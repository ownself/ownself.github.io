---
id: 1371
title: 'TestFlight Beta测试'
date: '2015-08-03T10:55:10+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1371'
permalink: /2015/testflight-beta-ce-shi.html
categories:
    - 'Mac&amp;iOS'
---

TestFlight曾经作为iOS应用开发非常受欢迎的工具之一，帮助开发者能够自动分发版本，让更多的测试者能够方便快速的在更多的设备上安装测试版本而省却掉万恶的Provisioning Profile。不过也许是因为功能过于强大，苹果恐其被盗版App发行平台所利用，在2014年正式将TestFlight收购招安，并于2015年2月份正式停止了原有TestFlight服务并启用了苹果自己的服务版本，发布后的正式名字改为TestFlight Beta Testing。

作为官方版服务自然对测试的范围加上了限制，依照苹果的以往抠门的风格果不其然只提供了25个内部测试者名额（真是给了不如不给），不过厚道的是，苹果另外提供了1000个名额的外部测试者名额。今天在这里为大家简单介绍一下新的TestFlight服务和使用的一些注意事项。

### Create App Record

如果你想使用新的TestFlight，首先你需要到iTunesConnect.apple.com上使用你的iTunesConnect帐号（Admin权限）来为你的应用创建一个App Record，以前我们只有当应用准备提交Apple上AppStore的时候才会需要创建App Record。需要注意的是如果你的开发者帐号是以公司形式注册的话，那么第一次创建应用程序记录时，系统会要求你填写公司未来在AppStore上的显示名称，这个名称是一经决定无法修改的，请填写前三思。创建App Record需要填写的内容中Name需要唯一并不能与已经在AppStore中发布的App名字重名；Bundle ID需要和Xcode中的相同；SKU也是一个唯一标识，我们使用的就是Bundle ID作为SKU。

![apprecord](/wp-content/uploads/2015/08/apprecord.png)

### Upload Build

当应用程序记录创建好后，我们就可以上传用以TestFlight的版本了，这个版本需要以公司的Distribution的Certificate加Provisioning profile编的Adhoc Release版，虽然在iTunesConnect后台看到是可以使用Application Loader上传的，但是似乎还是使用Xcode来上传更方便一些：设置好Provisioning profile和Code signing后，直接Archive，Archive好后在Organizer里就可以直接上传。

[![上传版本](/wp-content/uploads/2015/08/submitapp.png)](/wp-content/uploads/2015/08/submitapp.png)

要注意的是如果你希望收集测试人员所遇到的Crash的Log的话需要勾选上Include app symbols。另外打包的版本要注意记得更新小版本号，否则最后上传时会提醒版本号重复的错误，而大版本号在Beta测试阶段则最好不要轻易改变，因为如果改变大版本号需要重新进行Beta App Review，谁也不希望平白多等几天。另外要留意Apple限制每天我们只能上传2个版本。

[![includesymbol](/wp-content/uploads/2015/08/includingsymbol.png)](/wp-content/uploads/2015/08/includingsymbol.png)

### Metadata

版本上传好我再回到iTunesConnect后台来准备开启TestFlight，“我的App”-&gt;“预发行”，一般刚上传的版本会显示为处理中，大约15-20分钟左右，版本好了之后在版本列表右上方就可以通过开关来打开TestFlight，这样组织内部的邮箱的用户就可以开始使用TestFlight了。（Internal Tester）

### Beta App Review

如果我们希望开启External Tester，来让最多1000位外部测试人员来测试应用，那么就一定需要进行Beta App Review，上传好的版本在“外部”一栏中可以看到“提交App Review”，点击后按要求填写资料信息，因为Apple会审查，所以不要太过随意，尤其是如果应用需要账号密码来登陆的话记得要在审核一栏中填写上可用的测试帐号和密码以供Apple审核，第一次提交后Apple会进行一个完整审核，一般需要2-3个工作日要注意周末是不算在内，如果你周五传上去，最早也要周一晚上见了。之后的小版本依然每次要提交审核，但是这里有个小技巧是如果你在版本资料中关于“是否有过大改动”和“是否添加加密功能”如果选择否的话，那么小版本的审核几乎是秒过（大家要诚实哦！）

### Invite Tester

邀请外部的测试者非常简单，只需要一个Email地址即可，邀请测试人员后，测试人员会立刻收到测试邮件并可以下载应用，但添加新版本后却有机会选择何时何时给测试者发送测试邮件，Apple在这些细节有时候也让人霸道的无语。要注意的是测试者需要自己在AppStore中下载TestFlight应用，然后再点击测试邀请邮件中的链接，这样会自动跳转到TestFlight应用并添加测试应用，而TestFlight登陆的账号似乎和External Tester邀请的帐号不必非要相同。