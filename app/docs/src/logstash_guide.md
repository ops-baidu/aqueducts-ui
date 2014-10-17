# Logstash Guide

Logstash 是一个日志收集，分析，输出存储工具，主要有三个部分，input，filter，output：

- input：日志文件的输入配置。
- filter：按照日志行进行处理，格式化，提取需要的数据。
- output：对处理后的数据存储输出，可以是 stdout，file，kafka 等等。

### input

在 input 使用 file 配置项对日志文件进行读取操作的配置。

```
input {
  file {
    add_field => ... # hash (optional), default: {}
    codec => ... # codec (optional), default: "plain"
    debug => ... # boolean (optional), default: false
    discover_interval => ... # number (optional), default: 15
    exclude => ... # array (optional)
    path => ... # array (required)
    sincedb_path => ... # string (optional)
    sincedb_write_interval => ... # number (optional), default: 15
    start_position => ... # string, one of ["beginning", "end"] (optional), default: "end"
    stat_interval => ... # number (optional), default: 1
    tags => ... # array (optional)
    type => ... # string (optional)
  }
}
```

常用参数：

- path：必填，输入一个数组，可以使用通配符，用来指定日志文件的位置，可以指定多个日志文件。
- type：增加一个 type field 到事件处理器中，在 filter 里面可以根据配置项 type 的值，分别使用不同处理方式。
- sincedb_path：用来指定读取日志的偏移量，一般默认即可。

例如，输入多个日志文件，根据 type 配置项不同，在 filter 里面进行不同的处理：

```
input {
  file {
    path => "/home/local/access.log"
    type => "access"
  }

  file {
    path => "/home/local/error.log"
    type => "error"
  }
}

filter {
  if [type] == "access" {
  ...handle...
  }

  if [type] == "error" {
  ...handle...
  }
}
```

### filter

***

在 filter 中 **Grok** 是目前最好的解析非结构化数据的工具。

```
filter {
  grok {
    add_field => ... # hash (optional), default: {}
    add_tag => ... # array (optional), default: []
    break_on_match => ... # boolean (optional), default: true
    drop_if_match => ... # boolean (optional), default: false
    keep_empty_captures => ... # boolean (optional), default: false
    match => ... # hash (optional), default: {}
    named_captures_only => ... # boolean (optional), default: true
    overwrite => ... # array (optional), default: []
    patterns_dir => ... # array (optional), default: []
    remove_field => ... # array (optional), default: []
    remove_tag => ... # array (optional), default: []
    tag_on_failure => ... # array (optional), default: ["_grokparsefailure"]
  }
}
```

如果需要测试 Grok，[grokdebug](http://grokdebug.herokuapp.com) 会非常有用(需要翻墙)。

常用参数：

- match：一个正则解释器，通过正则表达式，我们可以提取任何形式的数据。
- add_tag：增加一个 tag 到 event 里，可以在 output 配置项里面根据 tag 的值做不同处理。

```
filter {
  grok {
    match => [ "message", "Regular Expressions" ]
  }
}
```

例如，我们需要提取一个 10-11 个字符的 queue_id

```
(?<queue_id>[0-9A-F]{10,11})
```

这样我们就将一个字符串，放到以 queue_id 为 key 的哈希里面。

***

**Ruby** 执行一段 ruby 代码。

```
filter {
  ruby {
    add_field => ... # hash (optional), default: {}
    add_tag => ... # array (optional), default: []
    code => ... # string (required)
    init => ... # string (optional)
    remove_field => ... # array (optional), default: []
    remove_tag => ... # array (optional), default: []
  }
}
```

常用参数：

- code：必填字段，一段 ruby 代码，必须要写成一行，其中有一个 event 变量可以使用。

例如，我们希望把上面 grok 配置项提取出来的 queue_id 全部字母变成小写：

```
ruby {
  code => "event['queue_id'] = event['queue_id'].downcase "
}
```

### output

***

**stdout** 最简单的输出到命令行的配置，主要是用于调试。

```
output {
  stdout { debug => true }
}
```

***

**Kafka** 输出到 kafka 消息队列。

```
kafka {
  zk_connect => ... # string (optional), default: "localhost:2181"
  group_id => ... # string (optional), default: "logstash"
  topic_id => ... # string (optional), default: "test"
  reset_beginning => ... # boolean (optional), default: false
  consumer_threads => ... # number (optional), default: 1
  queue_size => ... # number (optional), default: 20
  rebalance_max_retries => ... # number (optional), default: 4
  rebalance_backoff_ms => ... # number (optional), default:  2000
  consumer_timeout_ms => ... # number (optional), default: -1
  consumer_restart_on_error => ... # boolean (optional), default: true
  consumer_restart_sleep_ms => ... # number (optional), default: 0
  decorate_events => ... # boolean (optional), default: false
  consumer_id => ... # string (optional) default: nil
  fetch_message_max_bytes => ... # number (optional) default: 1048576
  compression_codec => ... # string (optional [none, gzip, snappy]), default: 'none'
  compressed_topics => ... # string (optional), default: ''
  product => ... # string (requied), default: nil
  service => ... # string (requied), default: nil
  zk_host => ... # string (optional), default: 'buffer.aqueducts.baidu.com'
  zk_port => ... # string (optional), default: '2181'
  apidomain => ... # string (optional), default: 'api.aqueducts.baidu.com'
  skip_check => ... # string (optional), default: 'false'
  workers => ... # number (optional), default: 1
  message => ... # boolean (optional), default: false
}
```

常用参数：

- zk_host：可选，配置 zookeeper 的 ip 地址，华北：10.36.4.185 华东：10.202.6.13。
- zk_port：可选，配置 zookeeper 的端口号，默认 2181。
- product：必填，在 http://aqueducts.baidu.com/ 申请的 organization。
- service：必填，在 http://aqueducts.baidu.com/ 申请的 service。
- skip_check：可选，测试时可以跳过 product and service 的验证。
- message：可选，默认 false，当 message => true 可以把原始日志放在 event，如非必要，不填。

例如，根据 filter 配置项里面 tag 的值，输出到不同的 kafka 消息队列：

```
filter {
  grok {
  ...handle...
  add_tag => "ui"
  }

  grok {
  ...handle...
  add_tag => "api"
  }
}

output {
  if "ui" in [tags] {
    kafka {
      product => "search"
      service => "ui"
    }
  }

  if "api" in [tags] {
    kafka {
      product => "search"
      service => "api"
    }
  }
}
```
