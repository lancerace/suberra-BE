import { DeleteResult, getConnection, getRepository, UpdateResult } from "typeorm";
import { Agreement } from "../entities";
import WebSocket from 'ws';

async function getAgreements(): Promise<Agreement[]> {
    const agreements: Agreement[] = await getRepository(Agreement).createQueryBuilder('agreement')
        .select(['agreement.agreementId', 'agreement.paymentAmount', 'agreement.lastCharge', 'agreement.intervalLength', 'agreement.startTime'])
        .leftJoinAndSelect('agreement.receiver', 'receiver')
        .leftJoinAndSelect('agreement.sender', 'sender')
        .orderBy('agreement.agreementId', 'ASC').getMany();
    return agreements;

}

async function getAgreement(agreementId: number): Promise<Agreement> {
    const agreement: Agreement = await getRepository(Agreement).createQueryBuilder('agreement')
    .select(['agreement.agreementId AS "agreementId"','agreement.senderUserId AS "senderUserId"','agreement.receiverUserId AS "receiverUserId"',
    'agreement.lastCharge AS "lastCharge"','agreement.intervalLength AS "intervalLength"', 
    'agreement.paymentAmount as "paymentAmount"', 'agreement.startTime AS "startTime"'])
        .where('agreement.agreementId = :agreementId', { agreementId }).getRawOne();
    return agreement;
}

async function deleteAgreement(agreementId: number): Promise<boolean> {
    const result: DeleteResult = await getRepository(Agreement).createQueryBuilder('agreement')
        .softDelete().where('agreementId = :agreementId', { agreementId })
        .execute();
    return result.affected > 0 ? true : false;
}

async function createAgreement(receiverUserId, senderUserId, paymentAmount, intervalLength): Promise<Agreement> {
    const agreement: Agreement = await getRepository(Agreement).save({
        receiverUserId,
        senderUserId,
        paymentAmount,
        intervalLength
    });
    return agreement;
}

async function updateAgreement(agreementId: number, fields: { lastCharge: Date }): Promise<boolean> {

    const updatedAgreement: UpdateResult = await getConnection().createQueryBuilder().update(Agreement)
        .set({ ...fields }).where("agreementId = :agreementId", { agreementId }).execute();

    return (updatedAgreement.affected > 0) ? true : false;
}

async function automateRecurringPayment(agreement: Agreement, intervalInSeconds: number, wss: any) {
    const current = new Date();

    if (!agreement.paymentAmount || agreement.paymentAmount === 0 || !agreement.startTime)
        return;

    //first payment
    if (!agreement.lastCharge) {
        if (current > agreement.startTime) {
            await updateAgreement(agreement.agreementId, { lastCharge: current });
        }

        wss.clients.forEach(function each(client) {
                client.send(JSON.stringify({ message: `charged id ${agreement.agreementId}` }));
        });
        return;
    }

    //automate payment
    const lastCharge: Date = agreement.lastCharge;
    lastCharge.setSeconds(lastCharge.getSeconds() + intervalInSeconds);
    if (current > lastCharge) {
        //1. make payment
        //2. record payment done
        wss.clients.forEach(function each(client) {
                client.send(JSON.stringify({ message: `charged id ${agreement.agreementId}` }));
        });
        await updateAgreement(agreement.agreementId, { lastCharge: current });
        return;
    }

}

export default { automateRecurringPayment, createAgreement, getAgreements, getAgreement, deleteAgreement }