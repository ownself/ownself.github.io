---
id: 118
title: 'Shadow Map'
date: '2010-04-28T03:20:00+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=55'
permalink: /2010/shadow-map.html
categories:
    - 图形学
---

<font face="微软雅黑" size="2"> </font>

[![liu](/wp-content/uploads/2010/04/shadowmap_thumb.jpg "liu")](/wp-content/uploads/2010/04/shadowmap.jpg) 如何能够高效的产生更接近真实的阴影一直是视频游戏的一个很有挑战的工作，本文介绍目前所为人熟知的两种阴影技术之一的ShadowMap（阴影图）技术。   
 ShadowMap技术的概念应该说是最早应用在视频游戏中的阴影实现技术，有着非常高效和快速的特点，在实现阴影的同时只需要相对很小的计算负担。   
 ShadowMap绘制阴影主要是通过一张额外的阴影贴图来实现的，在早期的3D游戏中人物等动态运动的物体通常不绘制阴影，而场景内遮蔽关系相对确定的静态物体的阴影通常是在建立模型之初便已绘制到场景的贴图之中，这是利用ShadowMap来实现阴影概念的最初形成，而现在我们说到的 ShadowMap只是在游戏绘制时将阴影动态的绘制到一张阴影贴图上，再利用计算好的阴影贴图来绘制场景而已，整个计算只需要将场景绘制两边，而不需要像ShadowVolume一样额外生成新的模型，所以Shadow可以保持很好的性能表现而与场景的复杂度并无太大关系。   
 ShadowMap的概念很好理解，整个绘制过程分为两个阶段，首先以灯光为视角对场景进行绘制，绘制的结果是将场景内物体相对光源的深度信息写入一张阴影图中（Shadow Map），而不是RGB颜色。第二遍绘制场景时逐像素对比相对光源的深度值与阴影图中的深度，当深度大于阴影图中的深度时，说明该像素位于阴影中，进行相应的阴影混合。因为ShadowMap这种技术的特点，所以非常适合实现锥光源（spot light）下的阴影。对于在点光源（point light）下的利用ShadowMap生成阴影，有一种方法是利用Cubemap，这样六张阴影图可以实现全景点光源的ShadowMap。   
 **生成Shadow Map**   
 以DirectX中Sample为例，用于生成Shadow Map的Texture是格式为D3DFMT\_R32F的RenderTarget，32位的浮点数可以保证深度信息的精度。   
 第一遍的绘制中，设置视角变换和投影矩阵为光源的视角变换和投影矩阵（假设一个相机从光源向外），在Vertex Shader中照常进行顶点空间坐标（这样深度测试会自动得到每个像素最接近光源的点），额外的贴图坐标输出为坐标的z和w坐标。   
 Depth.xy = oPos.zw;   
 在Pixel Shader中最终输出的深度：   
 Color = Depth.x / Depth.y; // Depth is z / w   
 这个值就是反映场景中在光源照射下的深度信息，值域位于0，1区间，位于近平面时为0，原平面时为1。   
 **渲染场景**  第二遍渲染场景，在Vertex Shader中除了完成坐标转换和贴图坐标转换外，需要额外传递几个参数，观察视角下的空间坐标、法线向量以及转换到光源投影空间下的坐标。前两个用于光照计算，后一个用于阴影深度判断。   
 最后的阴影混合在Pixel Shader中完成，在这里依次判断每个像素是否位于光照影响之下，只需用到该顶点的光向量与光源朝向向量点积的结果与光源照射范围二分之一弧度值的 cos值相比较（通过夹角大小来判断）   
 如果位于光源照射下，则计算该像素在深度图中的uv坐标，采样，然后比较深度值，判断是否位于阴影之内：   
 //换算UV坐标   
 float2 ShadowTexC = 0.5 \* vPosLight.xy / vPosLight.w + float2( 0.5, 0.5 );   
 ShadowTexC.y = 1.0f – ShadowTexC.y;   
 //采样并判断深度   
 LightAmount = (tex2D( g\_samShadow, ShadowTexC ) &lt; vPosLight.z / vPosLight.w)? 0.0f: 1.0f;   
 最后根据阴影信息混合颜色即可。   
 Shadow Map的最大优点是高效率和快速，同样也会存在很多局限性，比如不适合点光源，并且在生成的阴影边缘锯齿化很严重。当然，我们也可以通过多次采样混合阴影边缘或者多次渲染进行高斯模糊来提高效果。