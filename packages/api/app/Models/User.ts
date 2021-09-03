import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Income from 'App/Models/Income';
import Expense from 'App/Models/Expense';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column()
  public password: string;

  @hasMany(() => Income)
  public incomes: HasMany<typeof Income>;

  @hasMany(() => Expense)
  public expenses: HasMany<typeof Expense>;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;
}
