import {Path_helper} from "Electron_path_helper"
import Conf from "Conf";

export class Config_helper
{
    conf_storage_path: string
    config_name: string = "app.conf"
    conf_driver: Conf<any>

    constructor()
    {
        this.conf_storage_path = Path_helper.get_app_path()
        this.conf_driver = new Conf({
            configName: this.config_name,
            cwd: this.conf_storage_path
        });
    }

    get(_key: string): string | false
    {
        return this.conf_driver.get(_key, false)
    }

    set(_key:string, _value: string | number | boolean)
    {
        this.conf_driver.set(_key, _value)
    }
}