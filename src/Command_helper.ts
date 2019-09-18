import _ from "lodash"
import { isUndefined } from "util"

class COMMAND_NO_FOUND extends Error{}

interface command_base
{
    name: string
    argus: string[]
}

interface func_dict
{
    [propName: string]: (...argus: any[]) => string
}

export class Command_helper
{
    function_dict: func_dict
    
    constructor()
    {
        this.function_dict = {}
    }

    add_func(key: string, _func: (...argus: any[]) => string)
    {
        _.set(this.function_dict, key, _func)
    }

    get_command_base(command: string): command_base
    {
        let temp_list = command.split(" ")
        return {
            name: <string>temp_list.shift(),
            argus: temp_list
        }
    }

    run(command: string): string
    {
        let command_b = this.get_command_base(command)
        let func = _.get(this.function_dict, command_b.name)
        if(isUndefined(func))
        {
            throw new COMMAND_NO_FOUND(`there is not command name "${command_b.name}"`)
        }
        return func(...command_b.argus)
    }
}