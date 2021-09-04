import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Expense from 'App/Models/Expense';
import { schema } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
export default class ExpensesController {
  public async createExpense({ request, response }: HttpContextContract) {
    const newExpenseSchema = schema.create({
      name: schema.string({ trim: true }),
      description: schema.string({ trim: true }),
      type: schema.string({ trim: true }),
      currency: schema.string({ trim: true }),
      amount: schema.number(),
      date: schema.date({ format: 'yyyy-MM-dd HH:mm:ss' }),
      user_id: schema.number(),
    });
    const body = await request.validate({ schema: newExpenseSchema });
    console.log('body = ', body);

    if (body) {
      const name = body.name;
      const description = body.description;
      const type = body.type;
      const currency = body.currency;
      const amount = body.amount;
      const date = body.date;
      const user_id = body.user_id;

      const expense = new Expense();
      expense.name = name;
      expense.description = description;
      expense.type = type;
      expense.currency = currency;
      expense.amount = amount;
      expense.date = date;
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

  public async index({ request, response }: HttpContextContract) {
    const pageNumber = request.qs().pageNumber ? request.qs().pageNumber : 1;
    const pageSize = request.qs().pageSize ? request.qs().pageSize : 10;
    const userId = request.qs().userId ? request.qs().userId : 0;
    console.log('pageNumber = ', pageNumber);
    console.log('pageSize = ', pageSize);
    console.log('userId = ', userId);

    const expenses = await Database.from('expenses')
      .where('user_id', userId)
      .paginate(pageNumber, pageSize);
    const expensesJSON = expenses.toJSON();
    console.log('expensesJSON = ', expensesJSON);

    const formattedExpensesList: unknown[] = [];
    if (expensesJSON && expensesJSON.data) {
      const expensesDataList = expensesJSON.data;
      for (let index = 0; index < expensesDataList.length; index++) {
        const item = expensesDataList[index];

        const obj: any = {
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          currency: item.currency,
          amount: item.amount,
          date: item.date,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };

        const expense = await Expense.find(item.id);
        if (expense) {
          const expenseUserList = await expense.related('user').query();
          if (expenseUserList) {
            const user = expenseUserList[0];
            obj.user = user;
          }
        }

        formattedExpensesList.push(obj);
      }
    }

    const allCount = (await Expense.query().where('user_id', userId)).length;

    response.status(200).json({
      message: 'getExpenses',
      expenses: formattedExpensesList,
      count: formattedExpensesList.length,
      allCount: allCount,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const idNum = parseInt(id, 10);

      let expenseObj: any = {};

      const expense = await Expense.find(idNum);
      if (expense) {
        expenseObj.id = expense.id;
        expenseObj.name = expense.name;
        expenseObj.description = expense.description;
        expenseObj.type = expense.type;
        expenseObj.currency = expense.currency;
        expenseObj.amount = expense.amount;
        expenseObj.date = expense.date;
        expenseObj.created_at = expense.created_at;
        expenseObj.updated_at = expense.updated_at;

        const expenseUserList = await expense.related('user').query();
        if (expenseUserList) {
          const user = expenseUserList[0];
          expenseObj.user = user;
        }
      }

      response.status(200).json({
        message: 'getExpenseById',
        expense: expenseObj,
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
