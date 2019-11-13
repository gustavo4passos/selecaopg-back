'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Selection extends Model {
	users() {
		return this.belongsToMany('App/Models/User').pivotTable('enrollments')
	}

	enrollments() {
		return this.hasMany('App/Models/Enrollment')
	}
}

module.exports = Selection
