import prisma from "../database/prisma";
import { CreateProjectSchema } from "../schemas/project.schema";
import { GetUserByIdSchema } from "../schemas/user.schema";

class ProjectService {

    async createProject(data: CreateProjectSchema){
        const project = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                userId: data.userId,
                repositoryUrl: data.repositoryUrl,
                repositoryPath: data.repositoryPath,
                language: data.language,
                customInstructions: data.customInstructions,
            }
        })

        if(!project){
            return null
        }

        return project
    }

    async checkIfProjectExists(data: CreateProjectSchema){
        const count = await prisma.project.count({
            where: {
                name: data.name,
                userId: data.userId
            }
        });

        return count > 0;
    }

    async getAllProjectsByUserId(idUser: GetUserByIdSchema){

        const projects = await prisma.project.findMany({
            where: {
                userId: idUser.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if(projects.length === 0){
            return null
        }

        return projects

    }

}

const projectService = new ProjectService();

export default projectService;