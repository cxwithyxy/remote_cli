#	remote_cli

通过公用免费的websocket服务器现实的远程命令行终端(伪)

最新版本：v2.20191203102442



## 使用方法（常用命令）

1. ### 设置频道和密码

   ```
   set_channel your_channel_name password password_counter
   ```

   your_channel_name 你的频道名称

   password 你的密码

   password_counter 密码计数器, 随意0到10的数字都行

2. ### 启动服务端

   ```
   server_start your_channel_name
   ```

3. ### 发送命令

   ```
   remote your_command
   ```

   your_command 服务端要执行的命令(或"其他命令-服务端"), 如 dir



## 其他命令(客户端)

### get_channel

获取当前频道名称

### close

关闭终端

### set_startup

设置软件启动时要执行的命令

```
set_startup cmd
```

cmd 具体命令

### show_startup

显示当前软件启动时要执行的命令



## 其他命令(服务端)

### server_cmd_start

启动新的终端

### server_cmd_now

显示当前的终端编号

### server_cmd_switch

通过ID切换当前终端

```
server_cmd_switch 2
```

### server_cmd_list

显示当前所有的终端id

### server_cmd_count

显示当前的终端数量

### server_cmd_stop

通过id结束终端

```
server_cmd_stop id
```

id 终端id



## 开发

#### 安装依赖

```
yarn
```

#### 运行

```
yarn start
```

#### 打包进文件夹

```
yarn build
```

#### 打包成zip

```
yarn exe
```



## 安全性

客户端和服务端的通讯会经过公用的websocket服务器，不过通过加密，确保websocket服务器等第三方无法获取具体通讯内容

