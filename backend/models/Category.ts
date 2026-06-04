import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
