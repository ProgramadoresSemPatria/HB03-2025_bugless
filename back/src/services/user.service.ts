import prisma from "../database/prisma";
import { UserSchema, GetUserByIdSchema, GetUserByEmailSchema } from "../schemas/user.schema";
import { hashSync } from "bcrypt";

class UserService {

    async createUser(data: UserSchema){
        try {
            const hashSalt = 10
            const hashedPassword = hashSync(data.password, hashSalt)

            const user = await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword
                }
            })

            if(!user){
                return null
            }

            return user
        } catch (error) {
            console.error("Error in createUser service:", error);
            throw error;
        }
    }

    async getUserByEmail(data: GetUserByEmailSchema){
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if(!user){
            return null
        }

        return user
    }

    async updateUser(data: GetUserByIdSchema, updateData: UserSchema){
        const hashSalt = 10
        const hashedPassword = hashSync(updateData.password, hashSalt)

        const user = await prisma.user.update({
            where: { id: data.id },
            data: { 
                name: updateData.name, 
                email: updateData.email, 
                password: hashedPassword 
            }
        })

        if(!user){
            return null
        }

        return user
    }
    
    async deleteUser(data: GetUserByIdSchema){
        const user = await prisma.user.delete({
            where: { id: data.id }
        })

        if(!user){
            return null
        }

        return user
    }

    async checkIfUserExistsByEmail(data: UserSchema){
        const user = await prisma.user.findFirst({
            where: { email: data.email }
        })

        if (!user) {
            return false;
        }

        return true;
    }

    async getUserById(id: string){
        const user = await prisma.user.findUnique({
            where: { id }
        })

        if(!user){
            return null
        }

        return user
    }
}

const userService = new UserService();

export default userService;