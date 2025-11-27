import prisma from "../database/prisma";
import { UserSchema, GetUserByIdSchema, GetUserByEmailSchema } from "../schemas/user.schema";
import { hashSync } from "bcrypt";

class UserService {

    async createUser(data: UserSchema){

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
    }

    async getUserById(data: GetUserByIdSchema){
        const user = await prisma.user.findUnique({
            where: { id: data.id }
        })

        if(!user){
            return null
        }

        return user
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

    async getAllUsers(){
        const users = await prisma.user.findMany()

        if(users.length === 0){
            return null
        }

        return users
    }

    async updateUser(idData: GetUserByIdSchema, updateData: UserSchema){
        const user = await prisma.user.update({
            where: { id: idData.id },
            data: { name: updateData.name, email: updateData.email, password: updateData.password }
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

    async checkIfUserExists(data: GetUserByIdSchema){
        const user = await prisma.user.findUnique({
            where: { id: data.id }
        })

        if(!user){
            return null
        }

        return user
    }
}

const userService = new UserService();

export default userService;