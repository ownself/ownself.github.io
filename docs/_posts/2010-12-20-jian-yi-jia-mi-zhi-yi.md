---
id: 133
title: 简易加密之一
date: '2010-12-20T14:28:00+08:00'
author: Jimmy
layout: post
guid: 'http://www.ownself.org/oswpblog/?p=60'
permalink: /2010/jian-yi-jia-mi-zhi-yi.html
categories:
    - Windows开发
---

很久没写了，忙完了结婚就一直在忙TopSpin4，现在得点空了，要好好补一补，先从简单的开始～

前一段时间工作上需要，用到了个简单的加密方法，在这里记录一下算法，权作笔记：

### 加密

```
// strSrc为源码, strKey为附加码
CString Encrypt(const CString& strSrc, CString strKey)
{
	int nKeyLen = strKey.GetLength();
	if (nKeyLen == 0)
		strKey = _T("XXXXXX"); // 如果附加码为空

	srand((unsigned)time(NULL));
	int nRange = 256;
	int nOffset = (rand() % nRange);
	CString strDest = _T("");
	strDest.Format("%1.2x", nOffset); // 第一字符为随机码

	int nSrcAsc = 0;
	int nKeyPos = 0;
	for (int nSrcPos = 0; nSrcPos < strSrc.GetLength(); nSrcPos++)
	{
		int n = strSrc[nSrcPos];
		nSrcAsc = (strSrc[nSrcPos] + nOffset) % 255;
		if (nKeyPos < nKeyLen-1 )
			nKeyPos += 1;
		else
			nKeyPos = 1;
		nSrcAsc = nSrcAsc ^ strKey[nKeyPos]; // 附加码影响
		CString strTemp = _T("");
		strTemp.Format("%1.2x", nSrcAsc);
		strDest += strTemp;
		nOffset = nSrcAsc; // 依次影响后面的编码
	}
	return strDest; // 加密后长度为2n+2
}
```

### 解密

```
// strSrc为目标码, strKey为附加码, 须一致 
CString Decrypt(const CString& strSrc, CString strKey)
{
	int nKeyLen = strKey.GetLength();
	if (nKeyLen == 0)
		strKey = _T("XXXXXX"); // 如果附加码为空

	char *stopstring;
	int nOffset = strtoul(strSrc.Mid(0,2), &stopstring, 16); // 去处第一个随机码 
	int nSrcPos = 2;
	int nSrcAsc = 0;
	int nKeyPos = 0;
	int nTempSrcAsc = 0;
	CString strDest;
	do
	{
		nSrcAsc = strtoul(strSrc.Mid(nSrcPos,2), &stopstring, 16); // 依次取出每一位码 
		//if (nSrcAsc == 0) break;
		if (nKeyPos < nKeyLen-1)
		{
			nKeyPos += 1;
		}
		else
		{
			nKeyPos = 1;
		}
		nTempSrcAsc = nSrcAsc ^ strKey[nKeyPos]; // 异或附加码 
		if (nTempSrcAsc <= nOffset) // 解码 
		{
			nTempSrcAsc = 255 + nTempSrcAsc – nOffset;
		}
		else
		{
			nTempSrcAsc -= nOffset;
		}
		CString strTemp;
		strTemp.Format("%c",nTempSrcAsc);
		strDest += strTemp;
		nOffset = nSrcAsc;
		nSrcPos += 2;
	} while (nSrcPos <= strSrc.GetLength());
	strDest=strDest.Mid(0,(strSrc.GetLength()-2)/2); 
	return strDest;
}
```