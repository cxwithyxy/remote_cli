import { Connection_base } from "./Connection_base";
import { spawn, ChildProcess } from "child_process";
import { decode } from "iconv-lite";
import _ from "lodash";

export class Server extends Connection_base
{
    cmd_process_list: ChildProcess[]

    constructor(name: string)
    {
        super(name)
        this.cmd_process_list = []
    }

    on_resv(msg: string)
    {
        console.log(`server_recv: ${msg}`);
        this.run_cmd(msg)
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

    run_cmd(cmd: string)
    {
        let terminal = spawn(cmd, {shell: true})
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
}