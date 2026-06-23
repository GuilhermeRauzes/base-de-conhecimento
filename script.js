import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiLY93Lto1UJ_qOkjgXyreeuMesMCsvvk",
  authDomain: "base-de-conhecimento-brpr01.firebaseapp.com",
  projectId: "base-de-conhecimento-brpr01",
  storageBucket: "base-de-conhecimento-brpr01.firebasestorage.app",
  messagingSenderId: "38310263201",
  appId: "1:38310263201:web:f8efd82e44958fc4c573e0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let rotinasData = [];

const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");
const btnShowAdd = document.getElementById("btn-show-add");
const modalLogin = document.getElementById("modal-login");
const modalAdd = document.getElementById("modal-add");
const modalDelete = document.getElementById("modal-delete");
const canvasBoard = document.getElementById("canvas-board");
const linksContainer = document.getElementById("dynamic-links-container");
const btnAddLink = document.getElementById("btn-add-link");

// Inicializa o Editor Quill
const quill = new Quill("#editor-container", {
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  },
});

// ==== SISTEMA NATIVO DE DRAG AND DROP ABSOLUTO (FREEFLOW) ==== //
let isDragging = false;
let currentCard = null;
let offsetX = 0,
  offsetY = 0;

document.addEventListener("mousedown", (e) => {
  if (e.target.closest(".drag-handle")) {
    currentCard = e.target.closest(".card");
    isDragging = true;
    currentCard.classList.add("dragging");

    // Calcula a diferença entre o clique e o topo/esquerda do card
    const rect = currentCard.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  }
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging || !currentCard) return;

  // Calcula a nova posição no Canvas considerando o scroll da tela
  const boardRect = canvasBoard.getBoundingClientRect();

  let x = e.clientX - boardRect.left + canvasBoard.scrollLeft - offsetX;
  let y = e.clientY - boardRect.top + canvasBoard.scrollTop - offsetY;

  // Impede que arraste para fora do canvas pra esquerda/cima (abaixo de zero)
  if (x < 0) x = 0;
  if (y < 0) y = 0;

  currentCard.style.left = `${x}px`;
  currentCard.style.top = `${y}px`;
});

document.addEventListener("mouseup", async () => {
  if (isDragging && currentCard) {
    isDragging = false;
    currentCard.classList.remove("dragging");

    // Salva as coordenadas X e Y no Firebase quando soltar o mouse
    const id = currentCard.dataset.id;
    const x = parseInt(currentCard.style.left, 10);
    const y = parseInt(currentCard.style.top, 10);

    try {
      await updateDoc(doc(db, "rotinas", id), { x, y });
    } catch (err) {
      console.error("Erro ao salvar posição", err);
    }
    currentCard = null;
  }
});
// ============================================================= //

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const iconClass =
    type === "success" ? "ph-check-circle" : "ph-warning-circle";
  toast.innerHTML = `<i class="ph ${iconClass}" style="font-size: 1.2rem;"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function createLinkRow(text = "", url = "") {
  const row = document.createElement("div");
  row.className = "link-row";
  row.innerHTML = `
    <input type="text" placeholder="Texto (Ex: Planilha Base)" value="${text}" class="link-text">
    <input type="text" placeholder="URL (https://...)" value="${url}" class="link-url">
    <button type="button" class="btn-remove-link" title="Remover link"><i class="ph ph-trash"></i></button>
  `;
  row
    .querySelector(".btn-remove-link")
    .addEventListener("click", () => row.remove());
  linksContainer.appendChild(row);
}
if (btnAddLink) btnAddLink.addEventListener("click", () => createLinkRow());

if (btnLogin)
  btnLogin.addEventListener("click", () =>
    modalLogin.classList.remove("hidden"),
  );
document
  .getElementById("close-login")
  .addEventListener("click", () => modalLogin.classList.add("hidden"));
document
  .getElementById("close-add")
  .addEventListener("click", () => modalAdd.classList.add("hidden"));
document
  .getElementById("btn-cancel-delete")
  .addEventListener("click", () => modalDelete.classList.add("hidden"));

if (btnShowAdd) {
  btnShowAdd.addEventListener("click", () => {
    document.getElementById("form-add-card").reset();
    document.getElementById("card-id").value = "";
    linksContainer.innerHTML = "";
    quill.root.innerHTML = "";
    document.getElementById("modal-add-title").innerText =
      "Adicionar Novo Processo";
    modalAdd.classList.remove("hidden");
  });
}

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    modalLogin.classList.add("hidden");
    document.getElementById("form-login").reset();
    showToast("Login realizado com sucesso!", "success");
  } catch (error) {
    showToast(`Erro: ${error.message}`, "error");
  }
});

if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    await signOut(auth);
    showToast("Sessão encerrada.", "success");
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) document.body.classList.add("is-admin");
  else document.body.classList.remove("is-admin");
});

document
  .getElementById("form-add-card")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("card-id").value;
    const title = document.getElementById("card-title").value;
    const content = quill.root.innerHTML;

    const links = [];
    document.querySelectorAll(".link-row").forEach((row) => {
      const text = row.querySelector(".link-text").value.trim();
      const url = row.querySelector(".link-url").value.trim();
      if (text && url) links.push({ text, url });
    });

    try {
      if (id) {
        await updateDoc(doc(db, "rotinas", id), { title, links, content });
        showToast("Rotina atualizada com sucesso!", "success");
      } else {
        // Quando cria um card novo, ele spawna no meio da tela com base no scroll
        const spawnX = canvasBoard.scrollLeft + 100;
        const spawnY = canvasBoard.scrollTop + 50;

        await addDoc(collection(db, "rotinas"), {
          title,
          links,
          content,
          x: spawnX,
          y: spawnY,
          timestamp: new Date(),
        });
        showToast("Nova rotina adicionada!", "success");
      }
      modalAdd.classList.add("hidden");
      document.getElementById("form-add-card").reset();
      linksContainer.innerHTML = "";
      quill.root.innerHTML = "";
    } catch (error) {
      showToast("Erro ao salvar: " + error.message, "error");
    }
  });

document
  .getElementById("btn-confirm-delete")
  .addEventListener("click", async () => {
    const id = document.getElementById("delete-card-id").value;
    try {
      await deleteDoc(doc(db, "rotinas", id));
      showToast("Rotina excluída com sucesso!", "success");
      modalDelete.classList.add("hidden");
    } catch (error) {
      showToast("Erro ao excluir: " + error.message, "error");
    }
  });

canvasBoard.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");
  const cardToggle = e.target.closest(".card-toggle");
  const cardTitle = e.target.closest("h3");

  if (editBtn) {
    const id = editBtn.dataset.id;
    const rotina = rotinasData.find((r) => r.id === id);
    if (rotina) {
      document.getElementById("card-id").value = rotina.id;
      document.getElementById("card-title").value = rotina.title;
      quill.root.innerHTML = rotina.content;

      linksContainer.innerHTML = "";
      if (Array.isArray(rotina.links)) {
        rotina.links.forEach((l) => createLinkRow(l.text, l.url));
      }

      document.getElementById("modal-add-title").innerText = "Editar Processo";
      modalAdd.classList.remove("hidden");
    }
    return;
  }

  if (deleteBtn) {
    document.getElementById("delete-card-id").value = deleteBtn.dataset.id;
    modalDelete.classList.remove("hidden");
    return;
  }

  if (cardToggle || cardTitle) {
    const card = e.target.closest(".card");
    if (card) {
      card.classList.toggle("collapsed");
      // Se o card foi aberto, garante que ele venha para frente dos outros
      if (!card.classList.contains("collapsed")) {
        document
          .querySelectorAll(".card")
          .forEach((c) => (c.style.zIndex = 10));
        card.style.zIndex = 20;
      }
    }
  }
});

// Renderizar Cards do Banco no Canvas
const rotinasQuery = query(collection(db, "rotinas"));

onSnapshot(rotinasQuery, (snapshot) => {
  canvasBoard.innerHTML = "";
  rotinasData = [];

  if (snapshot.empty) {
    canvasBoard.innerHTML = `<p style="color: var(--text-secondary); margin: 2rem; text-align: center;">O Canvas está vazio. Adicione um novo card!</p>`;
    return;
  }

  let indexOffset = 0; // Para cascatear cards antigos que não tem coordenada ainda

  snapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    rotinasData.push(data);

    let linksHtml = "";
    if (Array.isArray(data.links) && data.links.length > 0) {
      const anchors = data.links
        .map(
          (l) =>
            `<a href="${l.url}" target="_blank"><i class="ph ph-link"></i> ${l.text}</a>`,
        )
        .join("");
      linksHtml = `<div class="card-links">${anchors}</div>`;
    }

    // Fallback: Se os cards antigos não tiverem X e Y salvos, cascateia eles
    const posX = data.x !== undefined ? data.x : 50 + indexOffset * 40;
    const posY = data.y !== undefined ? data.y : 50 + indexOffset * 40;
    indexOffset++;

    const cardHtml = `
      <div class="card collapsed" data-id="${data.id}" style="left: ${posX}px; top: ${posY}px;">
        <div class="card-header">
          <div class="header-left">
            <i class="ph ph-dots-six-vertical drag-handle admin-only" title="Arraste para mover no mapa"></i>
            <i class="ph ph-caret-down card-toggle"></i>
            <h3 style="cursor: pointer;">${data.title}</h3>
          </div>
          <div class="card-actions admin-only">
            <button class="btn-icon edit-btn" data-id="${data.id}" title="Editar"><i class="ph ph-pencil-simple"></i></button>
            <button class="btn-icon delete delete-btn" data-id="${data.id}" title="Excluir"><i class="ph ph-trash"></i></button>
          </div>
        </div>
        <div class="card-body">
          ${linksHtml}
          <div class="card-content">
            ${data.content}
          </div>
        </div>
      </div>
    `;
    canvasBoard.insertAdjacentHTML("beforeend", cardHtml);
  });
});
