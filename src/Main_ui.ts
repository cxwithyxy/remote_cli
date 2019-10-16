import { UI } from "electron_commandline_UI";
import _ from "lodash";
import { Command_helper } from "./Command_helper";
import { Config_helper } from "./Config_helper";
import { isUndefined } from "util";
import { Client } from "./connection/Client";
import { Server } from "./connection/Server";

class Aready_running_server extends Error{}

export class Main_ui extends UI
{
    command_helper: Command_helper
    conf: Config_helper
    current_client!: Client
    server_list: Server[]

    constructor(win_setting?: object | undefined)
    {
        let preset = {
            autoHideMenuBar: true
        }
        super(_.merge(preset, win_setting))
        this.command_helper = new Command_helper()
        this.conf = new Config_helper()
        this.server_list = []
    }

    async init_win(_option?: { cmd_text: string, cmd_title: string})
    {
        await super.init_win(_option)
        this.set_title("远程命令行")
        this.on_msg(async (command: string) =>
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
        })
        this.init_command()
    }

    init_command()
    {
        if(!isUndefined(this.UI_win))
        {
            this.UI_win.on("close", () =>
            {
                try
                {
                    this.current_client.close()
                }catch(e){}
                this.server_list.forEach(element => {
                    element.close()
                });
            })
        }
        this.command_helper.add_func("close", async () =>
        {
            setTimeout(() =>
            {
                if(!isUndefined(this.UI_win))
                {
                    this.UI_win.close()
                }
            }, 1e3)
            return "关闭中......"
        })
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
        await temp_server.start()
        this.server_list.push(temp_server)
    }

    init_server()
    {
        this.command_helper.add_func("server_start", async (name: string) =>
        {
            let cmd_return: string
            await this.add_server(name)
            cmd_return = `server in "${name} channel start"`
            return cmd_return
        })
    }

    init_startup()
    {
        this.command_helper.add_func("set_startup", async (cmd: string) =>
        {
            this.conf.set("startup", cmd)
            return "startup setting success"
        })
        this.command_helper.add_func("show_startup", async (cmd: string) =>
        {
            return this.conf.get("startup")
        })
    }
}