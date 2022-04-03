require('dotenv').config();
import "reflect-metadata";//typeorm 
import { json, urlencoded } from "body-parser";
import cors from 'cors';
import express from 'express';
import logger from './utils/logger';
import MainController from "./controllers";
import { createConnection } from 'typeorm';
import { AgreementService } from "./services";
import { Agreement } from "./entities";
import http from 'http';
import WebSocket from 'ws';
var CronJob = require('cron').CronJob;

const app = express()
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(cors());
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });
server.listen(process.env.PORT || 4200, async () => {
    logger.info(`Server started at PORT ${process.env.PORT} in ${process.env.NODE_ENV}`);
    createConnection().then(async connection => {
        logger.info(`connection synched`);

        new CronJob('*/10 * * * * *', async () => {
            //console.log("run every 10 secs");
            const agreements: Agreement[] = await AgreementService.getAgreements();

            for (var i = 0; i < agreements.length; i++) {
                await AgreementService.automateRecurringPayment(agreements[i], agreements[i].intervalLength,wss);
            }
        }, null, true, 'Asia/Singapore');

    }).catch(error => logger.error(`[connection error]: ${error}`));
});




app.locals.wss = wss;
wss.on('connection', (ws) => {
    //connection is up
    ws.on('message', (message: string) => {
        //log the received message and send it back to the client
    });
});


app.use("/api", MainController);