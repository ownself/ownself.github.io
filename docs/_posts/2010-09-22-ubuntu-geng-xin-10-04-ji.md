---
id: 127
title: Ubuntu更新10.04记
date: '2010-09-22T23:44:35+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=89'
permalink: /2010/ubuntu-geng-xin-10-04-ji.html
categories:
    - IT
---

 08年夏景天时候装了Ubuntu8.04，用的是wubi安装的，后来更新到8.10，分了专门的区，再后来忙乎毕业的事情，找工作，系统就这么一直搁在机器里再没动过，前两天心血来潮，下了个最新的10.04试试，为了干净省事，想把先前的Linux分区直接删了重装。网上一查，发现需要先把硬盘的Mbr恢复成Windows的，可以在WindowsXP安装盘里用Mbr命令恢复，也可以在[这里下载](http://cid-507861a5ffb49bea.office.live.com/self.aspx/.Public/%E8%BD%AF%E4%BB%B6/Ubuntu/MbrFix.exe)独立的Mbr修复程序，然后在cmd中使用“MbrFix /drive 0 fixmbr”命令，即可恢复成Windows用的。如果Linux分区是在整个硬盘的最后，那么直接在控制面板-&gt;管理工具-&gt;计算机管理-&gt;磁盘管理中删除即可了，如果不是，情况可能稍微复杂点，还是用PQ等功能强大点的工具处理的好。   
 分区删掉后，分区就变成了未使用空间了，想合并进前面的逻辑分区中的话，可以在“cmd”中使用“diskpart”命令，回车进入磁盘管理工具程序。先输入“list disk”，回车便显示出磁盘编号，如果只有一个硬盘，便是“磁盘0”。再输入“select disk 0”，选定进行操作硬盘。再输入“list partition”显示分区，会依次列出主分区扩展分区和所有的逻辑分区，一般数字1就是主区也就是C盘。数字2是扩展分区包含了所有逻辑分区。数字3也就是D盘，我就到D盘，输入“select partition 3”。然后再输入“extend”随后开始将后面的未使用的空间与前面的分区进行合并，并且前面的分区中的文件不会丢失。   
 费了一大圈劲儿，恢复成最初的只有Windows系统了，想了想，还是用wubi在Windows系统里安装吧，省事～比较适合我这种装着玩的主儿，把[wubi安装程序](http://www.ubuntu.org.cn/desktop/get-ubuntu/windows-installer/)和[下载好的ISO](http://www.ubuntu.org.cn/desktop/get-ubuntu/download/)文件放在一个目录下启动就能安装，和以前一样简单直观，可以参看[以前的介绍](http://www.ownself.org/ownselfblog/read.php?37)。   
 5分钟就装好了，进了系统才发现，短短的两年时间，Ubuntu真的进化了好多，基本上系统装好一切就都是好的了，甚至不用折腾显卡驱动了，速度也有明显提升了，软件中心友好了很多，软件源的速度也很快，花了不到半个小时就把我以前需要折腾整夜的东西都装齐了。

[![Ubuntu104](http://www.ownself.org/blog/wp-content/uploads/2010/Ubuntu10.04_14DF7/Ubuntu104_thumb.jpg "Ubuntu104")](http://www.ownself.org/blog/wp-content/uploads/2010/Ubuntu10.04_14DF7/Ubuntu104.jpg)   
 Ubuntu真的成熟了很多，对于我这种伪Linux用户来说，这绝对是一个非常实用而且美丽异常的操作系统了～毫无保留，再次强烈推荐大家！！   
 PS：<http://forum.ubuntu.org.cn/>