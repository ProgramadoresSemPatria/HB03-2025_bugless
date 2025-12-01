import { Request, response, Response } from "express";

import planService from "../services/plan.service";
import projectService from "../services/project.service";
import { ms } from "zod/v4/locales";

class PlanController {
    async create(req: Request, res: Response) {
        const {name, price, requestPerDay, allowPrivateRepo, privacyMode, statusPlanId} = req.body;

        const plan = await planService.createPlan({
            name, 
            price, 
            requestPerDay, 
            allowPrivateRepo, 
            privacyMode, 
            statusPlanId
        });
        return res.json(plan)
    }

    async getAllPlan (req: Request, res: Response){
        const plan = await planService.getAllPlan();
        res.status(200).json(plan);
    }

    async update(req: Request, res: Response){
        const {id} = req.params;
        const {
            name,
            price, 
            requestPerDay, 
            allowPrivateRepo, 
            privacyMode, 
            statusPlanId} = req.body;

        const plan = await planService.updatePlan({
            id,
            name,
            price, 
            requestPerDay, 
            allowPrivateRepo, 
            privacyMode, 
            statusPlanId
        })
        return res.json(plan);
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id as string;
        const msg = await planService.deletePlan(id);
        
        return res.json(msg);
    }
}

export default new PlanController();
