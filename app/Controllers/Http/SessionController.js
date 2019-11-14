'use strict'

const Validator  = use('Validator')
const User = use('App/Models/User')

class SessionController {
	async login({ request, response, auth }) {
		const rules = {
			email: 'required|email',
			password: 'required'
		}

		const validation = await Validator.validate(request.all(), rules)

		if (validation.fails()) {
			return response.status(400).json({
				status: 'error',
				code: 'BAD_REQUEST',
				message: validation.messages()
			})
		}

		const { email, password } = request.all()
		
		const user = await User.findBy('email', email)
		if (!user) return response.status(404).json({
			status: 'error',
			code: 'USER_NOT_FOUND',
			message: 'User not found.'
		})

		
		try {
			await user.load('enrollments.publications')
			
			const { token } = await auth.attempt(email, password)
			return { token, user }
		} catch(err) {
			return response.status(401).json({
				status: 'error',
				code: 'INVALID_PASSWORD',
				message: 'Invalid password.'
			})
		}
	}

	async logout({ request, auth }) {
		return await auth.logout()
	}
}

module.exports = SessionController
