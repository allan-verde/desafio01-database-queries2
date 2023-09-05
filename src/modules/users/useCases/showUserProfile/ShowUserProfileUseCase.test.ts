import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'

import { ShowUserProfileError } from './ShowUserProfileError'

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

const userData = {
  name: 'User Test',
  email: 'use@test.com',
  password: '1234'
}

describe('Show User Profile Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to show user profile', async () => {
    const user = await createUserUseCase.execute(userData)

    const userProfile = await showUserProfileUseCase.execute(user.id as string)

    expect(userProfile).toHaveProperty('id')
    expect(userProfile.id).toBe(user.id)
  })

  it('should not be able to show user profile if user does not exists', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('invalid_id')
    }).rejects.toEqual(new ShowUserProfileError())
  })
})
