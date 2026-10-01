// Formulário de agendamento: validação, máscara do telefone e abertura do WhatsApp.
// Sem backend: os dados não são enviados para servidor nenhum.

import { NUMERO_WHATSAPP } from "./config.js";
import {
  formatarTelefone,
  validarFormulario,
  validarNome,
  validarTelefone,
  validarMotivo,
  montarMensagem,
  montarLinkWhatsApp,
} from "./validacao.js";

const VALIDADORES = {
  nome: validarNome,
  telefone: validarTelefone,
  motivo: validarMotivo,
};

function mostrarErro(formulario, campo, mensagem) {
  const entrada = formulario.elements[campo];
  const saida = formulario.querySelector(`[data-erro-de="${campo}"]`);

  // aria-invalid avisa leitores de tela que o campo está com problema
  entrada.setAttribute("aria-invalid", mensagem ? "true" : "false");
  if (saida) saida.textContent = mensagem;
}

function lerDados(formulario) {
  const dados = new FormData(formulario);
  return {
    nome: dados.get("nome") ?? "",
    telefone: dados.get("telefone") ?? "",
    motivo: dados.get("motivo") ?? "",
    periodo: dados.get("periodo") ?? "manhã",
    ansioso: dados.get("ansioso") === "on",
    mensagem: dados.get("mensagem") ?? "",
  };
}

export function iniciarFormulario() {
  const formulario = document.querySelector("[data-formulario]");
  if (!formulario) return;

  const status = formulario.querySelector("[data-status]");
  const telefone = formulario.elements.telefone;

  // Máscara: formata enquanto digita
  telefone.addEventListener("input", () => {
    telefone.value = formatarTelefone(telefone.value);
  });

  // Valida cada campo quando a pessoa sai dele, e corrige ao vivo depois do primeiro erro
  for (const [campo, validar] of Object.entries(VALIDADORES)) {
    const entrada = formulario.elements[campo];

    entrada.addEventListener("blur", () => {
      if (entrada.value) mostrarErro(formulario, campo, validar(entrada.value));
    });

    entrada.addEventListener("input", () => {
      if (entrada.getAttribute("aria-invalid") === "true") {
        mostrarErro(formulario, campo, validar(entrada.value));
      }
    });
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    status.textContent = "";

    const dados = lerDados(formulario);
    const erros = validarFormulario(dados);

    for (const campo of Object.keys(VALIDADORES)) {
      mostrarErro(formulario, campo, erros[campo] ?? "");
    }

    const primeiroComErro = Object.keys(VALIDADORES).find((campo) => erros[campo]);
    if (primeiroComErro) {
      formulario.elements[primeiroComErro].focus();
      return;
    }

    const link = montarLinkWhatsApp(NUMERO_WHATSAPP, montarMensagem(dados));
    window.open(link, "_blank", "noopener");
    status.textContent = "Abrimos o WhatsApp em outra aba com sua mensagem pronta. É só enviar por lá.";
  });
}
