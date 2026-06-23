# 📖 T.I. CAD BRPR01 | Base de Conhecimento

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

Plataforma interativa e visual para documentação de processos, rotinas operacionais e *troubleshooting* da equipe de T.I. do Centro de Distribuição BRPR01. 

Construída sob uma arquitetura *Serverless* e operando como um **Canvas Freeflow** (estilo mapa mental), a ferramenta permite que o time acesse guias de infraestrutura de forma orgânica, enquanto administradores podem editar e reorganizar os cards livremente pelo espaço de trabalho.

## ✨ Funcionalidades Principais

* **🗂️ Canvas Interativo (Drag & Drop):** Posicionamento absoluto de cards. Arraste qualquer processo pela tela e as coordenadas (X/Y) são salvas em tempo real no banco de dados.
* **🔒 Autenticação de Admin:** Controle de acesso nativo. Apenas usuários logados podem criar, editar, excluir ou mover os cards.
* **📝 Editor de Texto Rico (WYSIWYG):** Integração com **Quill.js** para formatação avançada de tutoriais (negrito, listas, cores) diretamente pelo navegador.
* **🔗 Links Dinâmicos:** Sistema de tags de links úteis acoplados a cada rotina.
* **🎨 UI/UX Premium:** Interface moderna focada em legibilidade, utilizando *Glassmorphism*, Dark Mode corporativo e *Toasts* não-intrusivos para notificações de sistema.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
* **Backend & Auth:** Firebase SDK v10 (Firestore Database, Firebase Authentication)
* **Dependências Externas:** * [Quill.js](https://quilljs.com/) (Editor de Texto)
  * [Phosphor Icons](https://phosphoricons.com/) (Iconografia UI)

## 🚀 Como Rodar Localmente

1. Clone este repositório:
   ```bash
   git clone [https://github.com/guilhermerauzes/seu-repositorio.git](https://github.com/guilhermerauzes/seu-repositorio.git)
