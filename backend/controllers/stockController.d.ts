import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
export declare const getAllMovements: (req: Request, res: Response) => Promise<void>;
export declare const createMovement: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=stockController.d.ts.map