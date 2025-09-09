import { beforeAll, afterAll, beforeEach } from 'vitest';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente para os testes
config({ path: '.env.test' });

// Configurações globais para os testes
beforeAll(async () => {
  // Configurações que devem ser executadas antes de todos os testes
  process.env.NODE_ENV = 'test';
});

beforeEach(async () => {
  // Configurações que devem ser executadas antes de cada teste
  // Aqui você pode limpar o banco de dados ou resetar mocks
});

afterAll(async () => {
  // Cleanup após todos os testes
});
