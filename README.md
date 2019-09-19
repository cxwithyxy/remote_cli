#	remote_cli

通过公用免费的websocket服务器现实的远程命令行终端(伪)



## 已知问题

1. 超过 5k 的数据无法被发送和接收
2. 关闭窗口时没有关闭其他子进程
3. 当执行的命令是持久执行的命令时, 则会一直处于等待状态, 如: ping baidu.com -t



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

   your_command 命令, 如 dir



## 其他命令

### get_channel

获取当前频道名称

close

关闭终端



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