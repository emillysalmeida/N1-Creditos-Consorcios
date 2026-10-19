/**
 * N1 Crédito e Consórcios — Chatbot / Assistente Virtual N1
 * Orientação inicial e triagem transparente sem fingir ser humano.
 */

(function () {
  'use strict';

  const chatbotWidget = document.getElementById('chatbot-widget');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotMessages = document.getElementById('chatbot-messages');

  if (!chatbotToggle || !chatbotWindow) return;

  function toggleChatbot(forceState) {
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !chatbotWindow.classList.contains('is-open');

    chatbotWindow.classList.toggle('is-open', isOpen);
    chatbotToggle.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      if (window.trackN1Event) {
        window.trackN1Event('chatbot_open');
      }
    }
  }

  chatbotToggle.addEventListener('click', () => toggleChatbot());
  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => toggleChatbot(false));
  }

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatbotWindow.classList.contains('is-open')) {
      toggleChatbot(false);
    }
  });

  // Respostas interativas
  window.handleChatReply = function (action) {
    let userText = '';
    let botReply = '';
    let actionBtn = null;

    if (action === 'simular') {
      userText = 'Quero fazer uma simulação';
      botReply = 'Excelente! Nossa ferramenta Raio-X permite estimar parcelas e valores para mais de 12 categorias de crédito e consórcio. Vou levar você direto ao simulador!';
      actionBtn = {
        text: 'Acessar Simulador Raio-X',
        callback: () => {
          toggleChatbot(false);
          const sim = document.getElementById('simulador');
          if (sim) sim.scrollIntoView({ behavior: 'smooth' });
        }
      };
    } else if (action === 'solucoes') {
      userText = 'Quero conhecer as soluções disponíveis';
      botReply = 'A N1 atua com 12 frentes: Imóveis, Veículos, Caminhões e Pesados, Máquinas Agrícolas/Industriais, Serviços, Investimentos, Fotovoltaico, Aeronaves, Construções, Motos, Capital de Giro e Embarcações.';
      actionBtn = {
        text: 'Ver Todas as Soluções',
        callback: () => {
          toggleChatbot(false);
          const sol = document.getElementById('solucoes');
          if (sol) sol.scrollIntoView({ behavior: 'smooth' });
        }
      };
    } else if (action === 'seguranca') {
      userText = 'Quero orientações sobre segurança e antifraude';
      botReply = '⚠️ Informação importante: A N1 **nunca solicita depósitos ou taxas antecipadas** para liberação de crédito ou consórcio. Nosso canal oficial único de atendimento WhatsApp é +55 11 94533-9633.';
      actionBtn = {
        text: 'Conferir Aviso de Segurança Completo',
        callback: () => {
          if (window.openSafetyModal) window.openSafetyModal();
        }
      };
    } else if (action === 'whatsapp') {
      userText = 'Quero falar com um consultor humano';
      botReply = 'Perfeito! Nosso atendimento humano e consultivo está disponível no WhatsApp oficial da N1. Clique abaixo para iniciar a conversa:';
      actionBtn = {
        text: 'Abrir WhatsApp (+55 11 94533-9633)',
        url: 'https://wa.me/5511945339633?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20consultor%20da%20N1.'
      };
    } else if (action === 'unidades') {
      userText = 'Onde ficam as unidades físicas da N1?';
      botReply = 'A N1 conta com a Sede em São Paulo (Perdizes) e Filiais em Bauru e Ribeirão Preto.';
      actionBtn = {
        text: 'Ver Endereços e Telefones',
        callback: () => {
          toggleChatbot(false);
          const uni = document.getElementById('unidades');
          if (uni) uni.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    if (!userText) return;

    // Adiciona bolha do usuário
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble chat-bubble-user';
    userBubble.textContent = userText;
    chatbotMessages.appendChild(userBubble);

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Resposta do bot com atraso sutil natural
    setTimeout(() => {
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-bubble chat-bubble-bot';
      botBubble.innerHTML = `<p style="margin:0 0 8px">${botReply}</p>`;

      if (actionBtn) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary btn-sm';
        btn.style.width = '100%';
        btn.style.fontSize = '11px';
        btn.style.padding = '8px 12px';
        btn.textContent = actionBtn.text;

        if (actionBtn.url) {
          btn.addEventListener('click', () => {
            window.open(actionBtn.url, '_blank', 'noopener,noreferrer');
          });
        } else if (actionBtn.callback) {
          btn.addEventListener('click', actionBtn.callback);
        }

        botBubble.appendChild(btn);
      }

      chatbotMessages.appendChild(botBubble);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 400);

    if (window.trackN1Event) {
      window.trackN1Event('chatbot_interaction', { action });
    }
  };

})();
