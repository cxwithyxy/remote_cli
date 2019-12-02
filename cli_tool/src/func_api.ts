import axios from "axios";
import { Log, Options, DownloadTarget, Wgdown } from "wgdown";
import { statSync } from "fs"
import ex_unzip from "extract-zip";

export async function net_get(url: string)
{
    return (await axios.get(url)).data
}


export function display_download_file_size(path: string, looptime: number, display_call: (current_size: number, stop_func?: () => void) => void ): () => void
{

    let running = true
    let handle: NodeJS.Timeout
    let last_size = 0

    function stop()
    {
        clearInterval(handle)
        running = false
    }
    
    handle = setInterval(() =>
    {
        if(running)
        {
            let size = 0
            try
            {
                size = statSync(path).size
            }
            catch(e){}
            if(last_size != size)
            {
                display_call(size)
                last_size = size
            }
            
        }
    }, looptime)

    return stop
}

export async function download_it(url: string, download_path:string)
{
    await new Promise(succ =>
    {
        let options = <Options>{}
        options.list = [<DownloadTarget>{serverPath: url, localPath: download_path}]
        options.cpus = 4
        options.errorLimit = 2
        options.quiet = true
        options.callback = (log: Log, errorList: Array<string>)=>{
            console.log("download finish");
            succ()
        }
        let wgdown: Wgdown = new Wgdown(options);
        wgdown.download();
    })
}

export async function unzip(source_path:string, unzip_to: string)
{
    await new Promise(succ => 
    {
        ex_unzip(source_path, <ex_unzip.Options>{dir:unzip_to},(err) =>
        {
            if(err)
            {
                console.log(err);
            }
            succ()
        })
    })
}