import vine from '@vinejs/vine'

export const createProjectValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3),
    description: vine.string(),
    userId: vine.string().uuid(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).optional(),
    description: vine.string().optional(),
    userId: vine.string().uuid().optional(),
  })
)