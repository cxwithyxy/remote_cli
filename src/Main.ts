import { Client } from "./connection/Client";
import { Server } from "./connection/Server";

import { app } from "electron";

app.on("ready", async() =>
{
    let c1 = new Client("mysaa")
    let s1 = new Server("mysaa")
    c1.set_password("cx",2)
    await s1.start()
    await c1.start()
    setInterval(() =>
    {
        c1.send(String(Date.now() + Math.random()* 1e10))
    },1e3)
})