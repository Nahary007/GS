import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("suppliers")
export class Supplier {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 150 })
    name!: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    email!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone!: string;

    @Column({ type: "text", nullable: true })
    address!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
