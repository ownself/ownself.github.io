---
id: 90
title: '[设计模式]单例模式(Singleton)'
date: '2009-08-06T15:27:00+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=56'
permalink: /2009/she-ji-mo-shi-dan-li-mo-shi-singleton.html
rumputhijau_meta_box_input_image:
    - ''
categories:
    - 设计模式
---

摘自《设计模式可复用面向对象软件的基础》

## 意图

保证一个类仅有一个实例，并提供一个访问它的全局访问点。

## 动机

对一些类来说，只有一个实例是很重要的。虽然系统中可以有许多打印机，但却只应该有一个打印假脱机（printer spooler），只应该有一个文件系统和一个窗口管理器。一个数字滤波器只能有一个A/D转换器。一个会计系统只能专用于一个公司。

我们怎么样才能保证一个类只有一个实例并且这个实例易于被访问呢？一个全局变量使得一个对象可以被访问，但它不能防止你实例化多个对象。

一个更好的办法是，让类自身负责保存它的唯一实例。这个类可以保证没有其他实例可以被创建（通过截取创建新对象的请求），并且它可以提供一个访问该实例的方法。这就是Singleton模式。

## 适用性

在下面的情况下可以使用Singleton模式:

- 当类只能有一个实例而且客户可以从一个众所周知的访问点访问它时。
- 当这个唯一实例应该是通过子类化可扩展的，并且客户应该无需更改代码就能使用一个扩展的实例时。

## 参与者

**Singleton**

— 定义一个Instance操作，允许客户访问它的唯一实例。Instance是一个类操作（即Smalltalk中的一个类方法和C++中的一个静态成员函数）。
— 可能负责创建它自己的唯一实例。

## 协作

- 客户只能通过Singleton的Instance操作访问一个Singleton的实例。

## 效果

Singleton模式有许多优点：

1. 对唯一实例的受控访问因为Singleton类封装它的唯一实例，所以它可以严格的控制客户怎样以及何时访问它。
2. 缩小名空间Singleton模式是对全局变量的一种改进。它避免了那些存储唯一实例的全局变量污染名空间。
3. 允许对操作和表示的精化Singleton类可以有子类，而且用这个扩展类的实例来配置一个应用是很容易的。你可以用你所需要的类的实例在运行时刻配置应用。
4. 允许可变数目的实例这个模式使得你易于改变你的想法，并允许Singleton类的多个实例。此外，你可以用相同的方法来控制应用所使用的实例的数目。只有允许访问Singleton实例的操作需要改变。
5. 比类操作更灵活另一种封装单件功能的方式是使用类操作（即C++中的静态成员函数或者是Smalltalk中的类方法）。但这两种语言技术都难以改变设计以允许一个类有多个实例。

此外，C++中的静态成员函数不是虚函数，因此子类不能多态的重定义它们。

## 实现

下面是使用Singleton模式时所要考虑的实现问题：

### 类的唯一实例

保证一个唯一的实例Singleton模式使得这个唯一实例是类的一般实例，但该类被写成只有一个实例能被创建。做到这一点的一个常用方法是将创建这个实例的操作隐藏在一个类操作（即一个静态成员函数或者是一个类方法）后面，由它保证只有一个实例被创建。这个操作可以访问保存唯一实例的变量，而且它可以保证这个变量在返回值之前用这个唯一实例初始化。这种方法保证了单件在它的首次使用前被创建和使用。

在C++中你可以用Singleton类的静态成员函数Instance来定义这个类操作。Singleton还定义了一个静态成员变量\_instance，它包含了一个指向它的唯一实例的指针。

Singleton 类定义如下

```
class Singleton
{
    public:
    static Singleton* Instance();
    protected:
    Singleton();
    private:
    static Singleton* _instance;
};
```

相应的实现是

```
Singleton* Singleton::_instance = 0;
Singleton* Singleton::Instance()
{
    if(_instance == 0)
    {
        _instance = new Singleton;
    }
}
```

客户仅通过Instance成员函数访问这个单件。变量\_instance初始化为0，而静态成员函数Instance返回该变量值，如果其值为0则用唯一实例初始化它。Instance使用惰性（lazy）初始化；它的返回值直到被第一次访问时才创建和保存。

注意构造器是保护型的。试图直接实例化Singleton的客户将得到一个编译时的错误信息。这就保证了仅有一个实例可以被创建。

此外，因为\_instance是一个指向Singleton对象的指针，Instance成员函数可以将一个指向Singleton的子类的指针赋给这个变量。我们将在代码示例一节给出一个这样的例子。

关于C++的实现还有一点需要注意。将单件定义为一个全局或静态的对象，然后依赖于自动的初始化，这是不够的。有如下三个原因：

1. 我们不能保证静态对象只有一个实例会被声明。
2. 我们可能没有足够的信息在静态初始化时实例化每一个单件。单件可能需要在程序执行中稍后被计算出来的值。
3. C++没有定义转换单元（translation unit）上全局对象的构造器的调用顺序\[ES90\]。这就意味着单件之间不存在依赖关系；如果有，那么错误将是不可避免的。

使用全局/静态对象的实现方法还有另一个（尽管很小）缺点，它使得所有单件无论用到与否都要被创建。使用静态成员函数避免了所有这些问题。

Smalltalk中，返回唯一实例的函数被实现为Singleton类的一个类方法。为保证只有一个实例被创建，重定义了new 操作。得到的Singleton 类可能有下列两个类方法，其中SoleInstance是一个其他地方并不使用的类变量：

```
new
self error:’connot create new object’
default
SoleInstance isNil ifTrue: [SoleInstance := super new].
^ SoleInstance
```

### 创建Singleton类的子类

主要问题与其说是定义子类不如说是建立它的唯一实例，这样客户就可以使用它。事实上，指向单件实例的变量必须用子类的实例进行初始化。最简单的技术是在Singleton的Instance操作中决定你想使用的是哪一个单件。代码示例一节中的一个例子说明了如何用环境变量实现这一技术。

另一个选择Singleton的子类的方法是将Instance的实现从父类（即MazeFactory）中分离出来并将它放入子类。这就允许C++程序员在链接时刻决定单件的类（即通过链入一个包含不同实现的对象文件），但对单件的客户则隐蔽这一点。

链接的方法在链接时刻确定了单件类的选择，这使得难以在运行时刻选择单件类。使用条件语句来决定子类更加灵活一些，但这硬性限定（hard-wire）了可能的Singleton类的集合。这两种方法不是在所有的情况都足够灵活的。

一个更灵活的方法是使用一个单件注册表（registry of singleton）。可能的Singleton类的集合不是由Instance定义的， Singleton类可以根据名字在一个众所周知的注册表中注册它们的单件实例。

这个注册表在字符串名字和单件之间建立映射。当Instance需要一个单件时，它参考注册表，根据名字请求单件。

注册表查询相应的单件（如果存在的话）并返回它。这个方法使得Instance不再需要知道所有可能的Singleton类或实例。它所需要的只是所有Singleton类的一个公共的接口，该接口包括了对注册表的操作：

```
class Singleton
{
public:
    static void Register(const char* name,Singleton*);
    static Singleton* Instance();
protected:
    static Singleton* Lookup(const char* name);
private:
    static Singleton* _instance;
    static List<NameSingletonPair>* _registry;
};   
```

Register以给定的名字注册Singleton实例。为保证注册表简单，我们将让它存储一列NameSingletonPair对象。每个NameSingletonPair将一个名字映射到一个单件。Lookup操作根据给定单件的名字进行查找。我们假定一个环境变量指定了所需要的单件的名字。

```
Singleton* Singleton::Instance()
{
    if(_instance == 0)
    {
        const char* singletonName = getenv("SINGLETON");
        //user or environment supplies this at startup
        _instance = Lookup(singletonName);
        //Lookup returns 0 if there’s no such singleton
    }
    return _instance;
}
```

Singleton类在何处注册它们自己？一种可能是在它们的构造器中。例如， MySingleton子类可以像下面这样做：

```
MySingleton::MySingleton()
{
    Singleton::Register("MySingleton",this);
}
```

当然，除非实例化类否则这个构造器不会被调用，这正反映了Singleton模式试图解决的问题！在C++中我们可以定义MySingleton的一个静态实例来避免这个问题。例如，我们可以在包含MySingleton实现的文件中定义：

> static MySingleton theSingleton;

Singleton类不再负责创建单件。它的主要职责是使得供选择的单件对象在系统中可以被访问。静态对象方法还是有一个潜在的缺点—也就是所有可能的Singleton子类的实例都必须被创建，否则它们不会被注册。

## 代码示例

假定我们定义一个MazeFactory类用于建造迷宫。MazeFactory定义了一个建造迷宫的不同部件的接口。子类可以重定义这些操作以返回特定产品类的实例，如用BombedWall对象代替普通的Wall对象。

此处相关的问题是Maze应用仅需迷宫工厂的一个实例，且这个实例对建造迷宫任何部件的代码都是可用的。这样就引入了Singleton模式。将MazeFactory作为单件，我们无需借助全局变量就可使迷宫对象具有全局可访问性。

为简单起见，我们假定不会生成MazeFactory的子类。我们通过增加静态的Instance操作和静态的用以保存唯一实例的成员\_instance，从而在C++中生成一个Singleton类。我们还必须保护构造器以防止意外的实例化，因为意外的实例化可能会导致多个实例。

```
class MazeFactory
{
    public:
    static MazeFactory* Instance();
    //existing interface goes here
    protected:
    MazeFactory();
    private:
    static MazeFactory* _instance;
};
```

相应的实现是：

```
MazeFactory* MazeFactory::_instance = 0;
MazeFactory* MazeFactory::Instance()
{
    if(_instance == 0)
    {
        _instance = new MazeFactory;
    }
    return _instance;
}
```

现在让我们考虑当存在MazeFactory的多个子类，而且应用必须决定使用哪一个子类时的情况。我们将通过环境变量选择迷宫的种类并根据该环境变量的值增加代码用于实例化适当的MazeFactory子类。Instance 操作是增加这些代码的好地方，因为它已经实例化了MazeFactory：

```
MazeFactory* MazeFactory::Instance()
{
    if(_instance == 0)
    {
        const char* mazeStyle = getenv("MAZESTYLE");
        if(strcmp(mazeStyle,"bombed")==0)
        {
            _instance = new BombedMazeFactory;
        }
        else if(strcmp(mazeStyle,"enchanted") == 0)
        {
            _instance = new EnchantedMazeFactory;
        }
        //……other possible subclasses
        else
        { //default
            _instance = new MazeFactory;
        }
    }
    return _instance;
}
```

注意，无论何时定义一个新的MazeFactory的子类，Instance都必须被修改。在这个应用中这可能没什么关系，但对于定义在一个框架中的抽象工厂来说，这可能是一个问题。