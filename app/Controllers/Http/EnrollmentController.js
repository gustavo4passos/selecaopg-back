'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with usersselections
 */

const Enrollment = use('App/Models/Enrollment')
const Validator  = use('Validator')

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
		'undergraduate_transcript',
		'enade_link',
		'graduate_transcript',
		'scientific_production',
		'publications',
		'user_id',
		'selection_id'
	])	

	return Enrollment.create(data);
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

  	const ids = request.only(['user_id', 'selection_id']);

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
		'scientific_production',
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

  	const ids = request.only(['user_id', 'selection_id']);

	if(ids.user_id != Number(auth.user.id)) {
		return await response.status(403).json({ 'Error': 'Updating other user\'s enrollment is forbidden' })
	}

	const enrollment = Enrollment.findBy('id', params.id)
	if(!enrollment) return await response.status(404).json({ 'Error': 'Enrollment not found' })

	await user.delete()
	return await response.status(200).json({ 'Status': 'User successfully deleted' })
  }
}

module.exports = EnrollmentController