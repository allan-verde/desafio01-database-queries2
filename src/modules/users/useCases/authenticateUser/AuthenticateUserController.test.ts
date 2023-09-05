import request from 'supertest'
import { Connection } from 'typeorm'
import createConnection from '../../../../database'
import { app } from '../../../../shared/infra/http/app'

let connection: Connection

const userTest = {
  name: 'User Example',
  email: 'user@mail.com',
  password: '1234'
}

describe('CreateUserController', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    await request(app).post('/api/v1/users').send(userTest)
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to authenticate an user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: userTest.email,
      password: userTest.password
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body.user.email).toEqual(userTest.email)
  })

  it('should not be able to authenticate an nonexistent user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: '',
      password: userTest.password
    })

    expect(response.status).toBe(401)
  })

  it('should not be able to authenticate an user with incorrect password', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: userTest.email,
      password: '1111'
    })

    expect(response.status).toBe(401)
  })
})
