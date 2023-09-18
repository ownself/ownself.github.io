---
id: 1574
title: 使用Autohotkey为你的键盘添加Fn层
date: '2020-03-29T22:16:32+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1574'
permalink: /2020/shi-yong-autohotkey-wei-ni-de-jian-pan-tian-jia-fn-ceng.html
categories:
    - 分享
---

# <span class="md-plain md-expand">60%键盘</span>

<span class="md-plain md-expand">一直以来，我都是60%键盘的爱好者，所谓60%键盘就是指键盘去除了小键盘、功能键区(F1~F12)、方向键和编辑键区，仅保留打字键区的键盘。60%键盘的优点有两个是我个人特别离不开的：一个是占用更小的桌面面积；另一个也是最重要的一点就是当你双手操作键盘的时候完全不用移动用于支撑的手掌底部，从而让你的敲击效率起飞。当然也不是没有代价的，那就是比起全键盘，所有省去的那些键必须要通过组合键的方式来进行。</span>

![这是我目前最满意的一把了](http://www.ownself.org/blog/wp-content/uploads/2020/03/my60keyboard.jpg)

<span class="md-plain">当然我想先说明的是这个议题本身就是带着强烈的个人偏好的，并没有所谓怎样更好的说法。比如有些人可能本身就是更喜欢104全键盘摆在桌上的那份踏实感，而且大部分人会更习惯更高的鼠标速度而不需要过分大的鼠标移动区域，再或者别忘了还有人在用轨迹球鼠标或者触摸板呢！我写这些也只是希望能给朋友们提供一点可能的“灵感”而已。</span>

<span class="md-plain">60%键盘会占用更小的桌面面积，那么就给右侧的鼠标留下更大的滑动空间，就个人而言因为我个人是比较重度的FPS玩家，鼠标速度也因此一直习惯设置的非常低，43×38厘米的大号鼠标垫对我来说才刚刚勉强可以用，在习惯了60%键盘后，省出来的桌面面积可以容许我继续暂时保持着低鼠标速度的习惯，现在别说104全键盘了，即使84键的键盘摆上我的桌面也会让我多少觉得有些空间局促。</span>

<span class="md-plain">如果说节省桌面面积更多的是对我玩游戏有帮助，那操作键盘时不需要移动手掌这点则是完全集中在提升我工作中的使用效率了。作为程序员，每天和代码打交道，也算是半个文字工作者了，我相信在经过一天高强度的编码工作后，会有很多人认同的一点便是，你可能经常需要迫不得已要把手离开键盘去抓一下鼠标完成一些操作然后再回到键盘才能继续之前的编码工作，不要小看这个微小的“中断”，当你每天需要反复进行几百次这样的“中断”时，累计下来浪费的时间可能是惊人的，更不能忽视的是它对你思路的打断和心情的影响。</span>

<span class="md-plain">全面掌握快捷键是解决上述问题的一个好办法，现代开发工具都提供了详尽的快捷键方案和强大的自定义功能，而更进一步的话Vim/Emacs等工具更是这方面的绝佳助手，因为他们最初的使用情景就是没有鼠标的终端环境，我个人选择了Vim，而且我认为这些工具的学习其实是你程序员职业生涯中一笔非常划算的投资，虽然它们可能有着更难的学习曲线，但真的是越早学习越划算。</span>

<span class="md-plain">好，我们假设你已经可以熟练的操作键盘完成编程中乃至桌面系统中绝大多数工作内容了，这时你会发现原来不用去触碰鼠标是如此的快乐，以至于你会开始致力于进一步学习如何能尽量的减少操作鼠标的频率了，然后同时你会开始慢慢发现即使是集中在键盘上工作时，当你需要操作方向键、PageUp/PageDown等编辑键、F1~F12、Esc等键时，因为距离的原因，还是需要抬起手掌，按下你想按的键，再回来用食指重新找回F或者J的时候，会让你重现起“中断”并拿起鼠标的不快感。当你到达这一步的时候，那么恭喜你，你可以发现60%键盘最美妙的地方了，你现在可以认真的考虑一下要不要尝试一下使用60%键盘了，因为它可以让你通过Fn层实现完全无需抬起手掌即可完成104键全键盘的键位操作。</span>

# <span class="md-plain">Autohotkey</span>

<span class="md-plain">目前60%键盘的社区里流派众多，并且看过了上面那些矫情的描述之后，相信你也可以理解最终走到选择60%键盘这一步的用户会有着执拗的客制化的需求，所以目前60%键盘并没有能形成一个大多数人认可的布局或解决方案，除了HHKB、Filco Minilar air、Leopold FC660c这类大厂的60%键盘有自己坚持的布局与方案外，大部分小厂或淘宝店都是基于一个叫[GH60](https://wiki.geekhack.org/index.php?title=GH60)的开源可编程键盘的项目来开发自己的60%键盘的。这一类键盘的优势是可以自己指定键盘的布局，不过也因此在购买选择上你会看到一个类似“百家争鸣”的市场：有的是通过软件来设置，有的通过一系列复杂的键位操作来设置，还有的需要通过驱动刷固件的古老方式，而且大部分的做工和质量很难和传统的大厂相媲美。在我用过的几把60%键盘里，每一把都或多或少的有些让人不满意的地方，以至于最终让我走到了自己动手完全从头组装键盘的地步……</span>

<span class="md-plain">看到这里你也不必感到沮丧，因为今天其实我的本意是想介绍一种零成本的60%键盘实现（测试）方案，它可以帮助你在不做任何实质投入的情况下测试60%键盘究竟适不适合你，是不是你需要的。而且方法也很简单：Windows+Autohotkey！</span>

<span class="md-plain">[Autohotkey](https://www.autohotkey.com/)是Widnows平台上一款老牌的热键编辑软件，支持键位调换、热键修改以及按键宏等功能，非常强大，我最早使用的几年里一直仅仅是用它来做些绑定音量调节和屏蔽某些按键这类的简单的事，直到我开始自己组装键盘了，我才想起来是不是可以利用Autohotkey在软件层面上让普通键盘也拥有可编程的Fn层，简单的阅读官方文档+摸索测试后，证明是完全行得通的，在这里我贴一个我自己使用习惯的实现脚本，有兴趣尝试的朋友可以根据自己的情况做些调整来亲自尝试一下，脚本非常简单，看懂花不了5分钟，即使脚本中没有你想实现的功能，阅读[官方的文档](https://wyagd001.github.io/zh-cn/docs/AutoHotkey.htm)(中文)相信也不会花费太多的精力。</span>

```
<pre class="lang:default decode:true" title="General Keyboard">; Disalbe Layer key and all the combinations
LCtrl::return
!LCtrl::return
+LCtrl::return
^LCtrl::return
!+LCtrl::return
^!LCtrl::return
^+LCtrl::return
^!+LCtrl::return

; All layers
CapsLock::LControl
`::Esc
Esc::`

; Layer 2
#If, GetKeyState("LCtrl", "P") and !GetKeyState("ScrollLock", "T")
j::Down
k::Up
h::Left
l::Right
o::PgDn
u::PgUp
i::Home
n::End
Backspace::Del
\::CapsLock
1::F1
2::F2
3::F3
4::F4
5::F5
6::F6
7::F7
8::F8
9::F9
0::F10
-::F11
=::F12
q::Media_Prev
w::Media_Play_Pause
e::Media_Next
a::Volume_Down
s::Volume_Up
d::Volume_mute
c::Launch_App2

; Use scrolllock as new number pad's toggle
#If, GetKeyState("ScrollLock", "T")
j::1
k::2
l::3
u::4
i::5
o::6
;::NumpadMult
p::/
n::Enter
,::+
m::-
h::Backspace

#If, !GetKeyState("LCtrl", "P")
\::Backspace
Backspace::\
```

![](http://www.ownself.org/blog/wp-content/uploads/2020/03/keyboard.png)

<span class="md-plain">上图是我脚本的实现示意，绿色框内的为涉及到键位，具体的可以看相应按键的右下角所表明的Fn层按键，简单的讲分为这样几点：</span>

- <span class="md-plain">Capslock键位让给Ctrl键：这个算是使用HHKB的后遗症，也有些人喜欢把这个键让给Fn键，都不错，总之我坚持认为这么顺手的位置放一个使用率如此低（至少对我而言）的按键是一种巨大的浪费</span>
- <span class="md-plain">Esc和”`~”键对调：标准键盘下Esc键对我这种手小的人来说够起来还是需要抬起手掌的，而Esc的使用频率比~可要高的多了</span>
- <span class="md-plain">Backspace和”</span>|<span class="md-plain">“键对调：这个也算是HHKB后遗症了，Backspace作为使用频率相当高的按键理应使用更易达到的位置，当然我试过不同的键盘里，这一条只适用于OEM键帽高度的键盘，比如通常是Low profile的薄膜键盘，我也会觉得还是原位置更顺手</span>
- <span class="md-plain">左Ctrl作为Fn键：这个可能是比较会有争议一个方案，我之所以觉得这样非常方便是因为我按下Fn的方式是用手掌肚了压下按键而不是使用小拇指，这样的好处几乎不需要移动左手，但我试过在不是OEM高度的键盘上是很难完成这个操作的，所以如果你真的是矮键帽党，也许用Capslock作为Fn键会是更好的选择</span>
- <span class="md-plain">H/J/K/L：这个是Vim的使用习惯了，真的方便，用惯了以后你会明白我的感受的：）</span>

<span class="md-plain md-expand">其实说到键盘的话，真的有着说不完的话，不过已经今天嘟囔了这么多了，更多的我们可以留着下次再讨论吧。</span>