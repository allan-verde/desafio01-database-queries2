import request from 'supertest';
import { app } from '../../../../app';
import { Connection } from 'typeorm'
import createConnection from '../../../../database';

let connection: Connection

const user_test = {
  name: 'User Example',
  email: 'user@mail.com',
  password: '1234'
}

describe('CreateUserController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post('/api/v1/users').send(user_test);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: user_test.email,
      password: user_test.password
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toEqual(user_test.email);
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: '',
      password: user_test.password
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate an user with incorrect password", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: user_test.email,
      password: '1111'
    });

    expect(response.status).toBe(401);
  });
});
