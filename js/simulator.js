/**
 * N1 Crédito e Consórcios — Simulador & Calculadora Raio-X
 * Funcionalidade consultiva orientada à captação de intenção e transparência.
 */

(function () {
  'use strict';

  // Configuração das Categorias
  const CATEGORIES = {
    imoveis: {
      name: 'Imóveis',
      icon: '🏠',
      minVal: 100000,
      maxVal: 2000000,
      defaultVal: 350000,
      minTerm: 60,
      maxTerm: 240,
      defaultTerm: 180,
      stepVal: 10000
    },
    veiculos: {
      name: 'Veículos',
      icon: '🚗',
      minVal: 30000,
      maxVal: 500000,
      defaultVal: 90000,
      minTerm: 24,
      maxTerm: 100,
      defaultTerm: 72,
      stepVal: 5000
    },
    pesados: {
      name: 'Caminhões e Pesados',
      icon: '🚛',
      minVal: 150000,
      maxVal: 1500000,
      defaultVal: 450000,
      minTerm: 36,
      maxTerm: 120,
      defaultTerm: 100,
      stepVal: 10000
    },
    maquinas: {
      name: 'Máquinas Agrícolas e Industriais',
      icon: '🚜',
      minVal: 100000,
      maxVal: 2500000,
      defaultVal: 500000,
      minTerm: 36,
      maxTerm: 120,
      defaultTerm: 96,
      stepVal: 20000
    },
    servicos: {
      name: 'Serviços',
      icon: '🎓',
      minVal: 15000,
      maxVal: 100000,
      defaultVal: 35000,
      minTerm: 12,
      maxTerm: 48,
      defaultTerm: 36,
      stepVal: 2500
    },
    investimentos: {
      name: 'Investimentos',
      icon: '📈',
      minVal: 100000,
      maxVal: 3000000,
      defaultVal: 400000,
      minTerm: 48,
      maxTerm: 180,
      defaultTerm: 120,
      stepVal: 25000
    },
    fotovoltaico: {
      name: 'Fotovoltaico',
      icon: '☀️',
      minVal: 20000,
      maxVal: 300000,
      defaultVal: 50000,
      minTerm: 24,
      maxTerm: 96,
      defaultTerm: 60,
      stepVal: 5000
    },
    aeronaves: {
      name: 'Aeronaves',
      icon: '✈️',
      minVal: 500000,
      maxVal: 10000000,
      defaultVal: 2000000,
      minTerm: 60,
      maxTerm: 144,
      defaultTerm: 120,
      stepVal: 100000
    },
    construcoes: {
      name: 'Construções',
      icon: '🏗️',
      minVal: 80000,
      maxVal: 1500000,
      defaultVal: 250000,
      minTerm: 48,
      maxTerm: 200,
      defaultTerm: 144,
      stepVal: 10000
    },
    motos: {
      name: 'Motos',
      icon: '🏍️',
      minVal: 15000,
      maxVal: 120000,
      defaultVal: 35000,
      minTerm: 18,
      maxTerm: 72,
      defaultTerm: 48,
      stepVal: 2000
    },
    capitalgiro: {
      name: 'Capital de Giro',
      icon: '💼',
      minVal: 50000,
      maxVal: 2000000,
      defaultVal: 200000,
      minTerm: 12,
      maxTerm: 84,
      defaultTerm: 48,
      stepVal: 10000
    },
    embarcacoes: {
      name: 'Embarcações',
      icon: '⚓',
      minVal: 80000,
      maxVal: 2500000,
      defaultVal: 300000,
      minTerm: 36,
      maxTerm: 120,
      defaultTerm: 84,
      stepVal: 10000
    }
  };

  // Estado do Simulador
  const state = {
    categoryKey: 'imoveis',
    modality: 'consorcio', // 'consorcio' ou 'credito'
    amount: 350000,
    term: 180
  };

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  });

  // Elementos do DOM
  const catButtons = document.querySelectorAll('[data-sim-category]');
  const modalityButtons = document.querySelectorAll('[data-sim-modality]');
  const amountSlider = document.getElementById('sim-amount-slider');
  const amountDisplay = document.getElementById('sim-amount-display');
  const termSlider = document.getElementById('sim-term-slider');
  const termDisplay = document.getElementById('sim-term-display');
  const raioXParcela = document.getElementById('raio-x-parcela');
  const raioXModalidade = document.getElementById('raio-x-modalidade');
  const raioXCategoria = document.getElementById('raio-x-categoria');
  const raioXValor = document.getElementById('raio-x-valor');
  const raioXPrazo = document.getElementById('raio-x-prazo');
  const simWhatsappBtn = document.getElementById('sim-whatsapp-btn');

  function updateCategory(catKey) {
    if (!CATEGORIES[catKey]) return;
    state.categoryKey = catKey;
    const cat = CATEGORIES[catKey];

    // Atualiza botões
    catButtons.forEach(btn => {
      btn.classList.toggle('is-selected', btn.getAttribute('data-sim-category') === catKey);
    });

    // Atualiza slider de valores
    if (amountSlider) {
      amountSlider.min = cat.minVal;
      amountSlider.max = cat.maxVal;
      amountSlider.step = cat.stepVal;
      amountSlider.value = cat.defaultVal;
      state.amount = cat.defaultVal;
    }

    // Atualiza slider de prazo
    if (termSlider) {
      termSlider.min = cat.minTerm;
      termSlider.max = cat.maxTerm;
      termSlider.value = cat.defaultTerm;
      state.term = cat.defaultTerm;
    }

    calculateRaioX();
  }

  function updateModality(modality) {
    state.modality = modality;
    modalityButtons.forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-sim-modality') === modality);
    });
    calculateRaioX();
  }

  function calculateRaioX() {
    const cat = CATEGORIES[state.categoryKey];
    if (!cat) return;

    // Atualiza Displays dos Sliders
    if (amountDisplay) amountDisplay.textContent = currencyFormatter.format(state.amount);
    if (termDisplay) termDisplay.textContent = `${state.term} meses`;

    // Cálculo ilustrativo consultivo (base demonstrativa conforme SPEC.md)
    let parcelaEstimada = 0;
    if (state.modality === 'consorcio') {
      // Estimativa baseada em consórcio: valor / meses + taxa adm média diluída (~18% no período)
      const custoTotalEstimado = state.amount * 1.18;
      parcelaEstimada = custoTotalEstimado / state.term;
    } else {
      // Estimativa baseada em linha de crédito estruturada / capital amortizado
      const coeficienteEstimado = (0.012 * Math.pow(1 + 0.012, state.term)) / (Math.pow(1 + 0.012, state.term) - 1);
      parcelaEstimada = state.amount * (coeficienteEstimado || (1 / state.term));
    }

    // Atualiza Painel Raio-X
    if (raioXParcela) {
      raioXParcela.textContent = currencyFormatter.format(parcelaEstimada);
    }
    if (raioXModalidade) {
      raioXModalidade.textContent = state.modality === 'consorcio' ? 'Consórcio Planejado' : 'Crédito Estruturado';
    }
    if (raioXCategoria) {
      raioXCategoria.textContent = cat.name;
    }
    if (raioXValor) {
      raioXValor.textContent = currencyFormatter.format(state.amount);
    }
    if (raioXPrazo) {
      raioXPrazo.textContent = `${state.term} meses`;
    }

    // Atualiza Link do WhatsApp com mensagem pronta
    if (simWhatsappBtn) {
      const msg = `Olá! Gostaria de uma consultoria para a simulação que fiz no site da N1:
• Categoria: ${cat.name}
• Modalidade: ${state.modality === 'consorcio' ? 'Consórcio Planejado' : 'Crédito Estruturado'}
• Valor pretendido: ${currencyFormatter.format(state.amount)}
• Prazo desejado: ${state.term} meses
• Parcela estimada no Raio-X: ${currencyFormatter.format(parcelaEstimada)}/mês

Gostaria de falar com um especialista para analisar as opções disponíveis entre as instituições parceiras.`;
      
      const whatsappUrl = `https://wa.me/5511945339633?text=${encodeURIComponent(msg)}`;
      simWhatsappBtn.href = whatsappUrl;
    }
  }

  // Event Listeners
  if (catButtons) {
    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const catKey = btn.getAttribute('data-sim-category');
        updateCategory(catKey);
        if (window.trackN1Event) {
          window.trackN1Event('simulator_category_change', { category: catKey });
        }
      });
    });
  }

  if (modalityButtons) {
    modalityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modality = btn.getAttribute('data-sim-modality');
        updateModality(modality);
        if (window.trackN1Event) {
          window.trackN1Event('simulator_modality_change', { modality });
        }
      });
    });
  }

  if (amountSlider) {
    amountSlider.addEventListener('input', (e) => {
      state.amount = Number(e.target.value);
      calculateRaioX();
    });
    amountSlider.addEventListener('change', () => {
      if (window.trackN1Event) {
        window.trackN1Event('simulator_amount_change', { amount: state.amount });
      }
    });
  }

  if (termSlider) {
    termSlider.addEventListener('input', (e) => {
      state.term = Number(e.target.value);
      calculateRaioX();
    });
    termSlider.addEventListener('change', () => {
      if (window.trackN1Event) {
        window.trackN1Event('simulator_term_change', { term: state.term });
      }
    });
  }

  // Permite que botões das seções externas ativem o simulador
  window.selectSimulatorCategory = function (catKey) {
    updateCategory(catKey);
    const simSection = document.getElementById('simulador');
    if (simSection) {
      simSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Inicializa com Imóveis
  updateCategory('imoveis');

})();
