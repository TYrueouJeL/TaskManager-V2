import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import Project from './project.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  public completed: boolean = false

  @column()
  declare dueDate: DateTime | null

  @column()
  public isDaily: boolean = false

  @column()
  declare projectId: string

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @manyToMany(() => Task, {
    pivotTable: 'task_dependencies',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'task_id',
    pivotRelatedForeignKey: 'dependency_id',
  })
  declare dependencies: ManyToMany<typeof Task>

  @manyToMany(() => Task, {
    pivotTable: 'task_dependencies',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'dependency_id',
    pivotRelatedForeignKey: 'task_id',
  })
  declare dependents: ManyToMany<typeof Task>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateId(task: Task) {
    task.id = uuidv4()
  }
}