---
id: 109
title: '景深（Depth of Field）'
date: '2010-01-25T15:25:56+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=50'
permalink: /2010/jing-shen-depth-of-field.html
categories:
    - 图形学
---

<font face="微软雅黑" size="2"> </font>

[![Depthoffield](http://www.ownself.org/blog/wp-content/uploads/2010/01/Depthoffield_thumb.jpg "Depthoffield")](http://www.ownself.org/blog/wp-content/uploads/2010/01/Depthoffield.jpg) 算法原理来自ATI实验室Guennadi Riguer、Natalya Tatarchuk、John Isidoro的论文“Real-Time Depth of Field Simulation”，本文只是对原理和过程进行简述，具体内容请参见原文。   
 我们知道视频游戏追求的目标就是完全真实的画面，但是早先的大部分游戏的画面在看上去似乎都缺了些什么，让画面看上去在任何角度任何距离都是完全锐利的，而这种情况在现实中是不存在的，因为有景深的存在。完全锐利的画面虽然完美，但是却让人看上去感觉不真实，这是因为在现实世界中无论是人眼还是照相机或者摄像机等成像设备，存在晶体或者透镜的关系，总会使得投影出的画面有实有虚，即在越靠近焦平面的物体越锐利，越远离焦平面的物体越模糊（大家可以自行复习初中物理知识～呵呵，我也是现看得），而在游戏画面的绘制中并没有透镜成像的部分参与，摄像机相当于一个完美的小孔成像，所以画面中的每一个像素都是完美锐利的，但是这并非是我们在真实世界中所能看到的，所以在游戏中加入景深效果可以使得画面更趋近于真实，也能使得像在电影中的通过变焦来引导观众注意力的手段能够在游戏中表现出来。   
 先让我们简单回忆一下透镜成像时参数之间的关系。   
 [![图片来自《GPU Gems 1》](http://www.ownself.org/blog/wp-content/uploads/2010/01/dof_thumb.jpg "图片来自《GPU Gems 1》")](http://www.ownself.org/blog/wp-content/uploads/2010/01/dof.jpg)   
 首先我们知道透镜关于焦距的公式1/P+1/I=1/F，我们设上图中Object通过透镜后所成像（Projection）到透镜的距离为X，同理可以得到1/F=1/X+1/D，然后我们可以推导：   
 [![CoC 推导公式](http://www.ownself.org/blog/wp-content/uploads/2010/01/doftuidao_thumb.jpg "CoC 推导公式")](http://www.ownself.org/blog/wp-content/uploads/2010/01/doftuidao.jpg)   
 因为物体同透镜距离的关系，在图一中只有在与透镜距离为P的位置，光线经过透镜后才能精准的交汇于一点，而与透镜距离为D的Object，经过透镜后光线会打散在一个直径为C的圆内，从而导致模糊的画面，而这个圆我们称为CoC（circle of confusion）。   
 景深在视频游戏中的实现方法有很多种，下面介绍的这种就是利用GPU（Direct3D API）通过模拟CoC来实现景深效果的（在DirectX所给的Dof的例子中是基于距离模拟的）。   
 这种实现方法实际上也是一种Post-Processing方法，这种方法是通过对场景绘制两遍来实现的，在第一遍的绘制中我们将计算模糊因子来模拟CoC，而第二遍的绘制则利用计算出的模糊因子来混合每个点的颜色，让该模糊的地方模糊，应该锐利的地方保持锐利。   
 **Pass One：绘制场景**   
 Pass One的任务除了绘制场景之外，最重要的就是计算模糊因子，因为要输出除去颜色信息之外的额外信息，所以还要用到前面动态模糊里用到过的Direct3D中的MRT（Multiple Render Target），输出的格式如下图所示：   
 [![输出格式](http://www.ownself.org/blog/wp-content/uploads/2010/01/dofoutformat_thumb.gif "输出格式")](http://www.ownself.org/blog/wp-content/uploads/2010/01/dofoutformat.gif)   
 格式分别是D3DFMT\_A8R8G8B8和D3DFMT\_G16R16，在顶点着色器中，在计算空间坐标变换之外，需要额外输出一个参数，每个点在视角坐标系下的深度值，这个参数将在后面像素着色器中参与计算。   
 struct VS\_INPUT   
 {   
 float4 vPos: POSITION;   
 float3 vNorm: NORMAL;   
 float2 vTexCoord: TEXCOORD0;   
 };   
 struct VS\_OUTPUT   
 {   
 float4 vPos: POSITION;   
 float4 vColor: COLOR0;   
 float fDepth: TEXCOORD0;   
 float2 vTexCoord: TEXCOORD1;   
 }; /////////////////////////////////////////////   
 VS\_OUTPUT scene\_shader\_vs(VS\_INPUT v)   
 {   
 VS\_OUTPUT o = (VS\_OUTPUT)0;   
 float4 vPosWV;   
 float3 vNorm;   
 float3 vLightDir;   
 // 标准坐标变换   
 o.vPos = mul(v.vPos, matWorldViewProj);   
 // 计算视角坐标系下的坐标   
 vPosWV = mul(v.vPos, matWorldView);   
 // 输出视角坐标系下的深度   
 o.fDepth = vPosWV.z;   
 // 计算漫反射颜色值   
 vLightDir = normalize(lightPos – v.vPos);   
 vNorm = normalize(v.vNorm);   
 o.vColor = dot(vNorm, vLightDir) \* mtrlDiffuse + mtrlAmbient;   
 // 输出贴图UV坐标   
 o.vTexCoord = v.vTexCoord;   
 return o;   
 }   
 在像素着色器中，根据已有的信息和我们推导过的式子来计算模糊因子，在这里模糊因子被参数化至0,1区间，0表示完全锐利，1表示最大模糊。   
 struct PS\_INPUT   
 {   
 float4 vColor: COLOR0;   
 float fDepth: TEXCOORD0;   
 float2 vTexCoord: TEXCOORD1;   
&amp;  
\#160; };   
 struct PS\_OUTPUT   
 {   
 float4 vColor: COLOR0;   
 float4 vDoF: COLOR1;   
 }; ///////////////////////////////////////////////////////////////////   
 PS\_OUTPUT scene\_shader\_ps(PS\_INPUT v)   
 {   
 PS\_OUTPUT o = (PS\_OUTPUT)0;   
 // 输出颜色   
 o.vColor = v.vColor \* tex2D(TexSampler, v.vTexCoord);   
 // 根据我们推导出的公式计算模糊因子   
 float pixCoC = abs(Dlens \* focalLen \* (Zfocus – v.fDepth) / (Zfocus \* (v.fDepth – focalLen)));   
 float blur = saturate(pixCoC \* scale / maxCoC);   
 // 将深度和模糊因子都归至0-1区间   
 o.vDoF = float4(v.fDepth / sceneRange, blur, 0, 0);   
 return o;   
 }   
 **Pass Two：Post-Processing**   
 在第二遍绘制的顶点着色器中没有任何操作，原样输出，论文中在这里进行了[贴图UV的偏移操作](http://www.ownself.org/blog/?p=45)，当然也可以在Shader之外进行这个操作。   
 最终的模糊发生在第二遍绘制的像素着色器中，根据在第一遍绘制中得出的模糊因子的大小我们模拟一个CoC的大小，并在这个CoC中所包含的像素点里进行一定数量的采样来混合形成该点最终的颜色。如下图所示：   
 [![CoC](http://www.ownself.org/blog/wp-content/uploads/2010/01/CoC_thumb.jpg "CoC")](http://www.ownself.org/blog/wp-content/uploads/2010/01/CoC.jpg)   
 采样点的相对坐标通常是事先制定好保存在数组中的，当然你也可以通过更科学的方法动态计算这些采样点，但是至少现在的视频游戏中还不需要这么高的精确度。   
 另外还有一个很重要的地方在前面的计算步骤中被忽略了，如果我们按照上面的流程计算，那么最终绘制出的画面会出现一个很严重的失真情况：当前后两个物体一个在焦平面一个远离焦平面，那么在两个物体融合接近交点处的像素在混合模糊时，CoC采样势必会将本处在焦平面的物体上的颜色混合进去（color leaking），所以在最终的计算中，我们还要对采样点的深度进行判断，以确定该点是否最终应该混合进去。   
 struct PS\_INPUT   
 {   
 float2 vTexCoord: TEXCOORD;   
 };//////////////////////////////////////////////////////////   
 float4 dof\_filter\_ps(PS\_INPUT v) : COLOR   
 {   
 // 采样中心点颜色   
 float4 colorSum = tex2D(SceneColorSampler, v.vTexCoord);   
 float totalContribution = 1.0f;   
 // 采样中心点深度值和模糊因子   
 float2 centerDepthBlur = tex2D(DepthBlurSampler, v.vTexCoord);   
 // 根据模糊因子计算CoC   
 float sizeCoC = centerDepthBlur.y \* maxCoC;   
 // 采样   
 for (int i = 0; i &lt; NUM\_DOF\_TAPS; i++)   
 {   
 // 计算采样点坐标，filterTaps为事先保存采样坐标的数组   
 float2 tapCoord = v.vTexCoord + filterTaps\[i\] \* sizeCoC;   
 // 采样颜色及采样点的深度值   
 float4 tapColor = tex2D(SceneColorSampler, tapCoord);   
 float2 tapDepthBlur = tex2D(DepthBlurSampler, tapCoord);   
 // 比较深度值以决定是否加入该点   
 float tapContribution=(tapDepthBlur.x &gt; centerDepthBlur.x) ? 1.0f : tapDepthBlur.y;   
 // 混合颜色   
 colorSum += tapColor \* tapContribution;   
 totalContribution += tapContribution;   
 }   
 // 取均值   
 float4 finalColor = colorSum / totalContribution;   
 return finalColor;   
 }   
 finalColor即为最终混合的颜色了～