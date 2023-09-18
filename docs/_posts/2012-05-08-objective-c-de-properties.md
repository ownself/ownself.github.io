---
id: 1251
title: Objective-C的Properties
date: '2012-05-08T16:14:50+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1251'
permalink: /2012/objective-c-de-properties.html
rumputhijau_meta_box_input_image:
    - ''
categories:
    - 'Mac&amp;iOS'
---

Objective-C是苹果为Cocoa框架下设计的面向对象语言，最早为开发Mac平台的程序服务，但现在随着iOS平台的兴盛，Obj-C渐渐也变为主流语言之一了，我自己也没想到过要和Obj-C打交道，但现在的工作是开发Civilization Revolution的iOS版本，自然要迎头赶上。

Obj-C目前给我感觉最大的不同并非是代码的写法上，而是在一些设计模式的固定套用上；虽然代码看上去和一般意义上的程序语言区别挺大，但其实明白了他写法上的规定还是可以当C++一样来读；但是其中Properties和对内存的管理上一些约定俗成的用法倒是很容易让刚上手的人感到迷惑和困解，在这里做一个简单的总结以为备用。

Properties的初衷是为了简化程序员在构建不同的类的时候要重复去写相应的Getter和Setter函数，当我对一个类中的成员变量使用了Property声明的时候，那么编译器会自动为我们构建- (float)value;和- (void)setValue:(float)newValue;这两个方法。当然这两个方法的创建是在编译的时候来进行的，我们实际上是可以自己来写这两个方法的，那么即使我们声明了Property对象，编译器会自动跳过我们人为写好的Getter或者Setter函数。关于Property的使用和语法规则可以详查[苹果官网的文档](https://developer.apple.com/library/ios/#documentation/Cocoa/Conceptual/ObjectiveC/Chapters/ocProperties.html)。

而其实Properties真正容易让人迷惑的是他的attributes（属性），不同的属性决定了变量不同的生命周期以及他们是如何在内存中运作的，稍有理解不对轻则造成内存泄漏，重则造成Crash，所以在动手写之前一定要保证你明白了该如何运用这些属性：

 **readwrite、readonly**：这两个比较好理解，决定了变量是否是只读的，如果声明readonly的话系统将不会构建Setter函数。readwrite是默认的。   
 **strong**：强引用，这是iOS5加入ARC机制以后新加入的关键词，只要有强引用指向一个变量，那么这个变量就不会被释放。我目前的理解是配合weak用来代替retain使用的，但是目前我们的游戏里还是使用retain为多，strong的理解还是停留在文档上的，往后我的理解加深了，会再来这里更正～   
 **weak**：弱引用，同样是随着ARC机制新加入的，如果没有强引用指向，那么即使再多的弱引用指向的变量依然会被释放掉，貌似是用来防止野指针的……   
 **assign**：可以理解为assign有着和C++对象一样的行为，在赋值的过程中不会做任何额外的操作，换句话说就是如果是assign类型的属性，那么程序员应当自己对变量的申请与释放负责，苹果建议当使用int,bool,CGRect这类简单数据类型时来使用assign。assign是默认属性。PS：我在苹果的论坛中看到别人的经验是delegate是一定要用assign的。   
 **retain**：保存类型，苹果引入这个的目的主要是为了为obj-c对象服务的，比如NSData或者NSArray，简单的说可以理解为指针拷贝，当有一个retain对象指向一个变量时，该变量的引用数要+1，而在程序中对任意一个指向该变量的retain属性使用了release操作实际上仅仅是对这个变量的引用数-1，也就是说只要还有retain对象在引用这个变量，那么它便不会被销毁，只有当引用数为0时，系统才会销毁这个变量。这个其实很复杂……说实话我现在还是没有完全弄明白关于retain对象调用release和直接赋值nil的区别……每一个iOS程序员都要过这一关，我想苹果也是明白这个属性的引入实际上更增加的内存管理的负担和风险才在iOS5中引入了strong和weak来代替retain和assign的。   
 **copy**：这个可以和retain结合来理解，和retain相同的是，两者在收到新的赋值时都会先对原来的对象进行一次release操作（retain是引用数-1，而copy则是直接销毁了），而不同的是retain的实际赋值是指针拷贝，而copy是内存拷贝，是复制一份新的内存数据出来。像NSString类型一般是多用copy的。   
 **nonatomic**：这个与多线程有关，系统默认的属性是其相对立的atomic，如果是atomic属性的对象，系统在生成Setter和Getter时会加入互斥锁机制，保证属性在多线程环境下内容的安全；而如果人为的声明nonatomic，系统在生成Setter和Getter则不会加入这些了，虽然加入互斥锁好处很多，但是同样的带来的系统负担会增大很多，在Mac开发中多数属性是使用atomic的，这也是其为何是默认的缘故，但是在iOS开发中目前为止所要面对的多线程环境还很有限的，而使用nonatomic又可以极大的节省移动设备上有限的机能，所以这也就是为什么在iOS代码中可以看到绝大多数的属性都是nonatomic的了。   
 **autorelease**：autorelease声明的属性对象会在程序跳出其生命周期之外时自动释放掉（通常是return）

另外要提一点的是文档中提到因为Properties实际上算是一种设计模式，虽然使用Properties声明过的变量我们还可以理解其为变量，但实际上当我们使用“.”操作来访问它时，它已经是一种方法了，而在这个方法中会有这系统自己嵌入的关于retain和release的诸多操作，所以当我们访问Properties的对象时，好的习惯是使用self.xxxx来访问，切忌偷懒少打self，因为在有些时候会有retain和release操作不当的情况而造成内存泄漏。

这篇里肯定还有很多自己的误解和不当的地方，随着以后进一步学习iOS的深入后再来完善吧～