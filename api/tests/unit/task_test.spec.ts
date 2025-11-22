import { test } from '@japa/runner'
import Task from '#models/task'
import TaskService from '#services/task_service'

test.group('TaskService', (group) => {
  group.each.setup(async () => {
    await Task.query().delete() // reset DB avant chaque test
  })

  test('création d’une tâche simple', async ({ assert }) => {
    const task = await TaskService.create({
      title: 'Ma tâche',
      description: 'Description de ma tâche',
    })

    assert.exists(task.id)
    assert.equal(task.title, 'Ma tâche')
    assert.isNull(task.projectId)
    assert.deepEqual(task.dependencies, [])
  })

  test('création avec une date', async ({ assert }) => {
    const task = await TaskService.create({
      title: 'Avec date',
      description: 'Description de ma tâche',
      dueDate: '2024-12-30',
    })

    assert.equal(task.dueDate!.toISODate(), '2024-12-30')
  })

  test('ajout de dépendances valides', async ({ assert }) => {
    const t1 = await TaskService.create({ title: 'A', description: 'Description de ma tâche' })
    const t2 = await TaskService.create({ title: 'B', description: 'Description de ma tâche' })

    const updated = await TaskService.update(t1, {
      dependencies: [t2.id],
    })

    assert.equal(updated.dependencies.length, 1)
    assert.equal(updated.dependencies[0].id, t2.id)
  })

  test('empêche les dépendances circulaires', async ({ assert }) => {
    const t1 = await TaskService.create({ title: 'A', description: 'Description de ma tâche' })
    const t2 = await TaskService.create({ title: 'B', description: 'Description de ma tâche' })

    // B dépend de A
    await TaskService.update(t2, { dependencies: [t1.id] })

    // A dépend de B → cycle
    await assert.rejects(async () => {
      await TaskService.update(t1, { dependencies: [t2.id] })
    })
  })
})
