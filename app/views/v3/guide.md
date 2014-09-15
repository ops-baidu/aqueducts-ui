#A-Stream 用户指南
---
**A-Stream** 是一个免费的、灵活的、简单易用的消息实时聚合、计算服务。它的全称是Aggregated Stream。我们为用户提供了多种方式的接入，帮助用户在尽量短的时间内上手，迅速获取聚合、计算结果，并对结果同时提供灵活的API调用以及可视化的图形展示。可定制的图形展示功能会在下一版本推出。

##目录
---
- [功能特色](#)
- [核心概念](#)
- [使用帮助](#)
- [API 调用](#)
- [接入现状](#)

##功能特色
####实时聚合、准确计算
对于用户发送的日志，我们可以保证准实时的计算，延时控制在15秒左右（从日志被打印到计算完毕）。并按照日志打印时间进行精确的聚合计算，默认提供按照1s为周期和60s为周期的聚合计算结果。


####按维度聚合
我们为用户提供了很多常用的聚合方法 （如：count,average,max,min,sum,topN等）常见的聚合方法不需要自己实现；同时支持按维度的聚合，不仅能看到 整体的平均响应时间，也能够看到按idc，来源，位置等等自定义的tag统计的响应时间。另外tag相加的聚合方式（如：idc+prod） 我们也在后台提供了，如有需要请[联系我们](http://aqueducts.baidu.com/about#contact)，这一功能会在下个版本上线。

####灵活的API
用户除了可以在网页上看到可视化的聚合结果（静态图表、动态图表）之外，还可以通过调用events查询API获取详细结果用于近一步的分析和自定义展现。可定制的图形展示功能会在下一版本推出。

##核心概念
---
- user : 用户，游客可以通过注册或第三方账号登录成为A-Stream用户，从而使用A-Stream的服务。
- guest ：游客账号，想要马上体验A-Stream的游客可以使用guest账号登录，体验A-Stream的**一些**功能，想要体验全部功能请注册或使用第三方账号登录。
- service : 服务，是部署计算任务的最小单位，包括private service和organization service。
- private service : 用户私人的服务，**只有用户自己**可以进行访问、管理。
- organization : 项目组/团队，与GitHub的organization概念相似。在公司内部，organization可以对应一个产品线，比如www、im、sf。用户可以创建organization，加入其他用户创建的organization。而在一个organization中，用户有四种角色：
  1. owner，创建organization的用户，**只有owner**可以向organization中添加其他用户，并且拥有**所有的**权限。
  2. admin，可以管理organization下的所有services，即，对所有services拥有**读写权限**。
  3. normal，可以添加以及修改/删除自己创建的services，即，对**所有services有读权限 & 属于自己的services有写权限**。
  4. guest，与系统的guest用户不同，这是针对organization的，对organization下所有的services**仅有读权限**。
- organization service : organization下的services，用户加入一个organization后，只要角色不是guest，即可在此organization下创建service，organization下的所有services**均属于organization**，即倘若organization被其owner删除，其下所有services也会被删除。
- item : 计算项，一个待计算的内容，如：page_view、response_time。用户发送过来的日志中需要包含此计算项的名称和值。
- calculation : 计算方法，如：count、average、percent80。
- tag : 维度，系统会按照tag对item进行分维度计算。如：按照不同的idc进行page_view的计算。
- job : 计算任务。用户可以在一个service下创建多个jobs，但一个job仅包含一个item、一个calculation、零个或者多个tag。目前暂不支持用户创建自定义item、tag和calculation，需要自定义的用户可以联系我们。

##使用帮助
---
###Web界面
---
####创建账户
在[A-Stream注册页](http://aqueducts.baidu.com/join)进行注册，或者在[登陆页](http://aqueducts.baidu.com/login)使用第三方账号登录。（**需要注意的是**，为了保证用户名的唯一性，倘若第三方账号用户名与系统内用户名重复，系统在用户**第一次登录时**会提示用户更改用户名。）
####创建organization
对于百度内部用户，为了便于管理，接入的产品线需要创建对应的organization，如sf、im。登录后点击导航栏“+”即可创建organization或private service。
####创建service

#####private service
登录后点击导航栏“+”选择private service或者在[用户首页](http://aqueducts.baidu.com/home)右侧Private Service面板右侧的“+”即可创建private service。创建service时请根据需要选择华东或者华北机房以及对应的流量，**请尽量接近**产品的现有流量状态，以免浪费资源。机房的选择决定service下的jobs部署在哪里。
#####organization service
创建organization service需要先创建organization，创建后在导航栏最左侧的下拉菜单选择进入organization首页并在Service面板右侧点击”+“即可创建organization service。流量的选择参考private service。
> private service的名称不得与用户自己其他的private service重复，organization service名称不得与organization下其他service名称重复，但用户可以创建同名的private service和organization service。

####创建job
在service面板点击对应的service名称进入service详情页面，点击右侧的“New Job”即可新建job。请根据需要计算的项选择item，选择了item后calculation下拉菜单会出现适用于此item的计算方法，最后选择对应的tag即可。需要增加item、calculation、tag请[联系我们](http://aqueducts.baidu.com/about#contact)。

> - 新增service、新增或删除job并不会使计算任务上线。只有点击“Apply Jobs"按钮才会部署或重新部署计算任务。在没有变更的情况下，**请勿频繁点击**“Apply Jobs”。
- 删除service会将service下包含的jobs**全部下线**。

####用户设置
#####更改用户名、密码
登录后点击导航栏锯齿按钮或者访问[设置页](http://aqueducts.baidu.com/settings)即可更改用户设置，点击Account Settings即可更改用户名、密码。
#####查看、重置Token
点击Access Token即可查看或重置Token。**需要注意的是**，除非Token外泄，一般情况下**请勿重置Token**，重置后需要及时在**接入端更新Token**，否则无法进行正常的计算。
###接入
---
####Step 0 : 创建相关organization、service、job
具体操作请参照上一节。**需要注意的是**，如果是测试需要，可以新建private service。
####HTTP接入

####Step 1 ：发送日志
发送日志的HTTP接口为：
```
POST http://10.202.6.115:8080/publish
```
POST的内容为：
``` 
message={
            "username"/"organization": "[name]", 
            "service": "[service name]", 
            "[item name]": "[item value]", 
            "[tag name]": "[tag value]"
        }
```
http://10.202.6.115:8080/publish 为华东机房的API地址，如需发送到华北机房请替换成：http://10.26.25.153:8080/publish
另外需要在header部分添加Authorization字段，如：Authorization: Token [your token]，否则会发送失败。

以下是一个完整的使用curl发送日志的样例：
0. 网站上新建一个名为test的private service，机房仅选择华东。
1. 在test中新建一个job，item选择page_view，calculation选择count，tag选择idc，然后点击“Apply Jobs”按钮。
2. 终端下载并执行日志发送的脚本：
``` Bash
wget http://download.aqueducts.baidu.com/demo_log_maker/demo_log_maker.sh
```
``` Bash
chmod u+x demo_log_maker.sh && ./demo_log_maker.sh
```
``` Bash
./demo_log_maker.sh ${your username} test ${your token}
```
把\${your username}换成你的用户名，\${your token}换成你的Token
3. 若终端持续收到{"response":"ok"}表示发送成功，不要中断。

####Step 2 ：查看聚合结果

#####Console实时查看抽样日志
发送日志后可以在网页上看到日志的抽样。点击页面导航栏的“CONSOLE”即可进入Console。在个人主页点击“CONSOLE”会显示所有的**private services**，只有在**organization的主页点击“CONSOLE”**才会显示organization下的services。
左侧的下来菜单选择某个service后可以看到实时发送的消息，切换华东华北可以看到华东华北收到的消息，切换service可以查看不同的service消息抽样，点击右边的“PAUSE”可以暂停，点击“LIVE”会重新显示。
在上一个示例中，当你在Console里选择test后看到抽样的消息则说明消息被成功地聚合、计算了。

#####Chart查看聚合图表

与Console**上下文的概念**相同，在个人主页点击导航栏的图标按钮会显示private services的图表，在organization主页点击会显示organization下的services。
点击下拉菜单选择不同的services，可以看到service下所有job的聚合结果图表，包括动态图和静态图。如果创建service时选择了在华东华北两个机房部署，则可以选择查看华东或华北的聚合结果图。
静态图提供了当日、同比、环比三条曲线，清晰明了便于对比分析。
动态图每秒刷新一次，实时性很强。
> 更详细的聚合结果请**通过API获取**，参见[API部分]()。

####Logstash接入
####Step 1 ：安装Logstash
---
[Logstash](http://logstash.net/)是一个消息/日志的收集、解析工具，A-Stream使用Logstash作为发送日志的客户端。下载最新版的Logstash客户端到需要采集日志的机器上，Logstash负责采集日志字段，唯一的依赖是Java runtime。Logstash官方推荐使用最新版的Java，我们这里要求是Java 1.6以上。使用如下命令查看Java版本：
``` Bash
java -version
```
百度内部用户使用work帐号执行以下命令：
``` Bash
wget http://download.aqueducts.baidu.com/logstash_install.sh -O logstash_install.sh
```
``` Bash
sh logstash_install.sh
```
``` Bash
cd /home/work/opbin/logstash
```
外部用户可以执行以下命令：
``` Bash
curl -O https://download.elasticsearch.org/logstash/logstash/logstash-1.4.2.tar.gz
```
``` Bash
tar zxvf logstash-1.4.2.tar.gz
```
``` Bash
cd logstash-1.4.2
```

> 查看[Logstash性能测试报告](http://wiki.aqueducts.baidu.com/logstash%20%20kafka%20performance%20test)

> 在流量较大，且日志格式复杂的情况下，对单机性能消耗较大。针对这种情况，我们提供了集中解析日志服务，agent只负责发送消息，解析由后端计算系统完成。这个功能正在和minos联合开发，如果有需求，请[联系我们](http://aqueducts.baidu.com/about#contact)。

####Step 2 ：配置Logstash，发送日志
只有保证Logstash被正确配置了，提交的日志才能被计算。提交的日志需要保证被提取字段和item名称一致。比如：在web上注册的item名字叫page_view，则agent的format字段需要提取出page_view: (?<page_view>NOTICE:)

以下是一个配置样例。用于提取organization im下router service的page_view和response _time。
``` 
input {
  file {
    # 详细配置项请参考 http://logstash.net/docs/1.3.3/inputs/file
    path => "/home/work/local/imas.log"

    # 附加自定义字段
    # add_field => { "input_a" => "input_a"
    #                "input_b" => "input_b"
    #              }
  }
}

filter {
  # 通过正则提取需要计算的字段
  grok {
    # 详细配置项请参考 http://logstash.net/docs/1.3.3/filters/grok
    match => [ "message", "^(?<page_view>NOTICE):.*tt=(?<response_time>[0-9]*) (?<timestamp>\d\d\d\d-\d\d-\d\d-\d\d-\d\d-\d\d)" ]
  }

  # 定义日志中的时间戳格式
  date {
    match => [ "timestamp", 'YYYY-MM-dd-HH-mm-ss' ]
  }
}
output {
#  stdout { debug => true }
    kafka {
      product => "aqueducts"
      service => "logstash"
    }
}
```
**需要注意的是**，如果是用户的private service，product的值为用户名，若是organization下的service，product的值为organization的名称。
> - 关于Logstash的详细文档请参考[Logstash配置](http://logstash.net/docs/1.3.3/)
- 需要手工配置的说明在样例的注释中说明，**其余的不需要修改**
- 用于验证grok正则表达式正确性的web service: [grokdebug](http://grokdebug.herokuapp.com/)

####Step 3 ：查看聚合结果
具体操作参照上一节。


##API 调用
---
由于新版的API需要权限认证，所有V3版本的API除特殊几个外都需要在HTTP请求的header添加Authorization项。下面有详细示例。
> 另外**需要注意**的是，所有API返回值均为JSON格式。

我们还提供了一个特殊的API用于测试连通性(无需Token验证)：

    GET http://api.aqueducts.baidu.com/v3/answer

可以正确连接的话返回：

    {
        "answer to universe, life and everything": 42
    }
状态码为200，反之为400。

###基本信息获取

#####验证Token是否合法
    GET http://api.aqueducts.baidu.com/v3/user/validate_token
    
参数说明：

| 参数名    | 参数类型 | 描述  |
| :-------- | --------:| :-- |
| token     | string   |  用户的Token值，可以在用户管理页面查看。|

返回值：
若是Token合法，返回：

    {
        "message": "validate token",
        "user": "[your username]"
    }


HTTP状态码为200。
若Token不合法，返回：

    {
        "message": "invalid token"
    }
状态码为400。
#####获取用户所有的private services

    GET http://api.aqueducts.baidu.com/v3/user/services

使用curl的例子：
``` Bash
curl -H "Authorization: Token [your token]" http://api.aqueducts.baidu.com/v3/user/services
```

#####获取用户加入的所有的organization

    GET http://api.aqueducts.baidu.com/v3/orgs

使用curl的例子：
``` Bash
curl -H "Authorization: Token [your token]" http://api.aqueducts.baidu.com/v3/orgs
```


#####获取某organization下所有的service
调用此API的前提是用户是此organization的成员。

    GET http://api.aqueducts.baidu.com/v3/orgs/[org_name]/services

org_name为此organization的名字。


###events查询
####v1
为了向下兼容，之前V1版本的events相关API仍然可用：

    GET http://api.aqueducts.baidu.com/v1/events

参数说明：

| 参数名     | 参数类型 | 描述  |
| :--------  | --------:| :-- |
| product    | string   | 必选。由于历史原因，V1中没有organization的概念，但两者在使用上没有区别，可以直接把organization的名称作为product的值传递。|
| service    | string   | 必选。要查询的service的名称。|
| item       | string   | 必选。要查询的item的名称。|
| calculation| string   | 必选。要查询的calculation的名称。|
| from       | string   | 必选。时间区间起始，如表示从上一分钟开始：-1m，详细对应关系参见下面的说明。|
| to         | string   | 必选。时间区间终止，如表示到现在为止：now，详细对应关系参见下面的说明。  |
|detail      | string   | 可选。参数存在时，则返回详细的结果，包括所有字段名称和值，缺省情况下仅返回部分字段的值。|
|area        | string   | 可选。若是查询华北机房的结果则值为huabei，若是查询华东的结果则值为huadong，缺省情况下查询的是华北机房。
| period     | string   | 可选。表示查询的精度，有两个值：1或60，分别表示：获取按秒聚合的结果、获取按分钟聚合的结果，缺省情况下是1。|

> **查询区间与返回精度对应关系**:
 < 1 hour, 返回秒级精度（1-second 1-point）
 \> 1 hour, 返回分钟级精度（1-minute 1-point）

>**时间区间表示格式**：

> ***Absolute Dates***
 yyyy-MM-dd HH:mm:ss.SSS     :  2013-08-11 00:00:00.000
 yyyy-MM-ddTHH:mm:ss.SSSZ  :  2013-08-13T18:45:00.000Z

> ***Relative Dates***
 now                     : now
 Last 12 hours       : -12h
 Last 5 minutes      : -5m
 Last 30 seconds   : -30s

使用curl获取organization im下router service近一分钟的page_view:

    curl "http://api.aqueducts.baidu.com/v1/events?product=im&service=router&item=page_view&calculation=count&from=-1m&to=now&detail=true&area=huabei&period=1"

除个别参数外，V1 与 V3 版本大致相同。

另外，由于V1缺乏权限验证，出于安全性的考虑在不久的将来很可能会**废弃**，所以**强烈建议**新用户直接使用V3 API。
####v3

    GET http://api.aqueducts.baidu.com/v3/events

参数说明：

| 参数名    | 参数类型 | 描述  |
| :-------- | --------:| :-- |
| username  | string |  若service为用户的private service，则username必选，organization不选。|
| organization | string |  若service为organization下的service，则organization必选，username不选。  |
| service    | string   | 必选。要查询的service的名称。|
| item       | string   | 必选。要查询的item的名称。|
| calculation| string   | 必选。要查询的calculation的名称。|
| from       | string   | 必选。时间区间起始，如表示从上一分钟开始：-1m，详细对应关系参见上面的说明。|
| to         | string   | 必选。时间区间终止，如表示到现在为止：now，详细对应关系参见上面的说明。  |
|detail      | string   | 可选。参数存在时，则返回详细的结果，包括所有字段名称和值，缺省情况下仅返回部分字段的值。|
|area        | string   | 可选。若是查询华北机房的结果则值为huabei，若是查询华东的结果则值为huadong，缺省情况下查询的是华北机房。
| period     | string   | 可选。表示查询的精度，有两个值：1或60，分别表示：获取按秒聚合的结果、获取按分钟聚合的结果，缺省情况下是1。|

使用curl获取organization im下router service近一分钟的page_view（前提是你在im organization下面）:

    curl -H "Authorization: Token [your token]" "http://api.aqueducts.baidu.com/v3/events?organization=im&service=router&item=page_view&calculation=count&from=-1m&to=now&detail=true&area=huabei&period=1"

##接入现状
在百度内部，目前已有  **7**  个产品线接入 A-Stream，创建超过  **50**  个 services，**100**  个计算任务。
A-Stream每秒处理超过 **300,000** 条消息，稳定性达到 **99.998%** 。
如在使用或接入过程中遇到任何问题，欢迎 [联系我们](http://aqueducts.baidu.com/about#contact)。

####Happy A-Streaming!