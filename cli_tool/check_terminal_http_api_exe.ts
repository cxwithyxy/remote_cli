import pathExists from "path-exists";

(async () =>
{
    let has_exe = await pathExists(`${__dirname}/../terminal_http_api/terminal_http_api.exe`)
    let has_node_modules = await pathExists(`${__dirname}/../terminal_http_api/node_modules/`)
    console.log(has_exe);
    console.log(has_node_modules);
})()
