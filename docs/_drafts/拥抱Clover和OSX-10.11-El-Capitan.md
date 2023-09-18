---
id: 1385
title: '拥抱Clover和OSX 10.11 El Capitan'
date: '2016-06-17T03:46:01+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1385'
permalink: '/?p=1385'
categories:
    - IT
---

### 前言

关于黑苹果的安装算算都有三年没写过更新教程了，主要是因为自从发现了[tonymacx86](http://www.tonymacx86.com)这个神一般的社区之后，安装黑苹果似乎已经是一件傻瓜版的事了，这次之所以想写写是因为这次10.11的黑苹果安装有一个很重要的改变是引导方式从之前的Chameleon换成来代表着未来的Clover，对于熟悉了之前安装方式的我来说都花了不少时间去学习和了解Clover的使用方法的，所以有些地方还是需要分享下经验和心得的。

使用下来确实感觉Clover是更先进的引导方式，而对于我们普通使用者而言，最大的意义在于系统每次小版本的更新的透明化，不需要再为升级后很多系统设置的丢失而烦恼了。

好，我们闲言少叙。

### 准备

首先还是推荐英文没问题的朋友通读[tonymacx86](http://www.tonymacx86.com)的安装教程原帖，毕竟人家才是正根～

[Install OS X El Capitan on Any Supported Intel-based PC](http://www.tonymacx86.com/threads/unibeast-install-os-x-el-capitan-on-any-supported-intel-based-pc.172672/)

总的来说安装的过程同之前相似还是准备安装U盘、安装OSX和引导、驱动的安装三个主要的部分，前两部和我们之前熟悉的步骤还是相同的，使用最新版的Unibeast来制作El Capitan的系统安装U盘，新版的Unibeast有几个不同的地方需要注意：只支持Yosemite和El Capitan，如果你希望装Mavericks或者更老的OSX版本，那么安装U盘还是需要用老版Unibeast来制作的，新老版本tonymacx86上也都提供了下载；使用新版制作安装U盘是你需要选择正确的Bootloader方式，是否选择UEFI方式需要根据自己的主板是否支持来决定。

之后的系统安装和驱动部署大体的步骤和以前没有太大的不同，你可能依然需要注意下BIOS的一些相关设置和特殊的神秘参数，比如使用N卡Maxwell核心的朋友需要在正确安装nVidia web driver之前使用nv\_disable=1的参数来启动，而安装好web driver后则要使用nvda\_drv=1来启动，具体的大家可以去原帖查看更多细节。

正确安装完成后，我们的黑苹果已经可以