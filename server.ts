import app from "./src/app";
import { envConfig } from "./src/config/envConfig";

//database connection import
import "./src/database/connection"

//User model creation
import "./src/database/models/userModel";

function startServer() {
    const port = Number(envConfig.portNumber)
    app.listen(port, function () {
        console.log(`Server has started successfully ${port}`)
    })
}

startServer()