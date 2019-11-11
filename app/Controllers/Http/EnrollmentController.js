'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with usersselections
 */

const Enrollment = use('App/Models/Enrollment')
const Publication = use('App/Models/Publication')
const Validator  = use('Validator')
const Helpers    = use('Helpers')

class EnrollmentController {
	/**
	 * Show a list of all usersselections.
	 * GET usersselections
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {

	}

	async create ({ request, response, auth }) {
		const idsRules = {
			user_id: 'integer|required',
			selection_id: 'integer|required'
		}

		const idsValidation = await Validator.validate(request.all(), idsRules)

		if(idsValidation.fails()) {
			return await response.status(400).json(idsValidation.messages()) 
		}

		const ids = request.only(['user_id', 'selection_id']);

		if(ids.user_id != Number(auth.user.id)) {
			return response.status(403).json({ 'Error': 'Enrolling a different user is forbidden'})
		}

		const validation = await Validator.validate(request.all(), Enrollment.rules)
		if(validation.fails()) {
			return await response.status(400).json(validation.messages())
		}

		const data = request.only([
			'entry_semester',
			'degree',
			'advisor_name',
			'lattes_link',
			'undergraduate_university',
			'enade_link',
			'undergraduate_transcript',
			'graduate_transcript',
			'score',
			'user_id',
			'selection_id'
		])	

		const files = ['undergraduate_transcript', 'graduate_transcript']

		files.map((filename) => {
			const file = request.file(filename, {
				types: ['pdf'],
				size: '15mb',
				extnames: ['pdf']
			})
	
			if(file) this.moveFile({
				request, 
				file, 
				filename: file.stream.filename,
				selectionId: data.selection_id,
				userId: data.user_id				
			}) 
		})

		const enrollment = await Enrollment.create(data)

		const { status, message } = await this.createPublications({ 
			request, 
			enrollmentId: enrollment.id, 
			selectionId: enrollment.selection_id, 
			userId: enrollment.user_id 
		})

		if(status === 'error') return response.status(400).json({status, message})

		await enrollment.load('publications')

		return response.json(enrollment)
	}

  async read ({ params, request, response, view }) {
	const idsRules = {
		user_id: 'integer|required',
		selection_id: 'integer|required'
	}
	const idsValidation = await Validator.validate(request.all(), idsRules)

	if(idsValidation.fails()) {
		return await response.status(400).json(idsValidation.messages()) 
	}

  	const ids = request.only(['user_id', 'selection_id'])

	if(ids.user_id != Number(auth.user.id)) {
		return response.status(403).json({ 'Error': 'Enrolling a different user is forbidden'})
	}

	const enrollment = Enrollment.findBy('id', params.id)

	if(!enrollment) return resopnse.status(404).json({ 'Error': 'Enrollment not found' })

	return response.json(enrollment)
  }

  async update ({ params, request, response, auth }) {
	const idsRules = {
		user_id: 'integer|required',
		selection_id: 'integer|required'
	}
	const idsValidation = await Validator.validate(request.all(), idsRules)

	if(idsValidation.fails()) {
		return await response.status(400).json(idsValidation.messages()) 
	}

  	const ids = request.only(['user_id', 'selection_id'])

	if(ids.user_id != Number(auth.user.id)) {
		return await response.status(403).json({ 'Error': 'Updating other user\'s enrollment is forbidden' })
	}

	const enrollment = Enrollment.findBy('id', params.id)
	if(!enrollment) return await response.status(404).json({ 'Error': 'Enrollment not found' })
	
	const validation = await Validator.validate(request.all(), Enrollment.rules)
	if(validation.fails()) {
		return await response.status(400).json(validation.messages())
	}

	let data = request.only([
		'entry_semester',
		'degree',
		'advisor_name',
		'lattes_link',
		'undergraduate_university',
		'undergraduate_transcript',
		'enade_link',
		'graduate_transcript',
		'scientific_productions',
		'publications',
		'user_id',
		'selection_id'
	])	

	enrollment.entry_semester           = data.entry_semester
	enrollment.degree                   = data.degree
	enrollment.advisor_name             = data.advisor_name
	enrollment.lattes_link              = data.lattes_link
	enrollment.undergraduate_university = data.undergraduate_university
	enrollment.undergraduate_transcript = data.undergraduate_transcript
	enrollment.enade_link				= data.enade_link
	enrollment.graduate_transcript      = data.graduate_transcript
	enrollment.scientific_production    = data.scientif_production
	enrollment.publications             = data.publications 
	enrollment.user_id					= data.user_id
	enrollment.selection_id   			= data.selection.id
	enrollment.save()

	return await response.json(enrollment)
  }

  async destroy ({ params, request, response, auth }) {
	const idsRules = {
		user_id: 'integer|required',
		selection_id: 'integer|required'
	}
	const idsValidation = await Validator.validate(request.all(), idsRules)

	if(idsValidation.fails()) {
		return await response.status(400).json(idsValidation.messages()) 
	}

  	const ids = request.only(['user_id', 'selection_id'])

	if(ids.user_id != Number(auth.user.id)) {
		return await response.status(403).json({ 'Error': 'Updating other user\'s enrollment is forbidden' })
	}

	const enrollment = Enrollment.findBy('id', params.id)
	if(!enrollment) return await response.status(404).json({ 'Error': 'Enrollment not found' })

	await enrollment.delete()
	return await response.status(200).json({ 'Status': 'Enrollment successfully deleted' })
  }

	async createPublications({ request, enrollmentId, selectionId, userId }) {
		let publications
		
		if (!request.body.publications) return { status: 'success' }
		try {
			publications = JSON.parse(request.body.publications)
		} catch(e) {
			return { status: "error", message: "Invalid json publications syntax." }
		}
		console.log(publications)
		for(let publication of publications) {
			if(!publication.file && !publication.link) {
				return { status: "error", message: "Publication needs either a link or a file." }
			}

			const rules = {
				category: 'string|required',
				score: 'required'
			}

			const validation = await Validator.validate(publication, rules)
			if(validation.fails())
			{
				return { status: "error", message: validation.messages() }
			}
		}

		for(let publication of publications) {
			if(publication.file) {
				const file = request.file(publication.file, {
					types: ['pdf'],
					size: '15mb',
					extnames: ['pdf']
				})
				if(file) publication.loaded_file = file;
				else return { status: "error", message: `Unable to load file ${publication.file}` }
			} else {
				publication.pdfLink = publication.link
			}
		}

		//  All publications are valid and files were successfully lodaded by now
		for(let publication of publications) {
			if(publication.file) {
				const status = await this.moveFile({
					request, 
					file: publication.loaded_file, 
					filename: publication.loaded_file.stream.filename,
					selectionId,
					userId				
				})
				console.log(status)
				if(status.status === 'error') return { status: 'error', message: status.message }
				publication.pdfLink = status.path+'/'+publication.loaded_file.stream.filename
				
				delete publication.file
				delete publication.loaded_file
			}
		}

		for(let publication of publications)
		{
			

			publication.enrollment_id = enrollmentId
			await Publication.create(publication)
		}

		return { status: "success" }
  }

  async moveFile({ request, file, filename, selectionId, userId}) {
	  const newPath = Helpers.tmpPath(`uploads/${selectionId}/${userId}`)

	  if(file) {
		  await file.move((newPath), {
			  name: file.stream.filename,
			  overwrite: true
		  })

		  if(!file.moved()) {
			  return { status: "error", message: file.error() }
		  }
	}
	  else return { status: "error", message: `Invalid file: ${filename}`}
	  return { status: "success", path: newPath }
  }
}

module.exports = EnrollmentController