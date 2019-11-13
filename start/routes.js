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

//  Selection controller routes
//Route.get('/selections', 'SelectionController.index')
Route.get('/selections/active', 'SelectionController.active').middleware('auth')
Route.get('/selections/:id', 'SelectionController.show').middleware('auth')
Route.post('/selections', 'SelectionController.store').middleware('auth')
Route.put('/selections/:id', 'SelectionController.update').middleware('auth')
Route.delete('/selections/:id', 'SelectionController.destroy').middleware('auth')

// User controller routes
Route.get('/users/:id/', 'UserController.read').middleware('auth')
Route.post('/users/', 'UserController.create')
Route.put('/users/:id/', 'UserController.update').middleware('auth')
Route.delete('/users/:id', 'UserController.destroy').middleware('auth')
Route.get('/ranking/:id', 'UserController.getRanking').middleware('auth')

// Enrollment routes
Route.get('/enrollments/:id', 'EnrollmentController.read').middleware('auth')
Route.post('/enrollments/', 'EnrollmentController.create').middleware('auth')
Route.put('/enrollments/:id', 'EnrollmentController.update').middleware('auth')
Route.delete('/enrollments/:id', 'EnrollmentController.destroy').middleware('auth')

// Publication controller routes
Route.resource('publications', 'PublicationController').apiOnly().middleware('auth')
