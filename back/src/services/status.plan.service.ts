import prisma from "../database/prisma";

interface CreateStatusRequest {
  name: string;
}

interface UpdateStatusRequest {
  id: string;
  name: string;
}

interface DeleteStatusRequest {
  id: string;
}

class StatusPlanService {
  async createStatusPlan({ name }: CreateStatusRequest) {
    if (!name) {
      throw new Error("The plan name is mandatory!");
    }

    const statusPlan = await prisma.statusPlan.create({
      data: { name },
    });

    return statusPlan;
  }

  async updateStatusPlan({ id, name }: UpdateStatusRequest) {
    const statusPlan = await prisma.statusPlan.update({
      where: { id },
      data: { name },
    });

    return statusPlan;
  }

  async getAllStatusPlan (){
    const statusPlan = await prisma.statusPlan.findMany();

    return statusPlan
  }

  async deleteStatusPlan({ id }: DeleteStatusRequest) {
    await prisma.statusPlan.delete({
      where: { id },
    });

    return { message: "StatusPlan successfully deleted!" };
  }
}

export default new StatusPlanService();