---
id: 1272
title: ftell()与fseek()的不一致
date: '2013-02-02T17:04:45+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.org/blog/?p=1272'
permalink: /2013/ftell-yu-fseek-de-bu-yi-zhi.html
categories:
    - Windows开发
---

开发中经常需要用到fopen()来进行一些文件操作。有时候我们会用到ftell()和fseek()来获取文件目前操作到的位置，但其实这里面存在一个比较大的隐患，也是我今天遇到的一个奇怪的bug。

当我使用ftell()获取到了现在进行的位置，然后使用fseek()定位后却读取到了不一样的内容，检查内存后发现似乎是有错位存在，因为实在想不出其他任何地方有引起问题的可能，所以最后我把原因定位在了ftell()和fseek()上，果然简单的搜索后发现根结正是如此。

原来读取文本格式的文件时，如果文件的格式是Windows的，那么不会有任何问题存在，但是如果文件格式是Unix的，那么因为换行符的不同，会导致ftell()返回不正确的位置，导致错位的发生。但这个问题只发生在文本格式的文件上，如果是二进制文件则不会存在上述问题。

如此看来如果面对文本格式的文件时，应当尽量避免ftell()的使用。

关于更详细的内容，可以[参考pendle的博文](http://blog.csdn.net/pendle/article/details/6718290 "fopen文本模式和ftell,fseek的跨平台问题探讨")