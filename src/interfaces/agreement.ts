
export interface IAgreement {
    receiverUserId: number;
    senderUserId: number;
    intervalLength: number;
    paymentAmount: number;
    startTime: Date;
}