'use strict'

class SessionController {
	async create({request}) {
		const { email, password } = request.all()

		return await auth.attempt(email, password)
	}

}

module.exports = SessionController
