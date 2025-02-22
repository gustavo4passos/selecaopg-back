'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Publication extends Model {
    static get rules(){
        return {
            score:    'number|required',
            category: 'string|required',
            pdf_link:  'string',
            annals_link: 'string',
            event_link:  'string'
        }
    }
}

module.exports = Publication
