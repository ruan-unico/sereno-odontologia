// Ponto de entrada: cada parte da página tem seu próprio módulo.
import { iniciarMenu } from "./menu.js";
import { iniciarFormulario } from "./formulario.js";

function iniciarTopo() {
  const topo = document.querySelector("[data-topo]");
  if (!topo) return;

  // Mostra uma linha sob o menu quando a página começa a rolar
  const atualizar = () => topo.toggleAttribute("data-rolou", window.scrollY > 8);
  window.addEventListener("scroll", atualizar, { passive: true });
  atualizar();
}

function atualizarAno() {
  const ano = document.querySelector("[data-ano]");
  if (ano) ano.textContent = new Date().getFullYear();
}

iniciarTopo();
iniciarMenu();
iniciarFormulario();
atualizarAno();
