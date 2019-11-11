'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicationSchema extends Schema {
  up () {
    this.table('publications', (table) => {
      table.renameColumn('qualis', 'category')
    })
  }

  down () {
    this.table('publications', (table) => {
      // reverse alternations
    })
  }
}

module.exports = PublicationSchema
