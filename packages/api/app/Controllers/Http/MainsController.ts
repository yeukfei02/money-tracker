// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class MainsController {
  public async index() {
    const response = {
      message: 'money-tracker api',
    };
    return response;
  }
}
