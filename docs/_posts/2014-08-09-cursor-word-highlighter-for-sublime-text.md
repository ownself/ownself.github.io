---
id: 1330
title: 'Cursor Word Highlighter for Sublime Text'
date: '2014-08-09T14:47:31+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1330'
permalink: /2014/cursor-word-highlighter-for-sublime-text.html
categories:
    - 分享
---

前阵子一直在重新整理自己的Sublime Text的快捷键和设置，在整理对高亮单词的需求时才注意到Sublime Text对于高亮的处理，默认的方法是需要你使用快捷键Ctrl+D(Cmd+D)先选中单词才能激活的，对比一下其他流行的代码工具比如Notepad++对高亮的处理是使用鼠标双击或拖拽来选中来高亮单词的，而Visual Studio配合VA则可以实现自动高亮光标所在的单词。

单词高亮的意义在于编程过程中你可以通过高亮同一文件内的关键词方便你使用余光来注意目前所关注的变量在上下文中的使用情况，显然如果你是需要高亮单词的话，那么你肯定不希望多按额外的快捷键来激活高亮，更不希望腾出手去碰鼠标，而同时你也不希望高亮的颜色像VA那样过于引人注目而显得喧宾夺主从而影响编码的思路。说到这里，深深地感觉的写代码的人在某些不为他人理解的细节领域真是有着各种奇怪的强迫症啊……至少在我看来单词自动高亮确实需要找到一个精妙的结合点，也就是高亮后的单词的注目度要在你需要关注的时候让你能注意到，而当你不需要关注的时候你又不会受其影响。

在Packages Control社区和网上搜索了一圈后找到两个插件是与Highlight有关的，一个叫[WordHighlight](https://github.com/SublimeText/WordHighlight)，另一个是[HighlightWords](https://github.com/seanliang/HighlightWords)。WordHighlight从在GitHub的路径来看似乎是官方的插件之一，但是奇怪的是我没办法让这个插件生效，无论是ST2还是ST3，当然还有一种可能是我没有正确理解这个插件的用处，而也许实际上它就是ST本身自带的高亮工具；HighlightWords是一位叫做[Sean Liang](http://weibo.com/seanliang)的中国朋友开发的插件，这个插件需要你使用快捷键打开搜索框来输入你想高亮的单词，而高亮的效果由于使用了”Fill Background”显得相当的引人注目，不过虽然并不是我想要的插件，但却给我提供了不错的思路。最终实在没办法找到我需要的插件于是只好开始自己写一个，我要感谢两款前面提到的插件，因为实际上我差不多是将两款捏在了一起改成了一个自己想要的插件。

[![CursorWordHighlighter](http://www.ownself.org/blog/wp-content/uploads/2014/08/CursorWordHighlighter.png)](http://www.ownself.org/blog/wp-content/uploads/2014/08/CursorWordHighlighter.png)

[CursorWordHighlighter](https://github.com/ownself/CursorWordHighlighter)

下载并将解压的文件手动拷贝到ST的Packages目录下（也许以后我有时间重构地漂亮一点会看看能不能放到Packages Control里的）。然后插件应该就可以自动生效了，如果没有也许你得重启一下ST，哈&gt;\_&lt;哈，任何你光标所在的单词都会被自动高亮，经过我的反复测试，仅使用边框来绘制高亮配合Comment的颜色可以找到一个不错的注意力的结合点，而且也有别于默认的选中单词后的高亮，而如果你发现有一个变量或者单词需要你持续关注一段时间你还可以使用“强力高亮”（默认快捷键Alt+Enter）来获得持续高亮，直到你手动清除它们（默认快捷键Alt+Shift+Enter）,插件最多支持6种不同颜色的强力高亮。更多的设置诸如Case Sensitive，Enable/Disable，Color等等你都可以在GitHub的文档中找到配置的方法。

如果插件可能会对你有用，欢迎尝试使用，同样任何建议都是非常感激的：）