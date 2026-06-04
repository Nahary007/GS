import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

export enum MovementType {
    IN = "IN",
    OUT = "OUT"
}

@Entity("stock_movements")
export class StockMovement {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: MovementType,
    })
    type!: MovementType;

    @Column({ type: "int" })
    quantity!: number;

    @Column({ type: "varchar", nullable: true })
    reason!: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    product!: Product;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;
}
