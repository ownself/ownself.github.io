---
id: 1362
title: '在iOS Simulator上运行Unity Native Plugin'
date: '2015-01-06T11:33:46+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1362'
permalink: /2015/zai-ios-simulator-shang-yun-xing-unity-native-plugin.html
categories:
    - 游戏开发
tags:
    - Unity
---

Unity提供了使用Native Plugin的机制，允许Unity使用其他Native语言，比如C++、C或者Objective-C写成的第三方库，这样我们就可以直接利用一些已有的比较成熟的Library来扩展功能，但是今天尝试让游戏在iOS平台上运行的我，在看到官方文档这么一句的时候真的是差点没吐血：

> iOS native plugins can be called only when deployed on the actual device

虽然在实际开发中因为性能的原因使用模拟器调试的机会并不多，但是在项目还处在技术探索的阶段时，这真如拦路虎一半啊，等公司的苹果开发者账号申请完毕，Provisionning File、Certification都弄好再来测试的话，那真是不知道要等到猴年马月了。

不过幸运的是，在少许的搜索和测试后发现，解决方法并不复杂：

打开使用Unity Editor生成的Xcode Project File，打开“Libraries/RegisterMonoModules.cpp”，你就会发现这个问题其实并不是因为iOS的Simulator有什么天生的缺陷，而是Unity在里面做了些手脚：

```
#if !(TARGET_IPHONE_SIMULATOR)
    ...
    void    mono_dl_register_symbol (const char* name, void *addr);
    ...
#endif // !(TARGET_IPHONE_SIMULATOR)

...

#if !(TARGET_IPHONE_SIMULATOR)
    ...
    mono_dl_register_symbol("YourFunction", (void*)&YourFunction);
    ...
#endif // !(TARGET_IPHONE_SIMULATOR)
```

然后就很简单了，只要讲上面的注册函数以及你自己的函数注册都搬到宏外面就可以了。

不知道Unity为什么要做这样的限制，如果只是因为Simulator性能上的瓶颈并说不太通，也许依然还有些没有解决的严重Bug？但不管怎么说，这已经可以让你在Simulator 上测试你的最基本的Native Plugin是否跑通了。