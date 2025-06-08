import { Sequelize } from 'sequelize-typescript'
import { envConfig } from '../config/envConfig'

const sequelize = new Sequelize({
    database: envConfig.dbName,
    username: envConfig.dbUsername,
    password: envConfig.dbPassword,
    host: envConfig.dbHost,
    dialect: "mysql",
    port: Number(envConfig.dbPort),
    models: [__dirname + '/models'] //
})

sequelize.authenticate()
    .then(() => {
        console.log("Successfully connected!")
    })
    .catch((e) => {
        console.log("Error", e)
    })

    export default sequelize

    //migration code goes here
    sequelize.sync({
        force: true
    }).then(()=>{
        console.log("Migrated successfully!")
    })