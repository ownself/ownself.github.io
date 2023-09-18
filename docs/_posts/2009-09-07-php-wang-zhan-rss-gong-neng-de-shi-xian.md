---
id: 94
title: '[PHP]网站RSS功能的实现'
date: '2009-09-07T17:28:47+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=37'
permalink: /2009/php-wang-zhan-rss-gong-neng-de-shi-xian.html
categories:
    - PHP
---

<font face="微软雅黑" size="2"> </font>

 RSS真的是个很不错的东东，让你的在网上的阅读能很大的提高效率，在我看来势必是会被推广的，我也一直在努力游说周围的朋友，来使用阅读器，但是目前还没多少人吊我，呵呵，也许我推荐的太多了，已经引起了大家的公愤和反感：）   
 我的博客的游戏版面是完完全全手工编写的，所以自然是不支持RSS的，其他几个用模板做的版面都通过Yahoo Pipe合在了一个RSS里，很希望能把这个版面的内容也能添加进来，没有办法，是需要手工写RSS的时候了。   
 不过研究了之后发现，其实很简单，一点都不复杂，开放式的标准真的很好。   
 想要为自己的网站实现RSS功能，首先需要了解RSS2.0的标准，这里有英文标准原文，非常的简洁明了：   
 <http://www.rssboard.org/rss-specification>   
 而RSS最终输出的就是一份符合RSS2.0标准的XML文件，仅此而已，所以我们要做的就是根据我们所需的理解RSS2.0标准下XML文件中的各个节点的含义，然后再用相应的语言（PHP、ASP等等）输出即可。   
 简单通读一下规则，我们可以知道一份RSS文档中首先所必需的是关于频道的描述（channel节点），这个节点中必须要包含的是&lt;title&gt;&lt;link&gt;&lt;description&gt;三个节点，分别表示的是频道的标题、链接地址和关于频道的描述，可选的节点包括language、webMaster、image等等，这些在RSS规则中都有详细的解释，不再赘述。   
 下面就是item节点了（也属在channel节点下的），每一个item节点就是一个RSS中的条目，也就是我们要输出的正文了，item节点同样包含很多子节点，所有节点都是可选的，但至少应该包含一个title（标题）和description（正文），一般来说，link（链接地址）、author（作者）、pubDate（发布日期）是比较常用的。其余的选择都可以在RSS标准中查到。   
 这里给出个小例子，方便大家理解，最终输出的XML文件应当是以下形式的：

&lt;?xml version="1.0" encoding="utf-8" ?&gt;   
&lt;rss version="2.0"&gt;   
 &lt;channel&gt;   
 &lt;title&gt;劉貞明的游戏人生&lt;/title&gt;   
 &lt;link&gt;http://www.ownself.org/game/rss.php&lt;/link&gt;   
 &lt;description&gt;我对游戏的理解&lt;/description&gt;   
 &lt;language&gt;zh-cn&lt;/language&gt;   
 &lt;managingEditor&gt;liuzhenming@ownself.org&lt;/managingEditor&gt;   
 &lt;webMaster&gt;liuzhenming@ownself.org&lt;/webMaster&gt;   
 &lt;item&gt;   
 &lt;title&gt;第二篇帖子&lt;/title&gt;   
 &lt;link&gt;http://www.ownself.org/game/display.php?id=2&lt;/link&gt;   
 &lt;author&gt;刘贞明&lt;/author&gt;   
 &lt;description&gt;宝塔镇河妖&lt;/description&gt;   
 &lt;/item&gt;   
 &lt;item&gt;   
 &lt;title&gt;第一篇帖子&lt;/title&gt;   
 &lt;link&gt;http://www.ownself.org/game/display.php?id=1&lt;/link&gt;   
 &lt;author&gt;刘贞明&lt;/author&gt;   
 &lt;description&gt;天王盖地虎&lt;/description&gt;   
 &lt;/item&gt;   
 &lt;/channel&gt;   
&lt;/rss&gt;

 要注意的是频道描述里的link节点，必须是RSS输出所在的文件，如上面例子中的，不然在Google Reader中会无法识别。还有在最后的输出里如果每个节点的内容又包含&lt;string&gt;&lt;/string&gt;的子节点是没有关系的，只是用来说明数据类型的。   
 还要注意的是字符集一定要匹配，RSS输出用的文件的字符集，数据库中存储的字符集，网页显示的字符集都要匹配。   
 关于频道就用固定的写在变量中echo出来就可以，item可以用循环语句将在数据库中检索出来的数据依次echo即可，下面这个链接是我用PHP写的，非常简单，很好理解。   
<iframe frameborder="0" marginheight="0" marginwidth="0" scrolling="no" src="http://cid-507861a5ffb49bea.skydrive.live.com/embedrowdetail.aspx/.Public/%e7%a8%8b%e5%ba%8f%e4%bb%a3%e7%a0%81/rss.php" style="border-right: #dde5e9 1px solid; padding-right: 0px; border-top: #dde5e9 1px solid; padding-left: 0px; padding-bottom: 0px; margin: 3px; border-left: #dde5e9 1px solid; width: 240px; padding-top: 0px; border-bottom: #dde5e9 1px solid; height: 66px; background-color: #ffffff"></iframe>   
 [rss.php](http://cid-507861a5ffb49bea.skydrive.live.com/self.aspx/.Public/程序代码/rss.php)   
 嗯，基本就这些了。