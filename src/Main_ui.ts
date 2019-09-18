import { UI } from "electron_commandline_UI";
import _ from "lodash";

export class Main_ui extends UI
{
    constructor(win_setting?: object | undefined)
    {
        let preset = {
            autoHideMenuBar: true
        }
        super(_.merge(preset, win_setting))
    }
    async init_win(_option?: { cmd_text: string; cmd_title: string;})
    {
        await super.init_win(_option)
    }
}