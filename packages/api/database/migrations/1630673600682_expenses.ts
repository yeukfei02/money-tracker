import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Expenses extends BaseSchema {
  protected tableName = 'expenses';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.text('name').notNullable();
      table.text('description').notNullable();
      table.text('type').notNullable();
      table.double('amount').notNullable();
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
