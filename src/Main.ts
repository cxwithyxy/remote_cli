import { Client } from "./connection/Client";
import { Server } from "./connection/Server";
import { app } from "electron";
import { Main_ui } from "./Main_ui";


app.on("ready", async() =>
{
    let m_ui = new Main_ui()
    await m_ui.init_win()
    
    // let c1 = new Client("mysaa")
    // let s1 = new Server("mysaa")
    // c1.set_password("cx",2)
    // await s1.start()
    // await c1.start()
    // c1.send("dir")
})