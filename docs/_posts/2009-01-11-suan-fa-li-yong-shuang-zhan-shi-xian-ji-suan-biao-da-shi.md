---
id: 48
title: 利用双栈实现计算表达式
date: '2009-01-11T14:51:32+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.servexcellent.com/oswpblog/?p=4'
permalink: /2009/suan-fa-li-yong-shuang-zhan-shi-xian-ji-suan-biao-da-shi.html
categories:
    - 算法
---

```
<pre class="lang:c++ decode:true ">struct Operator
{
	OperatorType OpType;
	int Value; //如果是操作数则为数值，若是运算符则为优先级表中下标
};

stack<Operator>  OPND;            //运算数栈
stack<Operator>  OPTR;            //运算符栈
vector<Operator> g_vecExpression; //表达式向量

char OpPriority[7][7] = {
	{’>’, '>’, '<’, '<’, '<’, '>’, '>’},
	{’>’, '>’, '<’, '<’, '<’, '>’, '>’},
	{’>’, '>’, '>’, '>’, '<’, '>’, '>’},
	{’>’, '>’, '>’, '>’, '<’, '>’, '>’},
	{’<’, '<’, '<’, '<’, '<’, '=’, ’ ‘},
	{’>’, '>’, '>’, '>’, ’ ‘, ’>’, '>’},
	{’<’, '<’, '<’, '<’, '<’, ’ ‘, ’='}
};

// 比较两个运算符的优先级
char Precede(Operator a, Operator b)
{
	return OpPriority[a.Value][b.Value];
}

// 计算子表达式
Operator Operate(Operator a, Operator theta, Operator b)
{
	Operator result;
	result.OpType = TokenValue;
	switch (theta.OpType)
	{
		case TokenPlus:
			result.Value = a.Value + b.Value;
			break;
		case TokenMinus:
			result.Value = a.Value - b.Value;
			break;
		case TokenMultiply:
			result.Value = a.Value * b.Value;
			break;
		case TokenDivide:
			result.Value = a.Value / b.Value;
			break;
	}
	return result;
}

int EvaluateExpression()
{
	//’#'入运算符栈
	Operator OpStart;
	OpStart.OpType = delimiter;
	OpStart.Value = 6;
	OPTR.push(OpStart);
	index = 0;
	//’#'界限符不相遇则继续循环
	while (g_vecExpression[index].OpType != delimiter || OPTR.top().OpType != delimiter)
	{
		if (!isOperator(g_vecExpression[index]))
		{
			//如果不是运算符,入运算数栈
			OPND.push(g_vecExpression[index]);
			index++;
		}
		else
		{
			switch (Precede(OPTR.top(), g_vecExpression[index])) //比较优先级
			{
				case ‘<’:
					//优先级大于栈顶，运算符入栈
					OPTR.push(g_vecExpression[index]);
					index++;
					break;
				case ‘=’:
					OPTR.pop();
					index++;
					break;
				case ‘>’:
					//小于则出栈进行计算
					Operator theta = OPTR.top();
					OPTR.pop();
					Operator b = OPND.top();
					OPND.pop();
					Operator a = OPND.top();
					OPND.pop();
					OPND.push(Operate(a, theta, b));
					break;
			}
		}
	}
	return OPND.top().Value;
}
```