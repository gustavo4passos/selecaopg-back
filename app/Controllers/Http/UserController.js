'use strict'

const Validator = use('Validator')
const User = use('App/Models/User')

class UserController {
	async create({ request, response }) {
		const validation = await Validator.validate(request.all(), User.rules)

		if(validation.fails()) {
			return await response.json(validation.messages()) 
		}

		const data = request.only(['fullname', 'email', 'password'])
		return await User.create(data)
	}

	async read({ params, request, response, auth }) {
		if(auth.user.id != Number(params.id)) {
			return response.status(403).json( {'Error': 'Acessing other user\'s profile is forbidden' }) 
		}

		const user = await User.findBy('id', params.id)
		if(!user) return response.status(404).json({ 'Error': 'User not found.'})

		return response.status(200).json(user)
	}

	async update( { params, request, response, auth }) {
		if(auth.user.id != Number(params.id)) {
			return response.status(403).json( {'Error': 'Updating other user\'s profile is forbidden' }) 
		}

		const validation = await Validator.validate(request.all(), User.updateRules)
		if(validation.fails()) {
			return await response.json(validation.messages()) 
		}

		const data = request.only(['fullname', 'email', 'password']) 

		let user = await User.findBy('id', params.id)
		if(!user) return response.status('404').json({ 'Error': 'User not found' })

		user.fullname = data.fullname
		user.email    = data.email
		user.password = data.password

		await user.save()
		return response.json(user)
	}
	
	async destroy({ params, response, auth }) {
		if(auth.user.id != Number(params.id)) {
			return response.status(403).json( {'Error': 'Deleting other user\'s profile is forbidden' }) 
		}

		const user = await User.findBy('id', params.id);
		if(!user)
		{
			return response.status('404').json({ 'Error': 'User not found' })
		}

		await user.delete();
		return response.status('200').json({ 'Status': 'User successfully deleted' })
	}
}

module.exports = UserController
