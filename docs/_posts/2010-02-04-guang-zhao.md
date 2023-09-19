---
id: 111
title: 光照
date: '2010-02-04T05:13:00+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=57'
permalink: /2010/guang-zhao.html
categories:
    - 图形学
---

 好吧，既然顶点变换都花那么多时间写了，把光照也写了吧。   
 不过这个比起顶点变换应该好写多了，至少不用画那么多矩阵和公式了。   
 经过是空间坐标变换的模型的位置和角度得到了正确的诠释，但是这些信息只够我们来绘制模型的边框，对于物体表面的细节表现，就无能为力了，这就需要我们来进行光照的计算。   
 实时渲染的游戏画面通常使用经典的Phong光照模型来进行计算，不同的情况下可能计算的公式会有细微调整，但都是利用环境光+漫反射光+镜面反射光的模型来描述光对物体表面的影响。   
**环境光**   
 环境光主要模拟场景中普遍存在的光源和各个物体反射过来的光线，位于理想的模型中的环境光是均匀的分布在场景的各个角落，均匀的照射在每一个物体表面上。不用考虑光的位置，也不用考虑光的方向。   
[![lighting1](http://www.ownself.org/blog/wp-content/uploads/2010/02/lighting1_thumb.jpg "lighting1")](http://www.ownself.org/blog/wp-content/uploads/2010/02/lighting1.jpg)   
 Aintensity表示环境光的强度， 表示环境光的颜色， 表示物体对环境光各成分颜色的反射系数。   
**漫反射**   
 漫反射主要模拟物体表面的漫反射情况，由于漫反射是当物体表面受到光照之后会向所在面方向发散反射，所以与观察角度无关，只同光源角度有关。   
 漫反射光照模型遵循Lambert定理，该定理用两个向量来描述漫反射的光照模型：一个是描述光源位置的向量L，该向量从物体表面顶点指向光源位置，另一个是描述顶点法向量的向量N。   
 当L和N重合时，或者说光线与表面相垂直时，漫反射达到峰值(cosa= 1)，光的强度与cosa成正比，因为光的方向和顶点法线之间的夹角a值越大，漫反射值越小。   
 要高效地实现漫反射，可以利用两个向量点积的性质： L·N = |L|\*|N|\*cosa   
 如果将其中的光向量L和法向量N都单位化，则上述公式可以简化为L·N = cosa   
 这样，可以用N和L的点击来描述漫反射光照的强度，再用它乘以光源的漫反射颜色值和材质的漫反射系数得到当前顶点的漫反射颜色值。   
 通常将漫反射光照成分与环境光光照成分相加来综合这些光照，这时顶点的颜色值计算公式为：   
[![lighting2](http://www.ownself.org/blog/wp-content/uploads/2010/02/lighting2_thumb.jpg "lighting2")](http://www.ownself.org/blog/wp-content/uploads/2010/02/lighting2.jpg)   
 其中，Dintensity和Dcolor分别表示漫反射的强度和颜色， 表示材质的漫反射系数。   
**镜面反射**   
 环境光不需要考虑光的方向也不需要考虑观察点的方向，漫反射光照模型只考虑光的方向，而在镜面反射光照模型中，既要考虑光的方向，也要考虑观察点的方向。因为对于模拟光滑、有光泽或者磨光的表面，将观察点纳入考虑是很有必要的。   
 在镜面反射光照模型中，是用两个向量来计算镜面反射成分：观察点向量V和反射向量R，前者描述了观察点（或照相机）的相对位置，后者描述了光向量的反射方向。   
 V和R的夹角为b，V越与R靠拢，反射光就越亮。因此cosb与镜面反射光照成正比。另外，还需要有一个指数n来表示光泽属性，n的值越大，镜面反射光越强，因此可以用cosb的n次方来描述镜面反射。   
 与实现漫反射光照模型类似，同样可以利用点积的性质来实现镜面反射光照模型为：R·V = |R|\*|V|\*cosb   
 在程序中将向量R和V都单位化后，就可以用R·V来代替cosb。因此，镜面反射光照可以描述为(R·V)的n次方。   
 反射向量则通过这个公式来计算：R=2\*(N·L)\*N-L   
 具体的推导可以参看下图：N·L为cosa，因为N与L向量的模均为1，所以在N向量方向上的与L在y坐标上相同的向量即为N\*cosa，乘以2放大两倍，平移得最左侧虚线垂直向量，将L向量平移至第三象限，相减，即可得向量R。   
[![Reflect](http://www.ownself.org/blog/wp-content/uploads/2010/02/Reflect_thumb.jpg "Reflect")](http://www.ownself.org/blog/wp-content/uploads/2010/02/Reflect.jpg)   
 添加了镜面反射光照后的顶点颜色计算公式如下：   
[![lighting3](http://www.ownself.org/blog/wp-content/uploads/2010/02/lighting3_thumb.jpg "lighting3")](http://www.ownself.org/blog/wp-content/uploads/2010/02/lighting3.jpg)   
 模型如此，具体的应用可进行相应的调整。   
 关于光源距离远近的光强度衰减问题，如果要完全按照模拟光照衰减非常消耗计算，通常的我们可以按照光源的强度与距离的平方成反比来模拟光强度的衰减。   
**Shading**   
 我实在不知道该怎么翻译这个，有了前面所有信息，我们已经可以在顶点级别绘制模型了，但是顶点与顶点之间形成的多边形面片上的颜色的绘制，则是由Shading的方法来决定的，下面我们阐述的Shading的方法，先不考虑贴图的存在，仅有上面的光照模型计算出的颜色参与绘制。   
 经典的Shading方式有三种，Lambert Shading（D3D中称为Flat Shading）、Gouraud Shading和Phong Shading（这里的Phong Shading不要和前面的Phong光照模型\[Phone illumination model\]相混淆）。   
 Shading决定顶点间的面片上的颜色以何种规律进行绘制，上面所提到的三种Shading方法从简单到复杂，所需要的计算时间也是从少到多，用户根据需求选择不同的Shading方式。   
 Lambert Shading：最简单的一种方式，在面片所依赖的顶点中选择其中一个作为整个面片的颜色，这种方式计算最快，但显示出的效果也最为粗糙，在视觉上面片与面片之间的边界过渡很突兀。   
 Gouraud Shading：首先计算出面片所依赖的顶点的颜色，然后根据面片上的位置对几个顶点的颜色进行插值计算所得，这种方法很好的提升了现实   
的效果，面片之间过渡相对自然。   
 Phong Shading：并不首先计算出各个顶点的颜色，而是直接根据面片上像素的位置对顶点的法线进行插值，然后根据插值所得的法线，依次计算面片上每个点的颜色，这样的计算更加精确，即使在面片很少的模型上颜色的表现和过渡也更平稳，当然所需的计算时间也相对要多些。   
 其实后两种Shading方式就是我们常说的逐顶点光照和逐像素光照，只不过那个是从Shader流程上区分并命名的而已，原理则是分别来自这两种不同的Shading方式的。   
[![shading](http://www.ownself.org/blog/wp-content/uploads/2010/02/shading_thumb.jpg "shading")](http://www.ownself.org/blog/wp-content/uploads/2010/02/shading.jpg)