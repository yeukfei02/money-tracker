import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Currencies extends BaseSchema {
  protected tableName = 'currencies';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.text('symbol').notNullable();
      table.text('name').notNullable();
      table.text('symbol_native').notNullable();
      table.integer('decimal_digits').notNullable();
      table.double('rounding').notNullable();
      table.text('code').notNullable();
      table.text('name_plural').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
