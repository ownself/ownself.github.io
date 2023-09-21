---
id: 1605
title: 在Unreal中使用Swift库
date: '2020-11-26T23:14:52+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1605'
permalink: /2020/zai-unreal-zhong-shi-yong-swift-ku.html
categories:
    - 未分类
tags:
    - iOS
    - UE
---

最近工作中遇到个很棘手的问题，就是项目中用到的一个SDK在iOS平台上的版本中使用了Swift库来实现其中的部分功能，SDK在Android平台上集成没有遇到任何问题，但是在iOS上却遇到了各种各样的问题。现在让我们来回顾一下我掉进这个坑一周以来的发现。

首先映入眼帘的是链接的问题：

```
Undefined symbols for architecture arm64:
"__swift_FORCE_LOAD_$_swiftCompatibilityDynamicReplacements", referenced from:
l18787 in XXXXXSDK
l18872 in XXXXXSDK
l19410 in XXXXXSDK
"__swift_FORCE_LOAD_$_swiftCompatibility51", referenced from:
l18786 in XXXXXSDK
l18871 in XXXXXSDK
l19409 in XXXXXSDK
"__swift_FORCE_LOAD_$_swiftCompatibility50", referenced from:
l18785 in XXXXXSDK
l18870 in XXXXXSDK
l19408 in XXXXXSDK
ld: symbol(s) not found for architecture arm64
Error: clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

很蹊跷的是同样是iOS平台的framework库，如果是使用Objective-C编写的库，那么使用Unreal的标准库导入流程不会有任何问题，但是一旦引入了Swift库，就会遇到上述的链接问题。

尝试过程中，我们通过将系统级的swiftCompatibility\*.a文件手动拷入UE工程中，竟然编译通过了，但是很遗憾的是程序运行起来立刻便会发生Crash。于是我们决定先抛开UE，尝试在原生的Xcode工程中研究明白引入Swift库究竟会带来什么样的变化。

# Damn you! Swift

新建了空的Xcode原生工程，引入了之前依赖了Swift库的framework，果然重现了一模一样的链接错误，问题到这里看来和UE的关系并不大了，应该还是Xcode和苹果开发自己这边有些什么阴人的套路，老实说这个时候我的心情真的是相当绝望的，这些年来一直想躲开Swift的我终于还是躲不开了吗？这真的是逼着我去学最不想学的东西啊……没办法，只能抱着当年60分及格万岁的想法，硬着头皮研究吧……

看到StackOverFlow有人提到类似的问题可以通过简单的在Xcode工程里拖入一个空的Swift文件的方式来解决？试了一下，嘿！还真灵，Swift什么内容都不用有，一个空文件，Xcode就能“智能”的在后台帮你把工程链接环境搞搞好（工程文件还看不出变化），能编！还能运行！这招灵是灵，StackOverFlow上用了的人都竖大拇指，但UE又没有接口让你搞个Swift文件进去。苹果我求求你，真不用你搞什么“智能”，你还是直接告诉我们需要设置哪里就好了。搜不到，真就搜不到，一点有用的东西都搜不到，苹果的开发支持也告你就拖个空Swift文件进去就好了……

苹果我谢谢你全家。

长话短说，经过若干天一系列惨烈的实验之后，我们终于成功在不拖入空Swift文件的前提下，让原生的Xcode工程在引入使用Swift库的framework后，成功的编译及运行，你需要在Xcode的工程中进行以下三项设置：

1. **在”Library Search Paths”中添加”$(TOOLCHAIN\_DIR)/usr/lib/swift/$(PLATFORM\_NAME)”和”$(TOOLCHAIN\_DIR)/usr/lib/swift-5.0/$(PLATFORM\_NAME)”**
2. **设置”Always Embed Swift Standard Libraries”为YES**
3. **在”Runpath Search Paths”中添加”/usr/lib/swift”和”@executable\_path/Frameworks”并且务必保证为以上的顺序**

其中第一条即可以让程序正确编译通过，但是这个地方是有几个暗坑的，$(TOOLCHAIN\_DIR)/usr/lib/swift/$(PLATFORM\_NAME)目录下就是系统用来存放swiftCompatibility\*.a的目录，但是如果你的framework库是使用Xcode11编译的，而工程是使用Xcode12编译的话，那么不知道处于什么原因，即使你正确地设置了这个路径，链接器也无法正确的进行链接。这个暗坑在我们完全理解这些现象之前折磨了我们整整好几天。如果你不能保证使用你的framework库的开发者也都是用相同的Xcode编译的话，**我的建议还是将你编译framework库用到的系统.a文件显式的拷贝至工程进行链接，这样即使别人使用不同的Xcode进行开发也不会遇到链接的问题**。

第2、3条解释起来也是需要费一点口舌的。首先我们需要知道的在iOS平台上Swift库只有动态库的形式存在的，但是在老一些iOS系统上并没有这个库（iOS12.2以前那时候Swift都还没有呢），那怎么办？iOS12.2以前就准备放弃了吗？苹果给你的解决方案就是勾选这个”Always Embed Swift Standard Libraries”选项，勾选了以后Xcode打包的时候会将兼容版本的Swift库拷贝至应用程序的”Frameworks”目录下，然后”Runpath Search Paths”则是决定程序运行时去哪里找这些动态库，添加上对应的”@executable\_path/Frameworks”目录后，这样老设备上动态库也有的找，也有的用。

你以为这样就行了吗？不行，在iOS高于12.2的新设备上跑起来照样Crash，告诉你”This copy of libswiftCore.dylib requires an OS version prior to 12.2.0.”，你考进去的动态库是专门给老设备用的，新设备上还必须得用人家系统里最新的！所以还得在”Runpath Search Paths”里添加”/usr/lib/swift”并且将其置于应用程序目录之前，以便在新设备上可以优先搜索到系统版本的Swift库。

# 在Unreal4中的实现

到此为止，我们已经将如何在原生Xcode工程中正确的集成使用了Swift库的framework的问题解决了，下一步该是如何在UE里将上述的这些改动应用上。

“Library Search Paths”还是比较容易的，UBT开放了接口，可以在\*.build.cs中通过添加如下代码来实现（或者明确的将.a拷贝至UE工程内再通过PublicAdditionalLibrary添加）：

```
PublicSystemLibraryPaths.Add("/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/swift/iphoneos");
PublicSystemLibraryPaths.Add("/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/swift-5.0/iphoneos");
```

但剩下两项我们并没有在UBT中找到开放的接口供我们修改，在有限的尝试失败后，我阅读了一些UBT的代码，最终我们决定通过修改UBT来实现上述改动：

1\. 修改/Engine/Source/Programs/UnrealBuildTool/ProjectFiles/Xcode/XcodeProject.cs中AppendPlatformConfiguration函数：

![](/wp-content/uploads/2020/11/xcodeproject.png)

2\. 修改/Engine/Source/Programs/UnrealBuildTool/Platform/IOS/IOSToolChain.cs中GetLinkArguments\_Global函数：

![](/wp-content/uploads/2020/11/iostoolchain.png)

# 总结

回过头再看这个问题，原因其实是两部分，一个是苹果在Xcode对于Swift库的包含引用的一些特殊性的机制；另一个是Unreal在iOS上对于Swift库的支持目前看来还是没有考虑到的。更深层次的原因就更多了，UBT中大量平台相关的设置都是直接写死在代码中的，如果项目中有些平台相关的特殊改动，大概率是躲不开修改UBT源码的；再有就是苹果对于Swift这门语言从设计到开发到使用推广，处处展现着欠考虑的一面，各种补丁还要想办法做兼容，搞得人各种狼狈，最后苦的还是开发者自己。

说实话，这种知识真的是没什么用的知识，完全没有任何积累，因为大概率过上一两年，苹果再大改上一版Xcode，这些选项全给你换一套新名字，再给你藏到犄角旮旯，完事再推一套新的APIs，你重新研究去吧……现在费这么多口舌把他写出来，是因为我在研究这个问题的过程中国内外基本搜不到有用的信息，虽然可能踩到这个坑里的人很少，但希望万一真有掉进来的，希望这篇唠叨能帮他早一点跳出去吧。