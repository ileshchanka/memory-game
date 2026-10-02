/**
 * Thin wrapper over document.createElement.
 * @param {string} tag
 * @param {{ className?: string, text?: string, attrs?: Record<string, string>, on?: Record<string, EventListener> }} [options]
 * @param {Array<Node | string>} [children]
 * @returns {HTMLElement}
 */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  const { className, text, attrs = {}, on = {} } = options;

  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  Object.entries(attrs).forEach(([name, value]) => node.setAttribute(name, value));
  Object.entries(on).forEach(([event, handler]) => node.addEventListener(event, handler));
  node.append(...children);

  return node;
}
