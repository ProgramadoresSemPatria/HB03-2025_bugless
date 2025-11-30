import prisma from "../database/prisma";
import { CreateProjectSchema, ProjectIdSchema, UpdateProjectSchema } from "../schemas/project.schema";
import { GetUserByIdSchema } from "../schemas/user.schema";

class ProjectService {
    async createProject(data: CreateProjectSchema) {
        return await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                userId: data.userId,
                repositoryUrl: data.repositoryUrl,
                repositoryPath: data.repositoryPath,
                language: data.language,
                customInstructions: data.customInstructions,
            }
        });
    }

    async getProjectById(projectId: ProjectIdSchema) {
        return await prisma.project.findUnique({
            where: { id: projectId.id }
        });
    }

    async getAllProjectsByUserId(idUser: GetUserByIdSchema) {
        return await prisma.project.findMany({
            where: {
                userId: idUser.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async updateProject(projectId: ProjectIdSchema, dataProject: UpdateProjectSchema) {
        const project = await prisma.project.update({
            where: { id: projectId.id },
            data: {
                ...dataProject,
                updatedAt: new Date(),
            }
        });

        if(!project){
            return null
        }

        return project
    }

    async checkIfProjectExists(data: CreateProjectSchema) {
        const count = await prisma.project.count({
            where: {
                name: data.name,
                userId: data.userId
            }
        });
        return count > 0;
    }

    async deleteProject(projectId: ProjectIdSchema) {
        const project = await prisma.project.delete({
            where: { id: projectId.id }
        });

        if(!project){
            return null
        }

        return project
    }
}

const projectService = new ProjectService();

export default projectService;