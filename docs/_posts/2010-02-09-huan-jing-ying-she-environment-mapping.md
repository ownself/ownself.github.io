---
id: 112
title: '环境映射（Environment Mapping）'
date: '2010-02-09T05:10:00+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=58'
permalink: /2010/huan-jing-ying-she-environment-mapping.html
categories:
    - 图形学
---

环境映射是一种用来模拟光滑表面对周围环境的反射的技术，常见的如镜子、光亮漆面的金属等等。

这种技术的实现主要通过将一张带有周围环境的贴图附在所需要表现的多边形表面来实现的。目前在实时3D游戏画面渲染中经常使用的有两种环境映射。

[![Spherical](/wp-content/uploads/2010/02/Spherical_thumb.jpg "Spherical")](/wp-content/uploads/2010/02/Spherical.jpg)

**球形环境映射（Spherical Environment Mapping）**

球形环境映射是模拟在球体表面产生环境映射的技术，通过对普通贴图的UV坐标进行调整计算来产生在球体表面应产生的扭曲。

UV的计算利用球体表面的法线来计算。计算公式如下：

> u=Nx/2+0.5
> v=Ny/2+0.5

计算公式中的Nx和Ny是表面法线的x和y分量，除以2将区间限制在\[-0.5,0.5\]，+0.5将区间调整至UV坐标应在的\[0,1\]区间。在这个公式的计算下，当球体正中表面法线正对摄像机的地方，坐标不会有任何扭曲；周围点依次随着Nx和Ny分量的增大而产生扭曲。

球体背面的剔除面可以根据法线Z分量的正负来判断。

**立方环境映射（Cubic Environment Mapping）**

立方环境映射是现在常用环境映射技术。我们知道游戏场景中经常通过在一个正方体上的六个面贴上前后左右上下六个贴图来模拟天空、宇宙等环境，称为Cubemap有的引擎中成为Skybox，立方环境映射的原理就是在游戏中所需要产生映射的物体的位置动态生成一套Cubemap，再对Cubemap进行采样生成物体表面应该反射出的周遭环境。

具体的采样方法是利用物体表面的法线来计算的，我们假设动态生成的Cubemap的正方体刚刚好包围住需要产生环境映射效果的物体，我们从摄像机也就是观察点出发同物体表面产生出的反射向量（同Phong光照模型的镜面反射中的反射向量是相同的，计算方法也相同R=2(E\*N)\*N-E），这个反射向量同正方体相交于一点，得到了这个点的所在面及UV坐标，采样，得到的颜色值就是我们应当看到。

立方环境映射的原理就是这样的，但是这些计算步骤并不需要我们在使用的时候过多考虑，因为从Cubemap的生成，到采样的计算，图形API已经都为我们封装好了，下面记录了在DirectX中简单的API调用流程，权作笔记。

首先需要声明Cubemap的贴图

> LPDIRECT3DCUBETEXTURE9 m\_pCubeMap = NULL;

然后创建Cubemap贴图

> pd3dDevice-\>;CreateCubeTexture(256,1,D3DUSAGE\_RENDERTARGET, D3DFMT\_A8R8G8B8,D3DPOOL\_DEFAULT , &m\_pCubeMap,NULL );

注意这里用到了D3DUSAGE\_RENDERTARGET，也就是说我们的Cubemap需要靠RenderTarget绘制。

如果需要的话，深度缓冲也可以考虑在内。

```
IDirect3DSurface9* g_pDepthCube = NULL;
DXUTDeviceSettings d3dSettings = DXUTGetDeviceSettings();
pd3dDevice->CreateDepthStencilSurface( 256, 256, d3dSettings.pp.AutoDepthStencilFormat,D3DMULTISAMPLE_NONE,0,TRUE,&g_pDepthCube, NULL );
```

绘制函数

```
void RenderSceneIntoCubeMap( IDirect3DDevice9 *pd3dDevice, double fTime )
{
    HRESULT hr;
    // Cubemap使用的投影矩阵
    D3DXMATRIXA16 mProj;
    D3DXMatrixPerspectiveFovLH( &mProj, D3DX_PI * 0.5f, 1.0f, 0.01f, 100.0f );
    LPDIRECT3DSURFACE9 pRTOld = NULL;
    V( pd3dDevice->GetRenderTarget( 0, &pRTOld ) );
    LPDIRECT3DSURFACE9 pDSOld = NULL;

    //if( SUCCEEDED( pd3dDevice->;GetDepthStencilSurface( &pDSOld ) ) )
    //{
    // // 如果使用深度缓冲
    // V( pd3dDevice->SetDepthStencilSurface( g_pDepthCube ) );
    //}

    for( int nFace = 0; nFace < 6; ++nFace ) //依次完成Cubemap中的六个面的绘制
    {
        LPDIRECT3DSURFACE9 pSurf;
        V( m_pCubeMap->GetCubeMapSurface( (D3DCUBEMAP_FACES)nFace, 0, &pSurf ) );
        V( pd3dDevice->SetRenderTarget( 0, pSurf ) );
        SAFE_RELEASE( pSurf );
        D3DXMATRIXA16 mView = DXUTGetCubeMapViewMatrix( nFace );
        V( pd3dDevice->Clear( 0L, NULL, D3DCLEAR_ZBUFFER,0x000000ff, 1.0f, 0L ) );
        pd3dDevice->SetTransform(D3DTS_VIEW,&mView);
        pd3dDevice->SetTransform(D3DTS_PROJECTION,&mProj);
        if( SUCCEEDED( pd3dDevice->BeginScene() ) )
        {
            //在这里绘制环境
            pd3dDevice->EndScene();
        }
    }

    // Restore depth-stencil buffer and render target
    /*if( pDSOld )//如果使用深度缓冲
    {
        V( pd3dDevice->SetDepthStencilSurface( pDSOld ) );
        SAFE_RELEASE( pDSOld );
    }*/

    V( pd3dDevice->SetRenderTarget( 0, pRTOld ) );
    SAFE_RELEASE( pRTOld );
}
```

这个绘制函数一般在每一帧绘制场景的最开始执行，先将场景内的物体绘制在Cubemap上。

这样我们就有了可用的Cubemap，之后我们绘制需要采用环境映射的物体时，将这个Cubemap作为Texture传入Shader内，另外还需传入观察向量用于计算反射向量。 在Shader中，顶点着色器中完成反射向量的计算：

> float3 vecReflect = normalize(reflect(vecEye, InNormal));

像素着色器负责采样，HLSL中已经有现成的函数可以使用，我们只需将计算所得反射向量传入即可。

> Output.RGBColor = texCUBE(EnvironmentSampler, In.CubeTexcoord);

采样器EnvironmentSampler并不需要特别的设置。

```
texture EnvironmentMap;
samplerCUBE EnvironmentSampler = sampler_state
{
    Texture = (EnvironmentMap);
    MipFilter = LINEAR;
    MinFilter = LINEAR;
    MagFilter = LINEAR;
};
```

[![Cubemap](/wp-content/uploads/2010/02/Cubemap_thumb.jpg "Cubemap")](/wp-content/uploads/2010/02/Cubemap.jpg)