# GUIA COMPLETO DE CONFIGURAÇÃO E IMPLANTAÇÃO — NOWTECH SOLAR
## Firebase (Spark Gratuito) + Vercel + Aplicativo Mobile (PWA)

**URL de Produção na Vercel:** `https://calendarianowtech.vercel.app/`

---

## 1. Como Criar o Projeto no Firebase (Plano Gratuito Spark)
1. Acesse o [Console do Firebase](https://console.firebase.google.com/) com a conta do Google da NowTech Solar.
2. Clique em **"Adicionar projeto"** (ou "Add project").
3. Digite o nome do projeto (ex.: `nowtech-solar-app` ou `calendario-nowtech`).
4. Desative o Google Analytics (opcional) ou mantenha ativo se preferir.
5. Conclua a criação do projeto.
   - **IMPORTANTE:** O plano padrão é o **Spark (Gratuito)**. Não é necessário ativar o plano Blaze nem vincular cartão de crédito.

---

## 2. Como Habilitar o Firebase Authentication (E-mail e Senha)
1. No menu lateral do Firebase Console, clique em **Criação (Build)** > **Authentication**.
2. Clique em **"Começar"** (Get Started).
3. Na aba **"Sign-in method"**, clique em **"E-mail/senha"** (Email/Password).
4. Ative a primeira opção (**"E-mail/senha"**) e clique em **Salvar**.
5. Na aba **"Users"**, você pode clicar em **"Adicionar usuário"** para cadastrar os e-mails e senhas dos colaboradores da NowTech Solar (ex.: `carlos@nowtechsolar.com`, `william@nowtechsolar.com`, `wellington@nowtechsolar.com`, etc.).

---

## 3. Como Criar o Cloud Firestore
1. No menu lateral, clique em **Criação (Build)** > **Firestore Database**.
2. Clique em **"Criar banco de dados"** (Create database).
3. Escolha o local do banco de dados (Cloud Region):
   - **Recomendado para o Brasil/Nordeste:** `southamerica-east1` (São Paulo) ou `us-east1`.
4. Escolha **"Iniciar no modo de produção"** (Start in production mode) e clique em **Criar**.

---

## 4. Como Obter as Chaves do Aplicativo Web
1. No Firebase Console, clique na engrenagem no canto superior esquerdo (**Configurações do projeto** / Project Settings).
2. Na aba **Geral**, desça até a seção **"Seus aplicativos"** e clique no ícone **Web (</>)**.
3. Dê o apelido de `NowTech Solar Web` e clique em **Registrar aplicativo**.
4. O Firebase exibirá um objeto `firebaseConfig` com as chaves:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

---

## 5. Como Cadastrar as Variáveis de Ambiente na Vercel
1. Acesse o painel da [Vercel](https://vercel.com/) e entre no projeto **`calendarianowtech`**.
2. Vá em **Settings** > **Environment Variables**.
3. Adicione as 6 variáveis a seguir (selecionando os ambientes *Production*, *Preview* e *Development*):

| Nome da Variável | Valor (do seu firebaseConfig) |
|---|---|
| `VITE_FIREBASE_API_KEY` | Seu `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Seu `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | Seu `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Seu `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Seu `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | Seu `appId` |

4. Após salvar as variáveis, vá na aba **Deployments** da Vercel e clique em **"Redeploy"** no último deploy (ou faça um novo push no GitHub).

---

## 6. Como Aplicar as Regras de Segurança do Firestore
O arquivo `firestore.rules` já está pronto na raiz deste repositório com as seguintes proteções:
- Visitantes não autenticados não têm acesso a leitura ou escrita.
- Colaboradores autenticados têm leitura garantida para campanhas, tarefas, aniversários e eventos.
- Administradores têm permissão de criação, edição e exclusão.
- Colaboradores podem atualizar tarefas atribuídas a eles.

Para aplicar:
- **Pelo Firebase Console:** Copie o conteúdo de `firestore.rules`, acesse o menu **Firestore Database** > aba **Regras (Rules)**, cole o código e clique em **Publicar**.
- **Ou via Firebase CLI:** Execute no terminal:
  ```bash
  firebase deploy --only firestore:rules
  ```

---

## 7. Como Testar e Instalar o Aplicativo no Celular (PWA)

### No Celular Android (Chrome / Samsung Internet):
1. Acesse `https://calendarianowtech.vercel.app/` pelo Google Chrome.
2. O sistema exibirá o aviso do app ou o botão **"Instalar Aplicativo NowTech"**.
3. Alternativamente, toque nos 3 pontinhos do Chrome (canto superior direito) e toque em **"Adicionar à tela inicial"** ou **"Instalar aplicativo"**.
4. O ícone oficial da NowTech Solar será criado na gaveta de aplicativos do aparelho.

### No iPhone / iPad (Safari):
1. Acesse `https://calendarianowtech.vercel.app/` pelo Safari da Apple.
2. Toque no botão de **Compartilhar** (ícone quadrado com uma seta para cima, no menu inferior do Safari).
3. Role para baixo e selecione a opção **"Adicionar à Tela de Início"** (Add to Home Screen).
4. Confirme o nome **NowTech Solar** e toque em **Adicionar**.
5. O app abrirá em tela cheia, sem barra de endereços, como um aplicativo nativo do iOS.

---

## 8. Arquitetura de Contingência e Tolerância a Falhas
- **Modo Offline & Standalone:** Se o usuário estiver sem internet ou antes de preencher as variáveis da Vercel, o aplicativo continua 100% funcional através de armazenamento local seguro e `BroadcastChannel` para sincronização imediata entre abas/janelas.
- **Backup e Restauração:** O painel de perfil conta com exportação e importação de backup em arquivo JSON para garantir redundância total dos dados de marketing da empresa.
