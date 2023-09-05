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

describe('ShowUserProfileController', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    await request(app).post('/api/v1/users').send(userTest)
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to show user profile', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: userTest.email,
      password: userTest.password
    })

    const { token } = responseToken.body

    const response = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
  })

  it('should not be able to show user profile with invalid token', async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer invalid_token`
    })

    expect(response.status).toBe(401)
  })
})
