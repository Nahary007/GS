import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Cet email est déjà utilisé." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        await userRepository.save(newUser);
        res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Identifiants invalides." });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Identifiants invalides." });
            return;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
