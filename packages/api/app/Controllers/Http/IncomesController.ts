import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Income from 'App/Models/Income';

export default class IncomesController {
  public async createIncome({ request, response }: HttpContextContract) {
    const body = request.body();
    if (body) {
      const name = body.name;
      const description = body.description;
      const type = body.type;
      const amount = body.amount;
      const user_id = body.user_id;

      const income = new Income();
      income.name = name;
      income.description = description;
      income.type = type;
      income.amount = amount;
      income.user_id = user_id;
      await income.save();

      response.status(200).json({
        message: 'createIncome',
      });
    } else {
      response.status(400).json({
        message: 'createIncome error, no request body',
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    const incomes = await Income.all();

    response.status(200).json({
      message: 'getIncomes',
      incomes: incomes,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const idNum = parseInt(id, 10);

      const income = await Income.find(idNum);

      response.status(200).json({
        message: 'getIncomeById',
        income: income,
      });
    } else {
      response.status(400).json({
        message: 'getIncomeById error, no this id',
      });
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const idNum = parseInt(id, 10);

      const income = await Income.find(idNum);
      if (income) {
        income.delete();

        response.status(200).json({
          message: 'deleteIncomeById',
        });
      } else {
        response.status(400).json({
          message: 'deleteIncomeById error, no this id',
        });
      }
    } else {
      response.status(400).json({
        message: 'deleteIncomeById error, please provide id',
      });
    }
  }
}
