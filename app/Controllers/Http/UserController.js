'use strict'

const Validator  = use('Validator')
const User 		 = use('App/Models/User')
const Selection  = use('App/Models/Selection')
const Enrollment = use('App/Models/Enrollment')

class UserController {
	async create({ request, response, auth }) {
		const validation = await Validator.validate(request.all(), User.rules)

		if(validation.fails()) {
			return response.status(400).json({
				status: 'error',
				code: 'BAD_REQUEST',
				message: validation.messages()
			})
		}

		const data = request.only(['fullname', 'email', 'password'])

		try {
			var user = await User.create(data)
		} catch(err) {
			return response.status(500).json({
				status: 'error',
				code: 'DATABASE_ERROR',
				message: 'An error occurred while trying to write data to database.'
			}) 
		}
		
		await user.load('enrollments.publications')

		const { token } = await auth.attempt(data.email, data.password)
		
		return { token, user }
	}

	async read({ params, request, response, auth }) {
		if(auth.user.id != params.id) {
			return response.status(403).json({
				status: 'error',
				code: 'DIFF_USER',
				message: 'Acessing other user\'s profile is forbidden.'
			}) 
		}

		const user = await User.findBy('id', params.id)
		if(!user) return response.status(404).json({
			status: 'error',
			code: 'USER_NOT_FOUND',
			message: 'User not found.'
		})

		await user.load('enrollments.publications')

		return await response.status(200).json(user)
	}

	async update( { params, request, response, auth }) {
		if(auth.user.id != params.id) {
			return response.status(403).json({
				status: 'error',
				code: 'DIFF_USER',
				message: 'Updating other user\'s profile is forbidden.'
			}) 
		}

		const validation = await Validator.validate(request.all(), User.updateRules)
		if(validation.fails()) {
			return response.status(400).json({
				status: 'error',
				code: 'BAD_REQUEST',
				message: validation.messages()
			})
		}

		const data = request.only(['fullname', 'email', 'password']) 

		let user = await User.findBy('id', params.id)
		if(!user) return response.status(404).json({
			status: 'error',
			code: 'USER_NOT_FOUND',
			message: 'User not found.'
		})

		user.fullname = data.fullname
		user.email    = data.email
		user.password = data.password

		await user.save()
		await user.load('enrollments.publications')

		return response.json(user)
	}
	
	async destroy({ params, response, auth }) {
		if(auth.user.id != params.id) {
			return response.status(403).json({
				status: 'error',
				code: 'DIFF_USER',
				message: 'Deleting other user\'s profile is forbidden.'
			}) 
		}

		const user = await User.findBy('id', params.id);
		if(!user) return response.status(404).json({
			status: 'error',
			code: 'USER_NOT_FOUND',
			message: 'User not found.'
		})

		await user.delete()
		return response.status(200).json({
			status: 'success',
			message: 'User successfully deleted.'
		})
	}

	async getRanking({ request, response, auth, params }) {
		const enrollment = await Enrollment.findBy('id', params.id)
		if(!enrollment) return response.status(404).json({
			status: 'error',
			code: 'ENROLLMENT_NOT_FOUND',
			message: 'Enrollment not found.'
		})
		
		if(auth.user.id != enrollment.user_id) {
			return response.status(403).json({
				status: 'error',
				code: 'DIFF_USER',
				message: 'Accessing an enrollment from another user is forbidden.'
			}) 
		}

		const selection = await Selection.findBy('id', enrollment.selection_id)
		
		if(!selection) return response.status(404).json({
							status: 'error',
							code: 'SELECTION_NOT_FOUND',
							message: 'Selection not found.'
						})

		const enrollments = await selection.enrollments().orderBy('score', 'desc').fetch()

		const ranking = enrollments.rows.findIndex(enrollment => enrollment.user_id == auth.user.id) + 1;
		return response.status(200).json({ ranking })
	}
}

module.exports = UserController
