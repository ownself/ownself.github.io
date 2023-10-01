---
id: 1731
title: 告别WordPress，你好Jekyll
date: 2023-10-01 16:24:35 +0800
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1731'
permalink: /2023/jekyll-immigrated.html
categories:
    - 历程
---

如同当年将博客系统从[Bo-Blog](https://www.ownself.org/2012/gao-bie-bo-blog.html)迁移至WordPress一样，最近终于下定决心再次将博客从WordPress更换到目前更“先进”更顺应潮流的静态博客系统上，目前选择的是Github Pages官方比较推荐的Jekyll。

![Jekyll-GithubPages](/assets/2023/github-pages-jekyll.png)

# 起因

最早在几年前看到[OneV's Den](https://onevcat.com/)的博客从WordPress迁移到Jekyll时就已经产生了这个想法，当时就对这个Jekyll的访问速度和简洁的风格印象深刻，更觉得可以把博客直接免费托管在Github上感到惊奇（Github真大方），但因为那几年孩子的出生以及工作上的繁忙，就一直被拖着。直到上个月读一篇技术博客时，看到作者也在使用了11年WordPress后，下定决心切换为Hugo后（[Hello, Hugo](https://therealmjp.github.io/posts/hello-hugo/)），才又燃起了我折腾一番的动力。于是我汇列了一下更换的优缺点：

优点

* 可以将博客托管至Github Pages，暂时每年不再需要缴服务器空间费了
* 目前托管的服务器太烂了，速度和空间容量不说，PHP版本都是不给升级一下（便宜没好货）
* 我真的太喜欢Markdown了（这才是决定性的理由！）

缺点

- 迁移博客需要时间和学习成本（事后来看正好一周的时间，过程其实还是充满乐趣的）
- 托管至Github Pages以后可能会有国内访问上的限制与风险（目前还OK）
- Jekyll很多配套的功能比较有限，插件社区也没办法与WordPress相比，可能需要更多的在自己并不熟悉的HTML+JS的代码上投入精力

此外，我还对比了目前流行的静态博客框架，虽然Hugo有着构建速度更快的性能优势，但是似乎也有着明显更高的学习曲线。因此最后还是保守的选择了Github Pages官方推荐的Jekyll。

# 过程

有了想法后当天就在本地先试了试安装环境与部署测试，参考Jekyll的官方文档就好，本地环境的安装就需要占用你接近1GB的空间（这上来第一点上就显得有点劝退了，改动和调试可能以后需要在固定的设备上进行了），之后又参照着Github Pages的文档，将测试的站点推到了https://ownself.github.io上，第一步比想象中的要顺利。

既然开了头，从第二天开始上班时候，就开始心里长草了，加上最近工作上没那么紧张，于是利用早晨早到公司的那一个多小时里就开始继续折腾了起来，连着用了几天，一步步完成了：

- 使用官方推荐的WordPress插件将老博客的文章导出为Jekyll的格式
- 测试并选定评论的功能插件：[utterances](https://utteranc.es/)
- 修复文章的Tags
- 选定第一版准备使用的主题[beautiful\-jekyll](https://github.com/daattali/beautiful-jekyll)的安装与测试
- 利用插件Jekyll-Paginate实现主页的分页功能（官方程序竟然没有提供，这个坑了我差不多半天的时间）
- 修复老文章中的格式问题
- 编写Python脚本来导出老博客中的评论到utterances中
- 修复所有文章链接问题
- 域名指向（到这里就算是正式迁移了）
- 启用Google Analytics（代替之前的Jetpack）
- 编写Python脚本修复所有的贴图链接
- 删除冗余的WordPress自动生成的缩略图（发现有时候WordPress自动生成的缩略图比我的原图还大……）
- 实现RSS全文输出，并通过跳转修复老的RSS地址
- 实现博客的全文搜索功能

Github Pages似乎不支持subpath，但是老博客是带着"/blog/"的subpath的，最后决定不再使用"/blog/"了，为了修复已经存在的老文章的链接地址失效的问题，又编写了Python脚本自动生成了所有老链接地址的自动跳转页面。

Beautiful-Jekyll主题实现了一个快速搜索标题的功能，但阅读了代码发现它是通过在每一个页面上内嵌所有文章的meta信息来实现的，这实在是个非常不环保非常浪费性能的实现，于是我魔改了主题的代码，摘去了这部分内嵌逻辑并把全文搜索（要求的Json格式中不能包含&字符这一点也坑了我将近半天的时间）实现在了专门的搜索页面上。

# 总结

总的算起来前后花了差不多一周的业余时间，完成了博客的迁移，也顺便提醒我今后还是应该尽力多分一些精力，多写一点东西，对我来说，其实写东西的核心并不为给别人看，更多是写给自己的，一份思考与一份总结，无论是生活上的还是工作中的。

PS：意外发现[Bo\-Blog](https://bo-blog.com/)的站点还在维持，并且还可以下载到当年使用的程序，还附了一首充满感情的小诗，要知道Bo-Blog v2.1可是15年前的产物了，我想作者对它的情怀由此可见。

