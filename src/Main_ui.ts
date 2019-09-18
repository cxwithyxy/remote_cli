import { UI } from "electron_commandline_UI";
import _ from "lodash";
import { Command_helper } from "./Command_helper";
import { isUndefined } from "util";

export class Main_ui extends UI
{
    command_helper: Command_helper

    constructor(win_setting?: object | undefined)
    {
        let preset = {
            autoHideMenuBar: true
        }
        super(_.merge(preset, win_setting))
        this.command_helper = new Command_helper()
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
    }
}