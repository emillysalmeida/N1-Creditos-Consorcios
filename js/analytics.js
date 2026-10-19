/**
 * N1 Crédito e Consórcios — Camada de Telemetria e Estrutura para CRM
 * Organiza dados semanticamente para futura integração com CRM/Analytics
 * conforme especificado no SPEC.md (Seção 28 e 36).
 */

(function () {
  'use strict';

  window.trackN1Event = function (eventName, eventData) {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      referrer: document.referrer || 'direto',
      device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      ...eventData
    };

    // Log estruturado para ambiente de desenvolvimento/inspeção
    console.log('[N1 Analytics / CRM Event]:', payload);

    // Dispara CustomEvent para integrações externas de CRM / GTM / Pixels
    window.dispatchEvent(new CustomEvent('N1_Analytics_Event', { detail: payload }));
  };

  // Rastreia cliques automáticos em CTAs estratégicos
  document.addEventListener('DOMContentLoaded', () => {
    // Cliques em WhatsApp
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      link.addEventListener('click', () => {
        window.trackN1Event('whatsapp_click', {
          cta_location: link.getAttribute('data-cta-location') || 'link_geral',
          href: link.href
        });
      });
    });

    // Cliques em Telefones
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        window.trackN1Event('phone_click', {
          phone_number: link.href.replace('tel:', '')
        });
      });
    });

    // Cliques em Mapas / Como Chegar
    document.querySelectorAll('a[href*="google.com/maps"]').forEach(link => {
      link.addEventListener('click', () => {
        window.trackN1Event('maps_click', {
          unit: link.getAttribute('data-unit') || 'unidade'
        });
      });
    });
  });

})();
