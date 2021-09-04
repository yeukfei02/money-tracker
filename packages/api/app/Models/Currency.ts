import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Currency extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public symbol: string;

  @column()
  public name: string;

  @column()
  public symbol_native: string;

  @column()
  public decimal_digits: number;

  @column()
  public rounding: number;

  @column()
  public code: string;

  @column()
  public name_plural: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
