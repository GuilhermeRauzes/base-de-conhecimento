# 📖 IT CAD BRPR01 | Knowledge Base

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

An interactive, visual platform for documenting processes, operational routines, and troubleshooting guides for the IT team at the BRPR01 Distribution Center.

Built on a *Serverless* architecture and operating as a **Freeflow Canvas** (mind-map style), the tool allows the team to access infrastructure guides organically, while administrators can freely edit, create, and reorganize cards across the workspace.

## ✨ Key Features

* **🗂️ Interactive Canvas (Drag & Drop):** Absolute card positioning. Drag any process across the screen, and its (X/Y) coordinates are saved in real-time to the database.
* **🔒 Admin Authentication:** Native access control. Only logged-in users can create, edit, delete, or move cards.
* **📝 Rich Text Editor (WYSIWYG):** Integrated with **Quill.js** for advanced tutorial formatting (bold, lists, colors) directly in the browser.
* **🔗 Dynamic Links:** Tag-based system for useful links attached to each routine.
* **🎨 Premium UI/UX:** Modern interface focused on readability, featuring *Glassmorphism*, corporate Dark Mode, and non-intrusive *Toasts* for system notifications.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
* **Backend & Auth:** Firebase SDK v10 (Firestore Database, Firebase Authentication)
* **External Dependencies:** * [Quill.js](https://quilljs.com/) (Text Editor)
  * [Phosphor Icons](https://phosphoricons.com/) (UI Iconography)
