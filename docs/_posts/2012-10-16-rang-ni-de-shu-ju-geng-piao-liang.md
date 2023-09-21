---
id: 1269
title: 让你的数据更漂亮
date: '2012-10-16T15:23:32+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1269'
permalink: /2012/rang-ni-de-shu-ju-geng-piao-liang.html
categories:
    - IT
---

我们在项目开发中，经常需要统计并处理一些数据，比如资源的比例，每日的变化，内存的分布等等等等。如果我们希望能够直观的一目了然的看到这些数据所反映出的关系，往往我们需要花大量的时间专门的人力去制作各种线性表、饼图，虽然对工作很有帮助，但是也为额外付出的工作而感到可惜。

对于程序员来说，首先想到的是就是让工作自动化，当然我们有很多方法来实习这些功能，但是今天为大家推荐一个不错的平台——[HighCharts](http://www.highcharts.com)。

HighCharts是一家致力于Java script的技术网站，HighCharts是他们的一款主力产品，是纯粹由Java Script实现的绘制表格、数据图的工具，而且对于非商业用户完全免费。

重要的是其使用起来非常简单，只要按照教程中的示例在JS中填写好我们的数据就可以得到一个动态的非常漂亮的数据图了，你可以选择线表、区域图、柱状图或者饼图甚至是动态的数据图。

[![image](/wp-content/uploads/2012/10/image_thumb.png "image")](/wp-content/uploads/2012/10/image.png)

如果觉得填写数据过于繁琐，HighCharts还支持CSV或者XML导入，实际上配合上Python之类的脚本我们完全可以通过highCharts实现自动统计并绘制数据图的功能。如果你们有这个需要，那么HighCharts一定可以帮到你的。