---
id: 1273
title: Box2D和Chipmunk
date: '2013-02-28T17:05:37+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.org/blog/?p=1273'
permalink: /2013/box2d-he-chipmunk.html
categories:
    - 游戏开发
---

物理的表现力对游戏的影响越来越重要，几乎已经是现在游戏中不可获取的要素之一，如果进入游戏开发的物理世界中，你会发现这是一个深不可测的领域，没个十几年的功力怕是难说出个头道来的，不过再难总要去面对和挑战，幸运的是随着游戏开发行业的日益成熟，物理引擎已经成为了游戏开发一个专门的方向，有PhysiX和Havok这样为AAA游戏而存在的专业级物理引擎，也有Box2D和Chipmunk这样为2D小游戏量身定做的轻量级物理引擎，使得游戏开发者已经可以实现非常出色的物理效果而不用过多的关心背后的实现机制了。不过也许2D游戏中的物理更适合像我这样的初学者来入门。其实Box2D和Chipmunk这两款物理引擎经过5、6年的发展已经非常成熟，并为数不清的游戏实现了精彩的物理效果，而在现在大红大紫的cocos2d中，同时引入了对这两款物理引擎支持，今天写一点简单的上手教程，一作笔记，二来望能帮助刚刚上手的朋友们。

首先我们需要了解的是Box2D和Chipmunk中所模拟的物理物体全部都是刚体，刚体指的是不会发生任何形变的理想化的物体，PhysiX和Havok中是有支持除了刚体外比如布料和流体等高级物理特性的，不过在Box2D和Chipmunk里，刚体已经足够我们制作出出色的物理效果了。物理引擎的工作是通过我们预先为游戏内物体设定的物理参数，比如质量，动能，磨擦等，自动的更新物体的运动和位置，需要注意的物理的真实表现往往需要大量的计算，所以我们必须权衡考虑游戏中所需要的物理计算量，效果和性能的平衡永远是一个程序员需要面对的永恒不变的哲学问题。

快速了解一下Box2D和Chipmunk的主要区别，可以让我们根据自己的需求作出合适的选择。Box2D是用C++写的，而Chipmunk是C风格的，Box2D相比之下有些Chipmunk无法体现的特性，所以如果你更倾向于轻量级或者易于上手，那么也许Chipmunk更适合你一些。

### Box2D

要使用Box2D首先有些类是需要我们了解的：

1. b2World：运行在游戏里的物理世界，是所有有物理表现的物体的容器，负责遍历和更新。
2. b2BodyDef：刚体定义，表示刚体的物理特性和参数，比如是静态还是动态，加速度角速度等等，主要用于创建b2Body。
3. b2Body：刚体，在世界内创建的刚体。
4. b2Shape：表示刚体的形状的，b2Shape只是基类，它的子类目前包括ChainShape、CircleShape、EdgeShape、PolygonShape等分别实现了多边形、三角形、球等形状。主要的用处是通过b2Body的CreateFixture接口来为刚体b2Body创建外形，要注意的是目前Box2D是无法创建空心球体的，只能通过多边形来近似模拟空心圆。

b2FixureDef：定义形状的，表示刚体形状的具体物理特性，比如摩擦力、密度、弹性等等，主要是用于创建形状的。

我们可以通过一小段代码来了解Box2D是如何来创建这些对象的：

```
<pre class="lang:c++ decode:true" title="创建Box2D">b2Vec2 gravity = b2Vec2(0.0f,-10.0f); //设置重力
bool allowBodiesToSleep = true; //是否设置静态物体休眠
world = new b2World(gravity, allowBodiesToSleep); //创建物理世界

b2BodyDef containerBodyDef;
containerBodyDef.type = b2_staticBody; //静态物体
containerBodyDef.position.Set(0.0f, 0.0f); //位置
b2Body* body = world->CreateBody(&containerBodyDef);

//创建形状
b2EdgeShape groundBox;
groundBox.Set(b2Vec2(px,py), b2Vec2(px+pw, py));
body->CreateFixture(&groundBox,0.0f);
groundBox.Set(b2Vec2(px,py), b2Vec2(px, py+ph));
body->CreateFixture(&groundBox,0.0f);
groundBox.Set(b2Vec2(px, py+ph), b2Vec2(px+pw, py+ph));
body->CreateFixture(&groundBox,0.0f);
groundBox.Set(b2Vec2(px+pw, py+ph), b2Vec2(px+pw, py));
body->CreateFixture(&groundBox,0.0f);

//创建动态物体
b2BodyDef ballBodyDef;
ballBodyDef.type = b2_dynamicBody;
ballBodyDef.position.Set(posX/PTM_RATIO, posY/PTM_RATIO);
b2CircleShape circle;
circle.m_radius =50.0/PTM_RATIO;
//设置动态物体物理属性
b2FixtureDef ballShapeDef;
ballShapeDef.shape =&circle;
ballShapeDef.density =1.0f;
ballShapeDef.friction =0.99f;
ballShapeDef.restitution =0.05f;
//关联Sprite，这里是cocos2d-x相关代码
m_pSprite = CCSprite::create( "ball.png");
m_pSprite ->setPosition(ccp(posX,posY));
addChild(m_pSprite );
ballBodyDef.userData = m_pSprite;
//创建
b2Body* m_BallBody = m_world->CreateBody(&ballBodyDef);
m_BallBody->CreateFixture(&ballShapeDef);
m_BallBody->SetLinearDamping(3);
m_BallBody->SetAngularDamping(3);
```

在Box2D的世界里，世界的大小是通过”米”来衡量的，而我们在游戏中通常都是通过像素来描述的，所以我们需要做一个将单位从像素点到米的转换，以便让我游戏背后的物理世界能和游戏画面所表示的内容完美的结合起来。

> \#define PTM\_RATIO 32

Box2D使用”米”作为刻度衡量单位有另一个考虑是出于性能上的，内部的机制使得刚体最好的性能和质量表现是建立在合理的刚体大小基础上的，如果物体普遍太小或者普遍太大，则容易引起各种各样的问题。一般来说尽量不要让刚体小于0.1米或者大于10米。

在cocos2d中如果我们想把b2Body和CCSprite关联起来：

```
<pre class="lang:c++ decode:true">void KitchenMainScene::tick(float dt)
{
    m_world->Step(dt, 10, 10);
    for(b2Body *b = m_world->GetBodyList(); b; b=b->GetNext())
    { 
        if (b->GetUserData() != NULL)
        {
            CCSprite *ballData = (CCSprite *)b->GetUserData();
            ballData->setPosition(ccp(b->GetPosition().x * PTM_RATIO,b->GetPosition().y * PTM_RATIO));
            ballData->setRotation(-1* CC_RADIANS_TO_DEGREES(b->GetAngle()));
        } 
    }
}
```

b2World的函数Step()负责更新物理世界，后面两个参数代表着模拟的精度。有的文章中提到这里dtTime如果帧数浮动不是很大，那么最好是固定，否则容易导致刚体的运动不稳定，不过我目前还没有非常深入的使用，所以究竟如何是需要实践一下。

Box2D的碰撞检测是通过b2ContactListenner来实现的，如果你想接受来自碰撞的回调，你需要创建一个继承自b2ContactListener的新类：

```
<pre class="lang:c++ decode:true">#include "Box2D.h"
class ContactListener : public b2ContactListener
{
     void BeginContact(b2Contact* contact);
     void EndContact(b2Contact* contact);
};
```

BeginContact()和EndContact()会在碰撞发生时被调用，如果要让Listener生效，需要在创建b2World时为他附上这个监听者：

```
<pre class="lang:c++ decode:true">ContactListener* contactListener = new ContactListener();
m_world->SetContactListener(contactListener );
```

### Chipmunk

我在实际的开发中并没有使用过Chipmunk，所以我只能浅显的介绍一下Chipmunk的大概，更多的需要朋友们自己去查看文档，但我想我们了解了Box2D所创建的物理世界，那么理解Chipmunk应该是异曲同工的，Chipmunk和Box2D最大的不同在于它是C风格的实现，在Chipmunk中把物理世界称为Space而不是World，创建也很简单：

```
<pre class="lang:c++ decode:true">cpInitChipmunk();

cpSpace* space = cpSpaceNew(); //cpSpaceFree(space);是释放函数
space->iterations = 8;     //迭代次数
space->gravity = CGPointMake(0,-100);
```

Chipmunk中不需要将像素转换成米，而是直接使用像素大小来表示，创建静态的body同样简单：

```
<pre class="lang:c++ decode:true">float mass = INFINITY;//质量
float inertia = INFINITY;//摩擦系数
cpBody* staticBody = cpBodyNew(mass, inertia);
```

由于Chipmunk是C代码风格的，所以我们可以找到各种类似于cpSegmentShapeNew()，cpSpaceAddStaticShpa()，cpSpaceAddBody()各种各样的函数来为space添加各种形状。

Chipmunk的更新类似于Box2D的Step()函数，由一个cpSpaceStep(space, dtTime)来负责。而与CCSprite的同步是通过一个cpSpaceHashEach来遍历循环的：

```
<pre class="lang:c++ decode:true">cpSpaceHashEach(space->activeShapes, &forEachShape, nil);
cpSpaceHashEach(space->staticShapes, &forEachShape, nil);
```

Chipmunk的碰撞是通过函数cpSpaceAddCollisionHandler(space, defaultCollisionType, defaultCollisionType, &amp;contactBegin, NULL, NULL, &amp;contactEnd, NULL);来完成的。其中contactBegin和contactEnd是两个静态函数，如果碰撞发生，他们会返回YES，如果返回NO，那么我们可以忽略碰撞。