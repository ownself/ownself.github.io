---
id: 1467
title: 自动部署TestFlight
date: '2017-02-17T15:55:58+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1467'
permalink: /2017/zi-dong-bu-shu-testflight.html
categories:
    - 'Mac&iOS'
---

之前公司里的项目需要部署版本到TestFlight给合作商时，都是由我来手动编专门的版本，再上传到iTunesConnect，不过随着需求越来越频繁，就迫切需要将这部分的工作交给CI来做了。

### 打包

相信每一个从事苹果平台的开发者最烦恼的东西都是——”Code Signing & Provisioning”，绝对没有之一，不过幸运的是现在Xcode已经有趋势在努力减轻这部分的苦难。

打包的工作我是通过xcodebuild工具来完成，首先创建archive包，这里需要注意的是DEVELOPMENT\_TEAM参数是Xcode8版本以后才支持的。

```
xcodebuild clean archive
-project "Unity-iPhone.xcodeproj"
-scheme "Unity-iPhone"
-archivePath "Unity-iPhone.xcarchive"
DEVELOPMENT_TEAM="XXXXXXXXXX"
```

这个命令等同于Xcode中的Archive操作，DEVELOPMENT\_TEAM参数需要填写的是developer.apple.com上你们的TeamID，一般是一串10位的大写英文，可以在”Account ->; Membership”中查看。有了这个参数，xcodebuild会帮你自动做code signing操作。

如果打包的过程是通过CI来完成的话，你可能会遇到权限的问题，这里我是通过security命令来做的，不过我并不是十分确定这么做安全方面是否有很大的问题。

```
security unlock-keychain -p "password" login.keychain
```

这里的password是你的CI的管理员密码。

之后我们再将archive包打成最终的IPA包。

```
xcodebuild -exportArchive
-archivePath "Unity-iPhone.xcarchive"
-exportOptionsPlist "appstore.plist"
-exportPath "xxx/xxx/"
```

这里充满魔法的是-exportOptionsPlist参数，传入的是一个plist文件，这个文件可以对打包的IPA进行一些设置。

```
<plist version="1.0">
<dict>
	<key>method</key>
	<string>app-store</string>
	<key>teamID</key>
	<string>XXXXXXXXXX</string>
</dict>
</plist>
```

teamID同前，而method则决定这个IPA的类型，这里因为我们是TestFlight版本，所以需要设置成”app-store”，如果是做内部测试的adhoc版本，可以设置成”ad-hoc”，通过这个xcodebuild可以帮你自动的完成code signing和entitlements的设置，更多的设置你可以使用命令终端中使用“xcodebuild –help”来查看使用。

### 上传

上传版本之前首先要保证iTunesConnect上项目已经正确设置并处于”准备提交”状态。

之后我们使用altool工具来上传，altool工具实际上是Application loader工具的一部分，所以访问起来路径有那么一点深呢……关于如何使用，详细信息可以查看[这里](https://help.apple.com/itc/apploader/#/apdATD1E53-D1E1A1303-D1E53A1126)。

因为需要在命令行中提供上传iTunesConnect的账号和密码，如果不希望在CI中暴露这些呢？我简单的把这些信息存在版本机本地文件内，然后通过读取来操作的，可能也有安全隐患，但至少账户和密码不会直接暴露在CI的版本记录中了。

```
TFUSER=$(<usr.dat)
TFPASW=$(<pw.dat)
/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Support/altool --upload-app -f "Unity-iPhone.ipa" -u "${TFUSER}" -p "${TFPASW}"
```