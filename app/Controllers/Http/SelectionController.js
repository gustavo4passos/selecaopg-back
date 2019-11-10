'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('Helpers')
const { validate } = use('Validator')
const User = use('App/Models/User')
const Selection = use('App/Models/Selection')

/**
 * Resourceful controller for interacting with selections
 */
class SelectionController {
	/**
	 * Show a list of all selections.
	 * GET selections
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const selections = await Selection.all()
		return selections
	}

	/**
	 * Create/save a new selection.
	 * POST selections
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store ({ request, response }) {
		const rules = {
			notice: 'required',
			semester: 'required',
			vacancies: 'required',
			deadline: 'required|date'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json(validation.messages())
		}
		
		const data = request.only(['notice', 'semester', 'vacancies', 'deadline'])

		return Selection.create(data);
	}

	/**
	 * Display a single selection.
	 * GET selections/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show ({ params, request, response, view }) {
		const selection = await Selection.findOrFail(params.id)

		await selection.load('users')

		return selection
	}


	/**
	 * Update selection details.
	 * PUT or PATCH selections/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {
		var selection = await Selection.findOrFail(params.id)

		const rules = {
			notice: 'required',
			semester: 'required',
			vacancies: 'required',
			deadline: 'required'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json(validation.messages())
		}

		var edit = request.only(['notice', 'semester', 'vacancies', 'deadline'])

		selection.notice = edit.notice
		selection.semester = edit.semester
		selection.vacancies = edit.vacancies
		selection.deadline = edit.deadline
		

		await selection.save()

		return selection

		
	}

	/**
	 * Delete a selection with id.
	 * DELETE selections/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, request, response }) {
		const selection = await Selection.findOrFail(params.id)

		await selection.delete()
	}

	async subscribe ({ params, request, session, response }) {		
		const rules = {
			fullname: 'required',
			email: 'required|email',
			phone: 'required',
			entry_semester: 'required',
			course: 'required',
			advisor_name: 'required',
			lattes_link: 'required|url',
			graduation_university: 'required',
			enade_link: 'required|url'
		} 

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({error: validation.messages()})
		}

		const data = request.all()

		const user = await User.findBy('email', data.email)
		if (!user) return response.status(404).json({'error': 'User not found.'})
		
		const selection = await Selection.findBy('id', params.id)
		if (!selection) return response.status(404).json({'error': 'Selection not found.'})

		[
			{name: 'undergraduate_academic_history', type: 'pdf', size: '1mb', extnames: ['pdf']}
		].map((props) => {
			const file = request.file(props.name, {
				types: [...props.type],
				size: props.size,
				extnames: [...props.extnames]
			})

			if (file) {
				file.move(Helpers.tmpPath(`uploads/${params.id}/${user.id}`), {
					name: file.stream.filename,
					overwrite: true
				})

				if (!file.moved()){
					return file.error()
				}
			}
		})

		return response.json({success: 'Inscrição concluída'})
	}
}

module.exports = SelectionController
