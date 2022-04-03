
import express from 'express';
import { IAgreement } from '../interfaces/agreement';
import { AgreementService, UserService } from '../services';
import { DBErrorHandling } from '../utils/db';
import { Agreement, User } from "../entities";
import WebSocket from 'ws';
const router: express.Router = express.Router();


router.get('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const agreement: Agreement = await AgreementService.getAgreement(id);

        req.app.locals.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ message: `GET /api/agreements/:id, id ${agreement.agreementId}` }));
            }
        });


        return res.json({ success: true, agreement: agreement || {} });
    } catch (err) {
        res.status(500).send({ success: false, message: await DBErrorHandling(err), agreement: null })
    }
})

router.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const agreements: Agreement[] = await AgreementService.getAgreements();

        req.app.locals.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ message: `GET /api/agreements` }));
            }
        });

        return res.json({ success: true, agreements: agreements || [] });
    } catch (err) {
        res.status(500).send({ success: false, message: await DBErrorHandling(err), agreements: null })
    }
})

router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const data: IAgreement = req.body;

        //1. check if sender and receiver exist
        const users: User[] = await UserService.getUsers([data.senderUserId, data.receiverUserId]);
        if (users.filter(u => u.userId === data.senderUserId).length < 1)
            return res.status(400).send({ success: false, message: "sender does not exist" })

        if (users.filter(u => u.userId === data.receiverUserId).length < 1)
            return res.status(400).send({ success: false, message: "receiver does not exist" })

        //2. create agreement
        const agreement: Agreement = await AgreementService.createAgreement(data.receiverUserId, data.senderUserId, data.paymentAmount, data.intervalLength);

        req.app.locals.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ message: `POST /api/agreements, id:${agreement.agreementId}` }));
            }
        });


        (agreement) ? res.json({ success: true }) : res.json({ success: false });
    } catch (err) {
        res.status(500).send({ success: false, message: await DBErrorHandling(err) })
    }
})

router.delete('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        //1. check if agreement exist
        const agreement: Agreement = await AgreementService.getAgreement(id);
        if (!agreement)
            return res.status(400).send({ success: false, message: "agreement does not exist" })

        //2. delete agreement
        const deleteResult: boolean = await AgreementService.deleteAgreement(id);


        req.app.locals.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ message: `DELETE /api/agreements, id:${agreement.agreementId}` }));
            }
        });

        return res.json({ success: deleteResult });
    } catch (err) {
        res.status(500).send({ success: false, message: await DBErrorHandling(err) })
    }
})



export default router;