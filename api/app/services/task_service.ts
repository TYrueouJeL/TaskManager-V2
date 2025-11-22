import Task from '#models/task'
import { DateTime } from 'luxon'

type TaskCreatePayload = {
  title: string
  description: string
  completed?: boolean
  dueDate?: Date | DateTime | string | null
  isDaily?: boolean
  projectId?: string | null
  dependencies?: string[]
}

type TaskUpdatePayload = Partial<Omit<TaskCreatePayload, 'dependencies'>> & {
  dependencies?: string[]
}

export default class TaskService {
  private static normalizeDueDate(
    dueDate?: Date | DateTime | string | null
  ): DateTime | null | undefined {
    if (typeof dueDate === 'undefined') {
      return undefined
    }

    if (dueDate === null) {
      return null
    }

    if (DateTime.isDateTime(dueDate)) {
      return dueDate
    }

    if (dueDate instanceof Date) {
      return DateTime.fromJSDate(dueDate)
    }

    if (typeof dueDate === 'string') {
      const parsed = DateTime.fromISO(dueDate)
      return parsed.isValid ? parsed : null
    }

    return null
  }

  static async ensureNoCyclicDependency(taskId: string, dependencies: string[]) {
    for (const depId of dependencies) {
      if (depId === taskId) {
        throw new Error("Une tâche ne peut pas dépendre d'elle-même.")
      }

      const depTask = await Task.query()
        .where('id', depId)
        .preload('dependencies')
        .firstOrFail()

      const subDeps = depTask.dependencies.map((d) => d.id)

      if (subDeps.includes(taskId)) {
        throw new Error('Impossible de créer une dépendance circulaire.')
      }
    }
  }

  static async create(data: TaskCreatePayload) {
    const { dependencies = [], dueDate, ...taskData } = data
    const normalizedDueDate = this.normalizeDueDate(dueDate)

    const task = await Task.create({
      ...taskData,
      projectId: taskData.projectId ?? null,
      ...(typeof normalizedDueDate !== 'undefined' ? { dueDate: normalizedDueDate } : {}),
    })

    if (dependencies.length > 0) {
      await this.ensureNoCyclicDependency(task.id, dependencies)
      await task.related('dependencies').sync(dependencies)
    }

    await task.load('dependencies')

    return task
  }

  static async update(task: Task, data: TaskUpdatePayload) {
    const { dependencies, dueDate, ...taskData } = data
    const normalizedDueDate = this.normalizeDueDate(dueDate)

    task.merge({
      ...taskData,
      ...(typeof normalizedDueDate !== 'undefined' ? { dueDate: normalizedDueDate } : {}),
    })

    await task.save()

    if (typeof dependencies !== 'undefined') {
      await this.ensureNoCyclicDependency(task.id, dependencies)
      await task.related('dependencies').sync(dependencies)
    }

    await task.load('dependencies')

    return task
  }

  static async delete(task: Task) {
    await task.delete()
  }

  static async read(id: string) {
    const task = await Task.query()
      .where('id', id)
      .preload('dependencies')
      .firstOrFail()
    return task
  }

  static async index() {
    const tasks = await Task.query().preload('dependencies')
    return tasks
  }
}
