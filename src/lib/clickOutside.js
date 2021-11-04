export function clickOutside(node) {
  function handleClick(event) {
    console.log('clickOutside', !node.contains(event.target));
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('click-outside'));
    }
  }

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
}
