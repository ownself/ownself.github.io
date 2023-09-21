---
id: 1730
title: Unity项目Android平台内存分析
date: '2023-03-19T15:37:18+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1730'
permalink: /2023/unity-memory-profile-on-android.html
categories:
    - 游戏开发
---

# 概述

现代操作系统的内存分配机制越来越复杂，分页、交换等机制的引入使得我们想要精确的了解我们编写的程序所使用的真实内存用量这件事情变得越来越不可能，而游戏开发中内存用量又是非常重要的性能标准。在本文中，我尝试将过往工作中一些在Unity项目中在安卓平台上分析内存的方法总结在这里。

# ADB

ADB是Linux提供系统级的工具，功能丰富且强大，其中对于内存分析我们常用的有如下几个。

### adb shell dumpsys meminfo \[application id\]

adb中最常用也是最主要的内存分析工具，其会输出应用程序关于内存总体及在各个类别的统计数据，并输出类似如下格式的信息：

```
App Summary
                       Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    11264                          26080
         Native Heap:   246716                         248732
                Code:    81256                         188528
               Stack:     2652                           2664
            Graphics:   214416                         214416
       Private Other:   588276
              System:    12874
             Unknown:                                  591972

           TOTAL PSS:  1157454            TOTAL RSS:  1272392       TOTAL SWAP PSS:       27
```

其中我们可以通过下面的App Summary的信息段来了解应用程序的内存不同部分的用量：

- **Java Heap**：Java相关代码的内存分配，在Unity项目中，这部分用量通常不大。
- **Native Heap**：C/C++代码中直接通过malloc分配的内存，在Unity项目中由于Unity底层的内存分配主要使用VirtualAlloc的方式，所以绝大部分会归类到Unknown类别中，因此这部分内存通常也不应过大，主要包含Mono或者il2cpp的虚拟机，部分图形API的驱动内存分配，以及项目中一些第三方Native Plugin也会造成一些这部分的潜在内存分配。**这部分的内存用量可以通过Google提供Perfetto工具来进行抓取和分析** （[Perfetto](https://perfetto.dev/)） ，但要注意的是Perfetto工具目前支持的机型还相对比较有限。
- **Code**：映射的so/jar/apk/dex/oat/art等代码文件所占用的内存，在Unity项目中这部分代码**最主要的用量来自libunity.so和libil2cpp.so两个文件**。需要注意的Android系统的工作机制是逐渐读取代码文件，只有在需要使用发现缺页时才会去实际分配并载入文件中相关部分，而且随着系统内存的整体情况的变化，这部分内存也最有可能会Swap-out出去。此外要注意PSS与RSS内存统计在这个类别中也是区别最大的，其中**RSS内存会将程序所使用到的系统级的代码文件计算在内**，而这部分文件又通常由许多应用程序所共享的，**PSS数据则会将共享的部分按照所涉及的应用程序数据所平分**，对于我们的内存分析来说，这部分**更准确的数据应该参考Private Dirty + Clean**。
- **Graphics**：GPU部分的内存用量，在Unity的项目中，Mesh数据和Texture的数据应属于这部分类别。在我们的观测中，发现**部分个别设备会出现关于这个类别的统计偏差**，其会将本属于该类别的内存归类到Unknown中。
- **Unknown**：adb将内存中所有匿名申请及无法溯源的内存归类于此，这也是Unity引擎中内存分配的主要来源，**包括了Unity引擎中绝大多数C++的内存分配和C#的Managed Heap的内存分配**，以及一些来自第三方Native Plugin的内存分配，例如Wwise。**这部分的内存我们可以主要通过Unity Memory Profiler来进行分析**。

### adb shell cat /proc/\[pid\]/statm

该命令会打印出与应用程序相关的内存页的用量，其会输出7个数字，分别代表：

- Size : 程序虚拟空间的完整大小
- **Resident：程序实际正在使用的物理内存的大小**
- Shared：Resident中共享内存页数（例如存在文件备份的内存页）
- Text：程序所拥有的可执行内存页数
- Lib：Library（Linux 2.6内核以后均为0）
- Data：程序数据段和栈内存页数
- Dirty：脏内存页数（Linux 2.6内核以后均为0）

要注意以上数据均为内存的页数（Pages），在计算实际内存时我们只需要将该数字乘以单个内存页的容量即可（Android系统为4KB）。

**这个命令中对我们最重要的数据是Resident，因为这个数据是Unity引擎中底层返回的”System Used Memory”数据的实际来源，也是Unity Memory Profiler中内存总用量的来源**。

在我们的测试过程中，发现这个数据与adb meminfo中的PSS和RSS均存在一定的偏差，通常来说该值大于PSS而小于RSS。

关于该命令更多信息可查阅Linux系统文档：[proc(5) – Linux manual page](https://man7.org/linux/man-pages/man5/proc.5.html)

其他常用的相关命令还包括：

- adb shell run-as \[application id\] showmap \[pid\]
- adb shell run-as \[application id\] cat /proc/\[pid\]/smaps

### adb shell run-as \[application id\] pmap \[pid\] -x &gt; \*\*.txt

该命令用于详细打印出应用程序的详细内存映像信息，并输出类似如下格式的信息：（由于该命令输出内容较多，所以通常我们通过”&gt; \*\*.txt”将其结果输出至指定文本文件中）

```
Address            Kbytes     PSS   Dirty    Swap  Mode  Mapping
0000000012c00000  524288   11884   11884       0 rw---  [anon:dalvik-main space (region space)]
000000006f04a000    2620    1278    1256       4 rw---  boot.art]
000000006f2d9000     364     234     232       0 rw---  boot-core-libart.art]
000000006f334000     816     347     336      20 rw---  boot-core-icu4j.art]
000000006f400000     220     125     124       0 rw---  boot-okhttp.art]
000000006f437000     272      94      92       4 rw---  boot-bouncycastle.art]
000000006f47b000      60       0       0       4 rw---  boot-apache-xml.art]
000000006f48a000     512       2       0       0 r----  boot.oat
000000006f50a000    2508      13       0       0 r-x--  boot.oat
......
......
......
00000073a338f000      16      16      16       0 rw---  [anon:.bss]
00000073a3393000       4       0       0       0 r----  [anon:.bss]
00000073a3394000      24      12      12       0 rw---  [anon:.bss]
0000007fed645000       4       0       0       0 -----    [anon]
0000007fed646000    8188      64      64       0 rw---  [stack]
----------------  ------  ------  ------  ------
total           20713476  656271  532504    1556
```

这个命令向我们非常详细的展示了应用在内存中所处的每一个段落的信息（相信adb meminfo也是通过这些信息来汇总分析），其mapping信息可以帮助我们验证adb meminfo中相关类别的数据信息。

其中.so .art .oat .dex对应Code部分的内存；dalvik对应Java部分内存；anon则对应Unknown部分的内存。

在我们的测试中，我们主要用来验证前文中adb meminfo数据中.so mmap部分数据存在的波动性问题。

关于该命令更多信息可查阅Linux系统文档：[pmap(1) – Linux manual page](https://man7.org/linux/man-pages/man1/pmap.1.html)

### .so mmap的波动问题

在我们测试过程中，会观测到同一个APK测试时.so mmap的用量有时可以在启动后及游戏的运行过程中稳定在100MB以内，而另一些时候则会在启动后开始逐渐增长至300MB，该现象在不同的手机上均会复现并无明显规律可循。

经过我们的进一步的测试与分析，可以发现当.so mmap用量出现大幅增长时，Unknown部分的内存是会出现相应减少的，而内存的总量则始终保持稳定。

之后通过利用pmap工具的进一步分析，我们确认无论.so mmap会不会增长，在pmap的数据中，.so的用量始终保持稳定，因此根据我们已有的线索来推断，只能理解为adb meminfo会出现这种将部分unknown内存用量错误的归类于.so mmap的问题。

如果**你的测试中也观测到类似的现象，我们建议你通过pmap数据来确认真实的.so文件相关内存用量，并采用正确的.so mmap数据时的adb内存数据**（抛弃.so mmap出现不正常增长时的内存数据）

# Unity Memory Profiler

Memory Profiler是Unity提供的用于内存分析的工具，以目前尚在Preview的Package的形式提供给开发者使用，其本质是通过获取引擎中Allocator所记录的内存分配信息（需要Development Build）并进行归类来帮助开发者对游戏的内存情况进行分析，截至本文的编写，我们使用的是0.7.1-preview-1版本。

该工具目前还处在开发与持续改进中，而在我们的使用过程中，通过阅读Memory Profiler与引擎的源代码，也确实发现了Memory Profiler在内存分析中一些很容易造成误导的问题，但总体来说Memory Profiler依然是目前Unity项目中用来分析Managed Heap与Unity引擎中Native Heap的最好的工具。

### Managed Heap

这部分内存即为Unity C#代码逻辑使用的堆内存（Mono/il2cpp），更详细的信息可以通过”Objects and Allocations”标签中的”All Managed Objects”表格并结合实际代码来进行分析和改进。

此外我们需要了解的In Use/Reserved两个数据所代表的含义，**”In Use”表示当前C#代码中实际进行new分配并尚在生命周期的内存数据，Reserved则表示Unity Managed Heap的扩容逻辑向系统所预先申请的内存空间**（当Managed Heap扩容时实际上在操作系统层面上并不会立刻造成实际的物理内存分配，后文中有更详细的讨论）

### Native Heap

即Summary页面上的Other Native Memory部分，这也是除了Unity项目中除了Graphics中Texture、Mesh、Shader之外我们最应该关注的部分，也是用量通常最大的部分，对于这部分内存的详细情况，我们可以参考”Objects and Allocations”中的”Native Allocations”的数据。

其主要的组成内容包括：

- **Objects**：即所有常见的Unity引擎对象的C++层面的内存分配，包括GameObject、Transform、Animator、Collider等等，如果你的项目场景中对象很多，这部分内存往往是Native Heap中最大头的部分，这往往会使得通常只关注Managed Heap中相关对象用量（Objects的C#端的内存）的开发者们低估在项目中使用海量Unity对象所造成的内存负担，此外Unity引擎中也会存在一些匿名的底层内存申请也会归类于这部分内存（例如Addressable），如果你的项目这部分用量过于庞大，而且你有Unity引擎源代码，可以通过打开RECORD\_ALLOCATION\_SITES宏，并魔改一下Memory Profiler来获得这部分内存更精细的类别统计（统计其Allocator的类别）
- **No Root Area**：这部分内存主要是引擎底层内部使用的部分内存，比如各种内部用到的Buffer，数组等以及一些来自GfxDevice模块的内存分配。此外在我们的测试中，可以发现使用大量的MeshCollider也会造成该部分内存的增长。
- **SerializedFile**：这部分内存与AB包的加载数量呈直接且线性的关系。
- **PersistentManager.Remapper**：也与AB包的使用相关，如果AB包中存在大量嵌套层级较深的Prefab的时候，这部分内存用量往往会出现较明显的增长。

### All Native Objects

在”Objects and Allocations”中还有一个标签页”All Native Objects”看上去应该是用来详细展示Native Allocations中的Objects类别的数据，但仔细看的话会发现其总量是通常会高于Native Allocations中的Objects用量的，关于这部分统计数据，我们了解了如下一些信息：

- 其统计的是引擎Native分配中所有由GC系统所追踪并带有InstanceID的Objects，通过实际数量也可以确认，其应为Native Allocations中Objects的一部分对象
- 而其统计的内存中是包含了贴图与Mesh等部分GPU段内存的用量的，也因此导致内存用量无法与其他类别的内存统计量所对应
- 对于Objects本身的对象在”All Native Objects”中是不统计其数据结构头部信息的（Overhead），而通过阅读引擎源代码可以发现在Overhead部分是会被统计在Other Native的Reserved部分的，而其是会造成实际的内存分配的

Other Native的In Use/Reserved空间的情况会比Managed Heap略微复杂一些，通过阅读引擎源代码可以发现与Other Native有关系的众多Allocator的逻辑其实并不相同，有些例如BucketAllocator确实会预先向操作系统申请虚拟内存空间，即我们通常所理解的Reserved操作，但例如DefaultAllocator则不会进行类似的操作，反而仅将OverHead与Padding计算入Reserved空间。对于这部分的详细内容，我们可能需要更多的测试与调研，但Other Native的实际内存用量是应该会高于引擎目前统计的In Use的部分的。

### Treemap

Treemap是Memory Profiler从早期版本开始就已经提供的内存分析工具，可以以图形的方式来帮助开发者了解项目运行时的内存情况，但需要注意的是其所展示的内存包括了我们上文说的Graphics+Managed Heap+Native Heap，但**均为部分包含，并未展现Unity引擎所使用内存的很多方面**。例如我们之前对比测试中发现当AB包数量较大时使用Addressable和AssetBundle.LoadFromFile()存在相当大的内存差距，而这部分差距在Treemap中无法得到体现。

本质上**Treemap是Unity为我们提供的用来发现一些项目中常见的内存问题的便捷工具，当项目进行较深度优化时，该工具无法发现所有问题**。

### Untracked Memory

按照Unity的官方文档，这部分是包含了目前Unity无法追踪的内存的总量，其包含Native Plugin、Executable &amp; Dll、il2cpp runtime等。

通过实际阅读源码，可以发现Unity对于这部分的计算方式是使用来自系统的/proc/\[pid\]/statm中Resident的内存用量减去Unity目前统计的各部分的内存用量得来的。**但问题在于其减去的是各部分Reserved的内存数据，而Reserved的空间实际上有许多可能是并未发生实际内存分配的**，这使得Untracked的数据可能会产生相当大的误差。

在我们的测试中经常会观测到Untracked Memory显示为Unknown，通过源代码我们发现显示Unknown的原因是系统返回的内存用量小于了Unity所统计的内存总和……而这正是由于Reserved空间的误差所造成的。

**由此我们判断Memory Profiler中的Untracked Memory完全没有任何指导意义，且极具迷惑性**。由此我们在以后的内存分析中需要重新定义Untracked的统计方式而不应采用Memory Profiler中的数值。

# 系统内存分配与Unity内存分配的规则

在分析内存时，我们同样应该对操作系统以及引擎的内存分配行为及逻辑有所了解，以更好地理解我们所观测到的一些现象。

安卓系统的内存管理体系主要继承于Linux的系统，这里推荐一个来自Google I/O的演讲[Understanding Android memory usage (Google I/O ’18)](https://www.youtube.com/watch?v=w7K0jio8afM) 介绍了一些系统层面的内存工作机制，简而言之，从系统角度来看，内存最小分配的单元是页，每个页4KB，并且会在系统内存紧张时尝试回收部分可回收的内存页面（Clean Pages），或必要时杀掉优先度较低的应用进程。

而引擎底层的重载了new操作并主要通过VirtualAlloc接口来进行内存申请，其在内存声明/申请时并不会真正发生底层的物理内存分配，而只有在实际进行相关的内存访问（读/写）时才会触发系统底层内存分配操作。

此外引擎所记录的内存信息主要是基于虚拟内存地址，其无法反应对象在真实物理内存上所属内存页情况，因此我们所看到的例如Managed Heap中In Use的用量是一种理想的非常紧凑的内存用量情况，其实际分配与物理内存页的情况可能会造成更高的内存用量，而这部分的偏差也是我们目前已有的工具中无法准确统计到的。

ADB数据中反应的是反映了系统实际所使用的物理内存页的情况，而Unity所记录的是更加理想化的紧凑化之后的内存数据，即我们在Unity Memory Profiler所能看到的内存用量应会适量占据更多的内存。

# 内存分析流程

在了解上述所有内容后，我们在日常项目的内存分析工作中，通常使用了如下的分析流程：

- 使用adb shell dumpsys meminfo来分析程序内存的整体情况，并确保.so mmap数据的正常
- 使用Perfetto获取并分析Native Heap的内存使用情况
- 使用pmap来对比并确认.so mmap的内存使用情况
- 利用Memory Profiler中的All Native Objects数据来分析Graphics相关内存（ADB的Graphics与Memory Profiler中Graphics的用量差别应为引擎底层的渲染相关内存分配）
- 通过Memory Profiler的数据来分析Unknown中的主要内存使用情况
- 通过开关Native Plugin的方式来获得相关插件的大致内存用量
- 由于Unknown ≈ Memory Profiler中统计数值(Managed Heap + Other Native + Audio + Profiler) + Native Plugin，我们在使用ADB的Unknown用量减去所有可统计的已知内存部分，可以获得更为精确的Untracked memory内存用量

利用这样的方法我们将ADB所统计的内存用量，更清晰的划分为类似下图的内存分配图（Graphics可更进一步统计出Mesh与Texture2D的用量占比），以帮助我们了解项目的内存使用情况，并针对性的展开相关部分的优化与改进工作。

![](/wp-content/uploads/2023/03/1c5e7198-9777-46fe-9630-fb116b4653a8-1024x792.png)

通过分析流程所获取的内存用量分布饼图