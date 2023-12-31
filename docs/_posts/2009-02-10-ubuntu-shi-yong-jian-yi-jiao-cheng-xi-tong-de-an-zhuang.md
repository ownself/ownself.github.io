---
id: 61
title: '[Ubuntu使用简易教程]系统的安装'
date: '2009-02-10T16:00:50+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=37'
permalink: /2009/ubuntu-shi-yong-jian-yi-jiao-cheng-xi-tong-de-an-zhuang.html
categories:
    - IT
---

由于我也刚接触Linux不久，也是新手，而且我主要是很希望能给身边很多并不太学电脑的朋友推荐Ubuntu操作系统，所以写的很傻瓜，尽量一看就会，高深的我目前也写不出来，呵呵，所以要是万一有路过的不可一世的高手，就请您省却鄙视我的过程吧～。

在开始准备安装Ubuntu操作系统前，我们需要准备一张Ubuntu操作系统的光盘，网上搜一搜，搜不到的话可以去官方网站([www.ubuntu.org.cn](http://www.ubuntu.org.cn))上下载，因为是免费的嘛～而且看到官方上还有系统光盘邮寄服务！？

下载好桌面版光盘镜像后不要着急～

Ubuntu提供了两种安装方式，一种是Install inside Windows，另一种是独立安装。

### Install inside Windows

我不知道Linux的其他发行版本支持不支持这种安装方式，Ubuntu提供的这种方式实在是太方便了，绝大多数的用户电脑使用的都是Windows操作系统，而在这种安装模式下，我们不需要另外的Linux分区，在Windows内便可以进行Ubuntu的安装，Ubuntu就像Windows下的一个软件一般，整个Ubuntu的“分区”被模拟成一个Windows系统下的文件～而要想删除Ubuntu系统的时候，也像删除一个软件一般简单。这样简单方便，很多Windows的用户完全可以轻松地享受到新鲜的操作系统，而不需要担负很大的风险，万一系统不尽人意，担心恢复机器的原样会过于麻烦。

对于想尝试Ubuntu操作系统，而且主要应用就是上网，娱乐等功能的朋友，我还是比较推荐这种安装方式的。

使用这种安装模式，不需要把系统镜像刻录成光盘，而直接使用虚拟光驱加载即可，加载后启动，在主界面上选择“Install inside Windows” ：

[![1234252834_15957628](/wp-content/uploads/2012/04/1234252834_15957628_thumb.jpg "1234252834_15957628")](/wp-content/uploads/2012/04/1234252834_15957628.jpg)

然后我们可以看见如上图中的界面，这时我们需要选择模拟分区的大小、安装位置、语言环境以及管理员的名称和密码，硬盘大的话选8G、10G都可以，硬盘小的话5G也差不多够用了。确定后便开始复制镜像了，完成后重启，在多系统启动菜单中选择Ubuntu，进入后，我们可以休息一会儿，系统就会自动的完成剩余的安装，安装，基本…就这么简单，注意安装完成后，在Windows系统下安装Ubuntu的文件夹内会有.iso的Ubuntu的光盘镜像，可以删掉，节省700M左右的空间。 另外这种模式有一个不好的地方就是Windows中安装Ubuntu的那个分区在Ubuntu系统下是无法访问到的。

### 独立安装

这个就比较传统了，需要将镜像刻录成光盘，再使用光盘引导启动，进入安装，按照提示进行分区，如果已有Windows分区，也可以从其中“挪出”一部分空间转为Linux用的，然后安装，难点也就在这里，可能会让很多非计算机的童鞋感到茫然， 光盘启动后选择”install Ubuntu”，进入后一路会需要你选择语言、区域、键盘类型等等，应该都很简单，照直选择即可，然后会进入分区界面，这一步很关键，如下图所示：

[![1234252845_261216ac](/wp-content/uploads/2012/04/1234252845_261216ac_thumb.jpg "1234252845_261216ac")](/wp-content/uploads/2012/04/1234252845_261216ac.jpg)

我相信对于身边大多数朋友来说，机器上都会安装Windows的操作系统，所以基本都会遇到这个问题，这一步我们需要做的是从安装有Windows系统的硬盘中划分出一块给Ubuntu用，Linux需要用到的分区主要有两个：用于存放文件的ext3（初学者向）分区和用作虚拟内存的swap分区，当然在这里我们使用引导的话，用户是不需要去详细的了解这些的，如图选择“向导-resize….分区 and use freed space”，这时我们可以通过鼠标拖拽来调整原有系统的分区和用于Ubuntu的分区的比例大小，注意在此之前最好了解原先系统中空余空间的大小，并以此做相应调整，以防过度调整，伤害原来系统中的文件，不过我没做过这种测试，会出现什么情况我就不清楚了，最好将原先系统中的重要文件提前备份吧，呵呵，之后系统会重新调整分区，并自动建立用于Linux的分区，如果有人愿意自己手动调节的话，可以选择手动，我在wiki中找了一点点说明，可以参照，[点击观看](http://wiki.debian.org.hk/w/Partition_hard_disk_with_Ubuntu_desktop_8.10_Install)。

另外，在网上查看资料的时候说，Vista系统下的分区不能直接进行调整，需要在Vista下使用一个Vista提供的叫Disk Management Console的工具来调整分区大小，之后安装进行到如上界面时，选择出现的“向导-安装到最大的连续未使用空间”即可。我的机器无福消受Vista，没有试验过，需要更多信息，大家可以自行搜索。

之后….就应该比较简单了，按照说明照着点就是了，其实真的很傻瓜，会装XP肯定也会装这个，现在的系统做得越来越易用了，再也不用回到当年Win98那时候，全班同学的重装系统的任务都只能交给一个“高手”来完成的年代了。据说利用这种安装方法还可以实现在优盘、移动硬盘里安装Ubuntu系统，从而实现移动操作系统的功能，没处在特殊的工作环境中，可能这种应用的实用性倒是不太大，呵呵。