import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository.js';
import { CreateUserUseCase } from '../../../src/app/useCases/create-user.useCase.js';

let userRepository: InMemoryUserRepository;
let sut: CreateUserUseCase; // SUT = System Under Test

// Roda antes de CADA teste
beforeEach(() => {
  userRepository = new InMemoryUserRepository();
  sut = new CreateUserUseCase(userRepository);
});

describe('Create User Use Case', () => {
  it('deve criar um novo usuário', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'password123',
    };

    const output = await sut.execute(input);

    expect(output.id).toBeTypeOf('string');
    expect(userRepository.users.length).toBe(1);
    expect(userRepository.users[0].name).toBe('John Doe');
  });

  it('não deve criar um usuário com email duplicado', async () => {
    // Cria um usuário manualmente no repo em memória
    await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'password123',
    });

    // Tenta criar de novo
    await expect(
      sut.execute({
        name: 'Jane Doe',
        email: 'john@doe.com',
        password: 'password456',
      })
    ).rejects.toThrow('User with this email is already registered');
  });
});