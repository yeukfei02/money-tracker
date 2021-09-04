import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Currency from 'App/Models/Currency';
import _ from 'lodash';

export default class CurrenciesController {
  public async index({ response }: HttpContextContract) {
    const currencies = await Currency.all();
    const sortedCurrencies = _.orderBy(currencies, ['id'], ['asc']);

    response.status(200).json({
      message: 'getCurrencies',
      currencies: sortedCurrencies,
    });
  }
}
