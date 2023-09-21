---
id: 108
title: '[DirectX]Multiple Render Targets'
date: '2010-01-15T14:54:17+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=49'
permalink: /2010/directx-multiple-render-targets.html
categories:
    - DirectX
---

Multiple Render Target（MRT）是一种指可以使绘制程序在单帧中同时渲染多个Render Target，也就是一次Draw可以将不同的信息分别画入多个Surface。是利用Pixel Shader实现Post-Process效果中很重要的一部分。

如在上一篇Pixel Motion Blur中，单帧渲染中返回了场景中原有的画面颜色同时还有该像素点的运动速度，超出单一Surface所能表现的数据宽度的部分就是通过Multiple Render Target渲染到另一个Surface上，有了Multiple Render Target的支持，我们在Pixel Shader中就可以返回更多的数据。

不过Multiple Render Target有很多限制，我没有试验过，体会也不深，以下翻译自DirectX的文档，往后有机会接触多了，再有新的再即时更新：

- Multiple Render Target中的所有的Render Target表面必须具有相同的位宽（比如都是32位）但可以拥有不同的格式（比如同样是32位可以使用D3DFMT\_A8R8G8B8或者D3DFMT\_G16R16F），不过DX允许我们通过设置D3DPMISCCAPS\_MRTINDEPENDENTBITDEPTHS表示来使得Render Target之间可以拥有不同的位宽。

- Multiple Render Target中的所有的Render Target应该拥有相同的宽和高 。

- 反锯齿是不被支持。

另外还有两点关于post-pixel shader操作和标志位D3DRS\_COLORWRITEENABLE的注意事项，情况比较特殊，需要时再具体查询DX文档吧。