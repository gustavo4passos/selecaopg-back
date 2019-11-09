'use strict'

class SessionController {
	async create({request, auth}) {
		console.log('eae')
		const { email, password } = request.all()
		
		const token = await auth.attempt(email, password)
		console.log(token)
		return token
	}

	async logout({request, auth}) {
		return await auth.logout()
	}
}

module.exports = SessionController
