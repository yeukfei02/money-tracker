import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Expense from 'App/Models/Expense';

export default class ExpensesController {
  public async createExpense({ request, response }: HttpContextContract) {
    const body = request.body();
    if (body) {
      const name = body.name;
      const description = body.description;
      const type = body.type;
      const amount = body.amount;
      const user_id = body.user_id;

      const expense = new Expense();
      expense.name = name;
      expense.description = description;
      expense.type = type;
      expense.amount = amount;
      expense.user_id = user_id;
      await expense.save();

      response.status(200).json({
        message: 'createExpense',
      });
    } else {
      response.status(400).json({
        message: 'createExpense error, no request body',
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    const expenses = await Expense.all();

    response.status(200).json({
      message: 'getExpenses',
      expenses: expenses,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const idNum = parseInt(id, 10);

      const expense = await Expense.find(idNum);

      response.status(200).json({
        message: 'getExpenseById',
        expense: expense,
      });
    } else {
      response.status(400).json({
        message: 'getExpenseById error, no this id',
      });
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const idNum = parseInt(id, 10);

      const expense = await Expense.find(idNum);
      if (expense) {
        expense.delete();

        response.status(200).json({
          message: 'deleteExpenseById',
        });
      } else {
        response.status(400).json({
          message: 'deleteExpenseById error, no this id',
        });
      }
    } else {
      response.status(400).json({
        message: 'deleteExpenseById error, please provide id',
      });
    }
  }
}
