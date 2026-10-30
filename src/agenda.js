// Regras da agenda da barbearia
export const SERVICOS = { corte: 30, barba: 20, combo: 50 }; // duração em minutos
export const ABERTURA = '09:00';
export const FECHAMENTO = '19:00';

export function paraMinutos(hora) {
  if (!/^\d{2}:\d{2}$/.test(hora)) throw new Error('Hora deve estar no formato HH:MM');
  const [h, m] = hora.split(':').map(Number);
  if (h > 23 || m > 59) throw new Error('Hora inválida');
  return h * 60 + m;
}

export function agendar(agenda, pedido) {
  const { cliente, servico, data, hora } = pedido;
  if (!cliente || !cliente.trim()) throw new Error('Informe o nome do cliente');
  const duracao = SERVICOS[servico];
  if (!duracao) throw new Error('Serviço inválido');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data ?? '')) throw new Error('Data deve estar no formato AAAA-MM-DD');

  const inicio = paraMinutos(hora);
  const fim = inicio + duracao;
  if (inicio < paraMinutos(ABERTURA) || fim > paraMinutos(FECHAMENTO)) {
    throw new Error('Fora do horário de atendimento (09:00 às 19:00)');
  }

  const conflito = agenda.some((a) => {
    if (a.data !== data) return false;
    const aInicio = paraMinutos(a.hora);
    const aFim = aInicio + SERVICOS[a.servico];
    return inicio < aFim && aInicio < fim;
  });
  if (conflito) throw new Error('Horário já ocupado');

  return [...agenda, { cliente: cliente.trim(), servico, data, hora }];
}
