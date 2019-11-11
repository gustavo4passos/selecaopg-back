'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnrollmentSchema extends Schema {
  up () {
    this.create('enrollments', (table) => {
	  table.increments()
	  
	  table.string('entry_semester').notNullable()
	  table.enu('degree', ['masters', 'doctorate']).notNullable()
	  table.string('advisor_name').notNullable()
	  table.string('lattes_link')
	  table.string('undergraduate_university').notNullable()
	  table.string('enade_link')
	  table.string('undergraduate_transcript')
	  table.string('graduate_transcript')
	  table.float('score').notNullable()

      table
      	.integer('user_id')
		.notNullable()
      	.unsigned()
      	.references('id')
      	.inTable('users')
      	.onUpdate('CASCADE')
      	.onDelete('CASCADE')

      table
      	.integer('selection_id')
		.notNullable()
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
