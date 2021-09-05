import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class UsersController {
  public async signup({ request, response }: HttpContextContract) {
    const newSignupSchema = schema.create({
      email: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
    });
    const body = await request.validate({ schema: newSignupSchema });

    if (body) {
      const email = body.email;
      const password = bcrypt.hashSync(body.password);

      const userFromDB = await User.findBy('email', email);
      console.log('userFromDB = ', userFromDB);

      if (!userFromDB) {
        const user = new User();
        user.email = email;
        user.password = password;
        await user.save();

        response.status(201).json({
          message: 'signup',
        });
      } else {
        response.status(400).json({
          message: 'signup error, already have this user email',
        });
      }
    } else {
      response.status(400).json({
        message: 'signup error, no request body',
      });
    }
  }

  public async login({ request, response }: HttpContextContract) {
    const newLoginSchema = schema.create({
      email: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
    });
    const body = await request.validate({ schema: newLoginSchema });

    if (body) {
      const email = body.email;
      const password = body.password;

      const user = await User.findBy('email', email);
      if (user) {
        const hashPasswordFromDB = user.password;
        const isPasswordValid = bcrypt.compareSync(password, hashPasswordFromDB);
        if (isPasswordValid) {
          const jwtSecret = Env.get('JWT_SECRET');
          const token = jwt.sign({ id: uuidv4(), email: email }, jwtSecret, { expiresIn: '1d' });

          response.status(200).json({
            message: 'login',
            token: token,
            userId: user.id,
          });
        } else {
          response.status(400).json({
            message: 'login error, wrong password',
          });
        }
      } else {
        response.status(400).json({
          message: 'login error, no this user',
        });
      }
    } else {
      response.status(400).json({
        message: 'login error, no request body',
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    const users = await User.all();

    const formattedUsersList: unknown[] = [];
    if (users) {
      for (let index = 0; index < users.length; index++) {
        const item = users[index];

        const obj: any = {
          id: item.id,
          email: item.email,
          password: item.password,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };

        const incomes = await item.related('incomes').query();
        const expenses = await item.related('expenses').query();
        obj.incomes = incomes;
        obj.expenses = expenses;

        formattedUsersList.push(obj);
      }
    }

    response.status(200).json({
      message: 'getUsers',
      users: formattedUsersList,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const idNum = parseInt(id, 10);

      let userObj: any = {};

      const user = await User.find(idNum);
      if (user) {
        userObj.id = user.id;
        userObj.email = user.email;
        userObj.password = user.password;
        userObj.created_at = user.created_at;
        userObj.updated_at = user.updated_at;

        const incomes = await user.related('incomes').query();
        const expenses = await user.related('expenses').query();
        userObj.incomes = incomes;
        userObj.expenses = expenses;
      }

      response.status(200).json({
        message: 'getUserById',
        user: userObj,
      });
    } else {
      response.status(400).json({
        message: 'getUserById error, no this id',
      });
    }
  }

  public async changePassword({ request, response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const newChangePasswordSchema = schema.create({
        old_password: schema.string({ trim: true }),
        new_password: schema.string({ trim: true }),
      });
      const body = await request.validate({ schema: newChangePasswordSchema });

      if (body) {
        const idNum = parseInt(id, 10);

        const oldPassword = body.old_password;
        const newPassword = body.new_password;

        const user = await User.findOrFail(idNum);
        const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
        if (isPasswordValid) {
          user.password = bcrypt.hashSync(newPassword);
          await user.save();

          response.status(200).json({
            message: 'changePassword',
          });
        } else {
          response.status(400).json({
            message: 'changePassword error, wrong old password',
          });
        }
      }
    } else {
      response.status(400).json({
        message: 'changePassword error, no this id',
      });
    }
  }
}
