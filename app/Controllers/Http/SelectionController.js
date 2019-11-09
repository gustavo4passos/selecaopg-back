'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Selection = use('App/Models/Selection')

/**
 * Resourceful controller for interacting with selections
 */
class SelectionController {
  /**
   * Show a list of all selections.
   * GET selections
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return Selection.all()
  }

  /**
   * Create/save a new selection.
   * POST selections
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    
  }

  /**
   * Display a single selection.
   * GET selections/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const selection = await Selection.findOrFail(params.id)

    await selection.load('users')

    return selection
  }


  /**
   * Update selection details.
   * PUT or PATCH selections/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a selection with id.
   * DELETE selections/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = SelectionController
