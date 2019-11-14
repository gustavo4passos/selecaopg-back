'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('Helpers')
const { validate } = use('Validator')
const User = use('App/Models/User')
const Selection = use('App/Models/Selection')
const Database = use('Database')

/**
 * Resourceful controller for interacting with selections
 */
class SelectionController {
	async index ({ request, response, view }) {
		const selections = await Selection.all()
		return selections
	}

	async store ({ request, response }) {
		const rules = {
			notice:    'string|required',
			semester:  'string|required',
			vacancies: 'integer|required',
			deadline: 'date|required',
			active: 'boolean|required'

		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.status(400).json({
				status: 'error',
				code: 'BAD_REQUEST',
				message: validation.messages()
			})
		}
		
		const data = request.only(['notice', 'semester', 'vacancies', 'deadline', 'active'])

		return await Selection.create(data);
	}

	async show ({ params, request, response, view }) {
		const selection = await Selection.findBy('id', params.id)

		if(!selection){
			return response.status(404).json({
				status: 'error',
				code: 'SELECTION_NOT_FOUND',
				message: 'Selection not found.'
			})
		}

		await selection.load('users')

		return selection
	}

	async update ({ params, request, response }) {
		var selection = await Selection.findBy('id', params.id)

		if(!selection) return response.status(404).json({
							status: 'error',
							code: 'SELECTION_NOT_FOUND',
							message: 'Selection not found.'
						})

		const rules = {
			notice:    'string|required',
			semester:  'string|required',
			vacancies: 'integer|required',
			deadline:  'date|required',
			active:    'boolean|required'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.status(400).json({
				status: 'error',
				code: 'BAD_REQUEST',
				message: validation.messages()
			})
		}

		var edit = request.only(['notice', 'semester', 'vacancies', 'deadline', 'active'])

		selection.notice    = edit.notice
		selection.semester  = edit.semester
		selection.vacancies = edit.vacancies
		selection.deadline  = edit.deadline
		selection.active    = edit.active
		

		await selection.save()

		return selection
	}

	async destroy ({ params, request, response }) {
		const selection = await Selection.findBy('id', params.id)

		if(!selection) return response.status(404).json({
							status: 'error',
							code: 'SELECTION_NOT_FOUND',
							message: 'Selection not found.'
						})

		await selection.delete()

		return response.status(200).json({
			status: 'success',
			message: 'Selection successfully deleted.'
		})
	}

	//Show activies Selections
	async active({ params, request, response }){
		const activeSelection = await Database.from('selections').where('active', 'true').first()

		if(!activeSelection){
			return response.status(404).json({ status: "error", code: 'NO_ACTIVE_SELECTION', message: "There's no active selection" })
		}

		return activeSelection
	}

}

module.exports = SelectionController
