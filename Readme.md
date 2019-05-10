# onlyoffice ibisheng  

[毕升文档](https://bishengoffice.com)| 多人协同编辑 | 在线Office| onlyOffice

#### 毕升文档公网免费使用地址： https://bishengoffice.com

#### 毕升文档免费部署文档：https://bishengoffice.com/apps/blog/free/

#### 毕升文档免费部署脚本地址：https://gitee.com/ibisheng/deploy.git

毕升文档在线文件服务部分的Office在线编辑预览使用优秀的开源项目onlyOffice，根据开源协议我们将毕升修改过的sdkjs进行开源。毕升文档在线文件服务部分在编辑和预览Office时集成了onlyOffice。我们在集成onlyOffice主要是使用了sdkjs部分代码，并且根据毕升文档的优化要求做了相应的调整。相对于原来的onlyOffice，毕升文档的在线Office部分主要区别有：

1. 抛弃了only Office的原来的UI，整体UI重新设计实现
2. 抛弃了原来only Office开源部分的服务器实现，使用golang 和node js重新了实现Office在线编辑时的服务器逻辑以适应毕升文档分布式部署以及毕升文档在线文件服务整体设计的要求。
3. 文件的底层存储也抛弃了原来only Office的方案，按照毕升文档在线文件服务的设计，全部采用s3 api的存储。 本地部署时可以使用minio来实现s3服务，也可以使用其他兼容s3 api的存储服务商。目前全面兼容s3 api的服务商有：aws对象存储，阿里云 oss服务，青云对象存储服务,开源ceph存储等。另外对于 七牛以及ucloud 等国内云服务商的存储API不完全兼容 s3 标准API，目前还不能使用。毕升文档将在今后增加对这些存储的支持。另外也欢迎有兴趣的开发者加入我们开发相应的API以支持更多存储方式
4. 与开源版的only office相比，毕升文档在线Office部分主要增加了文件加水印预览以及文件的版本对比功能。
5. 按照毕升文档在线文件服务的设计，部署上是分布式的。可以自由扩充结点。对于需要自由扩充结点的用户[请联系我们](https://bishengoffice.com/apps/blog/business/)
5. 按照毕升文档在线文件服务的设计，部署上是分布式的。可以自由扩充结点。

## **<u>毕升文档基础安装包永久免费，不设置用户数限制。具体如下：</u>**

## ![logo](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/favicon.ico)[only Office 毕升文档免费解决方案](https://bishengoffice.com/apps/blog/free/)
1. 毕升文档基础安装包永久免费，单机版不设置用户数和并发数限制。

2. 基础安装包功能与官网上线产品功能相同。

## ![logo](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/favicon.ico)[only Office 毕升文档免费解决方案](https://bishengoffice.com/apps/blog/free/)

onlyoffice 的开源部署目前存在很多问题以及限制，部署上也有诸多问题，为了方便大家使用，毕升文档提供了Office在线编辑的[免费解决方案](https://bishengoffice.com/apps/blog/free/)。和源开源方案相比，毕升文档提供了一个完整的drive系统提供线管理，组织结构权限，分享，团队协作等，文件的全文检索等功能；同时线文件服务除了集成了only Office实现Office的在线编辑处理之外，还实现了Office的带水印预览，pdf，视频，音频文件的预览以及实现了100多种文本文件带语法高亮的预览 。免费部署请参考[毕升文档免费部署](https://bishengoffice.com/apps/blog/free/)

![毕升文档](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng.png)

### 毕升文档集成的only Office重新设计了新的UI：

![ibisheng-view-水印1word](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-editor-word.png)

![image-20190225173559305](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-editor-excel.png)

![](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-editor-ppt.png)

### 同时实现了文档的带水印预览

![image-20190225175441993](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-view-水印1.png)

![image-20190225173651978](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-view-水印2.png)



## 毕升drive

Onlyoffie的毕升文档免费解决方案还提供了一个强大的drive，实现文件的管理，协同，组织结构权限以及团队的协同

### 多视图的文件列表：列表以及文件缩略图

![image-20190225173959687](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-drive-list.png)

![image-20190225173837209](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibsheng-drive-conver.png)

### 完整的组织结构以及全新管理

![image-20190225174053091](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-drive-admin.png)

### 文件的全文检索

![image-20190225174118133](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-drive-search.png)

### 以及多种文件的预览

![image-20190225174253269](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-view-pdf.png)

![image-20190225174405258](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/ibisheng-view-golang.png)

## 联系方式

如果你想了解我们，可以打开链接：https://bishengoffice.com/apps/blog/posts/aboutus.html

你可以通过毕升Office官方QQ [420819940](tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=420819940&website=www.oicqzone.com) 以及 微信号 bishengoffice，或者电话 18613320502联系我们

也可以在微信中搜索毕升Office文档小程序

![扫码_搜索联合传播样式-微信标准绿版](https://bisheng-public.nodoc.cn/resource/扫码_搜索联合传播样式-微信标准绿版.png)
