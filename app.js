import express from "express"
import config from "config"
import mongoose from "mongoose";
import router from "./routes/auth.routes.js"
import LinkRouter from "./routes/link.routes.js"
import RedirectRoutes from "./routes/redirect.routes.js"
import  path from "path";

const app = express()
app.use(express.json({extended:true}))

app.use("/api/auth", router)
app.use("/api/link",LinkRouter)
app.use("/t", RedirectRoutes)

if(process.env.NODE_ENV === "production"){
    app.use("/",express.static(path.join(__dirname,"client","build")))
    app.get("*",(req, res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const PORT = config.get("port") || 5000

async function start() {
    try {
        await mongoose.connect(config.get("mongoUri"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log("Server Error", e.message)
        process.exit(1)
    }
}

start()

