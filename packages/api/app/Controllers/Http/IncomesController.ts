import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Income from 'App/Models/Income';
import { schema } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import _ from 'lodash';

export default class IncomesController {
  public async createIncome({ request, response }: HttpContextContract) {
    const newIncomeSchema = schema.create({
      name: schema.string({ trim: true }),
      description: schema.string({ trim: true }),
      type: schema.string({ trim: true }),
      currency: schema.string({ trim: true }),
      amount: schema.number(),
      date: schema.date({ format: 'yyyy-MM-dd HH:mm:ss' }),
      user_id: schema.number(),
    });
    const body = await request.validate({ schema: newIncomeSchema });
    console.log('body = ', body);

    if (body) {
      const name = body.name;
      const description = body.description;
      const type = body.type;
      const currency = body.currency;
      const amount = body.amount;
      const date = body.date;
      const user_id = body.user_id;

      const income = new Income();
      income.name = name;
      income.description = description;
      income.type = type;
      income.currency = currency;
      income.amount = amount;
      income.date = date;
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

  public async index({ request, response }: HttpContextContract) {
    const pageNumber = request.qs().pageNumber ? request.qs().pageNumber : 1;
    const pageSize = request.qs().pageSize ? request.qs().pageSize : 10;
    const userId = request.qs().userId ? request.qs().userId : 0;
    console.log('pageNumber = ', pageNumber);
    console.log('pageSize = ', pageSize);
    console.log('userId = ', userId);

    const incomes = await Database.from('incomes')
      .where('user_id', userId)
      .paginate(pageNumber, pageSize);
    const incomesJSON = incomes.toJSON();
    console.log('incomesJSON = ', incomesJSON);

    const formattedIncomesList: unknown[] = [];
    if (incomesJSON && incomesJSON.data) {
      const incomesDataList = incomesJSON.data;
      for (let index = 0; index < incomesDataList.length; index++) {
        const item = incomesDataList[index];

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

        const income = await Income.find(item.id);
        if (income) {
          const incomeUserList = await income.related('user').query();
          if (incomeUserList) {
            const user = incomeUserList[0];
            obj.user = user;
          }
        }

        formattedIncomesList.push(obj);
      }
    }

    const orderByIncomesList = !_.isEmpty(formattedIncomesList)
      ? _.orderBy(formattedIncomesList, ['id'], ['asc'])
      : [];
    const allCount = (await Income.query().where('user_id', userId)).length;

    response.status(200).json({
      message: 'getIncomes',
      incomes: orderByIncomesList,
      count: orderByIncomesList.length,
      allCount: allCount,
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
        incomeObj.currency = income.currency;
        incomeObj.amount = income.amount;
        incomeObj.date = income.date;
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

  public async update({ request, params, response }: HttpContextContract) {
    const newIncomeSchema = schema.create({
      name: schema.string({ trim: true }),
      description: schema.string({ trim: true }),
      type: schema.string({ trim: true }),
      currency: schema.string({ trim: true }),
      amount: schema.number(),
      date: schema.date({ format: 'yyyy-MM-dd HH:mm:ss' }),
      user_id: schema.number(),
    });
    const body = await request.validate({ schema: newIncomeSchema });
    console.log('body = ', body);

    if (body) {
      const name = body.name;
      const description = body.description;
      const type = body.type;
      const currency = body.currency;
      const amount = body.amount;
      const date = body.date;
      const user_id = body.user_id;

      const id = params.id;
      if (id) {
        const idNum = parseInt(id, 10);
        const income = await Income.findOrFail(idNum);
        income.name = name;
        income.description = description;
        income.type = type;
        income.currency = currency;
        income.amount = amount;
        income.date = date;
        income.user_id = user_id;
        await income.save();
      }

      response.status(200).json({
        message: 'updateIncome',
      });
    } else {
      response.status(400).json({
        message: 'updateIncome error, no request body',
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

  public async deleteAll({ request, response }: HttpContextContract) {
    const body = request.body();
    if (body) {
      const userId = body.userId;
      await Income.query().where('user_id', userId).delete();

      response.status(200).json({
        message: 'deleteAllIncomeByUserId',
      });
    } else {
      response.status(400).json({
        message: 'deleteAllIncomeByUserId error, please provide request body userId',
      });
    }
  }
}
