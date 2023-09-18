---
id: 1363
title: Lua脚本的编译缓存
date: '2015-03-10T10:11:34+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1363'
permalink: /2015/lua-jiao-ben-de-bian-yi-huan-cun.html
categories:
    - 游戏开发
---

当我们在C代码中执行Lua脚本的时候，我们需要加载Lua文件进行编译，然后再执行lua\_pcall()来调用我们需要的函数，下一个脚本文件同样如此，而在游戏中可能会出现多个脚本文件被反复重复调用的情况，比如多个敌人的AI更新，每帧都要先执行EnemyA的脚本，再执行EnemyB的脚本，如此便要反复编译两个脚本，着实是性能的浪费，所以很自然希望能够将编译好的脚本代码段保存下来，而不是每次加载都要重复编译。

方法有很多种，更高效的比如LuaJIT，粗暴的也可以将所有的脚本合并成一个文件，同样有个简单的办法是通过Lua的注册表来实现的：

我们用lua\_load()（luaL\_loadfile或者luaL\_loadstring）将Lua文件加载并编译好后，编译过的代码Chunk这时候是在Lua的栈顶的，然后我们可以通过API函数luaL\_ref(luaState, LUA\_REGISTRYINDEX)来将这个Chunk保存在注册表中，LUA\_REGISTRYINDEX表明我们要保存的位置是Lua的注册表，这个函数将返回一个唯一的reference ID以标明它的位置。因为这个函数会将栈顶的Object弹出栈，会影响我们后面的pcall，所以我们可以在执行前先调用lua\_pushvalue(luaState, -1)来复制一份代码Chunk，这样执行完luaL\_ref后栈依然能保持之前的现场。

当我们再次回到这个脚本是，我们不必再重新load，只需要通过先前保存好的reference ID来调用lua\_rawgeti(luaState, LUA\_REGISTRYINDEX, referenceID)即可，这个函数会在注册表中拿到编译好的Chunk并将它压入栈中，然后我们就可以pcall了。

当我们确定脚本不会再执行时，我们可以通过luaL\_unref(luaState, referenceID, LUA\_REGISTRYINDEX)来表明我们已经不需要这个Chunk了，之后GC会在合适的时机释放掉它。

```
<pre class="font:droid-sans-mono lang:c++ decode:true " title="Lua脚本的编译缓存">void CompileLuaScript(const char* script) {

    if (!HasScriptCompiled(script)) {// Haven't compiled
        const char* luaString = getLuaString(script);
        if (luaString != NULL) {
            int r= luaL_loadstring(luaState, luaString);
            if (0 != r) { // Lua script compile error
                // Log Error
            } else {
                lua_pushvalue(luaState, -1);
                // gLuaReferenceID is a map for storing reference ID
                gLuaReferenceID[script] = luaL_ref(luaState, LUA_REGISTRYINDEX);
            }
        } else {
            // Log Error
        }
    } else { // Have compiled
        lua_settop(luaState, 0);
        lua_rawgeti(luaState, LUA_REGISTRYINDEX, gLuaReferenceID[script]);
    }
}
```