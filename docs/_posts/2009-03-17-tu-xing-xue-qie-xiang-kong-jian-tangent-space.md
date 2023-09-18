---
id: 68
title: '[图形学]切向空间(Tangent Space)'
date: '2009-03-17T21:50:27+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.servexcellent.com/oswpblog/?p=31'
permalink: /2009/tu-xing-xue-qie-xiang-kong-jian-tangent-space.html
categories:
    - 图形学
---

<font face="微软雅黑" size="2">[![1](http://www.ownself.org/blog/wp-content/uploads/2009/03/1-thumb.jpg "1")](http://www.ownself.org/blog/wp-content/uploads/2009/03/1.jpg) 这个应该算是补遗漏，去年在MSN Space上写过一篇关于凹凸贴图的，当时写了半天其实写的一点也不明白，呵呵，因为有很多细节其实我也没搞太清楚，现在这里发一点关于其中一个用来完成凹凸贴图计算中将光向量转向顶点所在的切向量的细节，这个在当时的例子中是通过API实现的，这里简单描述一下原理，以下翻译自OpenGL.org中关于Tangent Space的阐述。   
 为了能够正确的完成凹凸贴图中偏移的计算，光向量L必须转换到切向空间中，所谓的切向空间包括3个轴：T，B和N。其中T是该点切线向量，平行于参数曲面上S方向上的增量（我理解应该就是在多边形曲面上的切向方向吧）；N是该点法线向量，垂直于局部平面；B(Binormal)是副法线，同时垂直于N和T，并且和T确定了切平面。这三个向量确定的一个空间坐标系就是传说中的切空间，如果所处的表面是曲线，那么切空间在每一个顶点上都应该是变化的。   
 既然光源必须转换至表面中每一个顶点的切空间，那么下面的问题就只有一个，如何能够正确的计算出每一个顶点的切空间呢？我们可以使用顶点的法线向量作为N；然后使用模型的局部坐标系中的S方向上的增量（模型空间中材质的S轴方向上）作为切线方向（这一块还是不太明白他的意思，用增量的极限来表示切线没有错，但是怎么实现的好像没说明白，可能是我还处于初级阶段吧，呵呵，不过在D3D中是有可以仅通过法线向量来计算切线空间的API的）；然后B可以通过N和T的叉乘计算求得，单位化后的三个向量可以组成一个旋转矩阵：   
 [![3](http://www.ownself.org/blog/wp-content/uploads/2009/03/3-thumb.jpg "3")](http://www.ownself.org/blog/wp-content/uploads/2009/03/3.jpg)   
 T，B，N分别作为空间内的X，Y，Z轴。它可以将向量从局部空间坐标系转换至切空间坐标系，如果T，B，N是在观察空间内定义的，那么就可以使用它来完成观察空间到切空间的转换。在非平整的表面上，每一个顶点所对应的矩阵自然也都是不同的。   
 有了这个矩阵我们就可以将光向量变换到每个顶点自己的切空间内了，来计算光给每个顶点的漫反射和镜反射的不同影响了。   
 这就是在各种贴图技术中很重要的切空间了～。   
 [![2](http://www.ownself.org/blog/wp-content/uploads/2009/03/2-thumb.jpg "2")](http://www.ownself.org/blog/wp-content/uploads/2009/03/2.jpg) </font>