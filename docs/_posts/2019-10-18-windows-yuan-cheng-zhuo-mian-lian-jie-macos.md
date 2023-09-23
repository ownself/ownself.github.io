---
id: 1541
title: Windows远程桌面连接MacOS
date: '2019-10-18T14:39:34+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1541'
permalink: /2019/windows-yuan-cheng-zhuo-mian-lian-jie-macos.html
categories:
    - IT
---

在工作中时常需要在Windows和Mac之间切换，因此也就需要时常在两台设备之间切换。可是当需要出差时就很苦恼，因为不想因此带两台设备在身边，考虑到平时还是使用Windows多一些，所以就尝试研究一下如何在Windows中远程桌面连接MacOS系统。

## VNC

Mac和Mac之间的远程桌面是通过一个叫VNC的开源协议来实现的，想打开Mac系统的远程桌面功能，需要启动“系统偏好设置 -\> 共享 -\> 屏幕共享”中启用“VNC显示程序可以使用密码控制屏幕”并设置密码，之后就使用其他的Mac电脑通过“vnc://x.x.x.x/”的地址来远程连接该电脑了。

## TightVNC

TightVNC是Windows上一款支持VNC协议的开源免费软件，安装和设置都很简单，但是我在填写正确的IP和密码并尝试连接后发现程序进入了无响应的状态。简单的搜索之后发现似乎是因为Mojave之后MacOS系统对VNC进行了一些修改，导致使用标准的VNC协议的软件会在login的窗口卡住，更详细的讨论大家可以参看[这里](https://apple.stackexchange.com/questions/342161/macos-mojave-remote-access-login-screen-stuck-on-infinite-loading-spinner)，所以我们在连接之前需要通过命令行来做一些Hack。

首先我们需要回到MacOS系统中启用“系统偏好设置 -\> 共享 -\> 远程登录”，这样我们就可以通过SSH命令”ssh username@x.x.x.x登录到这台Mac，登录后使用命令”sudo pkill loginwindow”来结束会卡住远程连接的登录界面。之后在使用TightVNC登录即可。

## 最后

这种方法并不完美，因为每次登录前都需要使用SSH命令来结束登录界面进程才行，不过对我来说虽然稍嫌麻烦但总好过再多背一台Mac电脑强。另外如果使用频率非常高，需要自动化的帮助，可以参看这篇英文的[帖子](https://partiallydisassembled.net/posts/macos-mojave-and-vnc.html)，里面讲了如何将这个SSH命令自动化的步骤。