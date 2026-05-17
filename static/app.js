document.addEventListener('DOMContentLoaded', () => {

  // --- DYNAMIC STICKY HEADER ---
  const headerWrapper = document.getElementById('navbar-wrapper');
  function checkScroll() {
    if (window.scrollY > 20) {
      headerWrapper.classList.add('scrolled');
    } else {
      headerWrapper.classList.remove('scrolled');
    }
  }
  if (headerWrapper) {
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
  }

  // --- SELECTORS ---
  const tabStunting = document.getElementById('tab-stunting');
  const tabPersonality = document.getElementById('tab-personality');
  const panelStunting = document.getElementById('panel-stunting');
  const panelPersonality = document.getElementById('panel-personality');

  const formStunting = document.getElementById('form-stunting');
  const formPersonality = document.getElementById('form-personality');

  const stuntingUmur = document.getElementById('stunting-umur');
  const stuntingTinggi = document.getElementById('stunting-tinggi');
  const stuntingBerat = document.getElementById('stunting-berat');
  const valStuntingBerat = document.getElementById('val-stunting-berat');

  const processingStuntingSkeleton = document.getElementById('processing-stunting-skeleton');
  const processingPersonalitySkeleton = document.getElementById('processing-personality-skeleton');
  
  const resultsStuntingSection = document.getElementById('results-stunting-section');
  const resultsPersonalitySection = document.getElementById('results-personality-section');
  
  const errorBox = document.getElementById('error-box');
  const errorMessage = document.getElementById('error-message');
  const btnCloseError = document.getElementById('btn-close-error');

  const btnSubmitStunting = document.getElementById('btn-submit-stunting');
  const btnSubmitPersonality = document.getElementById('btn-submit-personality');

  // --- STUNTING RESULTS SELECTORS ---
  const boxStuntingResult = document.getElementById('box-stunting-result');
  const resStuntingLabel = document.getElementById('res-stunting-label');
  const resStuntingAdvice = document.getElementById('res-stunting-advice');
  const stuntingMeterPin = document.getElementById('stunting-meter-pin');
  const resRecomMenu = document.getElementById('res-recom-menu');
  const resRecomStuntingActivities = document.getElementById('res-recom-stunting-activities');

  // --- PERSONALITY RESULTS SELECTORS ---
  const resPersonalityEmoji = document.getElementById('res-personality-emoji');
  const resPersonalityLabel = document.getElementById('res-personality-label');
  const resPersonalityDesc = document.getElementById('res-personality-desc');
  const resPersonalityProbaWrap = document.getElementById('res-personality-proba-wrap');
  const resPersonalityConfidence = document.getElementById('res-personality-confidence');
  const resPersonalityBar = document.getElementById('res-personality-bar');
  const resIntroProb = document.getElementById('res-intro-prob');
  const resExtroProb = document.getElementById('res-extro-prob');
  const resRecomPersonalityActivities = document.getElementById('res-recom-personality-activities');
  const resRecomParenting = document.getElementById('res-recom-parenting');

  // --- TAB NAVIGATION SYSTEM ---
  function switchTab(target) {
    if (target === 'stunting') {
      tabStunting.classList.add('active');
      tabStunting.setAttribute('aria-selected', 'true');
      tabPersonality.classList.remove('active');
      tabPersonality.setAttribute('aria-selected', 'false');
      panelStunting.style.display = 'block';
      panelPersonality.style.display = 'none';
    } else {
      tabPersonality.classList.add('active');
      tabPersonality.setAttribute('aria-selected', 'true');
      tabStunting.classList.remove('active');
      tabStunting.setAttribute('aria-selected', 'false');
      panelPersonality.style.display = 'block';
      panelStunting.style.display = 'none';
    }
  }

  tabStunting.addEventListener('click', () => switchTab('stunting'));
  tabPersonality.addEventListener('click', () => switchTab('personality'));

  // Hero CTA scroll
  const btnCtaStart = document.getElementById('btn-cta-start') || document.querySelector('.btn-consultation');
  if (btnCtaStart) {
    btnCtaStart.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('interaction-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- STEPPER BUTTONS ---
  function setupStepper(inputId, minBtnId, plusBtnId, stepVal, minVal, maxVal) {
    const input = document.getElementById(inputId);
    const minBtn = document.getElementById(minBtnId);
    const plusBtn = document.getElementById(plusBtnId);
    if (!input || !minBtn || !plusBtn) return;

    minBtn.addEventListener('click', () => {
      let val = parseFloat(input.value) || minVal;
      val = Math.max(minVal, val - stepVal);
      input.value = stepVal % 1 === 0 ? val : val.toFixed(1);
    });

    plusBtn.addEventListener('click', () => {
      let val = parseFloat(input.value) || minVal;
      val = Math.min(maxVal, val + stepVal);
      input.value = stepVal % 1 === 0 ? val : val.toFixed(1);
    });
  }

  setupStepper('stunting-umur', 'btn-umur-min', 'btn-umur-plus', 1, 0, 60);
  setupStepper('stunting-tinggi', 'btn-tinggi-min', 'btn-tinggi-plus', 0.5, 30, 150);

  // --- SLIDER INTERACTIVE LABELS ---
  function initSlider(sliderEl, labelEl) {
    if (!sliderEl || !labelEl) return;
    
    function updateVal() {
      labelEl.textContent = sliderEl.value;
      const min = parseFloat(sliderEl.min) || 0;
      const max = parseFloat(sliderEl.max) || 100;
      const val = parseFloat(sliderEl.value);
      const percent = ((val - min) / (max - min)) * 100;
      
      const themeColor = sliderEl.classList.contains('slider-purple') ? '#6C5CE7' : '#2A9D8F';
      sliderEl.style.background = `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${percent}%, #E2E8F0 ${percent}%)`;
    }
    
    sliderEl.addEventListener('input', updateVal);
    updateVal();
  }

  initSlider(stuntingBerat, valStuntingBerat);

  // Personality sliders
  const pSliders = ['Time_spent_Alone', 'Social_event_attendance', 'Going_outside', 'Friends_circle_size', 'Post_frequency'];
  pSliders.forEach(name => {
    const slider = document.querySelector(`input[name="${name}"]`);
    const label = document.getElementById(`val_${name}`);
    initSlider(slider, label);
  });

  // --- ALERTS & ERRORS ---
  function showError(msg) {
    errorMessage.textContent = msg;
    errorBox.style.display = 'block';
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  btnCloseError.addEventListener('click', () => {
    errorBox.style.display = 'none';
  });

  function validateStunting(umur, tinggi, berat) {
    if (isNaN(umur) || umur < 0 || umur > 60) {
      showError("Eh, usia si kecil sepertinya keliru. Batas usia balita yang terpantau stunting berkisar antara 0 sampai 60 bulan. Silakan dicek kembali ya, Bunda!");
      return false;
    }
    if (isNaN(tinggi) || tinggi < 30 || tinggi > 150) {
      showError("Aduh, tinggi badan si kecil agak tidak biasa. Batas tinggi badan yang wajar untuk balita berkisar antara 30 cm sampai 150 cm. Yuk, periksa lagi!");
      return false;
    }
    if (berat && (berat < 2 || berat > 35)) {
      showError("Hmm, sepertinya berat badan yang diinput kurang pas untuk balita. Pastikan angka berat badan berkisar antara 2 kg hingga 35 kg ya, Bunda.");
      return false;
    }
    return true;
  }

  // --- STUNTING FORM SUBMIT ---
  formStunting.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';

    const umur = parseInt(stuntingUmur.value);
    const tinggi = parseFloat(stuntingTinggi.value);
    const berat = parseFloat(stuntingBerat.value);
    const jk = document.querySelector('input[name="jenis_kelamin"]:checked').value;

    if (!validateStunting(umur, tinggi, berat)) return;

    btnSubmitStunting.classList.add('loading');
    btnSubmitStunting.disabled = true;

    // Show isolated skeleton & scroll to it
    resultsStuntingSection.style.display = 'none';
    processingStuntingSkeleton.style.display = 'block';
    processingStuntingSkeleton.scrollIntoView({ behavior: 'smooth', block: 'center' });

    try {
      // Latency simulation for premium AI calculation look
      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await fetch('/api/predict/stunting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          umur: umur,
          jenis_kelamin: jk,
          tinggi: tinggi,
          berat: berat
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Render Box A1: Status
      boxStuntingResult.className = `bento-box box-full color-card-${data.status}`;
      resStuntingLabel.textContent = data.label;
      resStuntingAdvice.textContent = data.advice;

      // Move parameter pin standard WHO curve
      let pinPct = 50;
      if (data.status === 'sangat-pendek') pinPct = 9;
      else if (data.status === 'pendek') pinPct = 26;
      else if (data.status === 'normal') pinPct = 52;
      else if (data.status === 'tinggi') pinPct = 77;
      else if (data.status === 'sangat-tinggi') pinPct = 92;
      stuntingMeterPin.style.left = `${pinPct}%`;

      // Render Box A2: Menu & Activities Recommendations
      resRecomMenu.innerHTML = '';
      data.menu.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        resRecomMenu.appendChild(li);
      });

      resRecomStuntingActivities.innerHTML = '';
      data.activities.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        resRecomStuntingActivities.appendChild(li);
      });

      // Show Stunting results
      processingStuntingSkeleton.style.display = 'none';
      resultsStuntingSection.style.display = 'block';
      resultsStuntingSection.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      processingStuntingSkeleton.style.display = 'none';
      showError('Gagal memproses data stunting: ' + err.message);
    } finally {
      btnSubmitStunting.classList.remove('loading');
      btnSubmitStunting.disabled = false;
    }
  });

  // --- PERSONALITY FORM SUBMIT ---
  formPersonality.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';

    const payload = {};
    const inputs = formPersonality.querySelectorAll('input[type="range"], input[type="radio"]:checked');
    inputs.forEach(input => {
      payload[input.name] = parseFloat(input.value);
    });

    // Optionals defaults
    ['Stage_fear', 'Drained_after_socializing'].forEach(k => {
      if (!(k in payload)) payload[k] = 0;
    });

    btnSubmitPersonality.classList.add('loading');
    btnSubmitPersonality.disabled = true;

    // Show isolated skeleton & scroll to it
    resultsPersonalitySection.style.display = 'none';
    processingPersonalitySkeleton.style.display = 'block';
    processingPersonalitySkeleton.scrollIntoView({ behavior: 'smooth', block: 'center' });

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await fetch('/api/predict/personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Render Box B1: Personality
      resPersonalityEmoji.textContent = data.result === 'Introvert' ? '🌙' : '🌟';
      resPersonalityLabel.textContent = data.result;
      resPersonalityDesc.textContent = data.description;
      resPersonalityConfidence.textContent = data.confidence + '%';
      resPersonalityBar.style.width = data.confidence + '%';

      resIntroProb.textContent = data.introvert_prob + '%';
      resExtroProb.textContent = data.extrovert_prob + '%';
      resPersonalityProbaWrap.style.display = 'block';

      // Render Box B2: Activities & Parenting
      resRecomPersonalityActivities.innerHTML = '';
      data.activities.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        resRecomPersonalityActivities.appendChild(li);
      });

      resRecomParenting.innerHTML = '';
      const parentingLi = document.createElement('li');
      parentingLi.textContent = data.parenting;
      resRecomParenting.appendChild(parentingLi);

      // Show Personality results
      processingPersonalitySkeleton.style.display = 'none';
      resultsPersonalitySection.style.display = 'block';
      resultsPersonalitySection.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      processingPersonalitySkeleton.style.display = 'none';
      showError('Gagal memproses data kepribadian: ' + err.message);
    } finally {
      btnSubmitPersonality.classList.remove('loading');
      btnSubmitPersonality.disabled = false;
    }
  });

  // --- PDF REPORTS TRIGGERS REMOVED ---

  // --- RESET BUTTONS ---
  const btnResetStunting = document.querySelector('.btn-reset-stunting');
  const btnResetPersonality = document.querySelector('.btn-reset-personality');

  btnResetStunting.addEventListener('click', () => {
    formStunting.reset();
    stuntingBerat.dispatchEvent(new Event('input'));

    boxStuntingResult.className = 'bento-box box-full color-card-default';
    resStuntingLabel.textContent = 'Menunggu Input';
    resStuntingAdvice.textContent = 'Silakan isi formulir gizi di atas terlebih dahulu untuk mendapatkan status stunting anak Anda.';
    stuntingMeterPin.style.left = '50%';
    resRecomMenu.innerHTML = '<li>Menu tinggi kalori, kalsium, zat besi, dan zat pembangun protein hewani.</li>';
    resRecomStuntingActivities.innerHTML = '<li>Stimulasi fisik balita luar ruangan untuk merangsang lempeng pertumbuhan.</li>';

    resultsStuntingSection.style.display = 'none';
    document.getElementById('interaction-section').scrollIntoView({ behavior: 'smooth' });
  });

  btnResetPersonality.addEventListener('click', () => {
    formPersonality.reset();
    pSliders.forEach(name => {
      const slider = document.querySelector(`input[name="${name}"]`);
      slider.dispatchEvent(new Event('input'));
    });

    resPersonalityEmoji.textContent = '🤔';
    resPersonalityLabel.textContent = 'Menunggu Analisis';
    resPersonalityDesc.textContent = 'AI akan memetakan kecenderungan psikologis anak setelah Anda menyelesaikan kuesioner singkat.';
    resPersonalityProbaWrap.style.display = 'none';
    resPersonalityConfidence.textContent = '0%';
    resPersonalityBar.style.width = '0%';
    resIntroProb.textContent = '0%';
    resExtroProb.textContent = '0%';
    resRecomPersonalityActivities.innerHTML = '<li>Metode bermain yang sesuai dengan kenyamanan mental si kecil.</li>';
    resRecomParenting.innerHTML = '<li>Tips pola asuh harian untuk mendekatkan jalinan emosi orang tua.</li>';

    resultsPersonalitySection.style.display = 'none';
    document.getElementById('interaction-section').scrollIntoView({ behavior: 'smooth' });
  });

  // --- DYNAMIC 3D CURVED TESTIMONIALS SLIDER ---
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonials-dots .dot');
  const btnTestimonialPrev = document.getElementById('btn-testimonial-prev');
  const btnTestimonialNext = document.getElementById('btn-testimonial-next');
  let currentTestimonialIndex = 2; // Start with card 3 (index 2) as active in the center

  function updateTestimonials() {
    testimonialCards.forEach((card, index) => {
      card.classList.remove('card-active', 'card-prev', 'card-next', 'card-far-left', 'card-far-right');
      
      const total = testimonialCards.length;
      let diff = index - currentTestimonialIndex;
      
      if (diff < -2) diff += total;
      if (diff > 2) diff -= total;
      
      if (diff === 0) {
        card.classList.add('card-active');
      } else if (diff === -1) {
        card.classList.add('card-prev');
      } else if (diff === 1) {
        card.classList.add('card-next');
      } else if (diff === -2) {
        card.classList.add('card-far-left');
      } else if (diff === 2) {
        card.classList.add('card-far-right');
      }
    });

    testimonialDots.forEach((dot, index) => {
      if (index === currentTestimonialIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  if (testimonialCards.length > 0) {
    updateTestimonials();

    btnTestimonialPrev.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
      updateTestimonials();
    });

    btnTestimonialNext.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
      updateTestimonials();
    });

    testimonialDots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentTestimonialIndex = parseInt(dot.getAttribute('data-index'));
        updateTestimonials();
      });
    });
  }

  // --- DYNAMIC INTERACTIVE FAQ ACCORDIONS (PREMIUM 2-COLUMN) ---
  const faqPillToggles = document.querySelectorAll('.faq-pill-toggle');
  faqPillToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.closest('.faq-pill-item');
      if (!item) return;
      const content = item.querySelector('.faq-pill-content');
      const isAlreadyActive = item.classList.contains('active');

      // Close all siblings
      const stack = item.closest('.faq-pill-stack');
      if (stack) {
        const allItems = stack.querySelectorAll('.faq-pill-item');
        allItems.forEach(i => {
          i.classList.remove('active');
          const c = i.querySelector('.faq-pill-content');
          if (c) c.style.maxHeight = '0px';
          const t = i.querySelector('.faq-pill-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }

      // Open clicked item if not already open
      if (!isAlreadyActive) {
        item.classList.add('active');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Clicking logo home scrolls to top smoothly
  const btnLogoHome = document.getElementById('btn-logo-home');
  if (btnLogoHome) {
    btnLogoHome.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- DYNAMIC NAVBAR ACTIVE STATE & SCROLLSPY ---
  const navLinksList = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinksList).map(link => {
    const hash = link.getAttribute('href');
    return document.querySelector(hash);
  }).filter(el => el !== null);

  const activeDotHtml = '<span class="nav-active-dot"></span>';

  function updateActiveNavLink(activeLink) {
    if (!activeLink) return;
    if (activeLink.classList.contains('active')) {
      if (!activeLink.querySelector('.nav-active-dot')) {
        activeLink.insertAdjacentHTML('afterbegin', activeDotHtml);
      }
      return;
    }
    
    navLinksList.forEach(link => {
      link.classList.remove('active');
      const dot = link.querySelector('.nav-active-dot');
      if (dot) dot.remove();
    });

    activeLink.classList.add('active');
    activeLink.insertAdjacentHTML('afterbegin', activeDotHtml);
  }

  // Bind click event for smooth scroll and immediate active state toggle
  navLinksList.forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      const targetSection = document.querySelector(hash);
      
      if (targetSection) {
        e.preventDefault();
        
        // Temporarily detach scroll listener to prevent double triggers during fast smooth scroll
        window.removeEventListener('scroll', handleScrollSpy);
        
        updateActiveNavLink(link);
        
        const offsetPosition = targetSection.offsetTop - 80; // Offset for navbar height
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Re-attach scroll listener after animation finishes
        setTimeout(() => {
          window.addEventListener('scroll', handleScrollSpy);
        }, 800);
      }
    });
  });

  // ScrollSpy logic
  function handleScrollSpy() {
    let currentActiveSection = sections[0];
    const scrollPos = window.scrollY + 250; // Offset window height for responsive trigger

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentActiveSection = section;
      }
    });

    if (currentActiveSection) {
      const targetHash = `#${currentActiveSection.id}`;
      const activeLink = document.querySelector(`.nav-links a[href="${targetHash}"]`);
      if (activeLink) {
        updateActiveNavLink(activeLink);
      }
    }
  }

  // Bind ScrollSpy scroll listener
  window.addEventListener('scroll', handleScrollSpy);
  // Run on load
  handleScrollSpy();

});
