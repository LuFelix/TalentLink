import axios from 'axios';
import * as bcrypt from 'bcrypt'; // Você precisará do bcrypt para hashear a senha do admin, se for necessário autenticar o script

const API_BASE_URL = 'http://localhost:3000/api/users'; // Ajuste esta URL se seu backend não estiver em localhost:3000
const ADMIN_EMAIL = 'admin@example.com'; // Use o email de um admin existente no seu DB
const ADMIN_PASSWORD = 'Senha123!'; // Use a senha DESHASHEADA do admin existente

async function seedUsers(numberOfUsers: number) {
  try {
    console.log('Iniciando o processo de seed de usuários...');

    // 1. Obter um token JWT para o admin
    console.log('Obtendo token JWT para o admin...');
    const authResponse = await axios.post(
      'http://localhost:3000/api/auth/login',
      {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    );
    const adminToken = authResponse.data.access_token;
    console.log('Token JWT obtido com sucesso.');

    // 2. Criar os usuários
    for (let i = 1; i <= numberOfUsers; i++) {
      const email = `testuser${Date.now()}_${i}@example.com`; // Garante emails únicos
      const password = 'Senha1!'; // Senha padrão para todos os usuários de teste
      const roles = ['user']; // Todos como user, você pode variar aqui se quiser
      const isActive = true;

      try {
        await axios.post(
          `${API_BASE_URL}/register`, // Assumindo que seu endpoint de registro é este
          { email, password, roles, isActive },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`, // Autentica a requisição com o token do admin
            },
          },
        );
        console.log(
          `Usuário ${i}/${numberOfUsers} (${email}) criado com sucesso.`,
        );
      } catch (userError: any) {
        console.error(
          `Erro ao criar o usuário ${email}:`,
          userError.response?.data || userError.message,
        );
        // Continue mesmo se um usuário falhar para tentar os próximos
      }
    }
    console.log(
      `Processo de seed concluído. ${numberOfUsers} usuários tentaram ser criados.`,
    );
  } catch (error: any) {
    console.error(
      'Erro geral no script de seed:',
      error.response?.data || error.message,
    );
    if (error.response && error.response.status === 401) {
      console.error(
        'Verifique se as credenciais do admin (ADMIN_EMAIL, ADMIN_PASSWORD) estão corretas e se o backend está rodando.',
      );
    }
  }
}

// Executar o script
seedUsers(250);
