import _ from "lodash";
import { Command_helper } from "./Command_helper";
import { Config_helper } from "./Config_helper";
import { isUndefined } from "util";
import { Client } from "./connection/Client";
import { Server } from "./connection/Server";
import { Server as NetServer, Socket } from "net";
import { decode } from "iconv-lite";

class Aready_running_server extends Error{}

export class Main_ui
{
    command_helper: Command_helper
    conf: Config_helper
    current_client!: Client
    server_list: Server[]
    net_socket_server: NetServer
    current_socket!: Socket

    constructor()
    {
        this.command_helper = new Command_helper()
        this.conf = new Config_helper()
        this.server_list = []
        this.net_socket_server = new NetServer()
    }

    on_msg(_fun: (command: string) =>{})
    {
        this.current_socket.on("data", (data: Buffer) =>
        {
            _fun(decode(data, "GB2312"))
        })
    }

    send(msg: string)
    {
        this.current_socket.write(msg)
    }

    async init_win()
    {
        await new Promise(succ =>
        {
            this.net_socket_server.listen(8088)
            this.net_socket_server.on("connection", (socket: Socket) =>
            {
                this.current_socket = socket
                console.log("connected");
                this.on_msg(this.cmd_handle.bind(this))
                succ()
            })
        })
        this.init_command()
    }

    async cmd_handle(command: string)
    {
        let return_str: string
        try
        {
            return_str = await this.command_helper.run(command)
        }
        catch(e)
        {
            return_str = `${e.constructor.name}-${String(e)}`
        }
        this.send(return_str)
    }

    init_command()
    {
        this.init_command_channel()
        this.init_client()
        this.init_server()
        this.init_startup()
    }

    init_command_channel()
    {
        this.command_helper.add_func("set_channel", async (name: string, pswd:string, counter: string) =>
        {
            this.conf.set("current_channel", name)
            if(isUndefined(pswd))
            {
                throw new Error(`need enter password`)
            }
            if(isUndefined(counter))
            {
                throw new Error(`need enter counter`)
            }
            Client.set_password(name, pswd, Number(counter))
            return "设置通讯频道成功"
        })
        this.command_helper.add_func("get_channel", async () =>
        {
            let cmd_return: string
            try
            {
                cmd_return = this.get_current_channel()
            }
            catch(e)
            {
                cmd_return = "尚未设置通讯频道"
            }
            return cmd_return
        })
    }

    get_current_channel()
    {
        return this.conf.get("current_channel")
    }

    init_client()
    {
        this.command_helper.add_func("remote", async (...argus: string[]) =>
        {
            let cmd_return: string = ""
            if(isUndefined(this.current_client))
            {
                try
                {
                    cmd_return = "远程连接客户端启动成功"
                    this.current_client = new Client(this.get_current_channel())
                    await this.current_client.start()
                    this.current_client.on_resv = async (msg) =>
                    {
                        this.send(msg)
                    }
                }
                catch(e)
                {
                    cmd_return = `远程连接客户端启动失败，请确定频道和加密方式是否设置好\n${String(e)}`
                    return cmd_return
                }
            }
            this.current_client.send(argus.join(" "))
            return cmd_return
        })
    }

    async add_server(channel: string)
    {
        if(_.findIndex(this.server_list, {connection_name: channel}) != -1)
        {
            throw new Aready_running_server(`server in channel "${channel}" is already running`)
        }
        let temp_server = new Server(channel)
        await temp_server.init()
        await temp_server.start()
        this.server_list.push(temp_server)
    }

    init_server()
    {
        this.command_helper.add_func("server_start", async (name: string) =>
        {
            let cmd_return: string
            await this.add_server(name)
            cmd_return = `server in "${name} channel" start`
            return cmd_return
        })
    }

    init_startup()
    {
        this.command_helper.add_func("set_startup", async (...argus: string[]) =>
        {
            this.conf.set("startup", argus.join(" "))
            return "startup setting success"
        })
        this.command_helper.add_func("show_startup", async (cmd: string) =>
        {
            return this.conf.get("startup")
        })
        let startup_cmd
        try
        {
            startup_cmd = this.conf.get("startup")
        }catch(e){}
        if(startup_cmd)
        {
            this.send(`### Running startup command: ${startup_cmd}`)
            this.cmd_handle(startup_cmd)
        }
    }
}