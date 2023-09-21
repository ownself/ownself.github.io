---
id: 1359
title: 'Unity的C#代码规范'
date: '2014-12-21T04:43:14+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/blog/?p=1359'
permalink: /2014/unity-de-c-dai-ma-gui-fan.html
categories:
    - 游戏开发
tags:
    - 'C#'
    - Unity
---

代码规范是程序员在团队协作中保证效率和配合的重要基石，好的代码规范可以除了让大家写出更易读的代码之外还可以提高未来代码的维护性，但同时我也认为代码规范不应过于严格，毕竟编写代码的过程是一个创作的过程，我们并不希望程序员像机器人一样的工作，所以一个好的代码规范应该在保证团队合作的前提下也尽可能让大家有创作的自由。

这份代码规范是这两年在Unity上工作中逐渐调整并一致遵循的，最大限度的遵循了Unity的Sample Code和Microsoft.Net的代码风格，并只在最基础的方面进行约束并摒弃了比较过时的命名法，不过C#本身就是一门比较具有现代理念的编程语言，本身已经具有很好的写出统一风格代码的前提，所以C#的代码规范制定起来是比较简单的，相比起C++这门自由洒脱的语言，工程师们完全可写出风格十分迥异但却各具优点的来。

## 代码规范

### 命名

- 文件名应该和文件内主要的类保持一致［例外：带有反应功能或目的的命名，如\_designer，\_generated］
- 类名应遵循PascalCasing，应使用名词作为类名，接口类以“I”作为首字母
- 函数名应遵循PascalCasing，以反映函数功能的动词作为函数名首单词［eg. Boolean函数以“Is”或者“Has”起始］
- 变量名应遵循小写的camelCasing，鼓励私有成员以“\_”作为前缀［eg. Boolean变量以”is”或者“has”起始，数组或列表鼓励以“Array”或“List”作为后缀］
- 常量应避免SCREAMINGCAPS，鼓励使用readonly或者只有get property的变量
- 应尽量避免缩写［例外：Xml、Ftp、Url、Id等常见缩写名词］

### 格式

- 花括号是应当另起一行(Windows)还是跟随同一行(Linux)一直是工程师们的“圣战”，Unity的Sample Code采用的是Linux风格，而Microsoft.Net则自然是Windows风格，这里的建议是根据项目的具体开发环境来进行规范，如果大家都使用Visual Studio来进行开发，自然遵循Windows风格更方便
- 使用Tab进行缩进
- if、while、for等关键词后应有一个空格［eg. “if (a == b)”］
- 运算符前后应各有一个空格［eg. “a = b + c;”］

### 性能考虑

- 使用for()代替foreach()
- 循环中及时Break［eg. “int a = 5; for (int i = 0; i &lt; 100; ++i) { if (i == a) break; }”］
- 使用z = a.callD()代替z = a.b.c.d()［[德墨忒尔定律](http://zh.wikipedia.org/zh/%E5%BE%97%E5%A2%A8%E5%BF%92%E8%80%B3%E5%AE%9A%E5%BE%8B)］
- 避免重复使用string，因为C#中的string是定长并分配在堆上的，每次赋值都会重新创建一个新的string，可以使用StringBuilder来构建字符串

### 可读性

- 鼓励使用var声明临时变量［例外：原始类型］
- 使用名词命名枚举［例外：位枚举］

### 示例

```
// a sample class for coding standard
public class SampleClass : ISampleInterce {

    // Enum
    enum Color { Red, Green, Blue };

    // constant
    public static const string constantType = "Constant";
    // Abbreviation
    public int ItemID { get; set; }
    // private
    int _intValue = 0;

    // functions
    public void SetValue(int initValue, string path) {
        // implicit variable type
        var stream = File.Create(path);
        _intValue = initValue;
    }

    void DoLoop() {
        // correct space between operators
        for (int i = 0; i < 100; ++i) {
            if (i == _intValue) {
                // breaking on time
                break;
            }
        }
    }

    public bool IsValuePositive() {
        return _intValue > 0;
    }
}
```