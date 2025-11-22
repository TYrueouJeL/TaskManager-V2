import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import { createTaskValidator, updateTaskValidator } from '#validators/task_validator'
import TaskService from '#services/task_service'

export default class TasksController {
    async index({ request }: HttpContext) {
        const tasks = await TaskService.index()
        return tasks
    }

    async create({ request }: HttpContext) {
        const payload = await request.validateUsing(createTaskValidator)
        const task = await TaskService.create(payload)
        return task 
    }

    async read({ params }: HttpContext) {
        const task = await TaskService.read(params.id)
        return task 
    }

    async update({ params, request }: HttpContext) {
        const payload = await request.validateUsing(updateTaskValidator)
        const task = await Task.findOrFail(params.id)
        return TaskService.update(task, payload)
    }

    async delete({ params }: HttpContext) {
        const task = await Task.findOrFail(params.id)
        await TaskService.delete(task)
        return task 
    }
}