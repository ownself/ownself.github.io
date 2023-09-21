---
id: 50
title: 利用注册表实现限制使用时间的共享版本
date: '2009-01-18T13:21:55+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.servexcellent.com/oswpblog/?p=9'
permalink: /2009/windows-kai-fa-li-yong-zhu-ce-biao-shi-xian-xian-zhi-shi-yong-shi-jian-de-gong-xiang-ban-ben.html
categories:
    - Windows开发
---

也是在卫生局项目中用到的，这个应该是该功能最简易的模型和实现，不过完全是自己写的，写在这里，权作笔记，呵呵。  
判断部分放在程序初始化部分之前即可。

```
#define SHAREVERSION //共享版本
#ifdef SHAREVERSION
////******************************
HKEY key;
key = HKEY_LOCAL_MACHINE;
CTime ttime = CTime::GetCurrentTime();
int iYear,iMonth,iDay;
iYear = ttime.GetYear();
iMonth = ttime.GetMonth();
iDay = ttime.GetDay();

long temp = RegOpenKeyEx(key, _T("SOFTWARE*****"), 0, KEY_READ,&key);
{
	LPBYTE strValue = new BYTE[4];
	DWORD type_1 = REG_DWORD;
	DWORD dwCount = 4;
	int *ltemp;
	int lYear,lMonth,lDay;

	RegQueryValueEx(key, _T("RegisterYear"), NULL, &type_1, strValue, &dwCount);
	ltemp = (int*)strValue;
	lYear = *ltemp;

	RegQueryValueEx(key, _T("RegisterMonth"), NULL, &type_1, strValue,&dwCount);
	ltemp = (int*)strValue;
	lMonth = *ltemp;

	RegQueryValueEx(key, _T("RegisterDay"), NULL, &type_1, strValue, &dwCount);
	ltemp = (int*)strValue;
	lDay = *ltemp;

	if (lYear < iYear)
	{
		if (!(iMonth == 1 && lMonth == 12 && (lDay - iDay > 0)))
		{
			AfxMessageBox(_T("您的试用版本已经过期"));
			return 0;
		}
	}
	else
	{
		if ( iMonth - lMonth > 1 || ((iMonth - lMonth == 1) && (lDay - iDay < 0)))
		{
			AfxMessageBox(_T("您的试用版本已经过期"));
			return 0;
		}
	}
}
else
{
	RegCloseKey(key);
	temp = RegCreateKey(HKEY_LOCAL_MACHINE, _T("SOFTWARE*****"), &key);
	if (temp == ERROR_SUCCESS)
	{
		// CString strDate,strYear,strMonth,strDay;

		LPBYTE lpb = new BYTE[4];
		lpb = (LPBYTE)(&iYear);
		DWORD cbD = 4;
		RegSetValueEx(key, _T("RegisterYear"), NULL, REG_DWORD, lpb, cbD);

		lpb = (LPBYTE)(&iMonth);
		RegSetValueEx(key, _T("RegisterMonth"), NULL, REG_DWORD, lpb, cbD);

		lpb = (LPBYTE)(&iDay);
		RegSetValueEx(key, _T("RegisterDay"), NULL, REG_DWORD, lpb, cbD);
	}
}
AfxMessageBox(_T("感谢您的使用，您现在正在使用的是本软件的测试版本，有效日期30天"));
#endif
```