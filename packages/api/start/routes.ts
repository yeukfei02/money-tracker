/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', 'MainsController.index');

Route.group(() => {
  Route.post('/users/signup', 'UsersController.signup');
  Route.post('/users/login', 'UsersController.login');
  Route.get('/users', 'UsersController.index').middleware('authorize');
  Route.get('/users/:id', 'UsersController.show').middleware('authorize');
  Route.put('/users/change-password/:id', 'UsersController.changePassword').middleware('authorize');

  Route.get('/dashboard', 'DashboardController.getData').middleware('authorize');

  Route.post('/incomes/create-income', 'IncomesController.createIncome').middleware('authorize');
  Route.get('/incomes', 'IncomesController.index').middleware('authorize');
  Route.get('/incomes/:id', 'IncomesController.show').middleware('authorize');
  Route.patch('/incomes/:id', 'IncomesController.update').middleware('authorize');
  Route.delete('/incomes/:id', 'IncomesController.delete').middleware('authorize');
  Route.post('/incomes/delete-all', 'IncomesController.deleteAll').middleware('authorize');

  Route.post('/expenses/create-expense', 'ExpensesController.createExpense').middleware(
    'authorize'
  );
  Route.get('/expenses', 'ExpensesController.index').middleware('authorize');
  Route.get('/expenses/:id', 'ExpensesController.show').middleware('authorize');
  Route.patch('/expenses/:id', 'ExpensesController.update').middleware('authorize');
  Route.delete('/expenses/:id', 'ExpensesController.delete').middleware('authorize');
  Route.post('/expenses/delete-all', 'ExpensesController.deleteAll').middleware('authorize');

  Route.get('/currencies', 'CurrenciesController.index').middleware('authorize');
}).prefix('/api');
