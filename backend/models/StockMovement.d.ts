import { Product } from "./Product";
import { User } from "./User";
export declare enum MovementType {
    IN = "IN",
    OUT = "OUT"
}
export declare class StockMovement {
    id: number;
    type: MovementType;
    quantity: number;
    reason: string;
    product: Product;
    user: User;
    createdAt: Date;
}
//# sourceMappingURL=StockMovement.d.ts.map