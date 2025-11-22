import vine from '@vinejs/vine'

export const createTaskValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3),
    description: vine.string(),
    completed: vine.boolean().optional(),
    dueDate: vine.date().optional(),
    isDaily: vine.boolean().optional(),
    projectId: vine.string().uuid().optional().nullable(),
    dependencies: vine.array(vine.string().uuid()).optional(),
  })
)

export const updateTaskValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).optional(),
    description: vine.string().optional(),
    completed: vine.boolean().optional(),
    dueDate: vine.date().optional(),
    isDaily: vine.boolean().optional(),
    projectId: vine.string().uuid().optional().nullable(),
    dependencies: vine.array(vine.string().uuid()).optional(),
  })
)