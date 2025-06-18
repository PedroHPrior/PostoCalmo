# 📱 PostoCalmo - Aplicativo Híbrido (Web & Mobile)

O **PostoCalmo** é uma aplicação voltada à visualização e escolha inteligente de postos de saúde com base em critérios como localização e nível de ocupação. Este repositório contém o front-end do projeto desenvolvido com **React Native via Expo**, com suporte a múltiplas plataformas (Web e Mobile).

---

## 🧩 Tecnologias Utilizadas

### Core
* [React Native](https://reactnative.dev/) - Framework para desenvolvimento mobile
* [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
* [Expo](https://expo.dev/) - Plataforma para desenvolvimento React Native
* [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática

### Navegação
* [React Navigation](https://reactnavigation.org/) - Roteamento e navegação
* [React Native Screens](https://github.com/software-mansion/react-native-screens) - Navegação nativa
* [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context) - Gerenciamento de áreas seguras

### Mapas e Localização
* [React Native Maps](https://github.com/react-native-maps/react-native-maps) - Componente de mapas
* [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) - Geolocalização

### UI/UX
* [@react-native-community/slider](https://github.com/callstack/react-native-slider) - Componente de slider
* [Expo Status Bar](https://docs.expo.dev/versions/latest/sdk/status-bar/) - Controle da barra de status

### Desenvolvimento
* [Babel](https://babeljs.io/) - Transpilador JavaScript
* [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
* [@types/react](https://www.npmjs.com/package/@types/react) - Definições de tipos para React
* [@types/react-native](https://www.npmjs.com/package/@types/react-native) - Definições de tipos para React Native

---

## 📁 Estrutura de Pastas

```bash
📦postocalmo
 ┣ 📂assets          # Imagens, ícones e outros recursos estáticos
 ┣ 📂components      # Componentes reutilizáveis
 ┣ 📂constants       # Constantes globais e estilos compartilhados
 ┣ 📂screens         # Telas principais (Login, Registro, Mapa)
 ┣ 📂services        # Integrações com APIs externas
 ┣ 📜App.tsx         # Arquivo principal da aplicação
 ┣ 📜package.json    # Gerenciador de dependências e scripts
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

* Node.js (v18+)
* NPM ou Yarn
* Expo CLI
* Backend do PostoCalmo rodando localmente

### 1. Instalação do Expo CLI (caso não tenha)

```bash
npm install -g expo-cli
```

### 2. Clone o Repositório

```bash
git clone https://github.com/PedroHPrior/projeto_abex.git
cd postocalmo
```

### 3. Instale as Dependências

```bash
npm install
```

### 4. Configure o Backend

1. Clone o repositório do backend:
```bash
git clone https://github.com/seu-usuario/postocalmo-backend.git
cd postocalmo-backend
npm install
```

2. Inicie o servidor backend:
```bash
npm start
```

3. Configure a URL da API:
   - Abra o arquivo `postocalmo/constants/api.ts`
   - Ajuste a `API_URL` de acordo com seu ambiente:
     ```typescript
     // Para emulador Android
     export const API_URL = "http://10.0.2.2:3000/api";
     
     // Para iOS ou Web
     export const API_URL = "http://localhost:3000/api";
     
     // Para dispositivo físico
     export const API_URL = "http://SEU_IP_LOCAL:3000/api";
     ```

### 5. Execute o Projeto

```bash
npm start
```

> A partir daqui, você pode:
> - Escanear o QR Code com o aplicativo **Expo Go** (iOS/Android)
> - Pressionar `w` para rodar no navegador
> - Pressionar `a` para rodar no emulador Android
> - Pressionar `i` para rodar no simulador iOS

---

## 📷 Telas Disponíveis

* **Login** – Acesso à plataforma com autenticação JWT
* **Registro** – Cadastro de novos usuários
* **Mapa** – Visualização dos postos disponíveis com:
  - Filtros por distância
  - Indicadores de lotação
  - Geolocalização em tempo real

---

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
API_URL=http://localhost:3000/api
```

### Permissões Necessárias

O aplicativo requer as seguintes permissões:
- Localização
- Acesso à internet
- Acesso ao mapa

---

## 🧪 Funcionalidades Implementadas

* ✅ Autenticação de usuários
* ✅ Visualização de postos no mapa
* ✅ Filtros por distância
* ✅ Indicadores de lotação
* ✅ Geolocalização
* ✅ Interface responsiva

---

## 🏢 Sobre o Projeto

Este projeto foi idealizado por uma holding com foco em soluções tecnológicas para a área da saúde pública. O objetivo do **PostoCalmo** é otimizar o atendimento da população, evitando deslocamentos desnecessários a postos superlotados.

Para mais informações institucionais ou parcerias, entre em contato com nosso time de inovação.

---

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Abex III** © 2025. Todos os direitos reservados. 