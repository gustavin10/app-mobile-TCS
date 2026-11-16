export function moeda(valor: number) {
  if (valor === 0) return 'Gratuito';
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// "2025-03-12" -> "12/03/2025"
export function data(iso: string) {
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

// "Maria Silva" -> "MS"
export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.charAt(0) ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
  return (primeira + ultima).toUpperCase();
}
