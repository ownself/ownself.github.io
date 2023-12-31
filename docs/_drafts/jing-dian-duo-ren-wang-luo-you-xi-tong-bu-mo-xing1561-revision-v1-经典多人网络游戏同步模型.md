---
id: 1570
title: 经典多人网络游戏同步模型
date: '2020-02-06T22:48:28+08:00'
author: Jimmy
layout: revision
guid: 'http://www.ownself.org/blog/2020/1561-revision-v1.html'
permalink: '/?p=1570'
---

网络游戏的同步模型是一个巨大的话题，为了适应不同的游戏模式和机制，游戏行业中在过去的几十年中开发出了很多种经典的模型，我们今天来讨论从雷神之锤3开始被奉为经典并影响了无数FPS游戏的网络同步机制，这种机制一直也是作为标准同步模型而集成在Unreal引擎中的。为了区别星际争霸、帝国时代等RTS游戏所使用的帧同步(Lockstep)，在国内很多从业者口中称这种同步模型为状态同步(client-server)。

我在过去第一次参与Unreal项目的开发时接触到了这种同步模型，并对其原理进行了学习和了解，但内部的机制Unreal其实全部都帮你已经实现好了，俗话说的好——纸上得来终觉浅，绝知此事要宫刑！哦，不，是要躬行……所以最好的学习办法还是动手写一下。

![Demo screenshot](http://www.ownself.org/blog/wp-content/uploads/2020/02/NetworkingReplication.gif)

关于状态同步的模型有一个英文的系列文章很好的阐述了其原理及克服一些问题的方法，再动手写示例之前最好再复习一下其原理：[client server game architecture](https://www.gabrielgambetta.com/client-server-game-architecture.html)

示例工程下载：[Networking replication demo](https://github.com/ownself/NetworkingReplicationDemo)

## 权威服务器

在状态同步模型中有一条最重要和基本的宗旨，就是要维护服务器计算结果的权威性，而不能相信任何来自客户端的关键性计算结果。这一切的根源在于令人深恶痛绝的作弊问题，作弊问题是一个长久以来困扰着游戏行业的问题，从反恐精英到绝地求生，使用状态同步模型的游戏一直就是作弊问题的重灾区，保证服务器的权威并不能100%的杜绝作弊问题，但确实可以极大的增加作弊的门槛。

在状态同步模型中，客户端负责处理并将玩家的输入信息发送给服务器，由服务器来进行世界的计算和更新，再将更新后的世界信息发送回客户端来显示及反馈操作结果。

## 客户端预测

由服务器计算和更新再发送回客户端没有问题，但网络消息在发送过程中带来的延迟会极大的影响本地玩家的操作体验，而网络延迟又是物理上无法克服的。为了解决这个问题我们需要使用客户端预测的技术。

客户端预测的技术可以克服网络延迟带来的不好体验，客户端在发送消息时需要带上消息序列编号并在本地缓存，等服务器传回经过权威计算的结果后再根据消息的序列编号对已经缓存在本地的结果进行核对，如果发生偏差，再进行矫正。要特别注意的是矫正的过程并非矫正出错编号的位置和状态，而是在出错的位置计算矫正偏差，再以此偏差应用到后续所有用于校验的等待缓存队列中，最后再在当前客户端的玩家身上应用这个矫正偏差。

## 实体插值

现实的情况中，服务器计算和更新世界的频率会成为很重要的性能瓶颈，所以不应该也不可能保证以非常高的频率来进行计算和更新，这样就会直接导致客户端上玩家看到其他玩家的位移是跳跃且间断的，以一种离散的方式移动的，这是一个很糟糕的体验，为了保证客户端上玩家看到的更新是流畅的，我们可以使用一个很简单的技巧，即客户端并不是直接将从服务器收到的信息作用在本地，而是通过插值的方式将物体“流畅”的逐步更新到正确的位置。

使用插值关键是需要客户端至少晚一个Tick来进行更新，实际上是以客户端增加少许延迟的代价来换取流畅的表现。

## 滞后补偿

因为实施了客户端预测和实体插值的机制，所以在客户端上，本地玩家在更新上总是领先与其他同步玩家的，这使得一些和位置与更新内容息息相关的计算与判断变得有些棘手。比如在FPS游戏中，命中的判断至关重要，所以为了保证游戏体验，游戏开发者们会使用一个看上去不太正确的技巧，就是使用错序的消息内容来进行相关的判断（本地玩家超前，远程玩家滞后），并将相关的序列信息一同发送至服务器来进行权威性判断。因为服务器保存着世界中所有过往的历史信息，所以实际上服务器可以做到根据某个客户端的错序信息来进行权威性计算的，这样做是以牺牲一定的公平性来提升客户端本地玩家的体验的。

在这次的示例工程中并没有实现滞后补偿机制。

## 网络消息的错序处理

由于网络传输过程中的延迟和不可控因素，难免会造成消息最终以错序的方式到达服务器，解决的办法是提高客户端发送的频率，先缓存一小段客户端消息再进行更新计算。这种方法可以增强消息错序的处理能力但会增加延迟，而提高客户端消息发送频率则可以反过来降低延迟的影响。《守望先锋》甚至设计了一个可变的更新频率机制，在服务器发现客户端消息丢包的情况下会通知客户端增加发送频率直到服务器端该客户端的消息队列重新回到正常水平。有兴趣的朋友可以去看看暴雪在GDC上做的相关演讲。

## 网络消息的丢包处理

同样，网络传输中消息包的丢失也是不可避免的。当发生某些消息丢包或者遭遇超长的消息延迟时，目前业界通常的做法是在服务器上以该客户端上一次已知的输入消息来填充空缺的消息，因为在实际的情况中，大部分的输入消息是连续且相同的，玩家不可能以极高的频率疯狂的改变方向的。

## 示例工程

在写这个示例工程的时候，确实让我对于状态同步网络模型中一些问题的处理细节有了更深的理解，因为写这个示例主要的目的还是加深理解，时间也很仓促，难免有些bug或者不合理的地方，如果有兴趣阅读，还望不吝指出其中可以改进或者存在的错误。非常感谢。