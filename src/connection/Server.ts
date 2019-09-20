import { Connection_base } from "./Connection_base";
import { spawn } from "child_process";
import { decode } from "iconv-lite";

export class Server extends Connection_base
{
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
        terminal.stdout.on("data", (data: Buffer) =>
        {
            if(data)
            {
                this.cmd_output(data)
            }
        })
    }
}