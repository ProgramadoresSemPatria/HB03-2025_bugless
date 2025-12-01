import { Request, Response } from "express";
import projectService from "../services/project.service";

class ProjectController {
   async create(req: Request, res: Response) {
    const { name, description, userId } = req.body;

    const project = await projectService.createProject({
      name,
      description,
      userId,
    });

    return res.json(project);
  }

  async getAllProject(req: Request, res: Response){
    const projects = await projectService.getAllProject();
    res.status(200).json(projects);
  }

    async update(req: Request, res: Response){
       const id = req.params.id as string;
        const {name, description} = req.body;

        const project = await projectService.updateProject({
            id,
            name,
            description,
        });
        return res.json(project);
    }

    async delete(req: Request, res: Response){
       const id = req.params.id as string;
        const msg = await projectService.deleteProject(id);

        return res.json(msg);
    }
}

export default new ProjectController();