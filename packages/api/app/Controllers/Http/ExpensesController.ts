import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Expense from 'App/Models/Expense';
import { schema } from '@ioc:Adonis/Core/Validator';
export default class ExpensesController {
  public async createExpense({ request, response }: HttpContextContract) {
    const newExpenseSchema = schema.create({
      name: schema.string({ trim: true }),
      description: schema.string({ trim: true }),
      type: schema.string({ trim: true }),
      amount: schema.number(),
      user_id: schema.number(),
    });
    const body = await request.validate({ schema: newExpenseSchema });
    console.log('body = ', body);

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

    const formattedExpensesList: unknown[] = [];
    if (expenses) {
      for (let index = 0; index < expenses.length; index++) {
        const item = expenses[index];

        const obj: any = {
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          amount: item.amount,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };

        const incomeUserList = await item.related('user').query();
        if (incomeUserList) {
          const user = incomeUserList[0];
          obj.user = user;
        }

        formattedExpensesList.push(obj);
      }
    }

    response.status(200).json({
      message: 'getExpenses',
      expenses: formattedExpensesList,
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
        expenseObj.amount = expense.amount;
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
