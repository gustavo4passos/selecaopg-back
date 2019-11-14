'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Enrollment extends Model {
	static get rules() {
		return {
			entry_semester:			  'required',
			degree: 		          'string|required',
			score_type:				  'string|required',
			advisor_name: 			  'string|required',
			lattes_link: 			  'required',
			undergraduate_university: 'string|required',
			enade_link: 			  'required',
			masters_freshman:		  'boolean|required',
			score: 					  'required',
			user_id: 				  'integer|required',
			selection_id: 			  'integer|required',
			crpg:					  'number|required',
			rg:						  'number|required',
			capes:					  'integer',
			enade:					  'integer',
			phone:					  'string'
		}
	}

	publications() {
		return this.hasMany('App/Models/Publication')
	}
}

module.exports = Enrollment
