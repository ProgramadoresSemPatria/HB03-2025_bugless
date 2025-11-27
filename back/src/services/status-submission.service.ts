import prisma from "../database/prisma";
import { StatusSubmissionSchema } from "../schemas/status-submission.schema";


class StatusSubmissionService {

    async createStatusSubmission(data: StatusSubmissionSchema){
        const statusSubmission = await prisma.statusSubmission.create({
            data: {
                name: data.name
            }
        })

        if (!statusSubmission) {
            return null;
        }

        return statusSubmission;
    }


    async getAllStatusSubmissions(){
        const statusSubmissions = await prisma.statusSubmission.findMany();

        if (!statusSubmissions) {
            return null;
        }

        return statusSubmissions;
    }

    async getStatusSubmissionById(id: string){
        const statusSubmission = await prisma.statusSubmission.findUnique({
            where: { id }
        });

        if (!statusSubmission) {
            return null;
        }

        return statusSubmission;
    }

    async updateStatusSubmission(id: string, data: StatusSubmissionSchema){
        const statusSubmission = await prisma.statusSubmission.update({
            where: { id },
            data: { name: data.name }
        });

        if (!statusSubmission) {
            return null;
        }

        return statusSubmission;
    }

    async deleteStatusSubmission(id: string){
        const statusSubmission = await prisma.statusSubmission.delete({
            where: { id }
        });

        if (!statusSubmission) {
            return null;
        }
        return statusSubmission;
    }


    async checkIfStatusSubmissionExists(data: StatusSubmissionSchema){
        const statusSubmission = await prisma.statusSubmission.findFirst({
            where: { name: data.name }
        });

        if (!statusSubmission) {
            return false;
        }

        return true;
    }

}

const statusSubmissionService = new StatusSubmissionService();

export default statusSubmissionService;