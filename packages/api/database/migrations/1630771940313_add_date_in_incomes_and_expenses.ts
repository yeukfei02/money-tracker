import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddDateInIncomesAndExpenses extends BaseSchema {
  protected tableName = 'incomes';
  protected tableName2 = 'expenses';

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.timestamp('date', { useTz: true }).notNullable().after('amount');
    });
    this.schema.table(this.tableName2, (table) => {
      table.timestamp('date', { useTz: true }).notNullable().after('amount');
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('date');
    });
    this.schema.table(this.tableName2, (table) => {
      table.dropColumn('date');
    });
  }
}
