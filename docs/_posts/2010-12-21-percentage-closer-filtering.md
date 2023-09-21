---
id: 134
title: 'Percentage Closer Filtering'
date: '2010-12-21T14:29:00+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=61'
permalink: /2010/percentage-closer-filtering.html
categories:
    - 图形学
---

Percentage Closer Filtering简称PCF是常用于柔化Shadow Map边缘，产生软阴影的一种技术，最早来源于1987年Computer Graphics上的论文，因为算法原理简单，实现快速而且并不会占用太多运算，所以广泛的应用于实时视频游戏的阴影计算中。

前面我们介绍过了Shadow Map的实现原理，Shadow Map的一个比较明显的缺点即是在生成的阴影边缘锯齿化很严重，而PCF则能有效地克服Shadow Map阴影边缘的锯齿。

PCF通过在绘制阴影时，除了绘制该点阴影信息之外还对该点周围阴影情况进行多次采样并混合来实现锯齿的柔化，这也是抗锯齿最通用也是最简易的处理方式，下面是不同采样次数下PCF的表现：

[![PCF](/wp-content/uploads/2010/12/PCF_thumb.jpg "PCF")](/wp-content/uploads/2010/12/PCF.jpg)

原理简单，实现自然也不复杂，有很多种办法，最简单的可以从周围的取若干像素信息然后平均混合；也可以根据一定比例插值；这里讲按照泊松分布来进行采样：

### 泊松采样

样本值是预先固定好的，最大可进行16次采样（需要compile ps\_3\_0编译方式）

```
<pre class="lang:default decode:true " title="泊松分布">float2 poissonDisk[16] = {
	float2(-0.94201624, -0.39906216),
	float2(0.94558609, -0.76890725),
	float2(-0.094184101, -0.92938870),
	float2(0.34495938, 0.29387760),
	float2(-0.91588581, 0.45771432),
	float2(-0.81544232, -0.87912464),
	float2(-0.38277543, 0.27676845),
	float2(0.97484398, 0.75648379),
	float2(0.44323325, -0.97511554),
	float2(0.53742981, -0.47373420),
	float2(-0.26496911, -0.41893023),
	float2(0.79197514, 0.19090188),
	float2(-0.24188840, 0.99706507),
	float2(-0.81409955, 0.91437590),
	float2(0.19984126, 0.78641367),
	float2(0.14383161, -0.14100790)
};
```

### 采样函数

```
<pre class="lang:default decode:true " title="采样">// zReceiver为深度信息
float PCF_Filter(float2 uv, float zReceiver, float filterRadiusUV)
{
	float sum = 0.0f;
	for (int i = 0; i < PCF_NUM_SAMPLES; ++i)
	{
		// SMAP_SIZE是Shadow Map的材质大小
		float2 offset = poissonDisk[i] * filterRadiusUV / SMAP_SIZE;
		float Zdepth = tex2D(g_samShadow, uv + offset) + SHADOW_EPSILON;
		if(Zdepth >= zReceiver)
		{
			sum += 1.0f;
		}
	}
	return sum / PCF_NUM_SAMPLES;
}
```

剩下的很简单了，在上篇介绍Shadow Map的文章中将采样的代码：

```
<pre class="lang:default decode:true ">LightAmount = (tex2D(g_samShadow, ShadowTexC) < vPosLight.z / vPosLight.w) ? 0.0f : 1.0f;
```

替换为：

```
<pre class="lang:default decode:true ">LightAmount = PCF_Filter(ShadowTexC, vPosLight.z / vPosLight.w, 1.0f);
```

即可了，实现后的效果：

[![PCFShadowmap](/wp-content/uploads/2010/12/PCFShadowmap_thumb.jpg "PCFShadowmap")](/wp-content/uploads/2010/12/PCFShadowmap.jpg)