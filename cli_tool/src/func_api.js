"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const wgdown_1 = require("wgdown");
const fs_1 = require("fs");
const extract_zip_1 = __importDefault(require("extract-zip"));
async function net_get(url) {
    return (await axios_1.default.get(url)).data;
}
exports.net_get = net_get;
function display_download_file_size(path, looptime, display_call) {
    let running = true;
    let handle;
    let last_size = 0;
    function stop() {
        clearInterval(handle);
        running = false;
    }
    handle = setInterval(() => {
        if (running) {
            let size = 0;
            try {
                size = fs_1.statSync(path).size;
            }
            catch (e) { }
            if (last_size != size) {
                display_call(size);
                last_size = size;
            }
        }
    }, looptime);
    return stop;
}
exports.display_download_file_size = display_download_file_size;
async function download_it(url, download_path) {
    await new Promise(succ => {
        let options = {};
        options.list = [{ serverPath: url, localPath: download_path }];
        options.cpus = 4;
        options.errorLimit = 2;
        options.quiet = true;
        options.callback = (log, errorList) => {
            console.log("download finish");
            succ();
        };
        let wgdown = new wgdown_1.Wgdown(options);
        wgdown.download();
    });
}
exports.download_it = download_it;
async function unzip(source_path, unzip_to) {
    await new Promise(succ => {
        extract_zip_1.default(source_path, { dir: unzip_to }, (err) => {
            if (err) {
                console.log(err);
            }
            succ();
        });
    });
}
exports.unzip = unzip;
