---
id: 1264
title: 从C++到Objective-C
date: '2012-10-08T15:04:11+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1264'
permalink: /2012/cong-c-dao-objective-c.html
rumputhijau_meta_box_input_image:
    - ''
categories:
    - 'Mac&amp;iOS'
---

随着iOS和Mac设备的兴起，在iOS和Mac上的开发变得越来越重要，但是苹果的开发环境向来自成一体，从语言到设计模式再到IDE，都与我们所熟悉的Windows开发大为不同，C++的程序员在最开始接触苹果开发的时候都是需要进行一些观念上的改变，而首先要面对的便是Objective-C语言。

Objective-C是上世纪八十年代以C语言为基础完成的早期设计，后来由乔布斯投资的NeXT Software发展，在1996年乔布斯重回苹果后作为OS X的基础语言支持后，才开始发扬光大。在2007年，苹果公司对Obj-C语言进行了一次重大升级，也就是我们目前所熟知的Obj-C 2.0版本。

我想也许有很多人和我一样在初看到Obj-C代码的时候会觉得写法很怪异，与我们之前接触过的语言都不像，但其实在接触之后你会发现毕竟Obj-C是以C语言作为基础设计的，在通晓了其中几点写法上的不同后，对于理解上和C++几乎是惊人的一致的，而Obj-C真正不一样的地方其实是在于其语言背后所贯通的一些苹果所坚持的设计模式上的。

今天我们来做一个快速简单的总结，在这篇中我们将关注的全部是语法层的不同，关于Foundation框架等苹果所特有的我会放到下篇去介绍。希望能帮到一些刚接触Obj-C的朋友，让他们能用最少的阅读和最短的时间，了解如何去读Obj-C的代码。

### 类、对象和方法

在C++中类的定义是由关键字class领导的，我们可以在其中声明和定义成员函数与变量，如果成员函数的定义在class体外，则需要在定义函数体的名字前加上“类名::”，而在Obj-C中，类的声明和定义是被独立分开的。

其中声明是通过@interface关键字来描述：

```
@interface NewClassName: ParentClassName  //类名及父类
{
    memberDeclarations;  //成员变量
}
@property (…) memberDeclarations; //声明Property成员变量
+(type)staticMethodDeclarations;  //静态成员函数
-(type)methodDeclarations;    //成员函数
@end
```

其中的@property部分是可选的，可让编译器自动生成getter和setter方法，并可以根据括号里的不同设置让方法具有不同的表现，更具体的可以参看我另一篇[《Objective-C的Properties》](http://www.ownself.org/blog/2012/objective-c-de-properties.html)。

实现部分是由@implementation开始的：

```
@implementation NewClassName
  …//methodDefinitions;
@end
```

函数的声明格式：

```
+ (type) functionName;    //静态成员函数不带参数
- (type) functionName;    //成员函数不带参数
- (type) functionName: (type) parm1;    //一个参数
- (type) functionName: (type) parm1 parmName (type) parm2;    //两个参数，parmName可以省略
```

函数的调用格式：

```
[object functions];    //无参数
[object functions:parm];  //一个参数
[object functions:parm1 parmName:parm2];  //两个参数
```

### self和super

在C++中，使用this指针来表示本身，而在Obj-C中，self关键字表示本身，而super关键字则表示父类对象。

### 包含头文件

在C++中，使用#include来包含头文件，而在Obj-C中，使用#import来包含头文件，另外还有关键字@class可以告诉编译器制定关键字是什么类而不需要引用头文件来加快编译过程，不过如果需要调用相关类的方法，那么还是需要包含头文件的，@class对此无能为力。

### alloc、dealloc、release和autorelease

Obj-C里很重要的一个功能就是autorelease pool，但是这个功能会让很多刚接触Obj-C的朋友犯晕，其实Obj-C对于自动释放的实现是围绕引用计数来做文章的，首先需要牢记的是在Obj-C中只有alloc是用来真正分配内存的，而dealloc是真正用来释放内存的，而release消息则只是进行引用数减一的操作。

autorelease消息则是通知系统把该对象加入到autorelease pool中，来检测它的引用数，当有更多的对象指向这个内存时，引用数则增加，当收到release消息则是引用数减少，当引用数为零时，系统会在合适的时候释放这块内存。

在Obj-C中，大多数用来创建对象的静态函数都是在创建内存的时候同时发送了autorelease消息，对于使用这类函数创建的对象，我们是不需要手动释放的，而所有自己通过调用alloc消息创建的对象则有责任来释放内存。

### id类型

在Obj-C中有一种特殊的数据类型：id类型，这种数据类型是一种通用数据类型，可以用来存储属于任何类的对象，是一种动态绑定，在程序运行时id类型的优势将会凸显出来。当然，它的缺点也很明显，就是会降低程序的可读性。而id数据类型的本质其实是一种指针。

### 分类

Obj-C中还有一个概念是分类，分类不同于子类，只是对原有类的一种快捷的拓展，可以在原有类的基础上添加新的方法，但是如果需要添加变量的话还是需要子类来实现。

```
@interface className (newclassName)
……//New functions
@end
```

### 协议

协议是Obj-C中另一个非常重要的概念，协议实质上是一种供多个类分享的一种方法列表，在协议中规定的方法本身没有任何实现方法，而是由采用协议者来实现，例如我们编写的某个类希望采用一个协议，那么只需要在@interface部分添加尖括号部分即可：

```
@interface classeName: parentClass <protocolName1,protocolName2 … >
```

Obj-C中有很多定义好的协议供我们使用，比如NSCopying，还有Game Center。如果我们想定义一个自己的协议，格式也很简单：

```
@protocol protocolName
//必须实现的函数声明
@optional
//可选实现的函数声明
@end
```

写的很浅显，基本上是笔记的形式吧，实在是因为细着写的话太费时间，更深入的内容还是去看官方的文档吧！这懒偷得～