import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export default class UsersController {
  public async signup({ request, response }: HttpContextContract) {
    const body = request.body();
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
    const body = request.body();
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

    response.status(200).json({
      message: 'getUsers',
      users: users,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const idNum = parseInt(id, 10);

      const user = await User.find(idNum);

      response.status(200).json({
        message: 'getUserById',
        user: user,
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
      const body = request.body();
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
