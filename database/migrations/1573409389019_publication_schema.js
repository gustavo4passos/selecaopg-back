'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicationSchema extends Schema {
  up () {
    this.create('publications', (table) => {
      table.increments()

      table.string('category')
      table.float('score')
      table.string('pdf_link')
      table.boolean('has_file')
      table.string('annals_link')
      table.string('event_link')

      table
      	.integer('enrollment_id')
		    .notNullable()
      	.unsigned()
      	.references('id')
      	.inTable('enrollments')
      	.onUpdate('CASCADE')
      	.onDelete('CASCADE')

      table.timestamps()
    })
  }

  down () {
    this.drop('publications')
  }
}

module.exports = PublicationSchema
