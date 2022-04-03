import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany} from "typeorm";



@Entity({ name: 'user' })
export default class User {

    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    fullName: string;

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)"})
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)"})
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamptz", default: null, nullable: true })
    deletedAt: Date;

}


