(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  const modal = document.getElementById('video-modal');
  const modalClose = document.getElementById('modal-close');
  const videoIframe = document.getElementById('video-iframe');
  const modalTitle = document.getElementById('modal-title');
  const videoTriggers = document.querySelectorAll('[data-video]');
  const year = document.getElementById('year');

  if (year) year.textContent = `© ${new Date().getFullYear()}`;

  const setHeaderState = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    menuButton.querySelectorAll('span').forEach(line => { line.style.transform = ''; });
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      menuButton.setAttribute('aria-expanded', String(open));
      body.classList.toggle('menu-open', open);
      menuButton.querySelectorAll('span').forEach((line, index) => {
        line.style.transform = open
          ? `translateY(${index === 0 ? 4.5 : -4.5}px) rotate(${index === 0 ? 45 : -45}deg)`
          : '';
      });
    });
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && mobileMenu.classList.contains('is-open')) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const openVideo = (id, title) => {
    if (!modal || !videoIframe || !id) return;
    videoIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    if (modalTitle) modalTitle.textContent = title || '';
    modal.showModal();
    body.classList.add('modal-open');
  };

  const closeVideo = () => {
    if (!modal) return;
    if (videoIframe) videoIframe.src = '';
    modal.close();
    body.classList.remove('modal-open');
  };

  videoTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => openVideo(trigger.dataset.video, trigger.dataset.title));
  });

  if (modalClose) modalClose.addEventListener('click', closeVideo);
  if (modal) modal.addEventListener('click', event => {
    if (event.target === modal) closeVideo();
  });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal?.open) closeVideo();
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('.project[data-category]');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
      projects.forEach(project => {
        const categories = (project.dataset.category || '').split(' ');
        project.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
      });
    });
  });

  const testimonials = [...document.querySelectorAll('.testimonial')];
  const prev = document.querySelector('[data-testimonial-prev]');
  const next = document.querySelector('[data-testimonial-next]');
  let testimonialIndex = 0;
  const showTestimonial = index => {
    if (!testimonials.length) return;
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((item, i) => item.classList.toggle('is-active', i === testimonialIndex));
  };
  prev?.addEventListener('click', () => showTestimonial(testimonialIndex - 1));
  next?.addEventListener('click', () => showTestimonial(testimonialIndex + 1));

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const type = String(formData.get('projectType') || '').trim();
      const message = String(formData.get('message') || '').trim();
      const subject = encodeURIComponent(`Project enquiry${type ? ` - ${type}` : ''}${name ? ` - ${name}` : ''}`);
      const bodyText = [
        name ? `Name: ${name}` : '',
        email ? `Email: ${email}` : '',
        type ? `Project type: ${type}` : '',
        '',
        message
      ].filter((line, index) => line || index === 3).join('\n');
      window.location.href = `mailto:rokpat.dm@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    });
  }
})();
