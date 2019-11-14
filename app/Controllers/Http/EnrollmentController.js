'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with usersselections
 */

const Enrollment  = use('App/Models/Enrollment')
const Publication = use('App/Models/Publication')
const Validator   = use('Validator')
const Helpers     = use('Helpers')

class EnrollmentController {
	async index ({ request, response, view }) {

	}

	async create ({ request, response, auth }) {
		const idsRules = {
			user_id: 'integer|required',
			selection_id: 'integer|required'
		}
		
		const idsValidation = await Validator.validate(request.all(), idsRules)
		
		if(idsValidation.fails()) {
			return response.status(400).json({
				status: 'error',
				code: 'BAD_REQUEST',
				message: validation.messages()
			}) 
		}
		
		const ids = request.only(['user_id', 'selection_id']);
		
		if(ids.user_id != Number(auth.user.id)) {
			return response.status(403).json({
				status: 'error',
				code: 'DIFF_USER',
				message: 'Acessing other user\'s profile is forbidden.'
			}) 
		}
		
		const validation = await Validator.validate(request.all(), Enrollment.rules)
		if(validation.fails()) {
			return response.status(400).json({
				status: 'error',
				code: 'BAD_REQUEST',
				message: validation.messages()
			})
		}
		
		var data = request.only([
			'entry_semester',
			'degree',
			'score_type',
			'advisor_name',
			'lattes_link',
			'undergraduate_university',
			'enade_link',
			'masters_freshman',
			'score',
			'user_id',
			'selection_id',
			'crpg',
			'rg',
			'capes',
			'enade',
			'phone'
		])	
		
		const files = ['undergraduate_transcript', 'graduate_transcript']
		
		let error = false;
		for(let filename of files) {
			const file = request.file(filename, {
				types: ['pdf'],
				size: '15mb',
				extnames: ['pdf']
			})
			
			if(file) {
				const status = await this.moveFile({
					request, 
					file, 
					filename: file.stream.filename,
					selectionId: data.selection_id,
					userId: data.user_id				
				}) 

				if(status.status != 'success') {
					return response.status(500).json({ 
						status: 'error',
						code: 'MOVE_FILE_ERROR',
						message: status.message
					})
				}
				else {
					data[filename] = `${status.path}.pdf`
				}
			}
		}

		const enrollmentValidation = await Validator.validate(data, Enrollment.rules)
		if(enrollmentValidation.fails()) {
			return response.status(400).json(enrollmentValidation.messages())
		}
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

  async read ({ params, request, response, auth }) {
	const idsRules = {
		user_id: 'integer|required',
		selection_id: 'integer|required'
	}
	const idsValidation = await Validator.validate(request.all(), idsRules)

	if(idsValidation.fails()) {
		return response.status(400).json({
			status: 'error',
			code: 'BAD_REQUEST',
			message: validation.messages()
		})
	}

  	const ids = request.only(['user_id', 'selection_id'])

	if(ids.user_id != Number(auth.user.id)) {
		return response.status(403).json({
			status: 'error',
			code: 'DIFF_USER',
			message: 'Acessing other user\'s profile is forbidden.'
		}) 
	}

	const enrollment = Enrollment.findBy('id', params.id)

	if(!enrollment) return response.status(404).json({
						status: 'error',
						code: 'ENROLLMENT_NOT_FOUND',
						message: 'Enrollment not found.'
					})

	return response.json(enrollment)
  }

  async update ({ params, request, response, auth }) {
	const idsRules = {
		user_id: 'integer|required',
		selection_id: 'integer|required'
	}
	const idsValidation = await Validator.validate(request.all(), idsRules)

	if(idsValidation.fails()) {
		return response.status(400).json({
			status: 'error',
			code: 'BAD_REQUEST',
			message: validation.messages()
		})
	}

  	const ids = request.only(['user_id', 'selection_id'])

	if(ids.user_id != Number(auth.user.id)) {
		return response.status(403).json({
			status: 'error',
			code: 'DIFF_USER',
			message: 'Acessing other user\'s profile is forbidden.'
		}) 
	}

	const enrollment = Enrollment.findBy('id', params.id)
	if(!enrollment) return response.status(404).json({
						status: 'error',
						code: 'ENROLLMENT_NOT_FOUND',
						message: 'Enrollment not found.'
					})
	
	const validation = await Validator.validate(request.all(), Enrollment.rules)
	if(validation.fails()) {
		return response.status(400).json({
			status: 'error',
			code: 'BAD_REQUEST',
			message: validation.messages()
		})
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
	const enrollment = await Enrollment.findBy('id', params.id);
	if(!enrollment) return response.status(404).json({
						status: 'error',
						code: 'ENROLLMENT_NOT_FOUND',
						message: 'Enrollment not found.'
					})

	if(Number(enrollment.user_id) != Number(auth.user.id)) {
		return response.status(403).json({
			status: 'error',
			code: 'DIFF_USER',
			message: 'Acessing other user\'s profile is forbidden.'
		}) 
	}

	await enrollment.delete()

	return response.status(200).json({
		status: 'success',
		message: 'Enrollment successfully deleted.'
	})
  }

  async  createPublications({ request, enrollmentId, selectionId, userId }) {
		let publications
		
		if (!request.body.publications) return { status: 'success' }
		try {
			publications = JSON.parse(request.body.publications)
		} catch(e) {
			return { status: "error", message: "Invalid json publications syntax." }
		}

		for(let publication of publications) {
			if(!publication.file && !publication.link) {
				return { status: "error", message: "Publication needs either a link or a file." }
			}

			const rules = {
				category: 'string|required',
				score: 'required'
			}

			const validation = await Validator.validate(publication, rules)
			if(validation.fails()){
				return response.status(400).json({
					status: 'error',
					code: 'BAD_REQUEST',
					message: validation.messages()
				})
			}
		}

		for(let publication of publications) {
			if(publication.file) {
				publication.hasFile = true;
				const file = request.file(publication.file, {
					types: ['pdf'],
					size: '15mb',
					extnames: ['pdf']
				})
				if(file) publication.loaded_file = file;
				else return { status: "error", message: `Unable to load file ${publication.file}` }
			} else {
				publication.hasFile = false;
				publication.pdf_link = publication.link
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

				
				if(status.status === 'error') return { status: 'error', message: status.message }
				publication.pdf_link = status.path+'/'+publication.loaded_file.stream.filename
				
				delete publication.file
				delete publication.loaded_file
			}
		}

		for(let publication of publications)
		{
			publication.enrollment_id = enrollmentId
			await Publication.create({ 
				category: publication.category,
				enrollment_id: publication.enrollment_id,
				score: publication.score,
				pdf_link: publication.pdf_link,
				annals_link: publication.proceedingsLink,
				event_link: publication.eventLink,
				has_file: publication.hasFile?'true':'false'
			})
		}

		return { status: "success" }
  }

  async moveFile({ request, file, filename, selectionId, userId}) {
	  const newPath = Helpers.tmpPath(`uploads/selection-${selectionId}/user-${userId}`)

	  if(file) {
		  await file.move((newPath), {
			  name: file.stream.filename,
			  overwrite: true
		  })

		  if(!file.moved()) {
			  return { status: "error", message: file.error() }
		  }
		}
	  else return { status: "error", message: `Unable to move file: ${file.stream.filename}`}
	  return { status: "success", path: newPath }
  }
}

module.exports = EnrollmentController