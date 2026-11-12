# App Login Mobile

Aplicativo em React Native (Expo + TypeScript) com tela de login, cadastro e tela principal com navegação por abas.

Feito seguindo o tutorial **React Native: Componentes, Flexbox e Navegação**.

## Telas

- **Login**: e-mail e senha, botão Entrar e link para cadastro
- **Cadastro**: nome, e-mail, senha e confirmação
- **Principal**: abas Início, Busca, Pedidos e Perfil
- **Perfil**: mostra o usuário logado e o botão Sair

## Tecnologias

- React Native com Expo
- TypeScript
- React Navigation (Native Stack e Bottom Tabs)

## Como rodar

Precisa ter o [Node.js](https://nodejs.org) instalado.

```bash
git clone https://github.com/gustavin10/app-mobile-TCS.git
cd app-mobile-TCS
npm install
npx expo start
```

Depois é só:

- apertar `a` para abrir no emulador Android, ou
- ler o QR Code com o app **Expo Go** no celular.

## Estrutura

```
App.tsx
src/
├── navigation/
│   ├── AppRoutes.tsx
│   ├── TabRoutes.tsx
│   └── types.ts
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   └── PerfilScreen.tsx
└── styles/
    └── theme.ts
```
