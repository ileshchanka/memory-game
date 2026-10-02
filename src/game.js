import { el } from './dom.js';
import { shuffle } from './shuffle.js';

export const SYMBOLS = ['🍎', '🍋', '🍇', '🍉', '🍒', '🥝', '🍍', '🥥'];
export const TOTAL_PAIRS = SYMBOLS.length;
const MISMATCH_DELAY = 1000;

/**
 * @typedef {{ id: number, symbol: string, isOpen: boolean, isMatched: boolean, node: HTMLButtonElement }} Card
 * @typedef {{ moves: number, pairsFound: number }} Stats
 */

/**
 * @param {{ onStatsChange: (stats: Stats) => void, onWin: (stats: Stats) => void }} handlers
 */
export function createGame({ onStatsChange, onWin }) {
  const board = el('div', { className: 'board', attrs: { 'aria-label': 'Игровое поле' } });

  /** @type {Card[]} */
  let cards = [];
  /** @type {Card[]} */
  let selected = [];
  let moves = 0;
  let pairsFound = 0;
  let isLocked = false;
  let mismatchTimer = null;

  const stats = () => ({ moves, pairsFound });

  function renderCard(card) {
    card.node.classList.toggle('card--open', card.isOpen || card.isMatched);
    card.node.classList.toggle('card--matched', card.isMatched);
    card.node.setAttribute('aria-label', card.isOpen || card.isMatched ? card.symbol : 'Закрытая карточка');
  }

  function createCard(symbol, id) {
    const node = el('button', { className: 'card', attrs: { type: 'button' } }, [
      el('span', { className: 'card__inner' }, [
        el('span', { className: 'card__face card__face--back', attrs: { 'aria-hidden': 'true' } }),
        el('span', { className: 'card__face card__face--front', text: symbol, attrs: { 'aria-hidden': 'true' } }),
      ]),
    ]);
    /** @type {Card} */
    const card = { id, symbol, isOpen: false, isMatched: false, node };
    node.addEventListener('click', () => selectCard(card));
    renderCard(card);
    return card;
  }

  function closeMismatch() {
    selected.forEach((card) => {
      card.isOpen = false;
      renderCard(card);
    });
    selected = [];
    isLocked = false;
    mismatchTimer = null;
  }

  function selectCard(card) {
    if (isLocked || card.isOpen || card.isMatched) return;

    card.isOpen = true;
    renderCard(card);
    selected.push(card);
    if (selected.length < 2) return;

    moves += 1;
    const [first, second] = selected;

    if (first.symbol === second.symbol) {
      [first, second].forEach((c) => {
        c.isMatched = true;
        c.isOpen = false;
        renderCard(c);
      });
      selected = [];
      pairsFound += 1;
      onStatsChange(stats());
      if (pairsFound === TOTAL_PAIRS) onWin(stats());
      return;
    }

    onStatsChange(stats());
    isLocked = true;
    mismatchTimer = setTimeout(closeMismatch, MISMATCH_DELAY);
  }

  function newGame() {
    clearTimeout(mismatchTimer);
    mismatchTimer = null;
    isLocked = false;
    selected = [];
    moves = 0;
    pairsFound = 0;

    cards = shuffle([...SYMBOLS, ...SYMBOLS]).map(createCard);
    board.replaceChildren(...cards.map(({ node }) => node));
    onStatsChange(stats());
  }

  return { board, newGame };
}
