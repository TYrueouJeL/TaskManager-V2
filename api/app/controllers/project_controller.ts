import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { createProjectValidator, updateProjectValidator } from '#validators/project_validator'
import ProjectService from '#services/project_service'

export default class ProjectController {
    async index({ request }: HttpContext) {
        const projects = await ProjectService.index()
        return projects
    }

    async create({ request }: HttpContext) {
        const payload = await request.validateUsing(createProjectValidator)
        const project = await ProjectService.create({
            title: payload.name,
            description: payload.description,
            userId: payload.userId,
        })
        return project
    }

    async read({ params }: HttpContext) {
        const project = await ProjectService.read(params.id)
        return project
    }

    async update({ params, request }: HttpContext) {
        const payload = await request.validateUsing(updateProjectValidator)
        const project = await Project.findOrFail(params.id)
        const updateData = {
            ...(payload.name ? { title: payload.name } : {}),
            ...(payload.description ? { description: payload.description } : {}),
            ...(payload.userId ? { userId: payload.userId } : {}),
        }
        return ProjectService.update(project, updateData)
    }

    async delete({ params }: HttpContext) {
        const project = await Project.findOrFail(params.id)
        return ProjectService.delete(project)
        return project
    }
}