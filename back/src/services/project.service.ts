import prisma from "../database/prisma";

interface ProjectRequest {
    name: string;
    description?: string;
    userId: string;
}

interface UpdateProjectRequest {
    id: string;
    name?: string;
    description?: string;
}

class ProjectService {
    async createProject({ name, description, userId }: ProjectRequest) {
        if (!name || !userId) {
        throw new Error("Project name and userID are required!");
        }

        const project = await prisma.project.create({
        data: {
            name,
            description,
            userId,
        },
        });
        return project;
    }

    async getAllProject (){
        const project = await prisma.project.findMany();

        return project
    }

    async updateProject ({id, name, description}: UpdateProjectRequest) {
        const project = await prisma.project.update({
            where: {id},
            data: {
                name,
                description,
            },
        });
        return  project
    }

    async deleteProject(id: string) {
        await prisma.project.delete({
            where: {id},
        });
        return {message: "Project successfully deleted!"}
    }
}

export default new ProjectService();


