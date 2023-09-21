---
id: 135
title: 'Post Process'
date: '2011-03-08T15:36:01+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=69'
permalink: /2011/post-process.html
categories:
    - 图形学
---

 Post Process一般是指后期效果处理，在游戏中诸如全屏模糊一些可以在渲染完整个场景后通过PS独立实现的一些效果都可以算在Post Process之列，DirectX SDK中自带了一个Post Process的例子，通过几个简单的效果阐述了后期特效的原理。

 **Monochrome**  单色效果作用是将彩色图案转为同样对比关系的黑白图，原理很简单就是将表示颜色的RGB值转换相应的亮度值即可，这里所用的是一个亮度公式   
 L = 0.27R + 0.67G + 0.06B;

 **Blur**   
 模糊是很常见的一种后期效果，实现的方式也很简单，通过对像素点周围点多次采样混合即可得到理想的模糊效果，通过采样的半径及次数来控制模糊的程度。不过在游戏中出于性能考虑，一般将模糊的过程分为两次，一次横向像素上的模糊，一次纵向像素上的模糊，两次叠加，并且一般的做法会在进行模糊之前先将Render Target缩小四倍，模糊过后再将Render Target恢复屏幕大小可以在效率上节省很多而且同样可以产生质量很高的模糊效果。

[![blur](/wp-content/uploads/2011/03/blur_thumb.jpg "blur")](/wp-content/uploads/2011/03/blur.jpg)

```
float2 PixelKernel\[g\_cKernelSize\] =   
{
    { 0, -6 },
    { 0, -5 },
    { 0, -4 },
    { 0, -3 },
    { 0, -2 },
    { 0, -1 },
    { 0, 0 },
    { 0, 1 },
    { 0, 2 },
    { 0, 3 },
    { 0, 4 },
    { 0, 5 },
    { 0, 6 },
};

static const float BlurWeights\[g\_cKernelSize\] =
{
    0.002216,
    0.008764,
    0.026995,
    0.064759,
    0.120985,
    0.176033,
    0.199471,
    0.176033,
    0.120985,
    0.064759,
    0.026995,
    0.008764,
    0.002216,
};

//Blurs the image vertically
float4 PostProcessPS( float2 Tex : TEXCOORD0 ) : COLOR0
{
    float4 Color = 0;
    for (int i = 0; i < g\_cKernelSize; i++)
    {
        Color += tex2D( g\_samSrcColor, Tex + PixelKernel\[i\].xy ) \* BlurWeights\[i\];
    }
    return Color;
}
```

在这里我们看到写的的是PixelKernel的坐标，只是意会，实际情况中应当使用TexelKernel，在Sample中你可以看到程序实际做了一个从PixelKernel到TexelKernel转换的计算，以适应不同大小的纹理。

**Normal based Edge Detect**  基于法线的边缘检测，利用边缘相交两面法线夹角越大，面法线向量点积越小的原理来检测边缘。需要先生成一张各点像素法线信息的法线图，要注意法线需要规格化，再根据对周围像素点法线采样判断与像素法线之间的关系来绘制边缘图。

[![edgedetect](/wp-content/uploads/2011/03/edgedetect_thumb.jpg "edgedetect")](/wp-content/uploads/2011/03/edgedetect.jpg)

```
float2 PixelKernel\[4\] =
{
    { 0, 1},
    { 1, 0},
    { 0, -1},
    {-1, 0}
};

//Detects and highlights edges
float4 PostProcessPS( float2 Tex : TEXCOORD0 ) : COLOR0
{
    float4 Orig = tex2D( g\_samSrcNormal, Tex );
    float4 Sum = 0;
    for( int i = 0; i < 4; i++ )
        Sum += saturate( 1 – dot( Orig.xyz, tex2D( g\_samSrcNormal, Tex + TexelKernel\[i\] ).xyz ) );
    return Sum;
}
```

**Bloom**  Bloom效果是用来模拟真实世界中光照的泛光效果的，一般作为实现HDR效果中的一个环节存在。在Sample中所实现的Bloom中是通过三个步骤来完成的：Tone Mapping、Bright Pass Filter以及Blur。

Tone Mapping：Tone Mapping是一种来自摄影学的技术，主要的用处是将真实世界里高范围的光照亮度映射到我们在一个场景内所能显示的亮度范围内，具体这个技术的细节会另篇介绍。在此例中，Tone Mapping中的参数Key值以及场景平均亮度值都是给定的，所以在此例中我们可以理解为将场景内所有的像素亮度映射到一个固定的范围，为下一步的Bright Pass做准备。

Bright Pass Filter：这一步的作用是将场景内低于一定亮度的像素也就是场景内较暗的区域隐去（涂黑），只留出场景内高亮的区域，用于下一步计算

Blur：利用上一步得到的场景进行前面所说的模糊并进行一定程度的加亮，以此得到我们想要的光亮处所形成的光晕效果

最后将算好的Render Target和原始的场景相加即可得到所要的效果。

[![bloom](/wp-content/uploads/2011/03/bloom_thumb.jpg "bloom")](/wp-content/uploads/2011/03/bloom.jpg)

```
float Luminance = 0.08f;
static const float fMiddleGray = 0.18f;
static const float fWhiteCutoff = 0.8f;
// Perform a high-pass filter on the source texture
float4 BrightPassFilter( in float2 Tex : TEXCOORD0 ) : COLOR0
{
    float3 ColorOut = tex2D( g\_samSrcColor, Tex );
    //Tone Mapping
    ColorOut \*= fMiddleGray / ( Luminance + 0.001f );
    ColorOut \*= ( 1.0f + ( ColorOut / ( fWhiteCutoff \* fWhiteCutoff ) ) );
    ColorOut -= 5.0f;
    ColorOut = max( ColorOut, 0.0f );
    ColorOut /= ( 10.0f + ColorOut );
    return float4( ColorOut, 1.0f );
}
```