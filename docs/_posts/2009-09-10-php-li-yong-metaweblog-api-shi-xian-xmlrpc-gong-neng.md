---
id: 97
title: '[PHP]利用MetaWeblog API实现XMLRPC功能'
date: '2009-09-10T15:53:53+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=43'
permalink: /2009/php-li-yong-metaweblog-api-shi-xian-xmlrpc-gong-neng.html
categories:
    - PHP
---

<font face="微软雅黑" size="2"></font>

 Windows Live Writer是一款小巧的写博客的工具，非常方便，甚至网上看到过有的评论称Live Writer是一款最不像微软产品的微软产品，呵呵，不管怎么说反正我是非常喜欢。   
 Writer支持MSN Spaces以及Wordpress之类的很多博客模板，但是如果是自己写的博客系统呢，就像我的游戏版面，因此就如上一篇的RSS功能一样，也需要亲自动手一下了。   
 非常不幸的是网上的资料非常少，而且全部是英文的，又参看了其他博客模板的XMLRPC功能的源代码，有了一点点的基本了解。   
 XMLRPC协议直白的讲是一个远程通讯用的标准，通讯的双方都使用XML格式来交流，而为了使双方的程序都明白数据的内容，需要有一个格式的约束，这个约束就是XMLRPC标准。   
 XMLRPC有很多应用的领域，其中之一便是Blogger API，Blogger API是遵守XMLRPC协议的一种用来进行博客写作的应用程序接口，而MetaWeblog API同样是这样一组应用程序接口，当然，对Blogger API在功能上进行了一定的扩充。   
 <http://www.xmlrpc.com/> 这里是XMLRPC的官网，关于Blogger API和MetaWeblog API的详细内容也都可以在这里完整的查到。   
 Live Writer作为博客写作的客户端，支持很多种用于博客写作的API接口，今天我的方法便是使用MetaWeblog API来实现的。   
 Writer和博客之间整个的工作流程很简单，每当Writer发出工作请求的时候，会发出一个XML格式的消息，当博客程序接收到消息后，进行处理（用户编写），然后再返回一个XML格式的消息，告知客户端工作进行的怎么样，就这么简单，我们要做的工作就是正确的分析客户端发来的XML消息，然后进行相应的数据库处理，最后再返回一个正确的XML消息。   
 那么首先，需要有XML解析的功能，还要保证符合XMLRPC协议，这可是个工程量浩大的活儿，网上有很多已经封装好的库可以使用，也可以在XMLRPC给出的Library基础上编写，可以事半功倍，我用的是一个应该是爱好者吧，自己用PHP编写的XML-RPC Library（[http://keithdevens.com/software/xmlrpc）](http://keithdevens.com/software/xmlrpc)   
 MetaWeblog API一共有6个程序接口，分别是：   
 metaWeblog.newPost (blogid, username, password, struct, publish)   
 metaWeblog.editPost (postid, username, password, struct, publish)   
 metaWeblog.getPost (postid, username, password)   
 metaWeblog.newMediaObject (blogid, username, password, struct)   
 metaWeblog.getCategories (blogid, username, password)   
 metaWeblog.getRecentPosts (blogid, username, password, numberOfPosts)   
 函数的用途正如其名，很好理解，上面三个函数是必须实现的，下面的三个是可选的，另外还有一个必须实现的函数是blogger.getUsersBlogs，这个是原属于Blogger API的。关于细节包括参数，返回值的要求，大家参看官网（<http://www.xmlrpc.com/metaWeblogApi>），不难理解，这里不再赘述了。   
 后面的工作就是正确的分析消息然后进行相应的操作就行，有点不太好讲清楚，所以我还是把源代码给出，里面写了详细的注释，相信能一目了然的。   
 [MetaWeblogAPI.php](http://cid-507861a5ffb49bea.skydrive.live.com/self.aspx/.Public/程序代码/MetaWeblogAPI.php)   
 另外要注意的是一定要保证返回的XML消息格式的正确，如果程序总是出错，大家可以用echo来debug。   
 例子中metaWeblog.newMediaObject我没有来得及实现，所以贴图要使用FTP来实现，Writer中可以进行设置，还有在Writer建立账户过程中如果提示下载样式的话，就不要下载了，好像在字符上会有些问题，目前没有做任何处理，呵呵，很基本的实现。   
 在最后给出一个blogger.getUsersBlogs函数客户端发来消息以及返回值的一个正确的格式，以供参考：

**客户端消息：**   
POST /api/RPC2 HTTP/1.0   
User-Agent: Java.Net Wa-Wa 2.0   
Host: plant.blogger.com   
Content-Type: text/xml   
Content-length: 515

&lt;?xml version=”1.0″?&gt;   
&lt;methodCall&gt;   
 &lt;methodName&gt;blogger.getUsersBlogs&lt;/methodName&gt;   
 &lt;params&gt;   
 &lt;param&gt;   
 &lt;value&gt;&lt;string&gt;C6CE3FFB3174106584CBB250C0B0519BF4E294&lt;/string&gt;&lt;/value&gt;   
 &lt;/param&gt;   
 &lt;param&gt;&lt;value&gt;&lt;string&gt;ewilliams&lt;/string&gt;&lt;/value&gt;&lt;/param&gt;   
 &lt;param&gt;&lt;value&gt;&lt;string&gt;secret&lt;/string&gt;&lt;/value&gt;&lt;/param&gt;   
 &lt;/params&gt;   
&lt;/methodCall&gt;

**返回值：**   
HTTP/1.1 200 OK   
Connection: close   
Content-Length: 125   
Content-Type: text/xml   
Date: Mon, 6 Aug 20001 19:55:08 GMT   
Server: Java.Net Wa-Wa/Linux

&lt;?xml version=”1.0″ encoding=”ISO-8859-1″?&gt;   
&lt;methodResponse&gt;   
 &lt;params&gt;   
 &lt;param&gt;   
 &lt;value&gt;   
 &lt;array&gt;   
 &lt;data&gt;   
 &lt;value&gt;   
 &lt;struct&gt;   
 &lt;member&gt;   
 &lt;name&gt;url&lt;/name&gt;   
 &lt;value&gt;<http://www.ownself.org/game>&lt;/value&gt;   
 &lt;/member&gt;  
 &lt;member&gt;   
 &lt;name&gt;blogid&lt;/name&gt;   
 &lt;value&gt;5467&lt;/value&gt;   
 &lt;/member&gt;   
 &lt;member&gt;   
 &lt;name&gt;blogName&lt;/name&gt;   
 &lt;value&gt;OWNSELF Game&lt;/value&gt;   
 &lt;/member&gt;   
 &lt;/struct&gt;   
 &lt;/value&gt;   
 &lt;/data&gt;   
 &lt;/array&gt;   
 &lt;/value&gt;   
 &lt;/param&gt;   
 &lt;/params&gt;   
&lt;/methodResponse&gt;