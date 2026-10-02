import { el } from './dom.js';
import { createGame, TOTAL_PAIRS } from './game.js';
import { createModal } from './modal.js';
import { getTopResults, saveResult } from './storage.js';
import { createCounters, createHeader, createLeaderboardTable } from './ui.js';

const counters = createCounters(TOTAL_PAIRS);
const winModal = createModal({ title: 'Победа!' });
const leaderboardModal = createModal({ title: 'Лидерборд — топ-10' });

const game = createGame({
  onStatsChange: counters.update,
  onWin: ({ moves }) => {
    saveResult({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, moves, date: Date.now() });
    winModal.open(
      [el('p', { className: 'modal__text', text: `Все пары найдены! Количество ходов: ${moves}.` })],
      [el('button', { className: 'button', text: 'Новая игра', attrs: { type: 'button' }, on: { click: startNewGame } })],
    );
  },
});

function startNewGame() {
  winModal.close();
  game.newGame();
}

const header = createHeader({
  onNewGame: startNewGame,
  onLeaderboard: () => leaderboardModal.open([createLeaderboardTable(getTopResults())]),
});

document.body.append(
  header,
  el('main', { className: 'main' }, [counters.node, game.board]),
);

game.newGame();
