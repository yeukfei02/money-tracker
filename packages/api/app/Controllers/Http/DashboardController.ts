import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Income from 'App/Models/Income';
import Expense from 'App/Models/Expense';
import dayjs from 'dayjs';
import _ from 'lodash';

export default class DashboardController {
  public async getData({ request, response }: HttpContextContract) {
    const userId = request.qs().userId ? request.qs().userId : 0;
    console.log('userId = ', userId);

    const incomesList = await Income.query().where('user_id', userId);
    const expensesList = await Expense.query().where('user_id', userId);

    let finalIncomesList: unknown[] = [];
    if (incomesList) {
      const formattedIncomesList = incomesList.map((item: any) => {
        const date = dayjs(item.date).format('YYYY-MM-DD');
        item.date = date;
        return item;
      });
      finalIncomesList = _.orderBy(formattedIncomesList, ['date'], ['asc']);
    }

    let finalExpensesList: unknown[] = [];
    if (expensesList) {
      const formattedExpensesList = expensesList.map((item: any) => {
        const date = dayjs(item.date).format('YYYY-MM-DD');
        item.date = date;
        return item;
      });
      finalExpensesList = _.orderBy(formattedExpensesList, ['date'], ['asc']);
    }

    response.status(200).json({
      message: 'getDashboardData',
      incomesData: finalIncomesList,
      expensesData: finalExpensesList,
    });
  }
}
