---
id: 1436
title: 在OSX下配置SublimeText的Perforce插件
date: '2017-01-25T16:01:08+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1436'
permalink: /2017/zai-osx-xia-pei-zhi-sublimetext-de-perforce-cha-jian.html
categories:
    - 'Mac&amp;iOS'
---

SublimeText是很多人日常使用开发工具了，如果你平时会在Mac上工作，又恰巧使用Perforce来进行版本管理，那么你可能会碰上一点小麻烦——如何让正在编辑的文件能在SublimeText下自动CheckOut。

因为SublimeText的Perforce功能是通过插件来实现的，而恰巧开发这个插件的作者本身又不是使用Mac来进行开发的，所以这个插件对Mac的支持并不算好，需要我们做一点额外的工作。

### P4 Command Line

首先我们得安装P4的命令行版本，因为P4在OSX下安装Visual Client和Command Line是分开的，所以如果你之前只安装了P4V，那么你必须要再安装这个，从官网上下载下来你会发现它只是一个可执行文件，不是DMG或者PKG，我们要先给这个文件可执行权限。

> chmod +x p4

之后要将p4放置在一个合适的位置，这里推荐”**/usr/local/bin/**“，本身这个目录已经是在$PATH环境变量中了，而且也符合El Capitan之后的Rootless安全要求。放置好后可以在terminal中通过命令”**p4 -h**“来测试命令行工具是否工作正常。

### 环境变量

SublimeText的Perforce插件在官方文档的说明中本身是支持两种方式来配置Perforce的，一种是通过环境变量设置P4CLIENT、P4PORT、P4USER来实现工作的，另一种方式是通过P4CONFIG文件来实现的，显然后一种更灵活更自由，尤其是你需要同时在多个Workspace之间工作的时候。

但很遗憾的是我至今没有成功地让P4CONFIG工作起来过，我甚至阅读了插件的源代码也没弄明白究竟是应该怎么工作的，因为似乎相关的逻辑代码完全是缺失的，不管怎么说吧，无论在Windows还是OSX，目前我都是使用环境变量来工作的。

在OSX下设置环境变量我是通过设置bash profile来实现的，打开terminal输入”**sudo vi ~/.bash\_profile**“来创建并编辑bash profile，然后我们设置好自己的参数：

> export P4PORT=xxx.xxx.xxx.xxx:xxxx  
> export P4CLIENT=xxxxxxx  
> export P4USER=xxxxx  
> export P4PASSWD=xxxxx

“**:wq**“退出编辑模式，再通过”**source ~/.bash\_profile**“来让环境变量立即生效。

### Perforce插件设置

我们还需要最后一步，要让Perforce插件正确的找到p4，官方文档推荐了一种办法是通过systemlink的方式，但很遗憾随着Rootless机制的推出，已经不好用了，但幸运是在插件的设置中有一个被注释掉的参数可以让我们自定义p4的位置，虽然官方文档对这个神器只字未提。

“shift+cmd+p”-&gt;”list package”-&gt;”perforce”，打开插件所在目录后，找到Perforce.sublime-settings，打开这句就好了：

> “perforce\_p4path”: “/usr/local/bin/”