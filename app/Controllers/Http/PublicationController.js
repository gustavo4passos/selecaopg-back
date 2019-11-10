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
  /**
   * Show a list of all publications.
   * GET publications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const publications = Publication.all()

    return publications;
  }

  /**
   * Render a form to be used for creating a new publication.
   * GET publications/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */


  /**
   * Create/save a new publication.
   * POST publications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const validation = await Validator.validate(request.all(), Publication.rules)

    if (validation.fails()) {
			return response.json(validation.messages())
    }

    const data = request.only(['qualis', 'score', 'pdfLink'])

    return Publication.create(data);
  }

  /**
   * Display a single publication.
   * GET publications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const publication = await Publication.findOrFail(params.id)

		return publication
  }


  /**
   * Update publication details.
   * PUT or PATCH publications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    var publication = await Publication.findOrFail(params.id)

		const validation = await Validator.validate(request.all(), Publication.rules)

		if (validation.fails()) {
			return response.json(validation.messages())
		}

		var edit = request.only(['qualis', 'score', 'pdfLink'])

		publication.qualis = edit.qualis
		publication.score = edit.score
		publication.pdfLink = edit.pdfLink

		await publication.save()

		return publication
  }

  /**
   * Delete a publication with id.
   * DELETE publications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const publication = await Publication.findOrFail(params.id)

		await publication.delete()
  }
}

module.exports = PublicationController
