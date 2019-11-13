'use strict'

const User = use('App/Models/User')

class SessionController {
	async login({ request, auth }) {
		const { email, password } = request.all()
		
		const userData = await User.findBy('email', email)
		await userData.load('enrollments.publications')

		const { token } = await auth.attempt(email, password)
		return { token, user: userData }
	}

	async logout({ request, auth }) {
		return await auth.logout()
	}
}

module.exports = SessionController
