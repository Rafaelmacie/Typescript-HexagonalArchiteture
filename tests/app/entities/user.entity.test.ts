import { describe, it, expect, beforeEach } from 'vitest';
import { User } from '../../../src/app/entities/user.entity.js';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('User Entity', () => {
  let userData: { name: string; email: string; password: string };

  // Reseta os dados antes de cada teste
  beforeEach(() => {
    userData = {
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'password123',
    };
  });

  it('deve criar um usuário com sucesso', async () => {
    const user = await User.create(userData);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBeTypeOf('string');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@test.com');
    expect(user.password).not.toBe('password123'); // Deve estar hasheada
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it('deve falhar ao criar com um email inválido', async () => {
    userData.email = 'invalid-email';
    
    await expect(User.create(userData))
      .rejects.toThrow('Invalid email format.');
  });

  it('deve falhar ao criar com uma senha curta', async () => {
    userData.password = 'short';
    
    await expect(User.create(userData))
      .rejects.toThrow('Password must be at least 8 characters long.');
  });

  it('deve atualizar um usuário com sucesso', async () => {
    const user = await User.create(userData);
    const oldUpdateDate = user.updated_at;

    await delay(10);

    const newUpdateData = {
      name: 'John Doe Updated',
      email: 'john.updated@test.com',
    };

    user.update(newUpdateData);

    expect(user.name).toBe(newUpdateData.name);
    expect(user.email).toBe(newUpdateData.email);
    expect(user.updated_at).not.toEqual(oldUpdateDate);
  });

  // Requisito da Atividade: "validar a falha ao tentar atualizar..."
  it('deve falhar ao atualizar com um nome curto', async () => {
    const user = await User.create(userData);
    
    expect(() => user.update({ name: 'ab', email: 'fail@test.com' }))
      .toThrow('Name is too short');
  });

  it('deve falhar ao atualizar com um email inválido', async () => {
    const user = await User.create(userData);
    
    expect(() => user.update({ name: 'Valid Name', email: 'invalid-email' }))
      .toThrow('Invalid email format.');
  });

  // Requisito da Atividade: "implementar testes para validar os métodos delete, restore"
  it('deve deletar (soft delete) um usuário', async () => {
    const user = await User.create(userData);
    expect(user.deleted_at).toBe(null); // 'null' ou 'undefined'

    user.delete();
    
    expect(user.deleted_at).toBeInstanceOf(Date);
  });

  it('deve restaurar um usuário deletado', async () => {
    const user = await User.create(userData);
    user.delete(); // Deleta primeiro
    expect(user.deleted_at).toBeInstanceOf(Date);

    user.restore(); // Restaura
    
    expect(user.deleted_at).toBe(null);
  });
});