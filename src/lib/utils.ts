// ============================================================
// UTILITÁRIOS COMPARTILHADOS
// Centraliza funções usadas em múltiplos componentes
// ============================================================

/**
 * Formata segundos em string legível. Ex: 3661 → "1h 01m 01s"
 */
export function formatarTempo(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m ${sec.toString().padStart(2, '0')}s`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, '0')}s`;
  return `${sec}s`;
}

/**
 * Formata segundos no estilo relógio. Ex: 3661 → "01:01:01"
 */
export function formatarTempoRelogio(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Sanitiza texto de entrada do usuário contra XSS e tamanho
 */
export function sanitizarTexto(texto: string, maxLen = 15): string {
  return texto
    .replace(/[<>'"&]/g, '')
    .slice(0, maxLen)
    .trim();
}

/**
 * Calcula percentagem entre 0 e 100 com clamp
 */
export function calcularPorcentagem(atual: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (atual / max) * 100));
}
