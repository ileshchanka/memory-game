import { el } from './dom.js';
import { formatDate } from './storage.js';

/**
 * @param {{ onNewGame: () => void, onLeaderboard: () => void }} handlers
 */
export function createHeader({ onNewGame, onLeaderboard }) {
  return el('header', { className: 'header' }, [
    el('h1', { className: 'header__title', text: 'Memory Game' }),
    el('nav', { className: 'header__nav' }, [
      el('button', { className: 'button', text: 'Новая игра', attrs: { type: 'button' }, on: { click: onNewGame } }),
      el('button', {
        className: 'button button--secondary',
        text: 'Лидерборд',
        attrs: { type: 'button' },
        on: { click: onLeaderboard },
      }),
    ]),
  ]);
}

/** @param {number} totalPairs */
export function createCounters(totalPairs) {
  const movesValue = el('span', { className: 'counter__value', text: '0' });
  const pairsValue = el('span', { className: 'counter__value', text: `0/${totalPairs}` });

  const node = el('div', { className: 'counters', attrs: { 'aria-live': 'polite' } }, [
    el('p', { className: 'counter' }, ['Ходы: ', movesValue]),
    el('p', { className: 'counter' }, ['Пары: ', pairsValue]),
  ]);

  /** @param {{ moves: number, pairsFound: number }} stats */
  function update({ moves, pairsFound }) {
    movesValue.textContent = String(moves);
    pairsValue.textContent = `${pairsFound}/${totalPairs}`;
  }

  return { node, update };
}

/** @param {import('./storage.js').GameResult[]} results */
export function createLeaderboardTable(results) {
  if (results.length === 0) {
    return el('p', { className: 'leaderboard__empty', text: 'Пока нет результатов. Сыграйте первую игру!' });
  }

  const head = el('thead', {}, [
    el('tr', {}, ['№', 'Ходы', 'Дата'].map((title) => el('th', { text: title, attrs: { scope: 'col' } }))),
  ]);
  const rows = results.map((result, index) =>
    el('tr', {}, [
      el('td', { text: String(index + 1) }),
      el('td', { text: String(result.moves) }),
      el('td', { text: formatDate(result.date) }),
    ]),
  );

  return el('table', { className: 'leaderboard' }, [head, el('tbody', {}, rows)]);
}
