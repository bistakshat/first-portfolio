/**
 * Akshat Bist Portfolio — Interactive Scripts & 3D Animations
 * High-performance vanilla JavaScript for physics, scroll tracking & mobile navigation
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Mobile Hamburger Menu (Phone Users ONLY)
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuToggle.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileNavBackdrop) {
      mobileNavBackdrop.addEventListener('click', closeMobileMenu);
    }

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Auto-close if resized to desktop (> 768px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && menuToggle.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================================================
  // 2. Scroll Progress Bar & Header Shadow
  // ==========================================================================
  const scrollProgressBar = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('siteHeader');

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Update progress bar
    if (scrollProgressBar && scrollHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      scrollProgressBar.style.width = `${progressPercent}%`;
    }

    // Toggle header shadow
    if (siteHeader) {
      if (scrollTop > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ==========================================================================
  // 3. Active Nav Link Tracking on Scroll
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const desktopNavItems = document.querySelectorAll('.desktop-nav .nav-item');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ==========================================================================
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // ==========================================================================
  // 5. Interactive 3D Tilt Physics (Desktop Cards & Badges)
  // ==========================================================================
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    const tiltCards = document.querySelectorAll('.tilt-card, [data-tilt]');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

        // Specular highlight coordinate
        card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });

    // 3D Parallax on Hero Visual & Floating Elements
    const heroVisualWrap = document.getElementById('heroVisualWrap');
    const hero3DScene = document.getElementById('hero3DScene');
    const tiltBadges = document.querySelectorAll('.tilt-badge, .orbit-tag');

    if (heroVisualWrap && hero3DScene) {
      heroVisualWrap.addEventListener('mousemove', (e) => {
        const rect = heroVisualWrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotX = (y / (rect.height / 2)) * -14;
        const rotY = (x / (rect.width / 2)) * 14;

        hero3DScene.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

        tiltBadges.forEach((badge) => {
          const depth = parseFloat(badge.getAttribute('data-depth')) || 20;
          const moveX = (x / (rect.width / 2)) * (depth * 0.4);
          const moveY = (y / (rect.height / 2)) * (depth * 0.4);
          badge.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, ${depth}px)`;
        });
      });

      heroVisualWrap.addEventListener('mouseleave', () => {
        hero3DScene.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
        tiltBadges.forEach((badge) => {
          const depth = parseFloat(badge.getAttribute('data-depth')) || 20;
          badge.style.transform = `translate3d(0, 0, ${depth}px)`;
        });
      });
    }

    // Dynamic Cursor Glow
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
      window.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      }, { passive: true });
    }
  }

  // ==========================================================================
  // 6. Interactive 3D Hero Canvas (Cyber Particle Sphere)
  // ==========================================================================
  const canvas = document.getElementById('heroCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = 460);
    let height = (canvas.height = 460);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 180;

    // Generate 3D sphere points
    const pointsCount = 110;
    const points = [];

    for (let i = 0; i < pointsCount; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        baseSize: Math.random() * 2 + 1.2,
        colorType: Math.random() > 0.4 ? 'purple' : 'cyan'
      });
    }

    let angleX = 0.002;
    let angleY = 0.0035;
    let targetAngleX = 0.002;
    let targetAngleY = 0.0035;

    // Track mouse over canvas container to subtly perturb rotation
    const visualWrap = document.getElementById('heroVisualWrap');
    if (visualWrap && !isTouchDevice) {
      visualWrap.addEventListener('mousemove', (e) => {
        const rect = visualWrap.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        targetAngleY = normX * 0.015;
        targetAngleX = -normY * 0.015;
      });

      visualWrap.addEventListener('mouseleave', () => {
        targetAngleX = 0.002;
        targetAngleY = 0.0035;
      });
    }

    let animationFrameId;

    function renderSphere() {
      ctx.clearRect(0, 0, width, height);

      // Smooth inertia on angles
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Sort points by Z for proper depth rendering
      const projectedPoints = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate Y
        let x1 = p.x * cosY + p.z * sinY;
        let z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Update point 3D coordinates
        p.x = x1;
        p.y = y2;
        p.z = z2;

        // 3D perspective projection
        const fov = 340;
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const alpha = Math.max(0.12, Math.min(0.9, (z2 + radius) / (2 * radius)));

        projectedPoints.push({
          x: projX,
          y: projY,
          z: z2,
          scale: scale,
          alpha: alpha,
          colorType: p.colorType,
          size: p.baseSize * scale
        });
      }

      // Draw subtle connecting lines between close points
      ctx.lineWidth = 0.7;
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 46) {
            const lineAlpha = (1 - dist / 46) * 0.25 * ((p1.alpha + p2.alpha) / 2);
            ctx.strokeStyle = p1.colorType === 'purple' ? `rgba(139, 92, 246, ${lineAlpha})` : `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < projectedPoints.length; i++) {
        const p = projectedPoints[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.colorType === 'purple') {
          ctx.fillStyle = `rgba(196, 181, 253, ${p.alpha})`;
          ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
        } else {
          ctx.fillStyle = `rgba(125, 211, 252, ${p.alpha})`;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        }

        ctx.shadowBlur = p.size > 2 ? 8 : 4;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderSphere);
    }

    renderSphere();
  }

  // ==========================================================================
  // 7. Clipboard Copy Email Action
  // ==========================================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'bistakshat@gmail.com';
      const copyTextEl = copyEmailBtn.querySelector('.copy-text');
      const originalText = copyTextEl ? copyTextEl.textContent : 'Copy Email';

      try {
        await navigator.clipboard.writeText(email);
        copyEmailBtn.classList.add('copied');
        if (copyTextEl) copyTextEl.textContent = 'Copied to Clipboard! ✓';

        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          if (copyTextEl) copyTextEl.textContent = originalText;
        }, 2500);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          copyEmailBtn.classList.add('copied');
          if (copyTextEl) copyTextEl.textContent = 'Copied! ✓';
          setTimeout(() => {
            copyEmailBtn.classList.remove('copied');
            if (copyTextEl) copyTextEl.textContent = originalText;
          }, 2500);
        } catch (e) {
          console.error('Failed to copy email:', e);
        }
        document.body.removeChild(textarea);
      }
    });
  }

})();
