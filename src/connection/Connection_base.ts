import { Badbadconnection } from "badbadconnection";
import { Config_helper } from "../Config_helper";

export class Connection_base
{
    connection_name: string
    conf: Config_helper
    conn!: Badbadconnection

    constructor(_name: string)
    {
        this.connection_name = _name
        this.conf = new Config_helper()
    }

    set_password(pswd: string, counter: number)
    {
        this.conf.set(`${this.connection_name}_password`, pswd)
        this.conf.set(`${this.connection_name}_counter`, counter)
    }

    async start()
    {
        let pswd = this.conf.get(`${this.connection_name}_password`)
        let counter = Number(this.conf.get(`${this.connection_name}_counter`))
        this.conn = new Badbadconnection(
            this.connection_name,
            {
                key: pswd,
                counter: counter
            }
        )
        await this.conn.init()
        this.conn.on_recv((msg: string) =>
        {
            this.on_resv(msg)
        })
    }

    send(msg: string)
    {
        this.conn.send(msg)
    }

    on_resv(msg: string)
    {
        console.log(`resv ${msg}`);
    }
}