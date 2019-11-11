'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SelectionSchema extends Schema {
  up () {
    this.create('selections', (table) => {
      table.increments() // ID

      table.string('notice').notNullable().unique()
      table.string('semester').notNullable()
      table.integer('vacancies').notNullable()
      table.date('deadline').notNullable()
      table.boolean('active').notNullable()
      
      table.timestamps() // CREATED_AT AND UPDATED_AT
    })
  }

  down () {
    this.drop('selections')
  }
}

module.exports = SelectionSchema
