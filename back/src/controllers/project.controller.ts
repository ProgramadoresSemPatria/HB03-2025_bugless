import { Request, Response } from "express";
import { createProjectSchema, projectIdSchema, updateProjectSchema } from "../schemas/project.schema";
import projectService from "../services/project.service";
import userService from "../services/user.service";
import { ZodError, flattenError } from "zod";
import HttpHelper from "../utils/http-helper";
import { getUserByIdSchema } from "../schemas/user.schema";

class ProjectController {

    async createProject(req: Request, res: Response){
        try {
            const dataProject = createProjectSchema.parse(req.body);

            const user = await userService.getUserById(dataProject.userId);
            if (!user) {
                return HttpHelper.notFound(res, "User not found");
            }

            const projectExists = await projectService.checkIfProjectExists(dataProject);

            if (projectExists) {
                return HttpHelper.conflict(res, "Project already exists");
            }

            const project = await projectService.createProject(dataProject);
            return HttpHelper.created(res, project, "Project created successfully");    
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            console.error("Error creating project:", error);
            return HttpHelper.serverError(res);
        }
    }

    async listAllProjectsByUserId(req: Request, res: Response){
        try {
            const dataUserId = getUserByIdSchema.parse(req.params);

            const user = await userService.getUserById(dataUserId.id);
            if (!user) {
                return HttpHelper.notFound(res, "User not found");
            }

            const projects = await projectService.getAllProjectsByUserId(dataUserId);

            if (projects.length === 0) {
                return HttpHelper.notFound(res, "Projects not found");
            }

            return HttpHelper.success(res, projects, "Projects fetched successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            console.error("Error listing projects:", error);
            return HttpHelper.serverError(res);
        }
    }

    async getProjectById(req: Request, res: Response) {
        try {
            const dataProjectId = projectIdSchema.parse(req.params);
            
            const project = await projectService.getProjectById(dataProjectId);

            if (!project) {
                return HttpHelper.notFound(res, "Project not found");
            }

            return HttpHelper.success(res, project, "Project fetched successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            console.error("Error fetching project:", error);
            return HttpHelper.serverError(res);
        }
    }

    async updateProjectById(req: Request, res: Response) {
        try {
            const dataProjectId = projectIdSchema.parse(req.params);
            const dataProject = updateProjectSchema.parse(req.body);
            const existingProject = await projectService.getProjectById(dataProjectId);

            if (!existingProject) {
                return HttpHelper.notFound(res, "Project not found");
            }

            const project = await projectService.updateProject(dataProjectId, dataProject);
            return HttpHelper.success(res, project, "Project updated successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            console.error("Error updating project:", error);
            return HttpHelper.serverError(res);
        }
    }

    async deleteProjectById(req: Request, res: Response) {
        try {
            const dataProjectId = projectIdSchema.parse(req.params);
            const project = await projectService.deleteProject(dataProjectId);
        
        if (!project) {
            return HttpHelper.notFound(res, "Project not found");
        }

        return HttpHelper.success(res, project, "Project deleted successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            console.error("Error deleting project:", error);
            return HttpHelper.serverError(res);
        }
    }

}

const projectController = new ProjectController();

export default projectController;