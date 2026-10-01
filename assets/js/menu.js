// Menu do celular: abre e fecha a gaveta de navegação com acessibilidade.

export function iniciarMenu() {
  const botao = document.querySelector("[data-menu-botao]");
  const menu = document.querySelector("[data-menu]");
  if (!botao || !menu) return;

  const rotulo = botao.querySelector(".visualmente-oculto");

  function definirAberto(aberto) {
    botao.setAttribute("aria-expanded", String(aberto));
    menu.toggleAttribute("data-aberto", aberto);
    rotulo.textContent = aberto ? "Fechar menu" : "Abrir menu";
  }

  botao.addEventListener("click", () => {
    definirAberto(botao.getAttribute("aria-expanded") !== "true");
  });

  // Fecha ao escolher um link (a página rola até a seção)
  menu.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) definirAberto(false);
  });

  // Fecha com Esc e devolve o foco ao botão, como o teclado espera
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
      definirAberto(false);
      botao.focus();
    }
  });

  // Se a tela crescer com o menu aberto (girou o celular), reseta o estado
  window.matchMedia("(min-width: 861px)").addEventListener("change", (mudanca) => {
    if (mudanca.matches) definirAberto(false);
  });
}
