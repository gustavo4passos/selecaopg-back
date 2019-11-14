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
			return response.status(400).json({
        status: 'error',
        code: 'BAD_REQUEST',
        message: validation.messages()
      })
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

    const data = request.only(['category', 'score', 'pdf_link'])

    return Publication.create(data);
  }

  async show ({ params, request, response, view }) {
    const publication = await Publication.findBy('id', params.id)

    if(!publication)  return response.status(404).json({
                        status: 'error',
                        code: 'PUBLICATION_NOT_FOUND',
                        message: 'Publication not found.'
                      })

		return publication
  }

  async update ({ params, request, response }) {
    const publication = await Publication.findBy('id', params.id)

    if(!publication) return response.status(404).json({
                      status: 'error',
                      code: 'PUBLICATION_NOT_FOUND',
                      message: 'Publication not found.'
                    })

		const validation = await Validator.validate(request.all(), Publication.rules)

		if (validation.fails()) {
			return response.status(400).json({
        status: 'error',
        code: 'BAD_REQUEST',
        message: validation.messages()
      })
		}

		var edit = request.only(['category', 'score', 'pdf_link'])

		publication.category = edit.category
		publication.score = edit.score
		publication.pdf_link = edit.pdf_link

		await publication.save()

		return publication
  }

  async destroy ({ rams, request, response }) {
    const publication = await Publication.findBy('id', params.id)

    if(!publication) return response.status(404).json({
                      status: 'error',
                      code: 'PUBLICATION_NOT_FOUND',
                      message: 'Publication not found.'
                    })

    await publication.delete()
    
    return response.status(200).json({
			status: 'success',
			message: 'Publication successfully deleted.'
		})
  }
}

module.exports = PublicationController
