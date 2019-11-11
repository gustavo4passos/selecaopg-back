'use strict'

const User = use('App/Models/User')

class SessionController {
	async create({ request, auth }) {
		const { email, password } = request.all()
		
		const userData = await User.findBy('email', email)
		const { token } = await auth.attempt(email, password)
		return { token, user: userData }
	}

	async logout({ request, auth }) {
		return await auth.logout()
	}
}

module.exports = SessionController
