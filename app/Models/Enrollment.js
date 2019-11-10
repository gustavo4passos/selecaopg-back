'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Enrollment extends Model {
	static get rules() {
		return {
			entry_semester: 'required',
			degree: 'string|required',
			advisor_name: 'string|required',
			lattes_link: 'required',
			undergraduate_university: 'string|required',
			enade_link: 'required',
			score: 'requierd',
			user_id: 'integer|required',
			selection_id: 'integer|required'
		}
	}

	publications() {
		return this.hasMany('App/Models/Publication')
	}
}

module.exports = Enrollment
