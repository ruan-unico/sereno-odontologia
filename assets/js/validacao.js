// Funções puras de validação e formatação do formulário.
// "Puras" = não mexem no HTML, então dá para testar com Node (veja a pasta test/).

// Mantém só os números: "(41) 99999-9999" -> "41999999999"
export function apenasDigitos(texto) {
  return String(texto ?? "").replace(/\D/g, "");
}

// Máscara enquanto a pessoa digita:
// "4199" -> "(41) 99" | "41999998888" -> "(41) 99999-8888" | "4133334444" -> "(41) 3333-4444"
export function formatarTelefone(texto) {
  const d = apenasDigitos(texto).slice(0, 11);

  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Cada validador devolve "" quando está tudo certo,
// ou a mensagem de erro que aparece embaixo do campo.

export function validarNome(nome) {
  const limpo = String(nome ?? "").trim();
  if (limpo.length === 0) return "Informe seu nome.";
  if (limpo.length < 2) return "O nome precisa ter pelo menos 2 letras.";
  if (/\d/.test(limpo)) return "O nome não pode ter números.";
  return "";
}

export function validarTelefone(telefone) {
  const d = apenasDigitos(telefone);

  if (d.length === 0) return "Informe seu WhatsApp com DDD.";
  if (d.length < 10 || d.length > 11) return "Use o formato (41) 99999-9999.";

  // DDDs brasileiros vão de 11 a 99 e não terminam em 0
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || d[1] === "0") return "Confira o DDD.";

  // Celular com 11 dígitos sempre começa com 9 depois do DDD
  if (d.length === 11 && d[2] !== "9") return "Confira o número: celulares começam com 9.";

  return "";
}

export function validarMotivo(motivo) {
  return String(motivo ?? "").trim() ? "" : "Escolha o motivo da consulta.";
}

// Valida tudo de uma vez e devolve { campo: mensagem } só com os campos com erro
export function validarFormulario(dados) {
  const erros = {
    nome: validarNome(dados.nome),
    telefone: validarTelefone(dados.telefone),
    motivo: validarMotivo(dados.motivo),
  };
  return Object.fromEntries(Object.entries(erros).filter(([, mensagem]) => mensagem));
}

// Monta o texto que chega no WhatsApp da clínica
export function montarMensagem(dados) {
  const linhas = [
    `Olá! Meu nome é ${dados.nome.trim()} e gostaria de agendar uma avaliação.`,
    "",
    `Motivo: ${dados.motivo}`,
    `Melhor período: ${dados.periodo}`,
    `Meu WhatsApp: ${formatarTelefone(dados.telefone)}`,
  ];

  if (dados.ansioso) {
    linhas.push("", "Tenho medo de dentista e gostaria de ir com calma.");
  }

  const extra = String(dados.mensagem ?? "").trim();
  if (extra) {
    linhas.push("", extra);
  }

  return linhas.join("\n");
}

// Link oficial do WhatsApp; encodeURIComponent protege acentos, quebras de linha e símbolos
export function montarLinkWhatsApp(numero, mensagem) {
  return `https://wa.me/${apenasDigitos(numero)}?text=${encodeURIComponent(mensagem)}`;
}
