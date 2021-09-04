import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddCurrencyInIncomeAndExpenses extends BaseSchema {
  protected tableName = 'incomes';
  protected tableName2 = 'expenses';

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('currency').notNullable().after('type');
    });
    this.schema.table(this.tableName2, (table) => {
      table.string('currency').notNullable().after('type');
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('currency');
    });
    this.schema.table(this.tableName2, (table) => {
      table.dropColumn('currency');
    });
  }
}
