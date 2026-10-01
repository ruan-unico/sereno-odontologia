import { test } from "node:test";
import assert from "node:assert/strict";
import {
  apenasDigitos,
  formatarTelefone,
  validarNome,
  validarTelefone,
  validarFormulario,
  montarMensagem,
  montarLinkWhatsApp,
} from "../assets/js/validacao.js";

test("apenasDigitos remove tudo que não é número", () => {
  assert.equal(apenasDigitos("(41) 99999-8888"), "41999998888");
  assert.equal(apenasDigitos(undefined), "");
});

test("formatarTelefone aplica a máscara enquanto a pessoa digita", () => {
  assert.equal(formatarTelefone(""), "");
  assert.equal(formatarTelefone("4"), "(4");
  assert.equal(formatarTelefone("4199"), "(41) 99");
  assert.equal(formatarTelefone("4133334444"), "(41) 3333-4444");
  assert.equal(formatarTelefone("41999998888"), "(41) 99999-8888");
  assert.equal(formatarTelefone("41999998888123"), "(41) 99999-8888", "corta o excesso");
});

test("validarNome", () => {
  assert.equal(validarNome("Ana"), "");
  assert.equal(validarNome("   "), "Informe seu nome.");
  assert.equal(validarNome("A"), "O nome precisa ter pelo menos 2 letras.");
  assert.equal(validarNome("Ana 2"), "O nome não pode ter números.");
});

test("validarTelefone aceita celular e fixo com DDD válido", () => {
  assert.equal(validarTelefone("(41) 99999-8888"), "");
  assert.equal(validarTelefone("4133334444"), "");
});

test("validarTelefone recusa números inválidos com mensagem clara", () => {
  assert.equal(validarTelefone(""), "Informe seu WhatsApp com DDD.");
  assert.equal(validarTelefone("9999-8888"), "Use o formato (41) 99999-9999.");
  assert.equal(validarTelefone("(01) 99999-8888"), "Confira o DDD.");
  assert.equal(validarTelefone("(40) 99999-8888"), "Confira o DDD.");
  assert.equal(validarTelefone("(41) 89999-8888"), "Confira o número: celulares começam com 9.");
});

test("validarFormulario devolve só os campos com erro", () => {
  assert.deepEqual(validarFormulario({ nome: "Ana", telefone: "41999998888", motivo: "Limpeza" }), {});
  assert.deepEqual(Object.keys(validarFormulario({ nome: "", telefone: "123", motivo: "" })), [
    "nome",
    "telefone",
    "motivo",
  ]);
});

test("montarMensagem inclui o pedido de calma e a mensagem opcional", () => {
  const texto = montarMensagem({
    nome: "  Ana  ",
    telefone: "41999998888",
    motivo: "Limpeza e prevenção",
    periodo: "manhã",
    ansioso: true,
    mensagem: "Tenho sensibilidade no dente da frente.",
  });

  assert.match(texto, /^Olá! Meu nome é Ana e/);
  assert.match(texto, /Motivo: Limpeza e prevenção/);
  assert.match(texto, /Meu WhatsApp: \(41\) 99999-8888/);
  assert.match(texto, /Tenho medo de dentista/);
  assert.match(texto, /sensibilidade no dente da frente\.$/);
});

test("montarMensagem omite o que não foi preenchido", () => {
  const texto = montarMensagem({
    nome: "Ana", telefone: "41999998888", motivo: "Clareamento", periodo: "tarde", ansioso: false, mensagem: "  ",
  });
  assert.doesNotMatch(texto, /medo/);
  assert.ok(texto.endsWith("Meu WhatsApp: (41) 99999-8888"));
});

test("montarLinkWhatsApp codifica acentos e quebras de linha", () => {
  const link = montarLinkWhatsApp("+55 (41) 90000-0000", "Olá!\nManhã & tarde");
  assert.equal(link, "https://wa.me/5541900000000?text=Ol%C3%A1!%0AManh%C3%A3%20%26%20tarde");
});
