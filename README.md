# AuthApp - Sistema de Autenticação e Gestão de Contas

Aplicação Full Stack desenvolvida para consolidar conceitos fundamentais de desenvolvimento web, comunicação com APIs RESTful e segurança de aplicações. O projeto implementa um fluxo completo de cadastro, autenticação stateless via tokens JWT e gerenciamento de perfil com persistência em nuvem.

---

## Acesse a Aplicação

* **Frontend em Produção:** [auth-app-nine-psi.vercel.app](https://auth-app-nine-psi.vercel.app)
* **Backend API (Render):** `https://auth-api-yvqt.onrender.com`
* **Banco de Dados (Neon):** Instância PostgreSQL gerenciada na nuvem

> **Nota sobre o primeiro acesso:** Como a API está hospedada no plano gratuito do Render, a aplicação pode levar de 30 a 50 segundos para responder à primeira requisição caso o servidor esteja acordando do modo de espera (*cold start*).

---

## O que o sistema faz

* **Cadastro de Usuários:** Registro com validação de campos obrigatórios e confirmação de senha.
* **Autenticação Segura:** Login via e-mail e senha com geração de token JWT assinado digitalmente.
* **Painel de Perfil / Configurações:** Tela privada que consome dados do usuário logado via endpoint protegido.
* **Edição de Perfil:** Permite a alteração do nome cadastrado.
* **Encerramento de Conta (Soft Delete):** Inativação lógica do usuário no banco de dados (`ativo = false`), mantendo a integridade referencial e o histórico do registro sem deletar a linha fisicamente.

---

## Tecnologias e Ferramentas

**Backend**
* **Java 21 & Spring Boot 3:** Construção da API RESTful estruturada em camadas (Controllers, Services, Repositories e DTOs).
* **Spring Data JPA / Hibernate:** Mapeamento objeto-relacional (ORM) e abstração de persistência sobre o PostgreSQL.
* **Spring Security & JWT:** Configuração de filtros de segurança stateless e validação de tokens Bearer.
* **BCrypt:** Criptografia unidirecional com salt para armazenamento seguro de senhas no banco de dados.
* **Flyway Migration:** Versionamento estrutural do schema do banco por meio de scripts SQL automatizados.

**Frontend**
* **HTML5 semântico e CSS3 moderno:** Interface limpa, responsiva e com foco em usabilidade.
* **JavaScript (ES6+ Vanilla):** Manipulação dinâmica do DOM, validação de formulários, consumo de endpoints assíncronos via Fetch API e gerenciamento do token JWT via `localStorage`.

**Infraestrutura e Ferramentas de Apoio**
* **Docker:** Conteinerização da aplicação Spring Boot via *multi-stage build* para padronização do deploy.
* **Vercel & Render:** Deploy contínuo integrado com Git para distribuição do frontend estático e execução do container backend.
* **Figma:** Prototipação e definição de layouts de telas.
* **Insomnia:** Validação manual dos contratos de requisições, payloads JSON e headers HTTP durante o desenvolvimento.

---

## Fluxo de Dados e Segurança

```text
[ Navegador / Cliente ]
        │
        ├── 1. POST /login (Credenciais)
        │
[ Spring Security / Backend ]
        │
        ├── 2. Consulta usuário e valida hash de senha com BCrypt
        ├── 3. Emite JWT assinado
        │
[ Navegador / Cliente ]
        │
        ├── 4. Armazena JWT no localStorage
        ├── 5. Dispara requisições autenticadas (Header: "Authorization: Bearer <JWT>")
        │
[ Spring Boot + PostgreSQL ]
        │
        └── 6. SecurityFilter valida o token e libera acesso aos dados cadastrais
 ```
## Autor
Desenvolvido por Gabriel Cagliari Luz

Estudante de Engenharia de Software - PUCRS

LinkedIn - [www.linkedin.com/in/gabriel-cagliari-luz]
