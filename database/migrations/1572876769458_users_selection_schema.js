'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersSelectionSchema extends Schema {
  up () {
    this.create('users_selections', (table) => {
      table.increments()

      table
      	.integer('user_id')
      	.unsigned()
      	.references('id')
      	.onTable('users')
      	.onUpdate('CASCADE')
      	.onDelete('CASCADE')

      table
      	.integer('selection_id')
      	.unsigned()
      	.references('id')
      	.onTable('selection')
      	.onUpdate('CASCADE')
      	.onDelete('CASCADE')

      table.timestamps()
    })
  }

  down () {
    this.drop('users_selections')
  }
}

module.exports = UsersSelectionSchema
