import { test } from 'node:test';
import assert from 'node:assert/strict';
import { agendar, paraMinutos } from '../src/agenda.js';

const pedido = { cliente: 'João', servico: 'corte', data: '2026-11-03', hora: '10:00' };

test('converte HH:MM em minutos', () => {
  assert.equal(paraMinutos('09:30'), 570);
});

test('agenda um corte em horário livre', () => {
  const agenda = agendar([], pedido);
  assert.equal(agenda.length, 1);
  assert.equal(agenda[0].cliente, 'João');
});

test('recusa horário que se sobrepõe a outro', () => {
  const agenda = agendar([], pedido);
  assert.throws(() => agendar(agenda, { ...pedido, cliente: 'Pedro', hora: '10:15' }), /ocupado/);
});

test('aceita horário colado no fim do anterior', () => {
  const agenda = agendar([], pedido);
  assert.equal(agendar(agenda, { ...pedido, cliente: 'Pedro', hora: '10:30' }).length, 2);
});

test('recusa serviço que termina depois das 19:00', () => {
  assert.throws(() => agendar([], { ...pedido, servico: 'combo', hora: '18:30' }), /Fora do horário/);
});

test('recusa cliente sem nome', () => {
  assert.throws(() => agendar([], { ...pedido, cliente: '  ' }), /nome/);
});

test('recusa agendamento no domingo', () => {
  assert.throws(() => agendar([], { ...pedido, data: '2026-11-01' }), /domingos/);
});
