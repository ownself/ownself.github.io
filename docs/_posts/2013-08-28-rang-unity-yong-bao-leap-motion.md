---
id: 1288
title: '让Unity拥抱Leap Motion'
date: '2013-08-28T15:19:20+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1288'
permalink: /2013/rang-unity-yong-bao-leap-motion.html
categories:
    - 游戏开发
---

Leap Motion是目前非常时髦的外设，为体感操作带来了新的尝试和思考，而且非常小巧，设计上也是浑然一体，有着强烈的Mac风格，不过和Kinect不同的是，Leap Motion将注意力放在了手势操作上，希望将用户的操作精确到指尖。

[![leapmotion](/wp-content/uploads/2013/08/leapmotion.jpg)](/wp-content/uploads/2013/08/leapmotion.jpg)

我们时髦的教授方臻同学这一次走在了时代的前列腺上，第一时间居然入手了一个！正好我们一起在研究小游戏，就拿来看看是不是很容易就能让我们的游戏支持Leap Motion。

简单用了用其实感觉虽然设备完成度挺高的，但是在如何把设备的输入信息准确的投影到屏幕空间上还是不敢说做的非常好，我觉得如果解决不了这个问题，很难给用户的日常应用带来非常好的体验，更多的只能还是一种新鲜感吧。

想让Unity支持Leap Motion其实并不是非常复杂，官方的SDK里直接带的UnitySandBox已经是一个完整的Unity工程了，除了必要地DLL之外，还封装了一些很方便的类以方便使用，大概浏览过后你会发现，最核心的对象包括三个，分别是Leap.Controller，Leap.Frame和Leap.Hand。

其中Leap.Controller是最关键的控制器，可以在开始通过new Leap.Controller()来创建，而Frame和Hand则都通过Controller来获取，最简单的方式是放在Update()中来更新：

```
public static void Update() 
{
	m_Hand = null;
	m_Frame = null;
	m_FingersCount = 0;
	if( m_controller != null )
	{
		m_Frame	= m_controller.Frame();
		if (m_Frame != null)
		{
			if (m_Frame.Hands.Count > 0)
				m_Hand = m_Frame.Hands[0];
			if (m_Frame.Fingers.Count > 0)
				m_FingersCount = m_Frame.Fingers.Count;
		}
	}
}
```

而手势的位置等数据，通过Hand对象的属性来获得，包括PalmPosition，PalmNormal，Direction等，而官方Sample中的LeapUnityExtensions.cs中还提供了转换函数可以将这些数据转换成Unity使用的Vector3类型，非常方便。

在这里推荐一个博客，<http://pierresemaan.com/>博主（把自己的大脸置顶，说明这家伙对自己的长相相当自信啊……）做了很多Leap Motion的研究，其中包括了将Bootcamp和Racecar等Unity官方的Sample支持Leap Motion的研究，还提供了代码下载，相信可以一定可以帮到有兴趣的朋友们，我看了他的方法在一个小时之内就让我们的游戏支持Leap Motion了~