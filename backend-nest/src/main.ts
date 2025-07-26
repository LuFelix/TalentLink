import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CONFIGURAÇÃO DO CORS ---
  // IMPORTANTE: Em produção restringir 'origin' para o domínio do seu frontend.
  app.enableCors({
    origin: 'https://talentlink.local', // Permite requisições APENAS do seu frontend Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite os métodos HTTP necessários
    credentials: true, // Se você for usar cookies ou credenciais em requisições
  });
  // --- FIM DA CONFIGURAÇÃO DO CORS ---
  // --- CONFIGURAÇÃO DO SWAGGER
  const config = new DocumentBuilder()
    .setTitle('API de Autenticação de Usuários')
    .setDescription(
      'Documentação da API TalentLinkpara Autenticação e Gestão de Usuários',
    )
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // --- FIM DA CONFIGURAÇÃO DO SWAGGER ---

  //é uma boa prática ter um prefixo para todas as rotas da API
  //  (/api/auth, /api/users, etc.).
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
