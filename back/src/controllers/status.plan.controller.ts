import { Request, response, Response } from "express";
import StatusPlanService from "../services/status.plan.service";
import { request } from "http";

class StatusPlanController{
    async create(req: Request, res: Response) {
    const { name } = req.body;

    const status = await StatusPlanService.createStatusPlan({ name });

    return res.json(status);
  }

 async getAllStatusPlan(req: Request, res: Response){ 
        try {
            const statusPlan = await StatusPlanService.getAllStatusPlan();
            return res.status(200).json(statusPlan); 
            
        } catch (error: any) {
            console.error("Error retrieving status plans:", error);
            return res.status(500).json({ error: "Failed to retrieve status plans." });
        }
    }
  async update (req: Request, res: Response) {
   const id = req.params.id as string;
    const {name} = req.body;

    const status = await StatusPlanService.updateStatusPlan({
        id,
        name
    });
    return res.json(status);
  }

  async delete(req: Request, res: Response){
   const id = req.params.id as string;
    const msg = await StatusPlanService.deleteStatusPlan({id});
    return res.json(msg)
  }
}

export default new StatusPlanController();