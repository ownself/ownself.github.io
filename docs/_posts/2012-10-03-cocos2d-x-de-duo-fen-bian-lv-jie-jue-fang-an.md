---
id: 1262
title: Cocos2d-x的多分辨率解决方案
date: '2012-10-03T04:53:50+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1262'
permalink: /2012/cocos2d-x-de-duo-fen-bian-lv-jie-jue-fang-an.html
rumputhijau_meta_box_input_image:
    - ''
categories:
    - 'MacAndiOS'
---

cocos2d-x作为一个跨平台的2D游戏引擎，确实是一个相当不错的2D游戏的跨平台解决方案，不但上手容易，而且性能和兼容性也表现不俗，不过目前还存在一些不足的地方，因为引擎本身尚处在一个发展和成熟的过程中，比如UI的制作流程还很不成熟且有着诸多限制，再比如就是跨平台的多分辨率没有一个明确而清晰的流程。

我们目前的项目中采用了一套解决思路在目前cocos2d-x v2.0.1版本上适用，事实上最近的版本v2.0.2已经对多分辨率进行了改进，不过仍然需要开发者对最终的方案进行思考，有趣的是这方面引擎的升级与我们在v2.0.1上做的许多工作不默而合，所以在我看来我们目前的算是一个比较合理的解决方案。分享出来也许可以帮助到需要的朋友们。

首先我们需要来看一下我们所面对的情况：

### 分辨率

[![androidresolution](/wp-content/uploads/2012/10/androidresolution_thumb.png "androidresolution")](/wp-content/uploads/2012/10/androidresolution.png) 我们可以明确知道的是iPhone的分辨率是480×320，而Retina的分辨率则是标准的iPhone的2倍—960×640，Android的情况则相当复杂，从800×480、854×480到1280×800，各种机型，各种分辨率。

在cocos2d-x中，我们需要谨记的是，面对iPhone版本，引擎没有提供一个可以实现统一缩放的接口，而无论是否Retina，在游戏内逻辑的分辨率都是480×320，即使我们打开了Retina模式，游戏代码中对坐标的访问也是一致的，区别是在我们需要为Retina提供一套更高分辨率的资源。而Android版本因为分辨率的不统一，所以引擎是提供了整体缩放的接口。

但最终游戏应该设计为有一个基准分辨率的，所以我们有两种办法，一种是以Android为设计基准，我们在主流的Android分辨率中选择一个比如800×480，然后拉伸到Android其他的分辨率上，但问题在于iOS的分辨率是固定的，而且在cocos2d-x的iOS版中没有整体缩放的接口可以直接调用，所以我们也许需要为iOS单独提供一套资源并在代码里对坐标进行调整，这么做，显然是有些得不偿失的，所以既然iOS的分辨率是固定的，不如我们选择第二种办法，以iOS的分辨率为游戏的设计基准，这也是引擎作者给出的建议，以480×320为基准设计分辨率，拉伸到Android版，然后为Retina单独制作一套以-hd结尾的高清资源。

这样的话制作流程非常清晰而且统一，但存在一点不足的是目前Android的主流机器已经多是较高分辨率的，如果用480×320的资源来拉伸效果必然不如人意，为了这一点，我们目前的解决方法是对引擎做了一点小修改，让系统的资源默认是高清的，非Retina的资源改为使用-sd结尾，这样游戏的设计分辨率改为960×640，如此再拉伸到Android上效果会好很多，并且代码和制作流程依然可以保持统一，唯一需要注意的是iOS上的逻辑坐标依然是480×320，所以需要代码里对绝对的坐标值做一点处理（Android和iOS是除2的关系），宏是一个不错的办法，但是需要组里的程序员编写UI时为此额外付出一点精力。

### 比例

不同的屏幕比例是我们需要面对的另一个难题，之前iOS的比例是统一的，3:2，但是现在iPhone5诞生了，16:9的改变把iOS变的和Android一样需要面对比例问题的解决上了。

比例问题的解决基本上有三种，我们修改了一点点代码实现了，不过现在最新的v2.0.2已经实现了这三种方法：

1. 黑边：游戏始终保持设计时的比例，对于不同比例的设备，通过加入黑边来解决，可以接受但显然不是最好的。
2. 拉伸：无视比例差异，拉伸充满屏幕，虽然可以保证全屏显示，但是整个游戏的比例则会失调。
3. 裁减：更类似与电视信号对于16:9到4:3的处理，4:3的画面部分是安全区域，所有重要的信息都会在这个范围内，而两边则是为了提供更大的视野。

如果把长和高的比值作为考量的话，那么市面上主流设备的比例从3:2到16:9的比值范围大概是是从1.5到1.778，想让游戏完美的显示在这些机器上，我们的办法是使用安全框也就是上面提到的第三种裁减的办法。

[![safeframe](/wp-content/uploads/2012/10/safeframe_thumb.jpg "safeframe")](/wp-content/uploads/2012/10/safeframe.jpg)

安全框的概念很好理解，游戏支持的屏幕比例从16:9到3:2（当然你可以支持更大的变化比例），而所有重要的游戏内容当将位于3:2的部分，对于16:9扩展开来的屏幕区域主要用来放背景图或者让地图具有更宽广的视野，上图是我们游戏中的一个简易的UI设计稿，很好理解，另外对于一些应当根据屏幕的不同而变更位置比如需要左右对齐的内容，我们也可以通过一些简单的代码来实现的。

因为iPhone5的发售，实际上我们目前的基准分辨率已经由原先的960×640变为了1136×640了，不过因为我们对于比例的解决方案同样适用，所以实际上除了制作ccbi文件时需要额外注意之外，并不需要修改任何代码。

### 资源

iPhone对于非Retina的设备需要我们提供一套低分辨率的资源，但实际上在非Retina的设备上正确显示Retina的资源也不是一件麻烦事，之所以需要另一套资源更多的考量还是在内存上，所以其实不仅仅是iOS，在Android上对于比较古老的、屏幕尺寸和内存都很小的设备上也是应该考虑使用小尺寸贴图的，除非游戏本身就不打算支持老设备，否则多准备一套资源还是很有必要的。