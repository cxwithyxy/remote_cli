import pathExists from "path-exists";
import { net_get, download_it, display_download_file_size } from "./src/func_api";
import { unlinkSync } from "fs";

(async () =>
{
    let has_exe = await pathExists(`${__dirname}/../terminal_http_api/terminal_http_api.exe`)
    let has_node_modules = await pathExists(`${__dirname}/../terminal_http_api/node_modules/`)
    // console.log(has_exe);
    // console.log(has_node_modules);

    if(!(has_exe && has_node_modules))
    {
        let terminal_http_api_zip_path = `${__dirname}/../terminal_http_api.zip`
        if(await pathExists(terminal_http_api_zip_path))
        {
            unlinkSync(terminal_http_api_zip_path)
        }
        console.log("# terminal_http_api EXE NOT FOUND");
        console.log("# download terminal_http_api EXE now");
        let all_releases = await net_get("https://api.github.com/repos/cxwithyxy/terminal_http_api/releases/latest")
        let latest_release = await net_get(all_releases.assets_url)
        console.log(latest_release[0].browser_download_url)
        let stop_display_dl = display_download_file_size(terminal_http_api_zip_path, 300, (now_size) =>
        {
            // console.log(`${now_size}/${latest_release[0].size}`);
            let p = (now_size/83614240 /* latest_release[0].size */ * 100).toFixed(2)
            console.log(`${p}%`);
            
        })
        await download_it(/* latest_release[0].browser_download_url */"https://qd.myapp.com/myapp/qqteam/pcqq/PCQQ2019.exe", terminal_http_api_zip_path)
        stop_display_dl()
    }
})()
