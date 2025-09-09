import { beforeAll, afterAll } from 'vitest';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente para os testes e2e
config({ path: '.env.test' });

// Configurações específicas para testes e2e
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  // Aqui você pode configurar um servidor de teste ou banco de dados de teste
});

afterAll(async () => {
  // Cleanup após todos os testes e2e
  // Aqui você pode parar o servidor de teste ou limpar o banco de dados
});
