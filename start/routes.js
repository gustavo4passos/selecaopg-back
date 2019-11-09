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
Route.get('/selections/:id', 'SelectionController.show')
Route.post('/selections', 'SelectionController.store')
Route.put('/selections/:id', 'SelectionController.update')
Route.delete('/selections/:id', 'SelectionController.destroy')

Route.resource('enrollments', 'EnrollmentController').apiOnly().middleware('auth')