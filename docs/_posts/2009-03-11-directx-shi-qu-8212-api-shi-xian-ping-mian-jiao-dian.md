---
id: 67
title: '[DirectX]拾取—API实现平面交点'
date: '2009-03-11T22:13:15+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.servexcellent.com/oswpblog/?p=23'
permalink: /2009/directx-shi-qu-8212-api-shi-xian-ping-mian-jiao-dian.html
categories:
    - DirectX
---

<font face="微软雅黑" size="2"> 简单总结一下D3D中的拾取问题，所谓拾取就是3D程序中当用户使用鼠标同3D世界内的物体进行交互的时候，如何能正确的实现从用户的鼠标到3D世界中的变换。   
 呵呵，如果要是推及到原理的话比较复杂，需要好好总结，先从简单的入手，D3D中提供了很多易用的API，使用这些API的话就可以绕过复杂的数学原理，所以呢，我们先来看实际应用中是怎样实现它的。   
 //首先获取世界、视角、投影矩阵   
 D3DXMATRIX matWorld,matView,matProj;   
 pd3dDevice-&gt;GetTransform(D3DTS\_WORLD,&amp;matWorld);   
 pd3dDevice-&gt;GetTransform(D3DTS\_VIEW,&amp;matView);   
 pd3dDevice-&gt;GetTransform(D3DTS\_PROJECTION,&amp;matProj);   
 //获取平面坐标   
 POINT ptCursor;   
 GetCursorPos(&amp;ptCursor);   
 ScreenToClient(DXUTGetHWND(),&amp;ptCursor);   
 D3DXVECTOR3 vScreen((float)ptCursor.x,(float)ptCursor.y,0.0f),vOut;   
 //创建视窗接口   
 D3DVIEWPORT9 viewPort;   
 pd3dDevice-&gt;GetViewport( &amp;viewPort );   
 //从屏幕空间投影到3D空间   
 D3DXVec3Unproject(&amp;vOut,&amp;vScreen,&amp;viewPort,&amp;matProj,&amp;matView,&amp;matWorld);   
 D3DXVECTOR3 vMousePt;   
 D3DXPLANE plane;   
 D3DXVECTOR3 v1(1.0f,1.0f,0.0f);   
 D3DXVECTOR3 v2(1.0f,-1.0f,0.0f);   
 D3DXVECTOR3 v3(-1.0f,1.0f,0.0f);   
 D3DXPlaneFromPoints( &amp;plane,&amp;v1,&amp;v2,&amp;v3);   
 D3DXPlaneIntersectLine(&amp;vMousePt,&amp;plane,pCamera-&gt;GetEyePt(),&amp;vOut);   
 //vMousePt.x,vMousePt.y和vMousePt.z就是鼠标根据视角所投射线同所指定平面的交点   
 很简单的一段代码，为了确保它的正确性，测试倒是费了半天劲-。-，全部都是用API来实现的，看程序不难理解，这段程序重点是D3DXVec3Unproject()函数，这个函数的作用便是进行屏幕到空间的投影（还有一个D3DXVec3project()函数是用来进行空间到屏幕的投影的^\_^），这个函数需要的是设备的Viewport、决定3D空间的三个矩阵和屏幕的坐标，函数可以算出结果向量，不过测试的时候我发现这个向量好像既不是近裁剪面的投影点也不是远裁剪面的，这个地方确实还是存在疑惑的，不过不影响使用，呵呵。   
 其实有了这个向量后面的怎么用就看大家了，上面是通过D3DXPlaneIntersectLine()函数（计算直线与平面交点用函数）来实现的，还可以用D3DXIntersect()来做与三角面片的相交。   
 我发现亲自写点东西还是很艰难的，随便一点东西就要写好多，而且还要确保正确，为了能坚持下来，还是尽量拆分开些吧，能保持些积极性，呵呵，今天先写这些。</font>