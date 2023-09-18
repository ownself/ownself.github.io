---
id: 1613
title: DXT纹理压缩
date: '2021-01-11T11:38:10+08:00'
author: Jimmy
layout: revision
guid: 'http://www.ownself.org/blog/2021/115-autosave-v1.html'
permalink: '/?p=1613'
---

最近的工作内容都在跟贴图打交道，负责优化游戏中所用到的贴图，看了一点点东西，记下笔记，内容源自DirectX SDK文档。  
我们知道游戏中对于3D物体表面细节的表现最重要的还是靠贴图来实现的，那么越是高分辨率越是真彩色的贴图自然表现力也是越强，但是同时带来的问题是所需占用的内存会成倍的上升，而节省内存这一点在目前的游戏中还是非常非常重要的。  
所以各个平台上都在使用纹理压缩的技术，让纹理贴图在内存占用和显示效果能达到一个尽可能的平衡。在DirectX中，使用一种叫做DXT的纹理压缩技术，目前这种技术被大部分显卡所支持，通过对DXT的了解，我们可以对纹理压缩技术管中窥豹。  
DXT是一种DirectDraw表面，它以压缩形式存储图形数据，该表面可以节省大量的系统带宽和内存。即使不直接使用DXT表面渲染，也可以通过 DXT格式创建纹理的方法节省磁盘空间。Direct3D提供了D3DFMT\_DXT1 ~ D3DFMT\_DXT5共5种压缩纹理格式。其中，D3DFMT\_DXT1支持15位RGB和1位alpha图形格式，D3DFMT\_DXT2、D3DFMT\_DXT3支持12位RGB和4位alpha，D3DFMT\_DXT4、D3DFMT\_DXT5则采取了线性插值方式生成alpha。  
[![DXT纹理压缩](http://www.ownself.org/blog/wp-content/uploads/2010/03/DXTformat_thumb.jpg "DXT纹理压缩")](http://www.ownself.org/blog/wp-content/uploads/2010/03/DXTformat.jpg)  
**DXT1**   
DXT1格式主要适用于不具透明度的贴图或仅具一位Alpha的贴图（非完全透明则即完全不透明），对于完全RGB565格式的贴图，DXT1具有4：1的压缩比，即平均每个像素颜色占4位，虽然压缩比并不是很好，但是DXT的特性使得它更适合用于实时游戏之中。  
DXT1将每4×4个像素块视为一个压缩单位，压缩后的4×4个像素块占用64位，其中有2个16位的RGB颜色和16个2位索引，格式描绘如下图所示：  
[![DXT1数据格式](http://www.ownself.org/blog/wp-content/uploads/2010/03/DXT1format_thumb.jpg "DXT1数据格式")](http://www.ownself.org/blog/wp-content/uploads/2010/03/DXT1format.jpg)  
DXT1中的两个RGB颜色负责表示所在压缩的4×4像素块中颜色的两个极端值，然后通过线性插值我们可以再计算出两个中间颜色值，而16个2位索引则表明了这4×4个像素块所在像素的颜色值，2位可以表示4种状态，刚好可以完整表示color\_0，color\_1以及我们通过插值计算出的中间颜色值color\_2和color\_3，而对于具有一位Alpha的贴图，则只计算一个中间颜色值，color\_3用来表示完全透明。  
对于如何判断DXT1格式是表示不透明还是具有1位alpha的贴图，则是通过两个颜色值color\_0和color\_1来实现的，如果color\_0的数值大于color\_1则表示贴图是完全不透明的，反之则表示具有一位透明信息。  
**DXT2、DXT3**  
DXT2和DXT3可以表示具有更复杂的透明信息的贴图，这两种格式采用的是显式的Alpha表示，我们知道了在DXT1中，我们使用64位数据来描述4\*4的像素块的颜色信息，在DXT2和DXT3中，这部分颜色信息是不变的，而是通过另附加64位数据也就是每个像素4位来表示他们的Alpha透明信息，而这4位的Alpha的信息通常情况下我们可以采用直接编码的方式来表示即可。  
这样每个4×4像素块占用128位也就是8个字，0~3字表示透明信息；4~7表示前面描述的颜色的信息。  
DXT2和DXT3的不同之处在于，DXT2中颜色是已经完成了Premultiplied by alpha操作（已完成颜色与alpha的混合，当透明度发生改变时，直接改变整体颜色值，不必再单独复合），DXT3的Alpha信息则是相对独立的，之所以要区分开了则是为了适应不同的需要，因为有些场合需要独立的Alpha信息。  
[![DXT2、DXT3中alpha的数据存储](http://www.ownself.org/blog/wp-content/uploads/2010/03/DXT2alpha_thumb.jpg "DXT2、DXT3中alpha的数据存储")](http://www.ownself.org/blog/wp-content/uploads/2010/03/DXT2alpha.jpg)  
**DXT4、DXT5**  
DXT4、DXT5也是用于表示具有复杂的透明信息的贴图，与2和3不同的是4和5的Alpha信息是通过线性插值计算所得，类似于DXT1的颜色信息。同样的，每4×4的像素块的透明信息占用64位，所不同的是，64位中采用了2个8位的alpha值和16个3位的索引值，既然每个像素的索引占3位，那么可以表示8种不同的透明状态。  
在这里插值的方法有两种，一种用于表示具有完全透明和完全不透明的状态，另一种则是仅在给出的极端值alpha\_0和alpha\_1中进行插值。区分的方法也是通过比较alpha\_0和alpha\_1的大小来实现的，如果alpha\_0大于alpha\_1，则通过插值计算剩下的6个中间alpha值；否则，只通过插值计算4个中间alpha值，alpha\_6直接赋值0，alpha\_7直接赋值255。  
DXT4和DXT5的区别同DXT2和DXT3的区别相同，DXT4的颜色值是理解为已经完成Premultiplied by alpha操作的。  
另外需要注意的是，所有的压缩纹理格式都是2的幂，因为纹理压缩的单位是4×4像素，所以如果贴图的大小位16×2或者8×1这样的比例，系统会同样采用4×4的单位进行压缩，会造成一定的空间浪费，同样的大小会被占用，只是不会参与使用而已。