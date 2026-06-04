import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./Category";
import { Supplier } from "./Supplier";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 150 })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number;

    @Column({ type: "int", default: 0 })
    quantity!: number;

    @Column({ type: "int", default: 10 }) // Alert threshold
    minQuantity!: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: "categoryId" })
    category!: Category;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: "supplierId" })
    supplier!: Supplier;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
