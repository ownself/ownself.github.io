---
id: 147
title: 'Mac OS X Lion 10.7.3 Hackintosh'
date: '2012-04-04T20:23:24+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=141'
permalink: /2012/mac-os-x-lion-10-7-3-hackintosh.html
rumputhijau_meta_box_input_image:
    - ''
categories:
    - IT
---

![MacOSXLion](/wp-content/uploads/2012/04/MacOSXLion_thumb.jpg "MacOSXLion")

上次为大家介绍过了我在我的PC上安装黑苹果的方法，安装的是雪豹10.6.4，最近又安装了Lion 10.7.3，在这里也把我安装的方法做一个简单的说明，希望能帮助到需要的朋友们，这里假设您已经拥有一些黑苹果的知识并阅读过我的前文，[入口在这里](https://www.ownself.org/2010/wo-de-mac-os-x86.html)。

安装黑苹果其实有很多种方法，也有很多高手致力于让黑苹果的安装过程更加简易化，他们选择了不同的方向，比如iATKOS等致力于将引导、破解、安装集成于一体的版本，也有使用第三方工具来安装原版系统的。我在安装雪豹的时候使用的就是iAntares Snow Leopard MacOSx86 10.6.3 v2.2，而这一次的Lion的安装，我则使用的是原版的。其实我能写下的也仅仅是针对我自己的机器安装的方法和经验，更多的内容我推荐您访问<http://www.tonymacx86.com/>，当然需要一点英文阅读，但这里提供的信息和工具在我两次安装Mac系统中都起到了决定性的作用。

这次我的安装Lion的方法也是来自TonyMacx86，我的工作主要是翻译原帖～，[原帖入口在这里](http://tonymacx86.blogspot.com/2011/10/unibeast-install-mac-os-x-lion-using.html)，需要翻墙。

这个安装方法真的是相当的傻瓜化，整个安装过程轻松到了仅仅是点了十几下的鼠标，等待15分钟左右就完成了，不过这么轻松是有前提的，所以一定要确认下面列举的几个条件都符合并且完成了：

1. 合格的硬件配置，尤其是CPU需要Intel Core以上的，AMD的目前Lion似乎还没有破解的内核，如果不确定你的硬件是否符合安装苹果的要求，可以[在这里](http://www.tonymacx86.com/wiki/index.php/Category:Hardware)查询。
2. 分好区的硬盘，因为我的硬盘在上次安装中已经完成了这个步骤，所以这次是省略掉了，如果参考我的分区，请翻看前文，确保分区合理并能支持多系统的启动。
3. 一台Mac电脑！或者是运行Mac电脑（虚拟机）的Windows系统，这一条可能比较讨厌，也很麻烦，但是这种安装方法一台Mac是必要的⋯⋯
4. 8G或者以上的U盘
5. Mac OSX Lion 10.7.3的安装程序，需要是以.app结尾的升级程序，也就是说是直接在Mac App Store上购买的OSX Lion 10.7.3的程序，购买后位于/Applications目录下，3.7G，而并非网上更容易搜到的dmg格式，不过我没研究过两者之间是否可以转换。

以上的条件都具备后，我们就可以开始做准备工作了，全部是在条件3中所需的Mac电脑上完成的：

1. 格式化U盘——将U盘插入Mac电脑后，启动磁盘工具（**Applications/Utilities/Disk Utility**），选中左边的U盘，然后点击右边的“分区”按钮，选择分一个分区，“选项”中选择**Master Boot Record**，分区文件格式选择“Mac扩展（日志）”。
2. 创建Mac安装U盘——下载[Unibeast工具](http://www.tonymacx86.com/downloads)，同时确保完整的Mac OSX Lion安装程序位于/Applications目录下，启动Unibeast，一路继续，选择U盘，在Installation Type界面，选择Mac App Store “Install Mac OS X Lion” App，最后选择安装，正常情况需要等待10－15分钟。
3. 安装Mac系统——通过U盘启动，进入变色龙启动界面，进入安装，如果顺利的话能够看到安装界面是最好的了，如果碰到自动重启或是卡住不动的情况则可能需要配合”-v busratio=20″ 等命令来进入安装界面，一旦进入安装界面，恭喜您，一大半的工作已经完成了。
4. 后期安装——系统安装大同小异，安装完成后会自动重启，此时不要拔除U盘，因为系统还没有安装变色龙引导，还需要通过U盘来进行引导，重启后进入Lion系统，来安装驱动和引导，MultiBeast无疑是最好的选择，在[这里下载](http://www.tonymacx86.com/downloads) ，并且下载你主板[相应的DSDT文件](http://www.tonymacx86.com/DSDT/)放置于桌面上，启动MultiBeast，勾选你机器所需要的相应的驱动即可。

恭喜您！安装完成了～