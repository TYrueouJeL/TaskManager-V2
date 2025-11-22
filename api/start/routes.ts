/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import TasksController from '#controllers/tasks_controller'

router.group(() => {
  router.get('/', [TasksController, 'index'])
  router.post('/', [TasksController, 'create'])
  router.get('/:id', [TasksController, 'read'])
  router.put('/:id', [TasksController, 'update'])
  router.delete('/:id', [TasksController, 'delete'])
}).prefix('/tasks')