---
id: 136
title: 'Tone Mapping'
date: '2011-03-10T14:44:36+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=82'
permalink: /2011/tone-mapping.html
categories:
    - 图形学
---

 Tone Mapping原是摄影学中的一个术语，因为打印相片所能表现的亮度范围不足以表现现实世界中的亮度域，而如果简单的将真实世界的整个亮度域线性压缩到照片所能表现的亮度域内，则会在明暗两端同时丢失很多细节，这显然不是所希望的效果，Tone Mapping就是为了克服这一情况而存在的，既然相片所能呈现的亮度域有限则我们可以根据所拍摄场景内的整体亮度通过光圈与曝光时间的长短来控制一个合适的亮度域，这样既保证细节不丢失，也可以不使照片失真。人的眼睛也是相同的原理，这就是为什么当我们从一个明亮的环境突然到一个黑暗的环境时，可以从什么都看不见到慢慢可以适应周围的亮度，所不同的是人眼是通过瞳孔来调节亮度域的。   
 而这个问题同样存在在计算机图形上，为了让图像更真实的显示在显示器上，同样需要Tone Mapping来辅助。   
 整个Tone Mapping的过程就是首先要根据当前的场景推算出场景的平均亮度，再根据这个平均亮度选取一个合适的亮度域，再将整个场景映射到这个亮度域得到正确的结果。其中最重要的几个参数：   
 Middle grey：整个场景的平均灰度，关系到场景所应处在亮度域。   
 Key：场景的Key将决定整个场景的亮度倾向，倾向偏亮亦或是偏暗。   
 首先我们需要做的是计算出整个场景的平均亮度，有很多种计算平均亮度的方法，目前常用的的是使用log-average亮度来作为场景的平均亮度，通过下面的公式可以计算得到：   
[![tone1](/wp-content/uploads/2011/03/tone1_thumb.jpg "tone1")](/wp-content/uploads/2011/03/tone1.jpg)   
 其中Lw(x,y)是像素点x,y的亮度，N是场景内的像素数，δ是一个很小的数用来应对像素点纯黑的情况。

[![tone2](/wp-content/uploads/2011/03/tone2_thumb.jpg "tone2")](/wp-content/uploads/2011/03/tone2.jpg)   
[![tonekey](/wp-content/uploads/2011/03/tonekey_thumb.jpg "tonekey")](/wp-content/uploads/2011/03/tonekey.jpg) 上面的公式用来映射亮度域，α即是前面所讲的Key值，用来控制场景的亮度倾向，一般来说，会使用几个特定的值，0.18是一个适中的Key，0.36或者0.72相对偏亮，0.09甚至0.045则是偏暗。完成映射的场景为了满足计算机能显示的范围还要将亮度范围再映射到\[0,1\]区间，可以通过下面的公式简单的得到\[0,1\]区间的亮度。   
[![tone3](/wp-content/uploads/2011/03/tone3_thumb.jpg "tone3")](/wp-content/uploads/2011/03/tone3.jpg)   
 不过这样得到的结果并不总是令人满意的，所以一般扩展为如下面的公式，公式中的参数Lwhite用来控制场景中的曝光，凡是亮度超过Lwhite的像素都会被置为纯白。如果Lwhite的值非常大，则这个参数在公式中将不起任何作用，如果非常小则场景将变为几乎全白。Ld即为我们所要的映射后的x,y像素点的亮度值。   
[![tone4](/wp-content/uploads/2011/03/tone4_thumb.jpg "tone4")](/wp-content/uploads/2011/03/tone4.jpg)   
 Tone Mapping一般作为HDR算法中的一部分存在，在使用中会灵活很多，但基本的原理都是相同的。