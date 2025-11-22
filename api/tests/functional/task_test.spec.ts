import { test } from '@japa/runner'
import Task from '#models/task'

test.group('TasksController', (group) => {
  group.each.setup(async () => {
    await Task.query().delete()
  })

  test('POST /tasks → créer une tâche', async ({ client, assert }) => {
    const response = await client.post('/tasks').json({
      title: 'Nouvelle tâche',
      description: 'Description de la tâche',
    })

    response.assertStatus(200)
    assert.equal(response.body().title, 'Nouvelle tâche')
    assert.equal(response.body().description, 'Description de la tâche')
  })

  test('GET /tasks → liste les tâches', async ({ client, assert }) => {
    await Task.create({ title: 'A', description: 'Description de la tâche' })
    await Task.create({ title: 'B', description: 'Description de la tâche' })

    const response = await client.get('/tasks')

    response.assertStatus(200)
    assert.equal(response.body().length, 2)
  })

  test('PUT /tasks/:id → met à jour une tâche', async ({ client, assert }) => {
    const task = await Task.create({ title: 'Avant', description: 'Description de la tâche' })

    const response = await client.put(`/tasks/${task.id}`).json({
      title: 'Après',
      description: 'Description de la tâche',
    })

    response.assertStatus(200)
    assert.equal(response.body().title, 'Après')
    assert.equal(response.body().description, 'Description de la tâche')
  })

  test('DELETE /tasks/:id', async ({ client, assert }) => {
    const task = await Task.create({ title: 'A supprimer', description: 'Description de la tâche' })

    const response = await client.delete(`/tasks/${task.id}`)

    response.assertStatus(200)

    const exists = await Task.find(task.id)
    assert.isNull(exists)
  })
})
