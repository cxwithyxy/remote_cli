import { Connection_base } from "./Connection_base";
import { execSync } from "child_process";
import { decode } from "iconv-lite";

export class Server extends Connection_base
{
    on_resv(msg: string)
    {
        console.log(`server_recv: ${msg}`);
        
        let cmd_return = this.run_cmd(msg)
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
        return execSync(cmd)
    }
}