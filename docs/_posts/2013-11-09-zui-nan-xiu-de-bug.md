---
id: 1295
title: 最难修的Bug
date: '2013-11-09T16:41:06+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1295'
permalink: /2013/zui-nan-xiu-de-bug.html
categories:
    - 历程
---

[![lady-bug](http://www.ownself.org/blog/wp-content/uploads/2013/11/lady-bug-300x180.jpg)](http://www.ownself.org/blog/wp-content/uploads/2013/11/lady-bug.jpg)最近Quora上比较火的一个帖子，有趣的是我也曾有过一段花了很长时间修复一个Bug的惨痛经历，Bug本身并算不上难修到夸张的程度，但是Debug环境的恶劣等等周边因素加在一起却造就了这个大概是我一生也很再遇到一个同等级别的Bug了。

当时我刚刚毕业来到上海加入了2K，刚刚从巨人网络那监狱一般的工作环境里逃脱出来结束实习，在2K的感觉就像天堂一样美好，头两个星期居然没有给我任何事情做，只好自己看看论文什么的，后来孙霆把我分到NBA2KPSP项目，才算正式上了道，不过我加入时正好是NBA2K10项目行将结束的时候，制作人面对一个完全不熟悉项目和环境的新人，似乎也想不出太合适的工作给我，就把当时一个优先度很低的独立问题交给我来做，其实这个问题当时有经验的同事已经看过一段时间了，似乎并不是很好解决的样子，但是因为有更重要事情做也只好先搁置起来，虽然大概看上去我不像是个能把问题解决的造型，估计是本着有枣没枣打三竿子的想法，制作人决定让我自己先看看，权当熟悉项目了。

这是个关于将游戏转换成数字版本以供PSN使用的问题，我们都知道PSP的游戏载体是UMD，一种小一号的DVD光盘，后来索尼开始进行数字化尝试，推出了PSN网络，玩家将可以从PSN上直接购买并下载游戏到本地的MemoryStick上而不必一定要求购买UMD盘，对于已经发售或即将发售的游戏索尼不可能要求开发者再为PSN重新开发，所以为此提供的办法是一套一键式转换的工具，开发者只需要利用工具将UMD的游戏版本转换为PSN可用的版本即可，大概做了一些安全有关处理的转换吧。

问题和现象看上去都很简单，当我们使用索尼提供的工具转换后游戏无法启动，始终只有一个黑屏画面……

好吧，让我想想该如何入手，我先学习了如何转换PSN的版本，实际上索尼并没有将本地工具提供给开发者，而是要求我们将版本上传至特定服务器，服务器会在上传完毕后自动进行转换，转换完成后我们再把转换好的版本下载即可，但很不幸的是公司的网络连接到这个服务器的速度相当慢，而我们的游戏又有将近1.5个G，我尝试转换的第一个版本上传用了1天半的时间，下载转换好的版本也用了1天半的时间，这样头一个星期里我基本就什么都干不了……

下载好第一个版本后放到开发机上一跑，不出所料果然只有个黑屏，该如何下手呢？因为转换后的PSN版本已经是面向市场的Release版了，而这个问题只会出现在转换后，是没有办法直接进行调试的，所以唯一剩下的办法就是——打Log，我尝试在游戏启动的几个关键地方加上了Log希望借此可以找到问题出现在哪一步，加好后又要上传转换，于是三天又过去了……然后根据Log我得到了一点点信息和方向，于是我只能沿着这个方向根据自己的判断再加上一些Log然后再上传，然后再等三天……大概这么搞了两个星期我被等待的过程搞疯了，因为这相当于如果我在本机调试的话，电脑三天才能开一次，这肯定不是办法！！

我想是肯定绕不开上传转换这一步的，所以我能想到的办法就是减小版本的尺寸，因为游戏启动都启动不了意味着理论上我可以把后面几乎所有的游戏资源都去除掉，只要我能保证还能正确的将游戏打包成PSP可识别的UMD镜像格式即可，但之前项目里没有人这么做过因为完全没有必要，所以我决定把Bug先搁置一旁，开始专心研究如何缩小游戏版本了，大概又花了一个星期的时间，在向老程序员学习了版本管理资源的方法和索尼PSP游戏打包的标准流程并成功将相关代码剥离开后，终于将游戏大部分的资源摘除出去，而且避免了代码上的Crash，让游戏实际上变成了一个只有主菜单的程序，游戏的大小从1.5G变成了7M，事实证明，这一个星期的额外工作是相当值的，虽然还是需要上传转换再下载才能跑一次，但是已然让我“调试”一次的周期从三天一次变成了一天七次！

效率起来后，进展快了许多，但似乎还是距离真正的线索很遥远，我的Log越加越多，越加越深，通过测试我发现无论是NBA2K还是MLB2K（2K旗下的另一款棒球游戏）经过转换后都会出现黑屏问题，这样基本排除了游戏的问题，把焦点集中在了两款游戏统一使用的框架库VCLibrary上了，VCLibrary是Visual Concept（NBA2K系列的真正开发方）为他们的游戏所开发的框架库，已经维护将近十年，写得非常好，难道这里会有个隐藏了多年的bug吗？经过不断地加Log，我已经能知道游戏实际上会精确的卡在哪里了，一个特定PSP本身的API上，但是PSP本身的API会犯错误吗？似乎不太可能吧……我尝试联系了索尼的开发支持，把最终的调查结果反馈给了VCLibrary的开发人员，并在开发社区上询问是否有别人遇到过同样的问题，但所有的反馈都像是一个死胡同，于是所有线索一下又像一个个断了线的风筝，只能目送着它们越行越远……

制作人知道了这个情况后也表示能理解，但是游戏已经即将发售，这意味着当初希望UMD版和数字版同时上线似乎不太可能了，但是大家也都没有什么好的办法，可能也只好这样了，到时候看看总部准备怎么解决吧，于是我消停了大约一周的时间，开始做点别的事情了。

但始终这个奇怪的问题让我无法回避，想起来就觉得堵心，每天还都会拿出些时间尝试些新东西，反复了将近两周后，突然有一天我终于崩溃了，我开始疯狂地加Log，我把启动时所有调到过得函数都加上了Log，每一个调用，每一个Step前后都加上了，现在好像有些想不起来当时为什么突然要发这种神经了，大概是真被折磨疯了吧，总之一共加了将近2000行Log吧，转换过后烧进开发机进入游戏，屏幕亮了，NBA的Logo打在了屏幕上，那一瞬我的第一反应是我怎么把UMD版放进了？但确认后发现真的是游戏启动了！确确实实的跳过了出现黑屏的地方，我高声大叫了起来，跑向制作人叫她来看上帝……

冷静过后，我把Log全部去掉把代码回退到原始的版本，黑屏的问题就又出现了，把Log加上去游戏又能启动了，所以这么说那些Log确确实实起了作用了，虽然我一下子想不出是为什么，而且这种未知的感觉还有一点点恐怖感。

于是我开始尝试逐步的去除Log，用折半法来继续探索，几次下来去掉了很多Log但是同样可以解决黑屏问题，这样我的信心大增，因为我已经能感觉到即使是某个我现在还无法解释的原因造成的，而Log可以解决这个问题的话，我应该也是不需要这么多Log来修复它（如果为了解决一个Bug而要向代码库上传上千条Log，这样丧心病狂的事情会让所有程序员疯掉的吧-\_-），那句真正起作用的秘密它只是现在还藏在这几千个Log中，而折半搜索法，学过计算机的人都知道，我只需要Log(n)次就能把它揪出来！

最终我当天就找到了问题的真正发生位置，并非是在我之前苦苦探索的游戏主线程中，而是在游戏的读取线程中，三天后我将一个只加了一句Log的经过转换的完整版本从索尼的服务器上拿下来并在开发机上顺利的跑了起来，玩了几局比赛后游戏看上去没有任何问题，这意味着PSN的版本赶上了最后的Deadline。

算了算整整六周的时间，我修了一个Bug……

此后的两天里，从巨大的苦难中解脱出来的我翻阅了索尼的技术文档，仔细阅读了VCLibrary关于读取线程的代码，最终确定问题的真正原因，在于UMD和MemoryStick的读取速度上的差异，之前VCLibrary的读取线程的优先度和主线程是一样的，而UMD的读取速度较慢，所以即使在读取线程工作时，它总需要等待光头，从而留给主线程时间进行正常的工作，而MemoryStick的读取速度比起UMD是天差地别，飞快的读取速度是VCLibrary当初移植PSP时未曾测试也没能考虑过的情况，很不幸的是，在这种情况下，读取线程因此陷入了飞速的死循环从而没能给主线程留下任何一点CPU来进行正常的工作，而我加上去的那个小小的神奇的Log，会进行一个极其微小的I/O操作，而就在这毫厘之间给了主线程喘息之机，从而让程序重新跑了下去。

第二天，我把那句Log换成一句Sleep(10);

我想这大概有可能是我整个职业生涯都很难再遇到一次的极品Bug了，而且还是我职业生涯开始的第一个任务……