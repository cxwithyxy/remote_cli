import { Connection_base } from "./Connection_base";
import { exec, execSync, ChildProcess } from "child_process";
import { decode } from "iconv-lite";
import _ from "lodash";
import { Command_helper } from "../Command_helper";
import { isUndefined } from "util";
import axios, { AxiosInstance } from "axios";

export class Server extends Connection_base
{
    command_helper: Command_helper
    cmd_process_list: ChildProcess[]
    http_conn!: AxiosInstance
    current_terminal_id!: number

    constructor(name: string)
    {
        super(name)
        this.cmd_process_list = []
        this.command_helper = new Command_helper()
        this.init_server_own_command()
    }

    async init()
    {
        this.http_conn = axios.create({baseURL: 'http://127.0.0.1:8000/',})
        if((await this.get_terminal_id_list()).length == 0)
        {
            this.current_terminal_id = await this.create_terminal()
        }
        else
        {
            this.current_terminal_id = (await this.get_terminal_id_list())[0]
        }
    }

    async create_terminal(): Promise<number>
    {
        return Number((await this.http_conn.post("/create")).data)
    }

    async on_resv(msg: string)
    {
        console.log(`server_recv: ${msg}`);
        await this.run_cmd(msg)
    }

    cmd_output(cmd_return: Buffer | string)
    {
        if(cmd_return instanceof Buffer)
        {
            this.send(decode(cmd_return, "GB2312"))
        }
        else
        {
            this.send(cmd_return)
        }
    }

    async run_cmd(cmd: string)
    {
        try
        {
            let own_command_return = await this.command_helper.run(cmd)
            this.send(own_command_return)
            return
        }
        catch(e){}
        this.http_conn.post(`/run`, {id:this.current_terminal_id, cmd: cmd})
        setInterval(async () =>
        {
            let result = await this.http_conn.post(`/result`, {id: this.current_terminal_id})
            if(result.data.length > 0)
            {
                this.cmd_output(result.data.replace(
                    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-Zbcf-nqry=><]/g, ''))
            }
        },1e3)
        
    }

    async get_terminal_id_list (): Promise<Array<number>>
    {
        let all_term_id = await this.http_conn.post(`/all`)
        return <Array<number>>all_term_id.data
    }

    async kill_terminal(id: number): Promise<boolean>
    {
        let result = Number((await this.http_conn.post(`/close`, {id: id})).data)
        return !!result
    }

    init_server_own_command()
    {
        this.command_helper.add_func("server_cmd_switch", async (index: string) =>
        {
            this.current_terminal_id = Number(index)
            return `已经切换到终端 ${index}`
        })

        this.command_helper.add_func("server_cmd_now", async () =>
        {
            return String(this.current_terminal_id)
        })
        
        this.command_helper.add_func("server_cmd_start", async () =>
        {
            return String(await this.create_terminal())
        })
        this.command_helper.add_func("server_cmd_count", async () =>
        {
            return String((await this.get_terminal_id_list()).length)
        })
        this.command_helper.add_func("server_cmd_list", async () =>
        {
            return (await this.get_terminal_id_list()).join(", ")
        })
        this.command_helper.add_func("server_cmd_stop", async (index: string) =>
        {
            let command_return:string
            command_return = `stop successfully`
            if(!await this.kill_terminal(Number(index)))
            {
                command_return = `terminal(${index}) NOT FOUND`
            }
            return command_return
        })
    }

    kill_cmd_process(cmd_process: ChildProcess)
    {
        execSync('taskkill /pid ' + cmd_process.pid + ' /T /F')
    }

    close()
    {
        this.cmd_process_list.forEach(element => {
            this.kill_cmd_process(element)
        });
        super.close()
    }
}