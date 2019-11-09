'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnrollmentSchema extends Schema {
  up () {
    this.create('enrollment', (table) => {
	  table.increments()
	  
	  table.string('fullname')
	  table.string('entry_semester')
	  table.enu('degree', ['masters', 'doctorate'])
	  table.string('advisor_name')
	  table.string('lattes_link')
	  table.string('email')
	  table.string('phone')
	  table.string('undergraduate_university')
	  table.string('undergraduate_transcript')
	  table.string('enade_link')
	  table.string('graduate_transcript')
	  table.string('scientific_production')
	  table.string('publications')

      table
      	.integer('user_id')
      	.unsigned()
      	.references('id')
      	.inTable('users')
      	.onUpdate('CASCADE')
      	.onDelete('CASCADE')

      table
      	.integer('selection_id')
      	.unsigned()
      	.references('id')
      	.inTable('selections')
      	.onUpdate('CASCADE')
      	.onDelete('CASCADE')

      table.timestamps()
    })
  }

  down () {
    this.drop('enrollments')
  }
}

module.exports = EnrollmentSchema
