/**
 * N1 Crédito e Consórcios — Main Script
 * Orquestração de navegação, formulário para WhatsApp, filtros, accordion e interações.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Header Sticky Effect
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Drawer Navigation
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.add('is-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (drawerClose) drawerClose.addEventListener('click', closeMobileMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // 3. Filtros da Seção de Soluções
  const filterChips = document.querySelectorAll('.filter-chip');
  const solutionCards = document.querySelectorAll('.solution-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filterGroup = chip.getAttribute('data-filter');

      filterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      solutionCards.forEach(card => {
        const cardGroup = card.getAttribute('data-group');
        if (filterGroup === 'all' || cardGroup === filterGroup) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease-out';
        } else {
          card.style.display = 'none';
        }
      });

      if (window.trackN1Event) {
        window.trackN1Event('solution_filter_click', { filter: filterGroup });
      }
    });
  });

  // 4. Accordion FAQ
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('is-active');

        // Fecha outros itens para foco limpo
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('is-active');
            const otherTrigger = other.querySelector('.faq-trigger');
            const otherPanel = other.querySelector('.faq-panel');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        // Alterna item atual
        if (!isActive) {
          item.classList.add('is-active');
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          if (window.trackN1Event) {
            window.trackN1Event('faq_item_opened', { question: trigger.textContent.trim() });
          }
        } else {
          item.classList.remove('is-active');
          trigger.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        }
      });
    }
  });

  // 5. Formulário Direto para WhatsApp Oficial (+55 11 94533-9633)
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    const nameInput = document.getElementById('lead-name');
    const phoneInput = document.getElementById('lead-phone');
    const emailInput = document.getElementById('lead-email');
    const objectiveInput = document.getElementById('lead-objective');
    const cityInput = document.getElementById('lead-city');
    const valueInput = document.getElementById('lead-value');
    const notesInput = document.getElementById('lead-notes');
    const consentInput = document.getElementById('lead-consent');
    const formFeedback = document.getElementById('lead-feedback');

    // Máscara simples para WhatsApp no formato (XX) XXXXX-XXXX
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.substring(0, 11);
        if (val.length > 6) {
          val = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
        } else if (val.length > 2) {
          val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
        } else if (val.length > 0) {
          val = `(${val}`;
        }
        e.target.value = val;
      });
    }

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const cleanPhone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';

      // Validação Nome
      if (!nameInput || !nameInput.value.trim()) {
        showInputError(nameInput, 'Por favor, informe seu nome.');
        hasError = true;
      } else {
        clearInputError(nameInput);
      }

      // Validação Telefone
      if (!cleanPhone || cleanPhone.length < 10) {
        showInputError(phoneInput, 'Informe um número de WhatsApp válido com DDD.');
        hasError = true;
      } else {
        clearInputError(phoneInput);
      }

      // Validação Objetivo
      if (!objectiveInput || !objectiveInput.value) {
        showInputError(objectiveInput, 'Selecione o que deseja realizar.');
        hasError = true;
      } else {
        clearInputError(objectiveInput);
      }

      // Validação Consentimento
      if (consentInput && !consentInput.checked) {
        if (formFeedback) {
          formFeedback.textContent = 'É necessário concordar com a política de privacidade para avançar.';
          formFeedback.style.display = 'block';
          formFeedback.style.color = 'var(--color-danger)';
        }
        hasError = true;
      }

      if (hasError) return;

      // Monta mensagem estruturada conforme SPEC.md
      const message = `Olá! Gostaria de entender as opções da N1.

• Nome: ${nameInput.value.trim()}
• WhatsApp: ${phoneInput.value.trim()}
• E-mail: ${emailInput && emailInput.value.trim() ? emailInput.value.trim() : 'Não informado'}
• Objetivo: ${objectiveInput.value}
• Valor aproximado: ${valueInput && valueInput.value.trim() ? valueInput.value.trim() : 'A definir com especialista'}
• Cidade: ${cityInput && cityInput.value.trim() ? cityInput.value.trim() : 'Não informada'}
• Observações: ${notesInput && notesInput.value.trim() ? notesInput.value.trim() : 'Sem observações adicionais'}

Vim pelo site da N1.`;

      const whatsappUrl = `https://wa.me/5511945339633?text=${encodeURIComponent(message)}`;

      if (window.trackN1Event) {
        window.trackN1Event('lead_form_submitted', {
          objective: objectiveInput.value,
          city: cityInput ? cityInput.value : ''
        });
      }

      if (formFeedback) {
        formFeedback.textContent = 'Mensagem formatada com sucesso! Redirecionando para o WhatsApp oficial da N1...';
        formFeedback.style.display = 'block';
        formFeedback.style.color = 'var(--color-success)';
      }

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 500);
    });
  }

  function showInputError(inputElement, msg) {
    if (!inputElement) return;
    inputElement.classList.add('has-error');
    const parent = inputElement.closest('.form-group');
    if (parent) {
      const errorEl = parent.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('is-visible');
      }
    }
  }

  function clearInputError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove('has-error');
    const parent = inputElement.closest('.form-group');
    if (parent) {
      const errorEl = parent.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
      }
    }
  }

  // 6. Cookie Consent Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptAll = document.getElementById('cookie-accept-all');
  const cookieAcceptEssential = document.getElementById('cookie-accept-essential');

  if (cookieBanner) {
    const hasConsent = localStorage.getItem('n1_cookie_consent');
    if (!hasConsent) {
      setTimeout(() => {
        cookieBanner.classList.add('is-visible');
      }, 1000);
    }

    if (cookieAcceptAll) {
      cookieAcceptAll.addEventListener('click', () => {
        localStorage.setItem('n1_cookie_consent', 'all');
        cookieBanner.classList.remove('is-visible');
        if (window.trackN1Event) window.trackN1Event('cookie_consent', { type: 'all' });
      });
    }

    if (cookieAcceptEssential) {
      cookieAcceptEssential.addEventListener('click', () => {
        localStorage.setItem('n1_cookie_consent', 'essential');
        cookieBanner.classList.remove('is-visible');
        if (window.trackN1Event) window.trackN1Event('cookie_consent', { type: 'essential' });
      });
    }
  }

  // 7. Modais (Segurança e Privacidade)
  const safetyModal = document.getElementById('safety-modal');
  const privacyModal = document.getElementById('privacy-modal');
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalCloses = document.querySelectorAll('[data-close-modal]');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(targetId);
      openModal(targetModal);
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  // Fechar modal ao clicar fora ou com ESC
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-active').forEach(closeModal);
    }
  });

  window.openSafetyModal = function () {
    openModal(safetyModal);
  };

  window.openPrivacyModal = function () {
    openModal(privacyModal);
  };

  // 8. Copyright Dinâmico
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});
