import { Request, Response } from 'express';
import userService from '../services/user.service';

class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            const exists = await userService.checkIfUserExistsByEmail(userData);
            if (exists) {
                return res.status(409).json({ error: "User with this email already exists." });
            }

            const user = await userService.createUser(userData);
            
            return res.status(201).json(user);
        } catch (error: any) {
            console.error("Error in createUser controller:", error);
            return res.status(400).json({ error: error.message || "Failed to create user." });
        }
    }

    async getAllUsers(req: Request, res: Response){
        try {
            const users = await userService.getAllUsers(); 
            return res.status(200).json(users);
        } catch (error: any) {
            console.error("Error in getAllUsers controller:", error);
            return res.status(500).json({ error: "Failed to retrieve user list." });
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        try {
            const email = req.query.email as string; 
            
            if (!email) {
                return res.status(400).json({ error: "Email parameter is required (e.g., /getEmail?email=test@example.com)." });
            }
            
            const user = await userService.getUserByEmail({ email });
            
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            return res.status(200).json(user);
        } catch (error: any) {
            console.error("Error in getUserByEmail controller:", error);
            return res.status(500).json({ error: "Failed to retrieve user." });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params; 
            const updateData = req.body; 
            
            if (!id) {
                return res.status(400).json({ error: "User ID is required for update." });
            }

            const user = await userService.updateUser({ id }, updateData);
            
            return res.status(200).json(user);
        } catch (error: any) {
            console.error("Error in updateUser controller:", error);
           
            return res.status(404).json({ error: "User not found or update failed." });
        }
    }
    
    async deleteUser(req: Request, res: Response) {
        try {
            
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({ error: "User ID is required for deletion." });
            }
            
            await userService.deleteUser({ id });
            
            return res.status(204).send(); 
        } catch (error: any) {
            console.error("Error in deleteUser controller:", error);
            return res.status(404).json({ error: "User not found or deletion failed." });
        }
    }
}

export default new UserController();