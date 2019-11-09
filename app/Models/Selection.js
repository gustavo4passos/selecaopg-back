'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Selection extends Model {
	users() {
		return this.hasMany('App/Models/Users')
	}
}

module.exports = Selection
