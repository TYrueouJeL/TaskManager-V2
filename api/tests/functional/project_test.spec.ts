import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'

import Project from '#models/project'
import User from '#models/user'

const createUser = () =>
  User.create({
    fullName: 'Test User',
    email: `${randomUUID()}@example.com`,
    password: 'secret',
  })

test.group('ProjectsController', (group) => {
  group.each.setup(async () => {
    await Project.query().delete()
    await User.query().delete()
  })

  test('POST /projects → crée un projet', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client.post('/projects').json({
      name: 'Nouveau projet',
      description: 'Description du projet',
      userId: user.id,
    })

    response.assertStatus(200)
    assert.equal(response.body().title, 'Nouveau projet')
    assert.equal(response.body().userId, user.id)
  })

  test('GET /projects → liste les projets', async ({ client, assert }) => {
    const user = await createUser()
    await Project.create({ title: 'Projet A', description: 'Desc', userId: user.id })
    await Project.create({ title: 'Projet B', description: 'Desc', userId: user.id })

    const response = await client.get('/projects')

    response.assertStatus(200)
    assert.equal(response.body().length, 2)
  })

  test('PUT /projects/:id → met à jour un projet', async ({ client, assert }) => {
    const user = await createUser()
    const project = await Project.create({ title: 'Avant', description: 'Desc', userId: user.id })

    const response = await client.put(`/projects/${project.id}`).json({
      name: 'Après',
      description: 'Nouvelle description',
    })

    response.assertStatus(200)
    assert.equal(response.body().title, 'Après')
    assert.equal(response.body().description, 'Nouvelle description')
  })

  test('DELETE /projects/:id → supprime un projet', async ({ client, assert }) => {
    const user = await createUser()
    const project = await Project.create({ title: 'A supprimer', description: 'Desc', userId: user.id })

    const response = await client.delete(`/projects/${project.id}`)

    response.assertStatus(200)

    const exists = await Project.find(project.id)
    assert.isNull(exists)
  })
})
