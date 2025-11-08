import { describe, it, expect } from 'vitest';
import { Password } from '../../../../src/app/entities/value-objects/password.vo.js';

describe('Password Value Object', () => {
  it('deve comparar corretamente uma senha válida', async () => {
    const plainPassword = 'mySecurePassword123';
    
    // Cria um hash
    const hashedPassword = await Password.createAndHash(plainPassword);

    // Compara
    const isValid = await hashedPassword.compare(plainPassword);
    
    expect(isValid).toBe(true);
  });

  it('deve falhar ao comparar uma senha inválida', async () => {
    const plainPassword = 'mySecurePassword123';
    
    // Cria um hash
    const hashedPassword = await Password.createAndHash(plainPassword);

    // Compara com a senha errada
    const isValid = await hashedPassword.compare('wrongPassword');
    
    expect(isValid).toBe(false);
  });
});