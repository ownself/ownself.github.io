---
id: 146
title: 防止数组越界
date: '2012-03-11T14:23:10+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=85'
permalink: /2012/fang-zhi-shu-zu-yue-jie.html
rumputhijau_meta_box_input_image:
    - ''
categories:
    - 设计模式
---

游戏开发中，尤其是很多老游戏的代码中会不可避免的存在大量的全局变量，开发者在享受着全局变量使用方便的同时，也同时要肩负着全局数组的隐患——下标越界！

下标越界带来的问题是非常严重和棘手的，因为一旦程序的逻辑出现错误造成下标访问越界，轻则是游戏单位状态不正常影响游戏，重则是造成写溢导致游戏Crash。这类Crash在实际开发中是最难处理的，因为通常Crash的现场并非真正导致Crash的源头，而且重现的步骤一般也是不确定的，几率则有高有低，寻找问题的真正源头更是一件非常耗时耗力的工作，比如我们在开发NBA2K12－PSP版的时候一个极低概率的随机死锁bug就萦绕我们了几乎整个开发过程，最后在项目尾声时才最终锁定是因为一个程序员写的全局数组变量的越界写操作而导致的内存写溢。

其实要防止也不难做到，首先是减少全局数组的使用，尽量使之面向对象化，当然全局数组经常是游戏程序员在修bug时一种快速简易的偷懒做法，如果非要使用的话也是有很多种方法来防止错误发生的，下面简单介绍一种利用模版类来检测的方法，也是现在《文明 变革》中使用的办法。

使用模版类来预防下标越界原理很简单，一目了然，利用模版类来记下数组的容量，重载”\[\]”运算符，并在重载的实现内做下标访问的检测：

```
<pre class="decode:true ">template< class sType, int SIZE > 
class SafeStruct 
{ 
public: 
    SafeStruct( ) : m_akInternal(NULL) { }; 
    SafeStruct( sType pkData[]  ) :   m_akInternal(pkData) 
    { 
        FAssertMsg( m_akInternal != NULL, "Error, trying to check NULL data?" ); 
    }; 
    // Safe indexing 
    sType & operator[] ( int iIndex )  
    { 
        if ( iIndex < 0 || iIndex >= SIZE ) 
            FAssertMsg( 0, "Error index out of range (used=%d, range=[0..%d))", iIndex, SIZE ); 
        //make the index in the range. 
        CLAMP(0, iIndex, SIZE-1); 
        return m_akInternal[iIndex]; 
    } 
    // Cast to a void pointer, for memcpy, etc. 
    operator void * () { return (void*)&(m_akInternal[0]); } 
    void SetData( sType * pkData ) { m_akInternal = pkData; } 
private: 
    sType * m_akInternal; 
    // Hack the sizeof operator to return the actual size of the array 
    // Wastes memory, so should not be used unless necessary 
    //char m_akSIZEOFFIX[SIZE*sizeof(sType)-sizeof(sType*)]; 
};
```

对于二维数组可以用同样的方法：

```
<pre class="decode:true ">//for 2D arrays 
template< class sType, int ROWSIZE, int COLSIZE > 
class SafeStruct2D 
{ 
    public: SafeStruct2D( sType * pkData ) 
    { 
        for ( int i = 0; i < ROWSIZE; i++ ) 
            m_akInternal[i].SetData(&pkData[i*COLSIZE]); 
    }; 
    // Safe indexing 
    SafeStruct< sType, COLSIZE > & operator[] ( int iIndex )  
    { 
        if ( iIndex < 0 || iIndex >= ROWSIZE ) 
            FAssertMsg2( 0, "Error, index out of range (used=%d, range=[0..%d))", iIndex, ROWSIZE ); 
        //make the index in the range. 
        CLAMP(0, iIndex, ROWSIZE-1); 
        return m_akInternal[iIndex]; 
    } 
    // Cast to a void pointer, for memcpy, etc. 
    operator void * () { return ((void*)m_akInternal[0]); } 
    int GetRowSize() { return ROWSIZE; } int GetColSize() { return COLSIZE; } 
private: 
    SafeStruct< sType, COLSIZE > m_akInternal[ROWSIZE]; 
};
```