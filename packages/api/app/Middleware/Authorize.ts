import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import jwt from 'jsonwebtoken';

export default class Authorize {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      const token =
        request.request.headers && request.request.headers.authorization
          ? request.request.headers.authorization.replace('Bearer ', '').trim()
          : '';
      console.log('token = ', token);

      if (token) {
        const decoded = await jwt.verify(token, Env.get('JWT_SECRET'));
        console.log('decoded = ', decoded);
        if (decoded) {
          await next();
        }
      } else {
        response.status(400).json({
          message: 'Authorize middleware error, please check token in request authorization header',
        });
      }
    } catch (e) {
      console.log('Authorize middleware error = ', e);
      response.status(400).json({
        message: `Authorize middleware error, error = ${e.message}`,
      });
    }
  }
}
