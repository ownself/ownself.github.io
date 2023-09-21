---
id: 1344
title: 关于Lua的print输出
date: '2014-12-15T11:00:06+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1344'
permalink: /2014/guan-yu-lua-de-print-shu-chu.html
categories:
    - 游戏开发
tags:
    - CPP
    - Lua
    - Windows
---

我们目前的项目开发中准备实现一套基于Lua的AI系统，所有具体的AI逻辑实现都将由Lua来完成，这样配合有经验的Designer，希望可以做到解放程序员大量繁重的具体实现。

但Lua也有很明显的缺点那就是调试并不方便，下断点的方法并不是很好用，所以大部分人都会选择打log来进行调试。而Lua的标准print功能是走stdout的，可使用Visual Studio开发Windows程序时的output的窗口是DebugMessage，所以Lua的print信息你是在VS里看不到，这一点就很讨厌，我对Windows开发基本上算是没有经验的，不太能明白微软这么设计debug output的原因。

怎么办呢，今天花了点时间搞鼓一下，简单的方法是将stdout重定向到文件上，你可以直接在项目工程文件的”Properties”里的”Debugging”的”Command Arguments”里添加“&gt;LuaOutput.txt 2&gt;LuaError.txt”，这样改动最小；你也可以在代码中来指定重定向文件：

```
freopen("luaOutput.txt", "w", stdout);
freopen("luaError.txt", "w", stderr);
```

不过通过文件效率还是很糟糕，因为你无法像通常的Debug窗口一样及时看到log信息（文件需要fflush），而且会带来很大磁盘IO负担。

当然你肯定会说更简洁的办法是直接修改Lua库用OutputDebugString来代替printf让log出现在Windows的output窗口中，但考虑到将来调试Lua的很大一部份工作将是由Designer来进行的，而他们显然是不希望和VS打交道的，所以我能马上想到的是如果能在启动游戏的同时再开一个Console窗口来负责显示Lua的log信息就好了，虽然这个方法感觉很笨，但似乎是目前暂时能想到的最好的了。

```
#if defined(WIN32) && defined(_DEBUG)
// For Lua Scripting print
#include <Windows.h>

AllocConsole();
freopen("CONOUT$", "w", stdout);
// freopen("CONIN$", "r", stdin);

// Don't forget to call this at the end
FreeConsole();
#endif
```

随着项目的进行，到时候肯定会更加完善这个pipeline的，届时我会进一步更新。