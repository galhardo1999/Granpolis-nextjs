# Prompt Mestre: Grepolis NextJS Clone

Este é o contexto detalhado do projeto, ideal para ser usado como referência em novas conversas com IAs ou para documentação técnica.

---

## 1. Arquitetura Técnica
- **Framework**: Next.js 14+ (App Router).
- **Linguagem**: TypeScript (Strict Mode).
- **Gerenciamento de Estado**: Zustand (Estado persistente e reativo).
- **Estilização**: Vanilla CSS (Focado em flexibilidade, glassmorphism e design premium).
- **Ícones/Assets**: Lucide React para interface e imagens customizadas para unidades/edifícios.

---

## 2. Mecânicas de Core (Gameplay)

### A. Recursos
- **Madeira, Pedra e Prata**: Produzidos passivamente por Bosque, Pedreira e Mina de Prata.
- **População**: Gerida pela Quinta. Necessária para construções e recrutamento.
- **Favor Divino**: Produzido pelo Templo. Usado para poderes divinos.

### B. Edifícios (Senado)
- Cada edifício tem um `nivel`, `custoBase`, `multiplicadorCusto` e `multiplicadorTempo`.
- **Fila de Construção**: Suporta múltiplas construções em série com tempos reais decrescentes.
- **Requisitos**: Árvore tecnológica onde edifícios dependem de outros (ex: Quartel requer Senado Nível 4).

### C. Unidades e Combate (Quartel)
- **Terrestres**: Espadachim, Fundibulário, Arqueiro, Hoplita, Cavaleiro, Biga, Catapulta.
- **Navais**: Birreme, Navio de Transporte, Trirreme.
- **Estatísticas**: Ataque, Defesa (específica para tipos), Velocidade e Capacidade de Saque.
- **Sistema de Combate**: Lógica baseada em soma de poder de ataque vs defesa, com perdas proporcionais para ambos os lados.

### D. Aldeias Bárbaras
- Sistema de PVE com 6 níveis de dificuldade.
- Cada aldeia tem tropas defensivas específicas e recompensas de saque.
- **Cooldown**: Tempo de recarga após cada ataque bem-sucedido.

### E. Sistema Divino
- **Deuses**: Zeus, Poseidón, Hera, Atena, Hades.
- **Poderes**: Cada deus oferece magias que custam Favor (ex: Casamento Real da Hera concede recursos).

---

## 3. Design e Experiência do Usuário (UI/UX)
- **Aesthetics**: Design "Dark Mode" premium, usando tons de azul profundo, ouro e cinzas metálicos.
- **Glassmorphism**: Modais e painéis com fundo translúcido e bordas sutis.
- **Feedback Visual**:
  - Notificações dinâmicas (Toast) para conclusão de obras/treinos.
  - Barras de progresso animadas para filas de espera.
  - Tooltips detalhados ao passar o mouse sobre custos e requisitos.
- **Responsividade**: Layout adaptável para desktop e dispositivos móveis.

---

## 4. Estrutura de Dados (Exemplos)

### Loja de Estado (Zustand)
```typescript
interface GameState {
  recursos: { madeira: number; pedra: number; prata: number; favor: number };
  edificios: Record<IdEdificio, number>;
  unidades: Record<IdUnidade, number>;
  filaConstrucao: Obra[];
  filaRecrutamento: Treino[];
  missoesConcluidas: string[];
  deusSelecionado: IdDeus | null;
}
```

---

## 5. Fluxos de Trabalho Implementados
1. **Loop de Produção**: `setInterval` no `gameStore.ts` que atualiza recursos e processa filas a cada segundo.
2. **Sistema de Missões**: Verificação contínua do estado do jogo (`src/lib/missoes.ts`) para recompensar o progresso.
3. **Cortes de Tempo**: Redução de tempo de construção baseada no nível do Senado.

---

## 6. Diretrizes para Futuras Expansões
- Priorizar animações suaves (CSS Transitions).
- Manter tipagem forte para todas as constantes (`IdEdificio`, `IdUnidade`).
- Evitar placeholders; usar imagens geradas ou assets temáticos de alta qualidade.
- Sempre atualizar o `gameStore` para garantir que a UI reflita o estado real instantaneamente.
