import { Client } from "./connection/Client";
import { Server } from "./connection/Server";

import { app } from "electron";

app.on("ready", async() =>
{
    let c1 = new Client("mysaa")
    let s1 = new Server("mysaa")
    c1.set_password("cx",2)
    c1.on_resv = () => {}
    await s1.start()
    await c1.start()
    c1.send("222")
})