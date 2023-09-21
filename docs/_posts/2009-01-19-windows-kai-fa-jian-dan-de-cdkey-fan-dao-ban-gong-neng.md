---
id: 51
title: 简单的CDKEY反盗版功能
date: '2009-01-19T11:44:38+08:00'
author: Jimmy
layout: post
guid: 'http://ownself.servexcellent.com/oswpblog/?p=12'
permalink: /2009/windows-kai-fa-jian-dan-de-cdkey-fan-dao-ban-gong-neng.html
categories:
    - Windows开发
---

呵呵，和昨天的共享版本的实现本是一起的，在代码中的#else部分，连在一起就可以实现仅改变预编译头即可在共享版本和正是版本之间的切换。

当然，这个同样应该是该模型的最简易实现。

首先是三个辅助函数：

```
//判断是否完成过正确的注册 
bool IsCdKeyRegisted()
{
	CString strFilePath;
	strFilePath = _T("***.**"); //CDKEY存放文件，也可利用注册表实现，这里采用文件存放
	CFile file(strFilePath, CFile::modeRead | CFile::typeBinary);

	if (file)
	{
		TCHAR buffer[256];
		ZeroMemory(buffer, 256);
		file.Read(buffer, 256);
		CString csCdKey;
		csCdKey = (LPCTSTR)buffer;
		if (CheckingCdKey(csCdKey))
		{
			return true; //如果以往注册信息正确 
		}
		return false;
	}
	else
	{
		return false;
	}
}
// 检测CDKEY是否正确
bool CheckingCdKey(CString myCdKey)
{
	CString csCdKey;
	csCdKey = _T("****"); //The CD-KEY!!
	if (csCdKey == myCdKey)
	{
		return true;
	}
	else
	{
		return false;
	}
}
//注册
void RegisterCdKey(CString myCdKey)
{
	CString strFilePath;
	strFilePath = _T("***.**");
	CFile file(strFilePath, CFile::modeCreate | CFile::modeWrite | CFile::typeBinary);
	TCHAR buffer[256];
	ZeroMemory(buffer, 256);
	memcpy(buffer, myCdKey.GetBuffer(), 256);
	file.Write(buffer, 256);
	AfxMessageBox(_T("恭喜您！注册成功！！"));
}
```

然后是判断部分，放在昨天的#ifdef-#endif中的#else即可：

```
#else
	////******************************
	////检测CDKEY注册
	if (!IsCdKeyRegisted())
	{
		CCdKeyRegister cdrdlg;
		if (cdrdlg.DoModal() == IDOK)
		{
			if (!CheckingCdKey(cdrdlg.m_csCdKey))
			{
				AfxMessageBox(_T("对不起，您输入的CDKEY是非法的！将退出执行应用程序！"));
				return false;
			}
			else
			{
				RegisterCdKey(cdrdlg.m_csCdKey);
			}
		}
		else
		{
			return false;
		}
	}
#endif
```