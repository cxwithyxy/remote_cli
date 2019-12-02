import pathExists from "path-exists";
import axios from "axios";

async function net_get(url: string)
{
    return (await axios.get(url)).data
}

(async () =>
{
    let has_exe = await pathExists(`${__dirname}/../terminal_http_api/terminal_http_api.exe`)
    let has_node_modules = await pathExists(`${__dirname}/../terminal_http_api/node_modules/`)
    // console.log(has_exe);
    // console.log(has_node_modules);

    if(!(has_exe && has_node_modules))
    {
        console.log("terminal_http_api EXE NOT FOUND");
        console.log("download terminal_http_api EXE now");
        let all_releases = await net_get("https://api.github.com/repos/cxwithyxy/terminal_http_api/releases/latest")
        let latest_release = await net_get(all_releases.assets_url)
        console.log(latest_release[0].browser_download_url)
        
        
    }
})()
