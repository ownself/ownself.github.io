---
id: 1345
title: Lua脚本的性能测试
date: '2014-12-18T03:54:30+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1345'
permalink: /2014/lua-jiao-ben-de-xing-neng-ce-shi.html
categories:
    - 游戏开发
tags:
    - 'C#'
    - CPP
    - Lua
    - Unity
---

观众朋友们，上一篇提到了我们目前的项目准备采用Lua来实现AI的逻辑，而这又是一个Unity的项目，那么问题来了，既然是Unity的项目，在开发效率上来讲自然直接使用C#来调用和解释Lua脚本要比再套用一层C++的DLL调用Lua来的方便的多，可是同时也要担心C#和C++在Lua方面的效率能差多少呢？开发效率和性能上究竟哪个更会成为项目开发后期的瓶颈呢？带着这个问题我开始了为期一天半的性能测试分析。

C#的Lua我们用的是云风团队出品的UniLua，对C#的Lua库了解不太多就选用了这个还算比较流行的库，C++版本是标准的Lua但要提前说明的是我们进行了修改，这是个去掉了浮点数运算的特别版本，不过测试的目的仅仅是为了得出大致的性能差距，并不是用来做学术研究，所以测试的方法非常简单，相信得到的结果也并不那么科学严谨，只能是在特定的前提条件范围内的粗略结果，较真儿的朋友们请出门儿右转找政府。

测试主要考虑了三个因素，编译Lua脚本的速度、调用Lua函数的速度以及Lua脚本内执行的速度，并通过几个因素之间不同的循环次数组合，并统计前后时间差来进行测试的，以下是测试的代码片段：

```
SYSTEMTIME time;
GetSystemTime(&time);
// printf("%d, %d,n", time.wSecond, time.wMilliseconds);
int startTime = time.wSecond * 1000 + time.wMilliseconds;
for(int i = 0; i < 1024; i++) {
    lua_getglobal(g_lua_state_instance, "measureINT");
    int result = lua_pcall(g_lua_state_instance, 0, 0, 0);
}
GetSystemTime(&time);
// printf("%d, %d,n", time.wSecond, time.wMilliseconds);
int gapTime = time.wSecond * 1000 + time.wMilliseconds - startTime;
if (gapTime < 0) { gapTime += 60000; }
printf("Used %d millisecondsn", gapTime);
```

```
function measureINT()
  num = 1024
  for i=1, num do
    local a = 1
    local b = 1
    local c = a + b
    local d = c + 5
  end
end
```

非常简单哈，然后…（省下无聊的万字测试过程）所以我们得到最终的测试结果如下（华丽丽地）：

[![PerformanceTestLua](/wp-content/uploads/2014/12/PerformanceTestLua.png)](/wp-content/uploads/2014/12/PerformanceTestLua.png)

我又做了个简单地计算，所以如果读表格费劲的话，大家也可以这样理解：

[![LuaTestConclusion](/wp-content/uploads/2014/12/LuaTestConclusion.png)](/wp-content/uploads/2014/12/LuaTestConclusion.png)

我们可以看到虽然很不希望这样，但事实是在Lua的效率方面目前C#还是和C++有着巨大的差距，编译Lua脚本上大约3倍的差距，13倍左右的差距在调用Lua函数，而Lua函数内部的解释则在15倍左右。