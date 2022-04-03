import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import User from "./user";

@Entity({ name: 'agreement' })
export default class Agreement {

    @PrimaryGeneratedColumn()
    agreementId: number;

    @Column()
    senderUserId: number;

    @ManyToOne(type => User, user => user.userId)
    @JoinColumn({ name: "senderUserId" })
    sender: User;

    @Column()
    receiverUserId: number;

    @ManyToOne(type => User, user => user.userId)
    @JoinColumn({ name: "receiverUserId" })
    receiver: User;

    @Column({nullable:true})
    lastCharge: Date;

    @Column({ nullable: true })
    intervalLength: number;

    @Column({ nullable: true })
    paymentAmount: number;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)", nullable: true })
    startTime: Date

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamptz", default: null, nullable: true })
    deletedAt: Date;

}


