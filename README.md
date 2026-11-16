# GM Cursos — App Mobile (N2)

App da **Plataforma de Cursos** em React Native (Expo + TypeScript).

O app usa a **mesma API e o mesmo banco do sistema web**:
[plataforma-cursos-nestjs](https://github.com/gustavin10/plataforma-cursos-nestjs) (NestJS + Prisma + PostgreSQL + JWT).
Tudo que é cadastrado no site aparece no app e vice-versa: usuários, cursos, trilhas, matrículas, assinaturas e pagamentos.

## Funcionalidades

| Requisito | No app | Na API |
|---|---|---|
| Autenticar e registrar usuário | Telas **Login** e **Cadastro** | `POST /auth/login` (JWT) e `POST /usuarios` |
| Exibir Trilhas, Cursos e Módulos | Aba **Início**, tela **Trilha** e tela **Curso** | `GET /aluno/trilhas`, `/aluno/cursos`, `/aluno/cursos/:id` |
| Exibir a lista dos meus cursos | Aba **Meus Cursos** | `GET /aluno/meus-cursos` |
| Exibir curso e aula do curso | Telas **Curso** e **Aula** (aulas bloqueadas sem matrícula) | `GET /aluno/aulas/:id` |
| Matricular no curso e efetuar pagamento | Tela **Pagamento**: escolhe o plano e Pix/Cartão/Boleto (simulado) | `POST /aluno/matriculas` → cria Assinatura + Pagamento + Matrícula |
| Notificação de boas-vindas com **Kafka** | Alerta ao entrar + aba **Notificações** com badge | Produtor no cadastro, consumidor cria a notificação |

Quem já tem assinatura ativa se matricula direto, sem pagar de novo.

## Mensageria (Kafka)

```
 App ou Site ── POST /usuarios ──▶ UsuariosService ──(PRODUTOR)──▶ Kafka: tópico "usuario-cadastrado"
                                                                          │
                                       NotificacoesConsumer (CONSUMIDOR) ◀┘  grupo "servico-notificacoes"
                                       grava "Bem-vindo(a), Fulano!" na tabela notificacoes
                                                                          │
 App ◀── GET /notificacoes (a cada 5s) ───────────────────────────────────┘  alerta + badge
```

Um usuário cadastrado **pelo site** também recebe a boas-vindas e vê a mensagem ao entrar no app.

## Como rodar

**1. API (projeto plataforma-cursos-nestjs)**

```bash
cd plataforma-cursos-nestjs/backend
docker compose up -d          # PostgreSQL + Kafka
npx prisma migrate dev        # cria/atualiza as tabelas (inclui notificacoes)
npm run start:dev             # API em http://localhost:3000 (Swagger em /api)
```

O site continua igual: `cd frontend && npm run dev`.

**2. App**

```bash
npm install
npx expo start
```

Abra no **Expo Go** (celular na mesma rede Wi-Fi do PC) ou aperte `a` para o emulador Android / `w` para o navegador.
O app descobre o IP do PC sozinho pelo Expo. Se precisar, crie um `.env` com `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000`.

> No Windows, libere a porta 3000 no firewall para o celular conseguir acessar a API.

### Demonstrando o Kafka

1. Cadastre um usuário no app (ou no site).
2. No terminal da API aparece `Mensagem publicada em "usuario-cadastrado"`, depois
   `Usuário cadastrado recebido` e `Notificação de boas-vindas criada`.
3. Entre no app com esse usuário: aparece o alerta de boas-vindas e o badge na aba **Notificações**.

Para ver as mensagens direto no tópico:

```bash
docker exec -it plataforma-cursos-kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic usuario-cadastrado --from-beginning
```

## Estrutura

```
App.tsx
src/
├── components/ui.tsx        # Botao, CursoCard, Estado (carregando/erro), Vazio
├── hooks/useCarregar.ts     # busca dados ao focar a tela
├── navigation/              # Stack + Bottom Tabs (badge de notificações)
├── screens/                 # Login, Registro, Home, Trilha, Curso, Aula, Pagamento, MeusCursos, Notificacoes, Perfil
├── services/api.ts          # chamadas HTTP para a API NestJS (envia o token JWT)
├── services/sessao.ts       # token e usuário logado
└── utils/                   # formatação (R$, dd/mm/aaaa) e alertas
```

## Tecnologias

React Native · Expo · TypeScript · React Navigation · NestJS · Prisma · PostgreSQL · JWT · Apache Kafka (KafkaJS) · Docker
