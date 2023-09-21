---
id: 49
title: 单一进程实例
date: '2009-01-16T15:52:24+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.servexcellent.com/oswpblog/?p=5'
permalink: /2009/windows-kai-fa-dan-yi-jin-cheng-shi-li.html
categories:
    - Windows开发
---

这个不是设计模式中的那个单例，是限定程序只能以唯一进程运行在Windows中，我们在开发卫生局培训中心项目的时候用到的，其实不麻烦，利用Win API简单实现了信号量机制，代码如下，一看就会。

在程序的App::InitInstance()中添加信号量判断部分：

```
// 用应用程序名创建信号量
HANDLE hSem = CreateSemaphore(NULL, 1, 1, m_pszAppName);
// 信号量存在，则程序已有一个实例运行
if (GetLastError() == ERROR_ALREADY_EXISTS)
{
	// 关闭信号量句柄
	CloseHandle(hSem);
	// 寻找先前实例的主窗口
	HWND hWndPrevious = ::GetWindow(::GetDesktopWindow(), GW_CHILD);
	while (::IsWindow(hWndPrevious))
	{
		//如果窗口有
		if (::GetProp(hWndPrevious, m_pszAppName))
		{
			// 主窗口已最小化，则恢复其大小
			if (::IsIconic(hWndPrevious))
			{
				::ShowWindow(hWndPrevious, SW_RESTORE);
			}
			// 将主窗口及对话框激活
			::SetForegroundWindow(hWndPrevious);
			::SetForegroundWindow(::GetLastActivePopup(hWndPrevious));
			// 退出本实例
			return FALSE;
		}
		// 继续寻找下一个窗口
		hWndPrevious = ::GetWindow(hWndPrevious, GW_HWNDNEXT);
	}
	// 前一实例已存在，但找不到其主窗，可能出错了，退出本实例
	return FALSE;
}
```

在程序的OnCreate()中为实例设置标记：

> ::SetProp(m_hWnd,::AfxGetApp()->m_pszAppName,(HANDLE)1);

最后在程序的退出部分，删除掉添加的标记，可以在对话框的OnDestroy中：

> ::RemoveProp(m_hWnd,::AfxGetApp()->m_pszAppName);