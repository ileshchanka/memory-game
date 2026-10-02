import { el } from './dom.js';

let activeModal = null;

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeModal) activeModal.close();
});

/**
 * Shared modal: closes by the close button, a click on the overlay or Escape.
 * Clicks inside the content do not close it.
 * @param {{ title: string }} options
 */
export function createModal({ title }) {
  const body = el('div', { className: 'modal__body' });
  const actions = el('div', { className: 'modal__actions' });
  const dialog = el(
    'div',
    { className: 'modal', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': title } },
    [el('h2', { className: 'modal__title', text: title }), body, actions],
  );
  const overlay = el('div', { className: 'overlay' }, [dialog]);

  const modal = {
    /**
     * @param {Node[]} content
     * @param {HTMLButtonElement[]} buttons
     */
    open(content, buttons = []) {
      activeModal?.close();
      body.replaceChildren(...content);
      actions.replaceChildren(
        ...buttons,
        el('button', { className: 'button button--secondary', text: 'Закрыть', on: { click: () => modal.close() } }),
      );
      document.body.append(overlay);
      activeModal = modal;
      actions.lastElementChild.focus();
    },
    close() {
      overlay.remove();
      if (activeModal === modal) activeModal = null;
    },
  };

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) modal.close();
  });

  return modal;
}
