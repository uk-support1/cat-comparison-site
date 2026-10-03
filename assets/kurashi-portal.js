(() => {
  const menuButton = document.querySelector('.kp-menu-button');
  const navigation = document.querySelector('.kp-navigation');
  if (menuButton && navigation) {
    const closeMenu = () => { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); };
    menuButton.addEventListener('click', () => {
      const open = !navigation.classList.contains('is-open');
      navigation.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open));
    });
    navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }
  const items = document.querySelectorAll('.kp-reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.12});
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('is-visible'));
})();
