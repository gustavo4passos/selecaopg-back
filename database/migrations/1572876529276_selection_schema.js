'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SelectionSchema extends Schema {
  up () {
    this.create('selections', (table) => {
      table.increments()

      

      table.timestamps()
    })
  }

  down () {
    this.drop('selections')
  }
}

module.exports = SelectionSchema
