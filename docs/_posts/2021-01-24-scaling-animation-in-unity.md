---
id: 1638
title: Unity的缩放骨骼动画问题
date: '2021-01-24T21:48:09+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1638'
permalink: /2021/scaling-animation-in-unity.html
categories:
    - 游戏开发
tags:
    - Animation
    - Unity
---

## 概述

最近在工作中遇到了一个在Unity引擎中无法正确使用带缩放的骨骼动画（FBX格式）的问题，其表现为如果动画资源在DCC工具（Maya）制作中使用非统一缩放（Non-uniform scaling）的骨骼节点，则该动画在导入Unity工程中以后动画效果会呈现出与DCC工具中不同的带有严重变形的动画效果（抱歉项目内的模型资源不便在博客展示）。

## 环境

| 软件名称 | 版本 |
|---|---|
| Unity | 2019.4 |
| Maya | 2020 |
| Unreal | 4.25 |
| FBX SDK | 2018.1.1 |
| Win10 3D查看器 | 7.2010.15012.0 |

## 问题复现

我们首先尝试在不同的软件/引擎中查看问题动画资源的显示效果，结果发现问题资源在导入到Unreal引擎中是可以得到同DCC工具中相同的效果的。

我们知道游戏引擎中为了实现动画资源更好的数据压缩，通常不会直接保存变换矩阵，而是通过SQT通道以及量化(Quantization)来进行一定程度的有损压缩。因为矩阵需要使用16个浮点数来表示一个完整的变换（缩放、旋转、平移），而如果使用四元数（四个浮点数）、平移向量（三个浮点数）、缩放向量（三个向量）则可以将每一个变换的数据信息缩减到10个浮点数来表示。在实际应用中，很多游戏引擎会限制非统一缩放，即仅允许模型进行整体缩放而不允许在不同的轴上进行不同程度的缩放，这样又可以省下两个浮点数，总共仅需要8个，这样算下来动画的数据量已经减小了一半！再来因为四元数是\[-1~1\]的值域，使用32位的浮点数来保存其实是一种浪费，所以通常还会更进一步将其压缩为整型来保存，而在运行时再动态的转换为浮点数来进行计算，这种技术被称为量化。

几乎所有的引擎在动画数据导入以后都会对数据进行一次转存，从而将信息保存为进行过类似上述优化后的数据，而不同的引擎对于原始动画数据会有不同的解读。于是我们可以先盲猜一手，问题很有可能是出现在引擎端对于动画数据的转换和解读过程中。

另一个值得注意的细节是，用Win10自带的“3D查看器”来查看问题动画的效果，虽然没有出现Unity中出现的很夸张的走形，但依然存在同DCC中效果的一些偏差，说明不同的软件之间对数据的解释都会一些差别。

## FBX文件格式

我们找到一篇来自Unity官方教程，里面提到了一些动画相关问题的官方建议：[《Rigging Edge Cases》](https://learn.unity.com/tutorial/rigging-edge-cases-1?language=en#5d02fb65edbc2a001f46ee63)。其中第4、5章节提到的一个关于Non-uniform缩放的问题看上去与项目组遇到的问题非常相似，而关于这个问题官方的建议是将带有缩放的节点提出并孤立出来，而这个方法也与目前项目组的解决方案不谋而合。

![](/wp-content/uploads/2021/01/extra_scale_nodes.png)

将缩放的变化置于额外的骨骼并保证其不会有子节点

之后再查阅Unity的官方文档，可以了解到Unity之所以存在Non-uniform缩放显示不正确的问题是因为Unity计算缩放的方式同Maya等大多数DCC工具不一样，特别是不支持”Segment scale compensation”（以下简称SSC）：[《Importing objects from Autodesk® Maya》](https://docs.unity3d.com/Manual/HOWTO-ImportObjectsFrom3DApps.html#Maya)

> Unity does not support Autodesk® Maya®’s Rotate Axis (pre-rotation). 
> Joint limitations include: 
>  • Joint Orient (joint only post-rotation) 
>  • **Segment Scale Compensate (joint only option)**

这个SSC是Maya独有的一个动画功能，在使用Maya制作动画资源时默认会在每一个骨骼节点开启，其效果是自动针对骨骼父节点的缩放信息来对子结点进行缩放补偿，使得子节点不会受到父节点的缩放变化影响。

为了更准确的定位问题发生的源头，我们使用Maya针对缩放补偿功能制作了一段简化的测试模型，该模型仅有4个骨骼节点，其中”joint2″带有缩放变化，Test1.fbx开启了缩放补偿，而Test2.fbx则关闭了缩放补偿。

![](/wp-content/uploads/2021/01/Test1.gif)

![](/wp-content/uploads/2021/01/Test2.gif)

通过对文件内容进行对比（将FBX使用ASCII格式保存）我们可以发现两段动画唯一不同的字段为节点的”InheritType”（启用SSC为2，未启用SSC为1）

![InheritType](/wp-content/uploads/2021/01/InheritType.png)

查看FBX SDK的官方文档：[Class FbxNode](https://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_class_fbx_node_html) 该字段是用来描述子节点是否受父节点的变换影响的。

> These settings determine how transformations must be applied when evaluating a node’s transformation matrix. The possible values are: 
>  • eInheritRrSs : Scaling of parent is applied in the child world after the local child rotation. 
>  • eInheritRSrs : Scaling of parent is applied in the parent world. 
>  • **eInheritRrs : Scaling of parent does not affect the scaling of children**.

由此我们可以确认对于SSC功能FBX文件格式本身是支持的，这个信息不会因为将动画资源以FBX格式导出而丢失。

在另一篇来自AutoDesk的文档中也明确提到了在**使用Maya为Unity项目制作动画资源时，应当明确关闭SSC功能**：[Turning Off Segment Scale Compensate in Maya: How to make Maya rigs play nice with Unity](https://knowledge.autodesk.com/support/maya/troubleshooting/caas/simplecontent/content/turning-segment-scale-compensate-maya-how-to-make-maya-rigs-play-nice-unity.html)

> when you scale a parent joint in Maya using scale compensation, it creates an offset for child joint rather than scaling it. Unity hates this and weird things can happen as a result.

之后我们将两段动画在DCC工具中、Unreal引擎中以及Win10 3D查看器中均可以看到如上图所示的动画效果，而在导入到Unity工程中后，两段动画均显示为Test2的动画效果。至此**我们基本可以确认问题是由于Unity引擎在导入动画资源进行的数据转换操作时引起的**。

PS：另一篇文档关于Scale compensation的官方文档，其中提到了SSC是Maya独有的功能，而MAX并不支持：[Scale compensation](https://download.autodesk.com/us/fbx/FBX_Maya_online/files/WS73099cc142f48755-3d114b751181c40f14b1283.htm?_ga=2.113840783.96561652.1611223408-907670307.1610969916)

# Unreal的实现

根据Unreal官方文档，Unreal是支持Non-uniform缩放动画的：[Non-Uniform Scale Animation](https://docs.unrealengine.com/en-US/AnimatingObjects/SkeletalMeshAnimation/NonUniformScale/index.html) 在前面的测试中我们也证实了该功能，此外我们也通过调查Unreal的源代码来了解了Unreal是如何实现对Non-uniform缩放动画的支持的。在“**/Engine/Source/Editor/UnrealEd/Private/SkeletalMeshEdit.cpp**”的函数**UnFbx::FFbxImporter::ImportAnimation()**中：

![](/wp-content/uploads/2021/01/UnrealImportAnim-724x1024.png)

可以看到在Unreal导入动画进行Resample的过程中，使用了FBXSDK的EvaluateGlobalTransform接口来获取骨骼节点的变换矩阵，通过调试我们可以发现该接口可以自动根据不同的InheritType得到该节点带有正确缩放信息的变换矩阵，而在最后转换为Unreal内部的变换数据结构（FTransform）时，还会对父节点的变换信息进行一个相对变换的计算，其中即会根据父节点的缩放信息来反算子节点的补偿缩放值。

# Unity的实现

最后我们再来看看Unity引擎的源代码，来确认这个问题的最后一块拼图。在“**/Modules/AssetPipelineEditor/Public/ModelImporting/FBXImporter/Animation.cpp**”的函数**static void ImportAnimationTake()**中：

![](/wp-content/uploads/2021/01/UnityImportAnim.png)

在Unity引擎中导入动画进行Resample过程时，直接使用了各个骨骼节点（FbxNode）的[Transform Data](https://help.autodesk.com/view/FBX/2017/ENU/?guid=__files_GUID_C35D98CB_5148_4B46_82D1_51077D8970EE_htm)的GetCurve()接口来获取的变换曲线，之后再将曲线转换为Unity内部的变换数据结构的，这种方式下当访问到受父节点缩放影响而需要进行缩放补偿的子节点时，由于GetCurve不会参考InheritType的影响，而返回的曲线为空（如果子节点本身没有其他变化信息），所以子节点的缩放补偿信息会在导入的过程中被完全丢失掉。

# 结论

对于带有Non-uniform动画资源的功能支持的问题上，本质上是因为不同的引擎对于动画资源处理上的逻辑不同而导致的，Unity总体上对动画的缩放支持比较有限（Humanoid则完全不支持缩放），官方给出的建议可以绕过这个限制，但会因为额外增加的骨骼节点，对CPU和内存都有些额外的消耗，不过我也特别针对这部分进行了性能测试，而测试的结果也没有发现特别大的性能负担，综合所有已知信息，也确实是目前解决这个问题性价比最好的解决方案了。