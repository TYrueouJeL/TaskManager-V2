import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'

import Project from '#models/project'
import User from '#models/user'
import ProjectService from '#services/project_service'

const createUser = () =>
  User.create({
    fullName: 'Test User',
    email: `${randomUUID()}@example.com`,
    password: 'secret',
  })

test.group('ProjectService', (group) => {
  group.each.setup(async () => {
    await Project.query().delete()
    await User.query().delete()
  })

  test('création d’un projet', async ({ assert }) => {
    const user = await createUser()

    const project = await ProjectService.create({
      title: 'Mon projet',
      description: 'Description de mon projet',
      userId: user.id,
    })

    assert.exists(project.id)
    assert.equal(project.title, 'Mon projet')
    assert.equal(project.userId, user.id)
  })

  test('mise à jour d’un projet', async ({ assert }) => {
    const user = await createUser()
    const project = await ProjectService.create({
      title: 'Avant',
      description: 'Ancienne description',
      userId: user.id,
    })

    const updated = await ProjectService.update(project, {
      title: 'Après',
      description: 'Nouvelle description',
    })

    assert.equal(updated.title, 'Après')
    assert.equal(updated.description, 'Nouvelle description')
  })

  test('lecture et suppression d’un projet', async ({ assert }) => {
    const user = await createUser()
    const project = await ProjectService.create({
      title: 'A supprimer',
      description: 'Description',
      userId: user.id,
    })

    const read = await ProjectService.read(project.id)
    assert.equal(read.id, project.id)

    await ProjectService.delete(project)
    const exists = await Project.find(project.id)
    assert.isNull(exists)
  })
})

