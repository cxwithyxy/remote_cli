import {Path_helper} from "Electron_path_helper"
import Conf from "conf";

class NOT_FOUND extends Error {}

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

    get(_key: string): string
    {
        let result = this.conf_driver.get(_key, false)
        if(result === false)
        {
            throw new NOT_FOUND(`${_key} Not found`)
        }
        return result
    }

    set(_key:string, _value: string | number )
    {
        this.conf_driver.set(_key, _value)
    }
}