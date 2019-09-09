import {Path_helper} from "Electron_path_helper"
export class Config_helper
{
    conf_storage_path: string
    config_name: string = "app.conf"

    constructor()
    {
        this.conf_storage_path = Path_helper.get_app_path()
    }
}