---
id: 99
title: '[DirectX]Directly Mapping Texels to Pixels(Direct3D 9)'
date: '2009-09-22T15:15:25+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=45'
permalink: /2009/directx-directly-mapping-texels-to-pixels-direct3d-9.html
categories:
    - DirectX
---

在DirectX里后期处理相关的例子里经常看到一些类似的处理，就是把贴图的XY坐标值分别左移和上移0.5，乍一看很让人感到莫名其妙，仔细阅读下DX的文档，发现需要这么做的原因正是由于Direct3D的工作机制所造成的。

在Direct3D的渲染过程中，当我们使用预先完成空间变换的顶点来渲染2D画面的时候，需要额外注意一下贴图多边形与像素点之间的关系，否则会出现纹理失真。这和Direct3D工作流程以及光栅化和三角形纹理的基础知识有关系。

[![图1](/wp-content/uploads/2009/09/texelinpixel_1_thumb.gif "图1")](/wp-content/uploads/2009/09/texelinpixel_1.gif) [![图2](/wp-content/uploads/2009/09/texelinpixel_2_thumb.gif "图2")](/wp-content/uploads/2009/09/texelinpixel_2.gif)

我们知道计算机显示图形是通过像素点来实现的，例如当屏幕的分辨率为1920×1080的时候，说明当前屏幕水平方向每行有1920个像素点，垂直方向有1080个像素点，而整个屏幕是由1920×1080个像素点组成并绘制完成的。我们可以看到图1，这是屏幕一小块像素区域的示意，每一个小方格代表着一个像素点；而在Direct3D的贴图模式中，每一个像素点的边长被认为1.0，而0.0的原点，是在每一个像素点的中心（如图2所示），而正是这个微小的差别会对最终贴图的显示产生不小的影响。

根据上面所叙述的机理，那么当我们显示一个(0,0)到(4,4)的贴图的时候，在Direct3D中被认为将要绘制的区域如图3所示，但是我们知道，每一个像素点的颜色值是唯一的，所以实际中是不可能绘制出图3中的区域，在出现这种情况下，Direct3D的光栅化会负责进行处理。

[![图3](/wp-content/uploads/2009/09/texelinpixel_3_thumb.gif "图3")](/wp-content/uploads/2009/09/texelinpixel_3.gif) [![图4](/wp-content/uploads/2009/09/texelinpixel_4_thumb.gif "图4")](/wp-content/uploads/2009/09/texelinpixel_4.gif)

光栅化的处理原理是左上填充法则（注），虽然根据该法则，填充的区域如图4显示，看上去同我们预期的是相同并且正确的，但是像素颜色的填充却会产生一些变化，这个变化正是因为光栅化填充规则的左上填充原理产生的。

例如如果我们使用图5中的4×4的贴图来填充(0,0)到(4,4)的区域，则填充后的图像会变成图6中所示的，所以当我们直接使用预先完成空间变换以后的顶点来渲染2D画面的时候，绘制图像会让人感觉比贴图本身来的要更模糊一些，因为像素点的颜色已经通过采样插值发生了变化。

[![图5](/wp-content/uploads/2009/09/texelinpixel_5_thumb.gif "图5")](/wp-content/uploads/2009/09/texelinpixel_5.gif) [![图6](/wp-content/uploads/2009/09/texelinpixel_6_thumb.gif "图6")](/wp-content/uploads/2009/09/texelinpixel_6.gif)

至于如何解决这种情况，很简单，只要在多边形四个顶点的XY坐标值分别左移和上移0.5，使得贴图多边形本身能够和屏幕的像素完全吻合，就可以避免图像的失真了，这也就是为什么在很多有后期处理功能的实例中都能看到类似代码的原因了。

> 注：光栅化左上填充规则——详见DirectX SDK文档，简单讲就是当三角形覆盖当前像素的中心时（中心为整数坐标）绘制当前像素点为三角形颜色，而当三角形的边缘恰巧经过当前像素点边缘时，则根据是边线来决定：即当顶边（三角形朝下，此时三角形的底为顶边）穿过时，绘制当前像素点；当左边线穿过时，绘制当前像素点；当右边线或者底边（三角形朝上，此时三角形的底为底边）穿过时，不绘制当前像素点。