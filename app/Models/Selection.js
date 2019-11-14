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

	static get rules(){
		return {
			notice:    'string|required',
			semester:  'string|required',
			vacancies: 'integer|required',
			deadline:  'date|required',
			active:    'boolean|required'
		}	
	}
}

module.exports = Selection
