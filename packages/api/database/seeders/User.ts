import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';
import bcrypt from 'bcryptjs';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({ email: 'test@email.com', password: bcrypt.hashSync('test') });
  }
}
