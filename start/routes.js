'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route.post('/users', 'UserController.create')
Route.post('/sessions', 'SessionController.create')
Route.post('/sessions/logout', 'SessionController.logout')

Route.get('/selections', 'SelectionController.index')
Route.post('/selections/:id/enroll', 'SelectionController.enroll')

// User controller routes
Route.get('/users/:id/', 'UserController.read').middleware('auth')
Route.post('/users/', 'UserController.create')
Route.put('/users/:id/', 'UserController.update').middleware('auth')
Route.delete('/users/:id', 'UserController.destroy').middleware('auth')

//Route.resource('enrollments', 'EnrollmentController').apiOnly().middleware('auth')
Route.get('/enrollments/:id', 'EnrollmentController.read').middleware('auth')
Route.post('/enrollments/', 'EnrollmentController.create').middleware('auth')
Route.put('/enrollments/:id', 'EnrollmentController.update').middleware('auth')
Route.delete('/enrollments/:id', 'EnrollmentController.delete').middleware('auth')
