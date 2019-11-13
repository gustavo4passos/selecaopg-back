'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Publication = use('App/Models/Publication')
const Validator = use('Validator')

/**
 * Resourceful controller for interacting with publications
 */
class PublicationController {
  async index ({ request, response, view }) {
    const publications = Publication.all()

    return publications;
  }

  async store ({ request, response }) {
    const validation = await Validator.validate(request.all(), Publication.rules)

    if (validation.fails()) {
			return response.json(validation.messages())
    }

    [
			{name: 'undergraduate_academic_history', type: 'pdf', size: '1mb', extnames: ['pdf']}
		].map((props) => {
			const file = request.file(props.name, {
				types: [...props.type],
				size: props.size,
				extnames: [...props.extnames]
			})

			if (file) {
				file.move(Helpers.tmpPath(`uploads/${params.id}/${user.id}`), {
					name: file.stream.filename,
					overwrite: true
				})

				if (!file.moved()){
					return file.error()
				}
			}
		})

    const data = request.only(['category', 'score', 'pdfLink'])

    return Publication.create(data);
  }

  async show ({ params, request, response, view }) {
    const publication = await Publication.findBy('id', params.id)

    if(!publication) return await response.status(404).json({'Error': 'Publication not found' })

		return publication
  }

  async update ({ params, request, response }) {
    const publication = await Publication.findBy('id', params.id)

    if(!publication) return await response.status(404).json({'Error': 'Publication not found' })

		const validation = await Validator.validate(request.all(), Publication.rules)

		if (validation.fails()) {
			return response.json(validation.messages())
		}

		var edit = request.only(['category', 'score', 'pdfLink'])

		publication.category = edit.category
		publication.score = edit.score
		publication.pdfLink = edit.pdfLink

		await publication.save()

		return publication
  }

  async destroy ({ rams, request, response }) {
    const publication = await Publication.findBy('id', params.id)

    if(!publication) return await response.status(404).json({'Error': 'Publication not found' })

		await publication.delete()
  }
}

module.exports = PublicationController
