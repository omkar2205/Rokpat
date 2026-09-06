(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');
  const viewButtons = document.querySelectorAll('.view-button');
  const projects = document.getElementById('projects');
  const projectItems = document.querySelectorAll('[data-project]');
  const reelButtons = document.querySelectorAll('[data-video]');
  const modal = document.getElementById('video-modal');
  const modalClose = document.getElementById('modal-close');
  const videoIframe = document.getElementById('video-iframe');
  const modalTitle = document.getElementById('modal-title');
  const cursor = document.querySelector('.cursor');
  const heroShots = [...document.querySelectorAll('.hero-shot')];
  const heroIndex = document.getElementById('hero-index');

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuButton.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
  });

  mobileLinks.forEach(link => link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  viewButtons.forEach(button => button.addEventListener('click', () => {
    viewButtons.forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    const view = button.dataset.view;
    projects.classList.toggle('index-view', view === 'index');
    projects.classList.toggle('cinema-view', view === 'cinema');
  }));

  function openVideo(videoId, title) {
    if (!videoId) return;
    modalTitle.textContent = title || 'Selected work';
    videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    modal.showModal();
    body.classList.add('modal-open');
  }

  function closeVideo() {
    videoIframe.src = '';
    modal.close();
    body.classList.remove('modal-open');
  }

  reelButtons.forEach(el => {
    el.addEventListener('click', event => {
      if (el.matches('[data-project]')) return;
      event.preventDefault();
      openVideo(el.dataset.video, el.dataset.title);
    });
  });

  projectItems.forEach(project => project.addEventListener('click', () => openVideo(project.dataset.video, project.dataset.title)));
  modalClose.addEventListener('click', closeVideo);
  modal.addEventListener('click', event => { if (event.target === modal) closeVideo(); });
  window.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.open) closeVideo(); });

  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    projectItems.forEach(project => {
      project.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));
      project.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    });
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && heroShots.length > 1) {
    let current = 0;
    window.setInterval(() => {
      heroShots[current].classList.remove('is-active');
      current = (current + 1) % heroShots.length;
      heroShots[current].classList.add('is-active');
      heroIndex.textContent = String(current + 1).padStart(2, '0');
    }, 5200);
  }
})();
