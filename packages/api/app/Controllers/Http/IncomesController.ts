import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Income from 'App/Models/Income';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class IncomesController {
  public async createIncome({ request, response }: HttpContextContract) {
    const newIncomeSchema = schema.create({
      name: schema.string({ trim: true }),
      description: schema.string({ trim: true }),
      type: schema.string({ trim: true }),
      amount: schema.number(),
      user_id: schema.number(),
    });
    const body = await request.validate({ schema: newIncomeSchema });
    console.log('body = ', body);

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

    const formattedIncomesList: unknown[] = [];
    if (incomes) {
      for (let index = 0; index < incomes.length; index++) {
        const item = incomes[index];

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

        formattedIncomesList.push(obj);
      }
    }

    response.status(200).json({
      message: 'getIncomes',
      incomes: formattedIncomesList,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const idNum = parseInt(id, 10);

      let incomeObj: any = {};

      const income = await Income.find(idNum);
      if (income) {
        incomeObj.id = income.id;
        incomeObj.name = income.name;
        incomeObj.description = income.description;
        incomeObj.type = income.type;
        incomeObj.amount = income.amount;
        incomeObj.created_at = income.created_at;
        incomeObj.updated_at = income.updated_at;

        const incomeUserList = await income.related('user').query();
        if (incomeUserList) {
          const user = incomeUserList[0];
          incomeObj.user = user;
        }
      }

      response.status(200).json({
        message: 'getIncomeById',
        income: incomeObj,
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
