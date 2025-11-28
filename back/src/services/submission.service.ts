import prisma from "../database/prisma";
import { CreateSubmissionSchema, SubmissionIdRule } from "../schemas/submission.schema";
import { StatusSubmissionEnum, SubmissionModeEnum } from "../generated/prisma/enums";

class SubmissionService {
    async createSubmission(data: CreateSubmissionSchema) {

        const pendingStatus = await prisma.statusSubmission.findFirstOrThrow({
            where: { name: StatusSubmissionEnum.PENDING }
        });

        const submission = await prisma.submission.create({
            data: {
                codeContent: data.codeContent,
                submissionMode: data.submissionMode as SubmissionModeEnum,
                user: { connect: { id: data.userId } },
                project: { connect: { id: data.projectId } },
                statusSubmission: { connect: { id: pendingStatus.id } }
            }   
        });

        return submission;
    }

    async getSubmissionById(submissionData: SubmissionIdRule){
        const submission = await prisma.submission.findUnique({
            where: { id: submissionData }
        });

        if (!submission) {
            return null;
        }

        const statusSubmission = await prisma.statusSubmission.findUnique({
            where: { id: submission.statusSubmissionId }, select: { name: true }
        });

        if (!statusSubmission) {
            return null;
        }

        const { statusSubmissionId, ...submissionWithoutStatus } = submission;

        const submissionResponse = {
            ...submissionWithoutStatus,
            statusSubmission: statusSubmission.name
        }

        return submissionResponse;
    }
}

export default new SubmissionService();
