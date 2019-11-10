'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Publication extends Model {
    static get rules(){
        return {
            qualis: 'string|required',
            score: 'number|required',
            pdfLink: 'string|required'
        }
    }
}

module.exports = Publication
