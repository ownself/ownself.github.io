---
id: 58
title: 追逐与躲闪
date: '2009-02-02T15:32:24+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.servexcellent.com/oswpblog/?p=19'
permalink: /2009/ren-gong-zhi-neng-zhui-zhu-yu-duo-shan.html
categories:
    - 人工智能
---

一碰上算法就头疼,所以还是先从最简单的写起，这是正在学习的《游戏开发中的人工智能》笔记。

1.最基本的追逐和闪躲：就是根据目标的坐标来更新追逐者的坐标，躲闪的则向相反的方向更新即可。

```
<pre class="lang:default decode:true ">if (A.x > B.x)
	A.x--;
else if (A.x < B.x)
	A.x++;
if (A.y > B.y)
	A.y--;
else if (A.y < B.y)
	A.y++;
```

![](/wp-content/uploads/2009/02/1.jpg)

这个方法虽然简明易懂但是在实际使用的时候会出现如上图所显现的并不太自然的运动轨迹。

2.视觉追逐：追逐的过程不再简单的基于坐标，而是基于追逐者与目标的方向，使用这种方法的时候，当目标不动时，运动轨迹将成直线，但是当目标处于运动状态时，轨迹则可能是弯弯曲曲的。另外使用这种方法如果是在类似于方格地图中运动的游戏时，还需要用到例如Bresenham算法来实现坐标到方格的投射转换。

```
<pre class="lang:default decode:true">Vec u = B.position - A.position; // 计算AB向量  
Normalize(&u); // 向量u单位化 
A += u * A.speedvalue;
```

![](/wp-content/uploads/2009/02/2.jpg)

3.拦截：比较高级的追逐模式，如果能做成想人一样的拦截判断，是需要考虑很多种情况的，比如根据目标移动方向选择距离该方向最近点到达后迎面拦截；或者再结合目标速度进行进一步判断选择更合适的拦截点；甚至通过判断目标以往运动规律来预测下一步运动的情况，细想想人脑还真挺吓人，这么多的事情毫不费力就能给出模糊结论和大致判断。

书中给出了一种基于靠拢时间的算法，算法思路大致如下：首先根据追逐者和目标的速度向量相减得出速度差向量，然后计算两者位置上的向量差，再通过 t = |S| / |V|计算出靠拢时间，再根据靠拢时间来最终预测目标在靠拢时间后将到达的位置S = S + V·t，而后只要利用前面视觉追逐的算法使追逐着追逐计算出来的位置即可实现拦截。

伪代码如下：

```
<pre class="lang:default decode:true ">Object a,b; // A为追逐者，B为目标
Vec v = a.speed - b.speed;
Vec s = a.position - b.position;
Time t = Magnitude(s) / Magnitude(v);//模相除
Object c;
c.position = b.position + b.speed*t;
Vec u = c.position - a.position;//计算AB向量
Normalize(&u);//向量u单位化
u = u * Magnitude(a.speed);
a.speed = u;//追逐者速度向量上的更新
a.position += a.speed;
```

![](/wp-content/uploads/2009/02/3.jpg)

这个算法在程序中需要每帧执行，也就是说即使目标进行随机运动，追逐者也会审时度势的调整方向，继续追踪，为了加深理解，写了程序来测试这段算法，[点击下载](http://cid-507861a5ffb49bea.skydrive.live.com/self.aspx/.Public/%e7%a8%8b%e5%ba%8f%e4%bb%a3%e7%a0%81/%e4%ba%ba%e5%b7%a5%e6%99%ba%e8%83%bd%e7%bb%83%e4%b9%a0%7C_%e6%8b%a6%e6%88%aa.rar)，不过经过测试发现这个算法还是有一定局限性，由于算法是一个趋向性的过程，通常情况下，会在起步一段后便能固定下追逐的方向，但是当追逐者原本的方向与目标的方向相似到一定程度时，也就是说速度向量的模小到一定程度的时候，追逐点会呈现出越来越远的趋势，而这是并不合理的。  
PS:测试程序要想编译通过的话需要DirectX SDK，呵呵，我实在不擅长用MFC写GUI程序。