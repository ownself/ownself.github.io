---
id: 106
title: 'Render Target'
date: '2010-01-08T19:43:55+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=46'
permalink: /2010/render-target.html
categories:
    - DirectX
---

<font face="微软雅黑" size="2"> </font>

 Render Target是Direct3D中的一个称谓，主要用于在各种Post Process处理中担任中间过渡的角色。   
 现在游戏中很多的特效类似于电影中的后期处理，也就是说当影片拍摄出来以后，再进行润色处理。同样的，如果游戏中的某个特效也需要类似的流程，效果的实现并非在多边形绘制的同时进行，而是在整个场景绘制结束之后再进行效果处理的话，我们的场景就不能直接绘制到屏幕缓冲了，而Render to Texture就是指将整个场景绘制到一块材质上，这样做，就需要用到Render Target。   
 其实仅仅是一个概念而已，没有算法上的东西，不过在Direct3D里使用Render Target有很多需要注意的细节，以后可能总会用到，所以记在这里，聊为笔记。   
 要在D3D中实现将场景绘制到Texture，我们首先需要的——当然是一个Texture对象，这个Texture对象不同于通常概念的Texture主要在于创建方式的不同。另外我们需要两个Surface对象（一个用于连接Render Target Texture，另一个用于暂时保存离屏缓冲）   
 变量声明：   
 LPDIRECT3DTEXTURE9 g\_pFullScreenRenderTarget; //全屏RT   
 LPDIRECT3DSURFACE9 g\_pFullScreenRenderTargetSurf,pOriginalRenderTargetSurf; //全屏RT用Surface   
 创建纹理：   
 D3DXCreateTexture( pd3dDevice, pBackBufferSurfaceDesc-&gt;Width, pBackBufferSurfaceDesc-&gt;Height,1, D3DUSAGE\_RENDERTARGET, D3DFMT\_A8R8G8B8,D3DPOOL\_DEFAULT, &amp;g\_pFullScreenRenderTarget );   
 g\_pFullScreenRenderTarget-&gt;GetSurfaceLevel(0, &amp;g\_pFullScreenRenderTargetSurf );   
 这里CreateTextur函数的参数中需要特别注意的是Usage参数需要为D3DUSAGE\_RENDERTARGET，而D3DPOOL则必须为D3DPOOL\_DEFAULT   
 颜色格式的设置通常情况下是D3DFMT\_A8R8G8B8等常用色彩格式，但如果利用Render Target来实现特殊计算需要用到浮点数，则要相应使用D3DFMT\_G16R16F等浮点数格式   
 另外如果材质的大小同离屏缓冲的高宽不相同的话，切换Render Target进行绘制的时候要重新设置投影矩阵，否则绘制的图像会比例不对，还有种说法是纹理不能太大，否则会绘制不出任何东西，不过我没有做过实验。   
 GetSurfaceLevel的作用将Surface对象同作为Render Target的Texture链接起来，以便后面访问   
 渲染：   
 渲染之前我们首先需要备份原本的离屏缓冲   
 pd3dDevice-&gt;GetRenderTarget(0,&amp;pOriginalRenderTargetSurf);   
 if( SUCCEEDED( pd3dDevice-&gt;BeginScene() ) )   
 {   
 pd3dDevice-&gt;SetRenderTarget(0,g\_pFullScreenRenderTargetSurf);   
 pd3dDevice-&gt;Clear(0, NULL, D3DCLEAR\_TARGET | D3DCLEAR\_ZBUFFER, D3DXCOLOR(0.0f,0.00f,0.00f,1.00f), 1.0f, 0);   
 //在这里对Render Target Texture进行渲染   
 pd3dDevice-&gt;EndScene();   
 }   
 pd3dDevice-&gt;SetRenderTarget(0, pOriginalRenderTargetSurf);//恢复原有离屏缓冲   
 SAFE\_RELEASE(pOriginalRenderTargetSurf);//Get获取的Render Target要记得释放掉，否则会内存泄漏   
 PS：想要直接访问Render Target Texture的值貌似有些困难，SDK文档上说是无法直接lock和unlock的，具体怎么回事，这个以后补齐吧～