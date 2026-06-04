"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../config/data-source");
const User_1 = require("../models/User");
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Cet email est déjà utilisé." });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "user"
        });
        await userRepository.save(newUser);
        res.status(201).json({ message: "Utilisateur créé avec succès." });
    }
    catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Identifiants invalides." });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Identifiants invalides." });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
    }
    catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map