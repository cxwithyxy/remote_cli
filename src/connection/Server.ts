import { Connection_base } from "./Connection_base";
import { exec, execSync, ChildProcess } from "child_process";
import { decode } from "iconv-lite";
import _ from "lodash";
import { Command_helper } from "../Command_helper";
import { isUndefined } from "util";

export class Server extends Connection_base
{
    command_helper: Command_helper
    cmd_process_list: ChildProcess[]

    constructor(name: string)
    {
        super(name)
        this.cmd_process_list = []
        this.command_helper = new Command_helper()
        this.init_server_own_command()
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
        let terminal = exec(cmd, {encoding:"buffer"})
        this.cmd_process_list.push(terminal)
        terminal.stdout.on("data", (data: Buffer) =>
        {
            if(data)
            {
                this.cmd_output(data)
            }
        })
        terminal.stdout.on("end", () =>
        {
            _.pull(this.cmd_process_list, terminal)
        })
    }

    init_server_own_command()
    {
        this.command_helper.add_func("server_cmd_count", async () =>
        {
            return String(this.cmd_process_list.length)
        })
        this.command_helper.add_func("server_cmd_stop", async (index: string) =>
        {
            let command_return:string
            try
            {
                let cmd_process_for_kill = this.cmd_process_list[Number(index)]
                if(isUndefined(cmd_process_for_kill))
                {
                    throw new Error(`index "${index}" is not correct`)
                }
                this.kill_cmd_process(cmd_process_for_kill)
                command_return = `stop successfully`
            }
            catch(e)
            {
                command_return = String(e)
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