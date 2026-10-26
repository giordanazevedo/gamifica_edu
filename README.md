# GamificaEdu

GamificaEdu é uma aplicação web de aprendizagem gamificada. O estudante pratica conteúdos escolares por meio de trilhas e questionários, acompanha seu progresso, estuda com apoio de inteligência artificial e pode disputar duelos 1x1 em tempo real.

**Aplicação publicada:** [https://gamifica-edu.web.app](https://gamifica-edu.web.app)

## Funcionalidades

- **Conta e perfil:** cadastro e login com e-mail e senha ou com uma conta Google. No primeiro acesso, a pessoa escolhe nome e avatar; o perfil também permite alterar o nome e personalizar o avatar.
- **Painel inicial:** mostra XP, sequência de dias, nível e progresso, com atalhos para as áreas de estudo e jogo.
- **Mapa de aprendizagem:** trilhas por matéria com conteúdos do 9º ano e escolha de dificuldade antes de iniciar uma missão.
- **Questionários:** prática por assunto com feedback, pontuação, XP e medalhas. As vidas limitam o início de missões e se regeneram durante a utilização.
- **Estudar com IA:** permite criar questões, pedir explicações ou conversar livremente com a IA para tirar dúvidas em várias mensagens. No chat, o estudante pode informar a matéria, continuar a conversa ou iniciar outra e anexar uma imagem JPG, PNG ou WebP, ou um PDF, de até 10 MB. Os arquivos selecionados são enviados ao serviço de IA para análise; evite incluir informações pessoais.
- **Desafio Multiplicação Rápida:** desafio cronometrado de multiplicação que concede XP pelos acertos.
- **Duelo 1x1:** busca de oponente, convites e partidas em tempo real; também inclui recursos para adicionar e acompanhar amigos.
- **Ranking:** consulta a classificação dos jogadores.
- **Avatares e perfil:** escolha entre avatares disponíveis e personalize sua conta.
- **Layout responsivo:** interface adaptada para uso em telas menores e computadores.

As trilhas apresentam Português, Matemática, Ciências, História, Geografia, Inglês, Arte, Educação Física e Ensino Religioso. Os tópicos disponíveis podem variar conforme o conteúdo cadastrado no projeto.

## Tecnologias

- React 19 e Vite
- Firebase Authentication para contas
- Cloud Firestore para perfis, progresso, ranking e partidas
- Firebase AI Logic para chat, geração de questões e explicações com IA
- Firebase Hosting para publicação
- Capacitor para empacotamento Android
- Lucide React para ícones

## Executar localmente

Requisitos: Node.js compatível com a versão do Vite usada pelo projeto e npm.

```bash
npm install
npm run dev
```

O Vite informa no terminal o endereço local (normalmente `http://localhost:5173`).

## Gerar APK Android

O projeto Android usa Capacitor e carrega a versão web compilada dentro do aplicativo. Para gerar um APK de depuração, tenha Node.js/npm, Java e Android SDK instalados e execute no PowerShell:

Para habilitar o seletor nativo de contas Google no APK:

1. No Firebase Console, abra **Authentication → Sign-in method → Google** e confirme que o provedor está habilitado. Copie o **Web client ID** mostrado em “Web SDK configuration”. Se não houver um, abra o projeto correspondente no Google Cloud Console, vá a **APIs e serviços → Credenciais** e crie/obtenha um OAuth Client ID do tipo **Web application**.
2. No Google Cloud Console, crie um OAuth Client ID do tipo **Android** no mesmo projeto. Use o pacote `com.gamificaedu.app` e a SHA-1 da chave que assina o APK. Para o APK de depuração padrão deste projeto, a SHA-1 é `0A:EC:57:30:7C:83:CD:44:89:A9:15:2F:A6:DE:BD:3E:65:50:B8:45`. Uma chave de release exige outro cadastro Android.
3. Se a tela de consentimento OAuth estiver em modo de teste, adicione as contas Google de teste como usuários de teste.
4. Configure o ID do tipo **Web application** como `VITE_GOOGLE_WEB_CLIENT_ID` no arquivo local `.env.local` (ou no ambiente de build). Não use o ID do cliente Android como `webClientId`.

Os IDs de cliente são identificadores públicos; nunca compartilhe o **Client Secret**. Arquivos `.env.local` não devem ser enviados ao repositório.

```powershell
npm install
$env:VITE_GOOGLE_WEB_CLIENT_ID="seu-client-id-web.apps.googleusercontent.com"
npm run build
npx cap sync android
Push-Location android
.\gradlew.bat assembleDebug
Pop-Location
```

O APK de depuração será criado em `android\app\build\outputs\apk\debug\app-debug.apk`. Para atualizar o conteúdo web dentro do projeto Android, repita o build e a sincronização antes de compilar o APK.

Esse APK é adequado para testes e instalação manual. Para distribuição pela Play Store, gere uma versão de release assinada com uma chave de publicação protegida; não compartilhe essa chave.

### Preparar uma versão para a Google Play

O APK de depuração não é o pacote para distribuir aos alunos. Para a Play Store, gere um Android App Bundle (`.aab`) de release e use o **Play App Signing**: o Google mantém a chave final do app e você assina os envios com uma chave de upload. O Play Protect ainda pode mostrar avisos em instalações diretas fora da Play Store; a publicação na loja oficial é o caminho recomendado, mas não garante que toda verificação ou aviso desapareça.

1. Crie ou acesse uma conta de desenvolvedor na Google Play Console e inicie o cadastro do app. Complete as verificações exigidas pelo Google, o formulário de segurança de dados e as declarações de público-alvo/conteúdo apropriadas para os estudantes. Prepare também a política de privacidade e os materiais da página da loja.
2. Gere uma chave de upload localmente. O comando pede a senha sem colocá-la no comando nem no histórico do terminal:

   ```powershell
   keytool -genkeypair -v -keystore android\app\gamifica-edu-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias gamifica-edu-upload
   ```

   Guarde uma cópia de segurança da keystore e das senhas em local privado e seguro. Não envie a keystore ao Git, não a inclua no APK e não a compartilhe. Se perder a chave de upload, será necessário solicitar a redefinição no Play Console.
3. No PowerShell, configure as variáveis somente na sessão atual. Digite as senhas nos prompts seguros; não as cole no código nem as envie por mensagem:

   ```powershell
   $env:GAMIFICA_KEYSTORE_FILE = (Resolve-Path 'android\app\gamifica-edu-upload.jks').Path
   $env:GAMIFICA_KEY_ALIAS = 'gamifica-edu-upload'
   $env:GAMIFICA_KEYSTORE_PASSWORD = [System.Net.NetworkCredential]::new('', (Read-Host -AsSecureString 'Senha da keystore')).Password
   $env:GAMIFICA_KEY_PASSWORD = [System.Net.NetworkCredential]::new('', (Read-Host -AsSecureString 'Senha da chave')).Password
   npm run build
   npx cap sync android
   Push-Location android
   .\gradlew.bat bundleRelease
   Pop-Location
   Remove-Item Env:GAMIFICA_KEYSTORE_FILE, Env:GAMIFICA_KEY_ALIAS, Env:GAMIFICA_KEYSTORE_PASSWORD, Env:GAMIFICA_KEY_PASSWORD
   ```

   O bundle assinado será criado em `android\app\build\outputs\bundle\release\app-release.aab`. O Gradle interrompe uma compilação de release se a configuração ou a keystore estiver faltando.
4. Envie o `.aab` à Play Console e comece por uma faixa de teste interno/fechado. Antes da distribuição ampla, conclua as revisões e requisitos exibidos pela Play Console.
5. O login Google no app Android também precisa reconhecer a assinatura de produção. Depois de ativar o Play App Signing, copie o certificado SHA‑1 da **chave de assinatura do app** mostrado em **Integridade do app** no Play Console e cadastre-o no Firebase/Google Cloud para o OAuth Android. A SHA‑1 da chave de upload é diferente da chave de assinatura usada pelo Google Play.

O ícone e a tela inicial do Android usam fundo branco e o logo centralizado. Seus arquivos-fonte ficam em `resources/` e podem ser regenerados com `npx capacitor-assets generate --android`.

## Verificação e publicação

```bash
npm run build
npm run lint
```

Para publicar no Firebase Hosting, instale ou disponibilize o Firebase CLI, autentique-se e selecione o projeto configurado em `.firebaserc`:

```bash
firebase login
firebase use gamifica-edu
npm run build
firebase deploy --only hosting
```

O Hosting serve a pasta `dist`; o `firebase.json` também encaminha as rotas da aplicação para `index.html`.

### Página de apresentação e download Android

A página criada a partir do HTML de apresentação fica em `public/inicio.html`, no mesmo domínio do app:

- Apresentação: `https://gamifica-edu.web.app/inicio`
- Aplicativo web: `https://gamifica-edu.web.app/`
- Os botões “Jogar online” abrem o app web; “Baixar app” leva à página de versões do projeto no GitHub.

O Hosting Firebase no plano Spark não aceita publicar arquivos APK. Para disponibilizar o download sem custo, publique o APK como asset de uma versão em GitHub Releases. Até existir uma versão com o arquivo anexado, o link abre a página de versões do projeto.

## Configuração Firebase

A configuração do app cliente está em `src/firebase.js`. Para executar os recursos online, o projeto Firebase precisa estar configurado com:

1. **Authentication:** habilite os provedores de e-mail/senha e Google. Cadastre os domínios de desenvolvimento e produção na lista de domínios autorizados. O login Google usa popup.
2. **Cloud Firestore:** crie o banco e publique regras compatíveis com os recursos do app usando `firestore.rules`.
3. **App Check e IA:** configure o provedor App Check usado pela aplicação e habilite Firebase AI Logic e o modelo utilizado pelo serviço em `src/services/aiQuestionService.js`.
4. **Hosting:** mantenha `dist` como diretório público e as regras de reescrita de SPA de `firebase.json`.

Não publique chaves privadas ou credenciais administrativas no código cliente. As configurações e restrições de provedores devem ser gerenciadas no Firebase Console.

## Estrutura principal

```text
src/
  components/   Telas, questionários, mapa, perfil e duelos
  data/         Currículo e conjuntos de questões
  hooks/        Autenticação e estado de usuário
  services/     Integrações com IA e partidas
  firebase.js   Inicialização dos serviços Firebase
public/         Imagens, logotipo e demais arquivos estáticos
```
