/**
 * SOUL Radiology Report Portal - Main Controller
 * Handles user login/signup (for users, not doctors), username uniqueness verification,
 * top-right navbar profile menu, and synthetic radiology report showcase.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentUser: null,
    signupStep1Data: null,
    reports: [...SYNTHETIC_REPORTS],
    activeFilter: 'all',
    searchQuery: '',
    redirectTimer: null
  };

  // DOM Elements - Shell & Views
  const viewAuth = document.getElementById('view-auth');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewReport = document.getElementById('view-report');
  const viewLanding = document.getElementById('view-landing');
  const reportViewBody = document.getElementById('report-view-body');
  const cardLogin = document.getElementById('card-login');
  const cardSignup = document.getElementById('card-signup');
  const signupSubcard1 = document.getElementById('signup-subcard-1');
  const signupSubcard2 = document.getElementById('signup-subcard-2');
  const mainNavLinks = document.getElementById('main-nav-links');
  const navAuthControls = document.getElementById('nav-auth-controls');
  const navGuestControls = document.getElementById('nav-guest-controls');

  // Step Tracker
  const trackerStep1 = document.getElementById('tracker-step-1');
  const trackerStep2 = document.getElementById('tracker-step-2');
  const trackerDivider = document.getElementById('tracker-divider');
  const signupStepSubtitle = document.getElementById('signup-step-subtitle');

  // Navbar Profile (Top Right Corner)
  const userProfileContainer = document.getElementById('user-profile-dropdown-container');
  const userProfileTrigger = document.getElementById('user-profile-trigger');
  const navUserAvatar = document.getElementById('nav-user-avatar');
  const navUserName = document.getElementById('nav-user-name');
  const navUserHandle = document.getElementById('nav-user-handle');

  // Dropdown Menu Elements
  const menuAvatar = document.getElementById('menu-avatar');
  const menuUserName = document.getElementById('menu-user-name');
  const menuUserEmail = document.getElementById('menu-user-email');
  const menuUserId = document.getElementById('menu-user-id');
  const menuUsername = document.getElementById('menu-username');
  const menuDob = document.getElementById('menu-dob');
  const menuGender = document.getElementById('menu-gender');
  const menuMobile = document.getElementById('menu-mobile');
  const btnLogout = document.getElementById('btn-logout');

  // Nav Switchers & Links
  const linkGotoSignup = document.getElementById('link-goto-signup');
  const linksGotoLogin = document.querySelectorAll('.link-goto-login');
  const navBtnGotoLogin = document.getElementById('nav-btn-goto-login');
  const navBtnGotoSignup = document.getElementById('nav-btn-goto-signup');
  const navBrandLogo = document.getElementById('nav-brand-logo');

  // Login Elements
  const formLogin = document.getElementById('form-login');
  const loginIdentifier = document.getElementById('login-identifier');
  const loginPassword = document.getElementById('login-password');
  const loginAlertContainer = document.getElementById('login-alert-container');

  // Signup Elements
  const formSignupCard1 = document.getElementById('form-signup-card-1');
  const regName = document.getElementById('reg-name');
  const regDob = document.getElementById('reg-dob');
  const regMobile = document.getElementById('reg-mobile');
  const regEmail = document.getElementById('reg-email');

  const formSignupCard2 = document.getElementById('form-signup-card-2');
  const regUsername = document.getElementById('reg-username');
  const regUsernameFeedback = document.getElementById('reg-username-feedback');
  const usernameSuggestionsWrap = document.getElementById('username-suggestions-wrap');
  const usernameSuggestionsList = document.getElementById('username-suggestions-list');
  const regPassword = document.getElementById('reg-password');
  const regConfirmPassword = document.getElementById('reg-confirm-password');
  const btnBackCard1 = document.getElementById('btn-back-card1');
  const btnBackToStep1 = document.getElementById('btn-back-to-step1');
  const card2SummaryName = document.getElementById('card2-summary-name');
  const card2SummaryContact = document.getElementById('card2-summary-contact');
  const signupAlertContainer = document.getElementById('signup-alert-container');

  // Reports Home Elements
  const reportsGridContainer = document.getElementById('reports-grid-container');
  const sampleCategoryFilters = document.getElementById('sample-category-filters');
  const reportSearchInput = document.getElementById('report-search-input');
  const dashWelcomeText = document.getElementById('dash-welcome-text');

  // New feature elements
  const viewTerms = document.getElementById('view-terms');
  const viewUpload = document.getElementById('view-upload');
  const btnContrast = document.getElementById('btn-contrast');
  const langSelect = document.getElementById('lang-select');
  const termsSearch = document.getElementById('terms-search');
  const termsGrid = document.getElementById('terms-grid');
  const uploadDrop = document.getElementById('upload-drop');
  const uploadInput = document.getElementById('upload-input');
  const btnBrowse = document.getElementById('btn-browse');
  const uploadSampleBtns = document.getElementById('upload-sample-btns');
  const uploadResult = document.getElementById('upload-result');
  const scanModal = document.getElementById('scan-modal');
  const scanCanvas = document.getElementById('scan-canvas');
  const scanCaption = document.getElementById('scan-caption');
  const scanClose = document.getElementById('scan-close');
  const scanZoomLabel = document.getElementById('scan-zoom-label');
  const btnScanZoomIn = document.getElementById('scan-zoom-in');
  const btnScanZoomOut = document.getElementById('scan-zoom-out');
  const btnScanInvert = document.getElementById('scan-invert');
  const btnScanReset = document.getElementById('scan-reset');
  const loginCaptcha = document.getElementById('login-captcha');
  const captchaCode = document.getElementById('captcha-code');
  const captchaRefresh = document.getElementById('captcha-refresh');

  // AI Modal Elements
  const aiModal = document.getElementById('ai-modal');
  const aiModalClose = document.getElementById('ai-modal-close');
  const aiChatThread = document.getElementById('ai-chat-thread');
  const aiInputForm = document.getElementById('ai-input-form');
  const aiInputBox = document.getElementById('ai-input-box');
  const aiContextText = document.getElementById('ai-context-text');
  const aiContextBadge = document.getElementById('ai-context-badge');

  // Toast
  const appToast = document.getElementById('app-toast');
  const toastText = document.getElementById('toast-text');

  /* =========================================================================
     Initial Setup
     ========================================================================= */
  function init() {
    setupEventListeners();
    setupPasswordToggles();
    setupDemoAccountButtons();
    setupPrefs();
    setupFeatureListeners();

    // Announce field messages and tie them to their inputs
    document.querySelectorAll('.field-feedback').forEach(fb => {
      fb.setAttribute('aria-live', 'polite');
      const input = document.getElementById(fb.id.replace('-feedback', ''));
      if (input) input.setAttribute('aria-describedby', fb.id);
    });
    document.querySelectorAll('.toggle-pwd').forEach(b => b.setAttribute('aria-label', 'Show password'));
    [loginAlertContainer, signupAlertContainer].forEach(c => {
      if (c) c.setAttribute('aria-live', 'polite');
    });

    // Check existing session or default to demo user
    const existing = window.soulAuth ? window.soulAuth.getCurrentUser() : null;
    state.currentUser = existing || (typeof DEFAULT_USERS !== 'undefined' ? DEFAULT_USERS[0] : null);
    showDashboardView(true);
  }

  /* =========================================================================
     View Controllers
     ========================================================================= */
  function showOnly(view, display = 'block') {
    [viewLanding, viewAuth, viewDashboard, viewReport, viewTerms, viewUpload].forEach(v => {
      if (v) v.style.display = 'none';
    });
    if (view) view.style.display = display;
  }

  function setTitle(t) {
    document.title = t === 'SOUL Radiology' ? t : `${t} – SOUL Radiology`;
  }

  // Move keyboard / screen-reader focus to the new page's main heading
  function focusHeading(root) {
    if (!root) return;
    const h = root.querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  function syncFilterUI() {
    if (!sampleCategoryFilters) return;
    sampleCategoryFilters.querySelectorAll('.filter-chip').forEach(c => {
      const on = c.dataset.region === state.activeFilter;
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function showLandingView() {
    clearTimeout(state.redirectTimer);
    showOnly(viewLanding);
    if (mainNavLinks) mainNavLinks.style.display = 'flex';
    if (navAuthControls) navAuthControls.style.display = 'flex';
    if (navGuestControls) navGuestControls.style.display = 'none';
    setTitle('SOUL Radiology');
    window.scrollTo(0, 0);
  }

  function exploreSamples() {
    showDashboardView(true);
  }

  function showLoginView(prefillId = '') {
    showDashboardView(true);
  }

  function showSignupStep1(prefillEmail = '') {
    clearTimeout(state.redirectTimer);
    showOnly(viewAuth, 'flex');
    setTitle('Create Account');
    cardLogin.style.display = 'none';
    cardSignup.style.display = 'block';

    signupSubcard1.style.display = 'block';
    signupSubcard2.style.display = 'none';

    trackerStep1.className = 'step-item active';
    trackerStep2.className = 'step-item';
    trackerDivider.className = 'step-divider';
    signupStepSubtitle.textContent = 'Step 1 of 2';

    signupAlertContainer.innerHTML = '';
    if (prefillEmail) {
      regEmail.value = prefillEmail;
    }
    regName.focus();
  }

  function showSignupStep2() {
    signupSubcard1.style.display = 'none';
    signupSubcard2.style.display = 'block';

    trackerStep1.className = 'step-item completed';
    trackerStep2.className = 'step-item active';
    trackerDivider.className = 'step-divider filled';
    signupStepSubtitle.textContent = 'Step 2 of 2';

    if (state.signupStep1Data) {
      card2SummaryName.textContent = state.signupStep1Data.name;
      card2SummaryContact.textContent = `${state.signupStep1Data.email} • ${state.signupStep1Data.gender}`;
    }

    renderUsernameSuggestions();
    regUsername.focus();
  }

  function showDashboardView(silent = false) {
    showOnly(viewDashboard);
    setTitle('Sample Reports');
    setActiveNav('home');

    if (mainNavLinks) mainNavLinks.style.display = 'flex';
    if (navAuthControls) navAuthControls.style.display = 'flex';
    if (navGuestControls) navGuestControls.style.display = 'none';

    updateUserProfileUI();
    renderReportCards();

    if (!silent && state.currentUser) showToast(`Signed in as ${state.currentUser.name}`);
    window.scrollTo(0, 0);
    focusHeading(viewDashboard);
  }

  /* =========================================================================
     User Profile (Top-Right Navbar)
     ========================================================================= */
  function updateUserProfileUI() {
    const user = state.currentUser;
    if (!user) return;

    // Top-Right Pill
    navUserAvatar.textContent = user.avatarInitials || 'U';
    navUserAvatar.style.backgroundColor = user.avatarBg || '#13836B';
    navUserName.textContent = user.name;
    navUserHandle.textContent = `@${user.username}`;

    // Dropdown
    menuAvatar.textContent = user.avatarInitials || 'U';
    menuAvatar.style.backgroundColor = user.avatarBg || '#13836B';
    menuUserName.textContent = user.name;
    menuUserEmail.textContent = user.email;
    menuUserId.textContent = user.userId || 'SOUL-USER';

    menuUsername.textContent = `@${user.username}`;
    menuDob.textContent = user.dob || '—';
    menuGender.textContent = user.gender || '—';
    menuMobile.textContent = user.mobile || '—';

  }

  function toggleProfileDropdown(forceClose = false) {
    if (forceClose) {
      userProfileContainer.classList.remove('open');
      userProfileTrigger.setAttribute('aria-expanded', 'false');
    } else {
      const isOpen = userProfileContainer.classList.toggle('open');
      userProfileTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  /* =========================================================================
     Login & Non-existence Redirection
     ========================================================================= */
  function handleLoginSubmit(e) {
    e.preventDefault();
    loginAlertContainer.innerHTML = '';

    const identifier = loginIdentifier.value.trim();
    const password = loginPassword.value;

    if (!identifier) {
      showFieldError('login-identifier-feedback', 'Enter your username or email address.');
      loginIdentifier.classList.add('is-invalid');
      return;
    }
    clearFieldError('login-identifier-feedback');
    loginIdentifier.classList.remove('is-invalid');

    if (!password) {
      showFieldError('login-password-feedback', 'Enter your password.');
      loginPassword.classList.add('is-invalid');
      return;
    }
    clearFieldError('login-password-feedback');
    loginPassword.classList.remove('is-invalid');

    if (loginCaptcha.value.trim().toUpperCase() !== captchaValue) {
      newCaptcha();
      showFieldError('login-captcha-feedback', 'The code did not match. Please try the new code.');
      loginCaptcha.classList.add('is-invalid');
      return;
    }
    clearFieldError('login-captcha-feedback');
    loginCaptcha.classList.remove('is-invalid');

    const result = window.soulAuth.login(identifier, password);
    newCaptcha();

    if (result.success) {
      state.currentUser = result.user;
      showDashboardView();
      return;
    }

    // Account doesn't exist -> Redirect to Sign Up!
    if (result.notFound) {
      loginAlertContainer.innerHTML = `
        <div class="alert-box amber">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div>
            <div style="font-weight: 600; margin-bottom: 2px;">No account found</div>
            <div>We couldn't find "<strong>${escapeHtml(identifier)}</strong>". Taking you to Sign Up in <span id="redirect-counter">3</span>s…</div>
            <div class="alert-redirect-action">
              <button type="button" class="btn btn-teal" id="btn-redirect-now" style="min-height: 32px; padding: 0 12px; font-size: 0.8125rem;">
                Create account
              </button>
            </div>
          </div>
        </div>
      `;

      let countdown = 3;
      const counterEl = document.getElementById('redirect-counter');
      const btnRedirectNow = document.getElementById('btn-redirect-now');

      btnRedirectNow?.addEventListener('click', () => {
        clearTimeout(state.redirectTimer);
        proceedRedirect(identifier);
      });

      state.redirectTimer = setInterval(() => {
        countdown--;
        if (counterEl) counterEl.textContent = countdown;
        if (countdown <= 0) {
          clearTimeout(state.redirectTimer);
          proceedRedirect(identifier);
        }
      }, 1000);
      return;
    }

    // Wrong password
    loginAlertContainer.innerHTML = `
      <div class="alert-box error">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        <div>
          <div style="font-weight: 600;">Wrong password</div>
          <div>Please try again.</div>
        </div>
      </div>
    `;
    loginPassword.classList.add('is-invalid');
  }

  function proceedRedirect(identifier) {
    const isEmail = identifier.includes('@');
    showSignupStep1(isEmail ? identifier : '');
    if (!isEmail) {
      regName.value = identifier.charAt(0).toUpperCase() + identifier.slice(1);
    }
    showToast('Redirected to registration.');
  }

  /* =========================================================================
     2-Card Sign Up Wizard
     ========================================================================= */
  function handleSignupCard1Submit(e) {
    e.preventDefault();
    signupAlertContainer.innerHTML = '';

    const name = regName.value.trim();
    const dob = regDob.value;
    const genderEl = document.querySelector('input[name="reg-gender"]:checked');
    const mobile = regMobile.value.trim();
    const email = regEmail.value.trim();

    let hasErrors = false;

    if (!name || name.length < 2) {
      showFieldError('reg-name-feedback', 'Please enter your name.');
      regName.classList.add('is-invalid');
      hasErrors = true;
    } else {
      clearFieldError('reg-name-feedback');
      regName.classList.remove('is-invalid');
    }

    if (!dob) {
      showFieldError('reg-dob-feedback', 'Date of birth is required.');
      regDob.classList.add('is-invalid');
      hasErrors = true;
    } else {
      clearFieldError('reg-dob-feedback');
      regDob.classList.remove('is-invalid');
    }

    if (!genderEl) {
      showFieldError('reg-gender-feedback', 'Please select a gender.');
      hasErrors = true;
    } else {
      clearFieldError('reg-gender-feedback');
    }

    const phoneDigits = mobile.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      showFieldError('reg-mobile-feedback', 'Enter a valid 10-digit mobile number.');
      regMobile.classList.add('is-invalid');
      hasErrors = true;
    } else {
      clearFieldError('reg-mobile-feedback');
      regMobile.classList.remove('is-invalid');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFieldError('reg-email-feedback', 'Enter a valid email address.');
      regEmail.classList.add('is-invalid');
      hasErrors = true;
    } else if (window.soulAuth.checkEmailExists(email)) {
      showFieldError('reg-email-feedback', 'Email is already registered. Please sign in.');
      regEmail.classList.add('is-invalid');
      hasErrors = true;
    } else {
      clearFieldError('reg-email-feedback');
      regEmail.classList.remove('is-invalid');
    }

    if (hasErrors) return;

    state.signupStep1Data = {
      name,
      dob,
      gender: genderEl.value,
      mobile: phoneDigits.length === 10 ? `+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}` : mobile,
      email
    };

    showSignupStep2();
  }

  function renderUsernameSuggestions() {
    if (!state.signupStep1Data) return;
    const suggestions = window.soulAuth.generateUsernameSuggestions(state.signupStep1Data.name);

    if (suggestions.length > 0) {
      usernameSuggestionsWrap.style.display = 'block';
      usernameSuggestionsList.innerHTML = suggestions.map(s => `
        <button type="button" class="suggestion-chip" data-user="${s}">
          + @${s}
        </button>
      `).join('');

      usernameSuggestionsList.querySelectorAll('.suggestion-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          regUsername.value = btn.dataset.user;
          validateUsernameUniqueness();
        });
      });
    } else {
      usernameSuggestionsWrap.style.display = 'none';
    }
  }

  function validateUsernameUniqueness() {
    const raw = regUsername.value.trim();
    if (!raw) {
      regUsernameFeedback.className = 'field-feedback hint';
      regUsernameFeedback.innerHTML = '<span class="text-muted">Pick a unique username.</span>';
      regUsername.classList.remove('is-valid', 'is-invalid');
      return false;
    }

    const check = window.soulAuth.checkUsernameAvailability(raw);
    if (check.available) {
      regUsernameFeedback.className = 'field-feedback success';
      regUsernameFeedback.innerHTML = `<span>${check.message}</span>`;
      regUsername.classList.remove('is-invalid');
      regUsername.classList.add('is-valid');
      return true;
    } else {
      regUsernameFeedback.className = 'field-feedback error';
      regUsernameFeedback.innerHTML = `<span>${check.message}</span>`;
      regUsername.classList.remove('is-valid');
      regUsername.classList.add('is-invalid');
      return false;
    }
  }

  function handleSignupCard2Submit(e) {
    e.preventDefault();
    signupAlertContainer.innerHTML = '';

    const validUser = validateUsernameUniqueness();
    if (!validUser) {
      regUsername.focus();
      return;
    }

    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;

    let hasErrors = false;

    if (!password || password.length < 8) {
      showFieldError('reg-password-feedback', 'Password must be at least 8 characters.');
      regPassword.classList.add('is-invalid');
      hasErrors = true;
    } else {
      clearFieldError('reg-password-feedback');
      regPassword.classList.remove('is-invalid');
    }

    if (password !== confirmPassword) {
      showFieldError('reg-confirm-password-feedback', 'Passwords do not match.');
      regConfirmPassword.classList.add('is-invalid');
      hasErrors = true;
    } else {
      clearFieldError('reg-confirm-password-feedback');
      regConfirmPassword.classList.remove('is-invalid');
    }

    if (hasErrors) return;

    const fullData = {
      ...state.signupStep1Data,
      username: regUsername.value.trim(),
      password: password
    };

    const result = window.soulAuth.registerUser(fullData);
    if (result.success) {
      state.currentUser = result.user;
      showToast('Account registered successfully!');
      showDashboardView();
    } else {
      signupAlertContainer.innerHTML = `
        <div class="alert-box error">
          <div>${escapeHtml(result.message)}</div>
        </div>
      `;
    }
  }

  /* =========================================================================
     Synthetic Radiology Reports Library (Card-based, Clean, Non-Texty)
     ========================================================================= */
  function renderReportCards() {
    let list = [...state.reports];

    // Filter by Region
    if (state.activeFilter !== 'all') {
      list = list.filter(r => r.bodyRegion.toLowerCase().includes(state.activeFilter.toLowerCase()));
    }

    // Search Filter
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.examType.toLowerCase().includes(q) ||
        r.bodyRegion.toLowerCase().includes(q) ||
        r.reportText.toLowerCase().includes(q)
      );
    }

    if (list.length === 0) {
      reportsGridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px var(--space-4); background: #fff; border: 1px solid var(--color-border-default); border-radius: var(--radius-card); color: var(--color-text-muted);">
          No reports found.
        </div>
      `;
      return;
    }

    reportsGridContainer.innerHTML = list.map(item => `
      <div class="report-card">
        <div>
          <span class="report-id-badge">${escapeHtml(item.id)}</span>
          <h2 class="exam-type-title">${escapeHtml(item.examType)}</h2>

          <div class="report-meta-chips">
            <span class="meta-chip highlight">${escapeHtml(item.bodyRegion)}</span>
            <span class="meta-chip">${escapeHtml(item.sampleDate)}</span>
          </div>

          <p class="report-card-desc">${escapeHtml(item.matchingAnalysis.findingSummary)}</p>
        </div>

        <div class="report-card-footer">
          <div class="analysis-status-pill ${item.statusColor}">
            <span class="status-dot"></span>
            <span>${escapeHtml(item.statusBadge)}</span>
          </div>

          <button class="btn btn-secondary btn-view-analysis" data-id="${item.id}" aria-label="View report: ${escapeHtml(item.examType)}">
            View Report
          </button>
        </div>
      </div>
    `).join('');

    reportsGridContainer.querySelectorAll('.btn-view-analysis').forEach(btn => {
      btn.addEventListener('click', () => {
        showReportView(btn.dataset.id, 'detail');
      });
    });
  }

  /* =========================================================================
     Report pages: "detail" (details + original report) and "analysis"
     Rebuilt from the selected sample every time, so nothing carries over.
     ========================================================================= */
  const ICON_WARN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
  const ICON_INFO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

  function showReportView(reportId, stage = 'detail') {
    const item = state.reports.find(r => r.id === reportId);
    if (!item) return;
    state.activeReportId = item.id;
    const a = item.matchingAnalysis;
    const esc = escapeHtml;

    const traces = [];
    const source = (text) => {
      if (!text) return '';
      traces.push(text);
      return `<details class="source-details"><summary>From the original report</summary><blockquote class="source-quote">${esc(text)}</blockquote></details>
        <button type="button" class="link-btn no-print" data-trace="${traces.length - 1}">Show in full report</button>`;
    };

    const head = (title) => `
      <header class="report-head">
        <div class="report-head-tags">
          <span class="report-id-badge">${esc(item.id)}</span>
          <span class="brand-badge">Fictional sample</span>
        </div>
        <h1 class="page-title">${title}</h1>
        <p class="report-sub">${esc(item.examType)} · ${esc(item.bodyRegion)}</p>
        <p class="sample-notice report-notice" role="note">${ICON_INFO}<span>Fictional prototype sample. Not for medical decisions.</span></p>
        <div class="report-actions no-print">
          <button type="button" class="btn btn-primary btn-ai-action" data-ask-ai="early-detection" title="Early Detection of Disease (Ask AI)">
            <span>✨ Early Detection (Ask AI)</span>
          </button>
          <button type="button" class="btn btn-secondary" data-ask-ai title="Ask AI about this report">Ask AI</button>
          <button type="button" class="btn btn-secondary" data-scan>View scan</button>
          <button type="button" class="btn btn-secondary" data-copy>Copy summary</button>
          <button type="button" class="btn btn-secondary" data-print>Print</button>
        </div>
      </header>`;

    let html;

    if (stage === 'detail') {
      const prior = item.priorReport;
      html = `
        <button type="button" class="btn btn-ghost report-back" data-back>← Back to Samples</button>
        ${head('Sample Report')}

        <section class="report-section">
          <h2 class="section-title">Examination Details</h2>
          <dl class="details-grid">
            <div><dt>Type</dt><dd>${esc(item.examType)}</dd></div>
            <div><dt>Body region</dt><dd>${esc(item.bodyRegion)}</dd></div>
            <div><dt>Sample date</dt><dd>${esc(item.sampleDate)}</dd></div>
          </dl>
        </section>

        <section class="report-section original-card">
          <h2 class="section-title">Original Report</h2>
          ${prior ? `<p class="muted-note">Current report · ${esc(item.sampleDate)}</p>` : ''}
          <p class="original-text">${esc(item.reportText)}</p>
        </section>

        ${prior ? `
        <section class="report-section original-card prior-card">
          <h2 class="section-title">Prior Report</h2>
          <p class="muted-note">Earlier report · ${esc(prior.date)}</p>
          <p class="original-text">${esc(prior.reportText)}</p>
        </section>` : ''}

        <button type="button" class="btn btn-primary report-back-bottom" data-analysis>View Analysis</button>
      `;
    } else {
      const findings = a.structuredFindings.map(f => `
        <li class="finding-item">
          <div class="finding-label">${esc(f.label)}</div>
          <div class="finding-value">${esc(f.value)}</div>
          ${source(f.evidence)}
        </li>`).join('');

      const warning = a.warning ? `
        <section class="warning-panel" aria-labelledby="warn-title">
          <h2 class="warning-title" id="warn-title">${ICON_WARN}<span>Review Note</span></h2>
          <p>${esc(a.warning.summary)}</p>
          ${source(a.warning.evidence)}
          <p class="warning-foot">This finding needs a qualified professional to interpret. It is not a diagnosis.</p>
        </section>` : '';

      const incomplete = a.incomplete ? `
        <section class="notice-panel" aria-labelledby="inc-title">
          <h2 class="warning-title" id="inc-title">${ICON_INFO}<span>Not Enough Information</span></h2>
          <p>${esc(a.incomplete.summary)}</p>
          <ul class="finding-list compact">${a.incomplete.points.map(pt => `<li>${esc(pt.text)}${source(pt.evidence)}</li>`).join('')}</ul>
        </section>` : '';

      const ed = getEarlyDetectionData(item);
      const earlyDetectStatusClass = ed.statusType === 'green' ? 'status-green' : (ed.statusType === 'amber' ? 'status-amber' : 'status-teal');
      const earlyDetectSection = `
        <section class="report-section early-detection-card" id="early-detection-card">
          <div class="early-detect-head">
            <div class="early-detect-badge">
              <span>🔬</span> Early Disease Detection Option
            </div>
            <span class="detect-status-pill ${earlyDetectStatusClass}">${esc(ed.status)}</span>
          </div>
          <h2 class="section-title" style="margin-top: 4px; margin-bottom: 8px;">${esc(ed.targetDisease)}</h2>
          <div class="early-detect-grid">
            <div class="detect-item">
              <span class="detect-label">Target Condition</span>
              <span class="detect-value"><strong>${esc(ed.targetDisease)}</strong></span>
            </div>
            <div class="detect-item">
              <span class="detect-label">Detection Stage</span>
              <span class="detect-value">${esc(ed.stage)}</span>
            </div>
            <div class="detect-item" style="grid-column: 1 / -1;">
              <span class="detect-label">Detected Early Biomarkers & Signs</span>
              <ul class="detect-indicators-list">
                ${ed.indicators.map(ind => `<li>${esc(ind)}</li>`).join('')}
              </ul>
            </div>
            <div class="detect-item" style="grid-column: 1 / -1;">
              <span class="detect-label">Early Intervention Window</span>
              <span class="detect-value">${esc(ed.earlyIntervention)}</span>
            </div>
          </div>
          <div class="early-detect-action-row">
            <button type="button" class="btn btn-primary btn-ai-action" data-ask-ai="early-detection">
              <span>✨ Ask AI for Full Early Detection & Prevention Plan</span>
            </button>
          </div>
        </section>`;

      const impression = item.impression
        ? `<p class="impression-text">${esc(item.impression)}</p><p class="muted-note small">From the sample report.</p>`
        : '<p class="muted-note">No separate impression is stated in this sample.</p>';

      const comparison = (item.priorReport && a.comparison) ? `
        <section class="report-section">
          <h2 class="section-title">Compared with Prior Report</h2>
          <p class="muted-note">Shows only where the two reports word things differently. It does not say whether anything improved or got worse.</p>
          ${a.comparison.rows.map(row => `
            <div class="compare-row">
              <h3 class="compare-topic">${esc(row.topic)}</h3>
              <div class="compare-grid">
                <div class="compare-col">
                  <div class="compare-label">Prior report · ${esc(item.priorReport.date)}</div>
                  <p>${row.prior ? `"${esc(row.prior)}"` : 'Not mentioned in this report.'}</p>
                </div>
                <div class="compare-col">
                  <div class="compare-label">Current report · ${esc(item.sampleDate)}</div>
                  <p>"${esc(row.current)}"</p>
                </div>
              </div>
            </div>`).join('')}
        </section>` : '';

      const measurements = (item.measurements && item.measurements.length) ? `
        <section class="report-section">
          <h2 class="section-title">Measurements</h2>
          <ul class="plain-list">${item.measurements.map(m => `<li>${esc(m.label)}: <strong>${esc(m.value)}${m.unit ? ' ' + esc(m.unit) : ''}</strong></li>`).join('')}</ul>
        </section>` : '';

      const foundTerms = findTerms(item.reportText);
      const wordsSection = foundTerms.length ? `
        <section class="report-section">
          <h2 class="section-title">Words Explained</h2>
          <div class="terms-grid compact">${foundTerms.map(termHtml).join('')}</div>
        </section>` : '';

      const recommendation = item.recommendation
        ? `<p>${esc(item.recommendation)}</p>`
        : '<p class="muted-note">No recommendation stated in this sample.</p>';

      html = `
        <button type="button" class="btn btn-ghost report-back" data-detail>← Back to Report</button>
        ${head('Analysis Result')}

        ${earlyDetectSection}
        ${warning}
        ${incomplete}

        <section class="report-section">
          <h2 class="section-title">Key Findings</h2>
          <ul class="finding-list">${findings}</ul>
        </section>

        <section class="report-section original-card" id="trace-section">
          <h2 class="section-title">Original Report</h2>
          <p class="muted-note small" id="trace-hint" role="status">Tap "Show in full report" on a finding to see where it comes from.</p>
          <p class="original-text" id="trace-text">${esc(item.reportText)}</p>
        </section>

        <section class="report-section">
          <h2 class="section-title">Radiologist's Impression</h2>
          ${impression}
        </section>

        <section class="report-section explain-card">
          <h2 class="section-title">Simple Explanation</h2>
          <p>${esc(a.plainLanguageExplanation)}</p>
        </section>

        ${wordsSection}
        ${comparison}
        ${measurements}

        <section class="report-section">
          <h2 class="section-title">Recommendations</h2>
          ${recommendation}
        </section>

        <section class="report-section limits-card">
          <h2 class="section-title">Review and Limitations</h2>
          <p>This is a predefined demonstration result, not a prediction from a trained AI model. It is not a diagnostic service and does not replace a professional medical opinion. Not for medical decisions. Please discuss your own reports with a qualified healthcare professional.</p>
        </section>

        <button type="button" class="btn btn-primary report-back-bottom" data-back>Back to Samples</button>
      `;
    }

    state.traces = traces;
    reportViewBody.innerHTML = html;
    showOnly(viewReport);
    setTitle(stage === 'analysis' ? 'Analysis Result' : 'Sample Report');
    window.scrollTo(0, 0);
    focusHeading(viewReport);
  }

  /* =========================================================================
     Accessibility: text size, high contrast, language
     ========================================================================= */
  const PREFS_KEY = 'soul_portal_prefs_v1';
  const prefs = { fs: 'base', hc: false, lang: 'en' };

  function setupPrefs() {
    try {
      const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
      if (['sm', 'base', 'lg'].includes(saved.fs)) prefs.fs = saved.fs;
      if (typeof saved.hc === 'boolean') prefs.hc = saved.hc;
      if (['en', 'hi', 'kn'].includes(saved.lang)) prefs.lang = saved.lang;
    } catch (e) { /* storage unavailable: use defaults */ }
    applyPrefs();
  }

  function applyPrefs() {
    const root = document.documentElement;
    root.classList.remove('fs-sm', 'fs-base', 'fs-lg');
    root.classList.add('fs-' + prefs.fs);
    root.classList.toggle('high-contrast', prefs.hc);
    root.dataset.lang = prefs.lang;
    document.querySelectorAll('[data-fs]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.fs === prefs.fs));
    });
    btnContrast.setAttribute('aria-pressed', String(prefs.hc));
    langSelect.value = prefs.lang;
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ }
  }

  /* =========================================================================
     Medical terms (glossary)
     ========================================================================= */
  function findTerms(text) {
    const t = (text || '').toLowerCase();
    return GLOSSARY.filter(g => g.keys.some(k => t.includes(k)));
  }

  function termHtml(g) {
    const esc = escapeHtml;
    return `
      <div class="term-card">
        <div class="term-head">
          <h3 class="term-name">${esc(g.term)}</h3>
          <span class="meta-chip">${esc(g.category)}</span>
        </div>
        <p>${esc(g.meaning)}</p>
        <p class="term-tr tr-hi" lang="hi">${esc(g.hi)}</p>
        <p class="term-tr tr-kn" lang="kn">${esc(g.kn)}</p>
      </div>`;
  }

  function renderTerms() {
    const q = termsSearch.value.trim().toLowerCase();
    const list = GLOSSARY
      .filter(g => !q || g.term.toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || g.meaning.toLowerCase().includes(q))
      .sort((x, y) => x.term.localeCompare(y.term));
    if (!list.length) {
      termsGrid.innerHTML = '<div class="empty-box">No words found.</div>';
      return;
    }
    termsGrid.innerHTML =
      '<p class="muted-note small tr-note">Hindi and Kannada lines are demo translations. Please have them checked before real use.</p>' +
      list.map(termHtml).join('');
  }

  /* =========================================================================
     Page switching for the new pages
     ========================================================================= */
  function setActiveNav(key) {
    mainNavLinks.querySelectorAll('.nav-link-btn').forEach(b => {
      const k = b.dataset.filter ? 'home' : b.dataset.page;
      b.classList.toggle('active', k === key);
    });
  }

  function showAppChrome() {
    if (mainNavLinks) mainNavLinks.style.display = 'flex';
    if (navAuthControls) navAuthControls.style.display = 'flex';
    if (navGuestControls) navGuestControls.style.display = 'none';
    updateUserProfileUI();
  }

  function showTermsView() {
    showDashboardView(true);
  }

  function showUploadView() {
    showOnly(viewUpload);
    showAppChrome();
    setActiveNav('upload');
    setTitle('Upload a Report');
    renderUploadSamples();
    renderUpload();
    window.scrollTo(0, 0);
    focusHeading(viewUpload);
  }

  function goPage(name) {
    if (name === 'upload') showUploadView();
    else if (name === 'scan') openScan(scanTargetFor(activeReport()));
    else showDashboardView(true);
  }

  /* =========================================================================
     Early Detection & Ask AI Clinical Assistant
     ========================================================================= */

  function getEarlyDetectionData(report) {
    if (report && report.earlyDetection) return report.earlyDetection;

    const text = (((report && report.reportText) || '') + ' ' + ((report && report.impression) || '')).toLowerCase();

    if (text.includes('nodule') || text.includes('mass') || text.includes('lesion') || text.includes('opacity') || text.includes('density')) {
      return {
        targetDisease: 'Pulmonary / Focal Lesion (Early Neoplasm Surveillance)',
        status: 'Early Indeterminate Finding',
        statusType: 'amber',
        stage: 'Early Detected Nodule / Mass Suspicion',
        indicators: [
          'Focal density or nodular parenchymal alteration identified on scan',
          'Requires interval radiographic surveillance to rule out early neoplastic progression'
        ],
        earlyIntervention: 'Follow-up cross-sectional low-dose CT in 3 to 6 months per clinical guidelines. Early detection offers the highest therapeutic success.',
        preventionGuidance: 'Avoid respiratory irritants and pollutants; report any hemoptysis or chronic chest symptoms immediately.',
        doctorQuestions: [
          'What is the recommended surveillance interval for this nodule?',
          'Are there prior scans available to establish long-term stability?'
        ]
      };
    } else if (text.includes('cartilage') || text.includes('meniscus') || text.includes('joint') || text.includes('osteophyt') || text.includes('knee')) {
      return {
        targetDisease: 'Early Knee Osteoarthritis & Meniscal Degeneration',
        status: 'Early Disease Detected (Grade 1-2)',
        statusType: 'teal',
        stage: 'Early Compartmental Osteoarthritis (Pre-Full Tear)',
        indicators: [
          'Articular cartilage thinning and early marginal osteophytes observed',
          'Intrasubstance meniscal signal change without full thickness tear'
        ],
        earlyIntervention: 'Early targeted physical therapy and joint load modification can halt structural cartilage degradation and prevent tear progression.',
        preventionGuidance: 'Low-impact exercise (swimming/cycling), quadriceps strengthening, and maintaining healthy joint weight.',
        doctorQuestions: [
          'Can structured physical therapy prevent this from progressing to an advanced tear?',
          'What exercises or joint supports are best at this early stage?'
        ]
      };
    } else if (text.includes('hemorrhage') || text.includes('hyperdens') || text.includes('infarct') || text.includes('stroke') || text.includes('bleed') || text.includes('brain')) {
      return {
        targetDisease: 'Acute Cerebrovascular Event / Intracranial Bleed',
        status: 'Early Critical Acute Pathology Detected',
        statusType: 'amber',
        stage: 'Early Hyperacute Phase (Golden Hour)',
        indicators: [
          'Acute focal hyperdensity or attenuation shift in cerebral parenchyma',
          'Detected before substantial mass effect or midline herniation'
        ],
        earlyIntervention: 'Urgent emergency neurology consultation, strict blood pressure control, and CT angiography to prevent hematoma enlargement.',
        preventionGuidance: 'Immediate inpatient stroke protocol management and rigorous long-term cardiovascular risk control.',
        doctorQuestions: [
          'Is emergency neurovascular imaging (CTA) required immediately?',
          'What is the emergency protocol for blood pressure and antiplatelet management?'
        ]
      };
    } else if (text.includes('gallbladder') || text.includes('liver') || text.includes('calculi') || text.includes('sludge') || text.includes('pancreas') || text.includes('chole')) {
      return {
        targetDisease: 'Early Biliary Sludge & Gallstone Disease (Cholelithiasis)',
        status: 'Early Biliary Pathology Detected',
        statusType: 'amber',
        stage: 'Early Subclinical Biliary Lithiasis',
        indicators: [
          'Acoustic shadowing or luminal debris in gallbladder',
          'Early intervention prevents acute cholecystitis and duct obstruction'
        ],
        earlyIntervention: 'Low-fat dietary adjustment, hydration, and scheduling repeat fasting ultrasound to assess obscured abdominal structures.',
        preventionGuidance: 'Gradual weight loss, low saturated-fat nutrition, and routine abdominal surveillance.',
        doctorQuestions: [
          'Does the debris/stone require elective treatment before symptoms develop?',
          'Should I schedule a follow-up fasting ultrasound or CT?'
        ]
      };
    } else {
      return {
        targetDisease: 'Cardiopulmonary & Anatomical Screening',
        status: 'Clear / Negative Baseline',
        statusType: 'green',
        stage: 'Healthy Baseline (No Early Pathology Detected)',
        indicators: [
          'No focal consolidation, pneumothorax, or abnormal fluid collections',
          'Cardiothoracic ratio and organ morphology within normal physiological limits'
        ],
        earlyIntervention: 'No active medical treatment required. Maintain routine preventive screening.',
        preventionGuidance: 'Maintain balanced lifestyle and keep this clear scan as a future baseline comparison.',
        doctorQuestions: [
          'Does this clear result confirm my symptoms are not coming from this organ system?',
          'When is the next routine wellness screening recommended?'
        ]
      };
    }
  }

  function generateEarlyDetectionResponse(report) {
    const ed = getEarlyDetectionData(report);
    const esc = escapeHtml;
    const badgeClass = ed.statusType === 'green' ? 'status-green' : (ed.statusType === 'amber' ? 'status-amber' : 'status-teal');

    return `
      <div class="ai-detect-response">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
          <span style="font-weight:700; color:#13836B; font-size:0.875rem;">🔬 EARLY DETECTION OF DISEASE ANALYSIS</span>
          <span class="detect-status-pill ${badgeClass}">${esc(ed.status)}</span>
        </div>
        <h3 style="margin:0 0 8px 0; font-size:1.05rem; color:#17365D;">${esc(ed.targetDisease)}</h3>
        <p style="margin:0 0 10px 0; font-size:0.875rem; color:#374151;">Based on findings from <strong>${esc(report.examType)}</strong> (${esc(report.bodyRegion)}, ${esc(report.sampleDate)}):</p>

        <div class="ai-response-section">
          <h4><span>🎯</span> Disease Detection Stage</h4>
          <p style="margin:0; font-size:0.875rem;"><strong>Current Status:</strong> ${esc(ed.stage)}</p>
        </div>

        <div class="ai-response-section">
          <h4><span>🔍</span> Detected Early Radiographic Biomarkers</h4>
          <ul class="ai-response-list">
            ${ed.indicators.map(ind => `<li>${esc(ind)}</li>`).join('')}
          </ul>
        </div>

        <div class="ai-response-section">
          <h4><span>⏱️</span> Why Early Detection Matters Here</h4>
          <p style="margin:0; font-size:0.875rem; line-height:1.45;">${esc(ed.earlyIntervention)}</p>
        </div>

        <div class="ai-response-section">
          <h4><span>🛡️</span> Prevention & Management Plan</h4>
          <p style="margin:0; font-size:0.875rem; line-height:1.45;">${esc(ed.preventionGuidance)}</p>
        </div>

        <div class="ai-response-section">
          <h4><span>🩺</span> Recommended Questions for Your Doctor</h4>
          <ul class="ai-response-list">
            ${ed.doctorQuestions.map(q => `<li><em>"${esc(q)}"</em></li>`).join('')}
          </ul>
        </div>
      </div>
      <p class="muted-note small" style="margin-top:6px;"><em>Deterministic educational output derived from report findings. Discuss with your physician for formal diagnosis.</em></p>
    `;
  }

  function generateSummaryResponse(report) {
    const a = report.matchingAnalysis;
    const esc = escapeHtml;
    return `
      <div class="ai-response-card">
        <h3 style="margin:0 0 6px 0; font-size:1rem; color:#17365D;">📋 Plain-Language Report Summary</h3>
        <p style="margin:0 0 8px 0; font-size:0.9375rem;"><strong>Core finding:</strong> ${esc(a.findingSummary)}</p>
        <p style="margin:0 0 8px 0; font-size:0.875rem; line-height:1.5;">${esc(a.plainLanguageExplanation)}</p>
        <div style="background:#F3F4F6; padding:8px 12px; border-radius:6px; font-size:0.8125rem;">
          <strong>Radiologist's Impression:</strong> ${esc(report.impression || 'No separate impression stated.')}
        </div>
      </div>
    `;
  }

  function generateDoctorQuestionsResponse(report) {
    const ed = getEarlyDetectionData(report);
    const esc = escapeHtml;
    return `
      <div class="ai-response-card">
        <h3 style="margin:0 0 6px 0; font-size:1rem; color:#17365D;">🩺 Questions to Ask Your Doctor</h3>
        <p style="margin:0 0 8px 0; font-size:0.875rem;">Take these questions to your next appointment:</p>
        <ul class="ai-response-list">
          ${ed.doctorQuestions.map(q => `<li><strong>"${esc(q)}"</strong></li>`).join('')}
          <li>"What does this finding mean in the context of my current health and symptoms?"</li>
          <li>"Are there early preventive steps or treatments I should start now?"</li>
        </ul>
      </div>
    `;
  }

  function generateRisksResponse(report) {
    const a = report.matchingAnalysis;
    const ed = getEarlyDetectionData(report);
    const esc = escapeHtml;
    const warning = a.warning ? `<div style="background:#FFF5E3; border:1px solid #FFE0A3; padding:10px; border-radius:6px; margin-bottom:8px;"><strong>⚠️ Review Note:</strong> ${esc(a.warning.summary)}</div>` : '';
    return `
      <div class="ai-response-card">
        <h3 style="margin:0 0 6px 0; font-size:1rem; color:#17365D;">⚠️ Clinical Review & Urgency Evaluation</h3>
        ${warning}
        <p style="margin:0 0 8px 0; font-size:0.875rem;"><strong>Early Detection Status:</strong> ${esc(ed.status)} (${esc(ed.stage)})</p>
        <p style="margin:0 0 8px 0; font-size:0.875rem;"><strong>Urgency:</strong> ${a.warning ? 'Prompt medical review recommended.' : 'Routine outpatient discussion.'}</p>
        <p style="margin:0; font-size:0.875rem;">${esc(a.clinicianReviewPrompt || 'Share this report with your doctor.')}</p>
      </div>
    `;
  }

  function appendAiMessage(role, htmlContent) {
    if (!aiChatThread) return;
    const msg = document.createElement('div');
    msg.className = `ai-msg ${role}`;
    msg.innerHTML = `
      <div class="ai-msg-avatar" aria-hidden="true">${role === 'user' ? '👤' : '✨'}</div>
      <div class="ai-msg-bubble">${htmlContent}</div>
    `;
    aiChatThread.appendChild(msg);
    aiChatThread.scrollTop = aiChatThread.scrollHeight;
  }

  function openAiModal(initialPrompt = '') {
    const report = activeReport();
    if (!report || !aiModal) return;

    if (aiContextText) aiContextText.textContent = `${report.examType} (${report.bodyRegion})`;
    if (aiContextBadge) aiContextBadge.textContent = report.id;

    if (aiChatThread) {
      aiChatThread.innerHTML = '';
      appendAiMessage('assistant', `
        <p style="margin:0 0 6px 0;"><strong>Hello! I am your SOUL AI Clinical Assistant.</strong></p>
        <p style="margin:0 0 8px 0; font-size:0.875rem;">I have loaded your report: <em>${escapeHtml(report.examType)}</em> (${escapeHtml(report.sampleDate)}). Tap the <strong>"Early Detection of Disease"</strong> option below or ask me any question about your scan.</p>
      `);
    }

    aiModal.removeAttribute('hidden');

    if (initialPrompt === 'early-detection') {
      setTimeout(() => {
        handleAiPrompt('early-detection');
      }, 200);
    } else if (initialPrompt) {
      setTimeout(() => {
        handleAiPrompt(initialPrompt);
      }, 200);
    }

    if (aiInputBox) {
      setTimeout(() => aiInputBox.focus(), 300);
    }
  }

  function closeAiModal() {
    if (aiModal) aiModal.setAttribute('hidden', '');
  }

  function handleAiPrompt(promptKey) {
    const report = activeReport();
    if (!report) return;

    let userLabel = '';
    let responseHtml = '';

    if (promptKey === 'early-detection') {
      userLabel = '🔬 What is the Early Detection of Disease analysis for this report?';
      responseHtml = generateEarlyDetectionResponse(report);
    } else if (promptKey === 'summary') {
      userLabel = '📋 Please summarize this report in plain language.';
      responseHtml = generateSummaryResponse(report);
    } else if (promptKey === 'doctor-questions') {
      userLabel = '🩺 What questions should I ask my doctor about this report?';
      responseHtml = generateDoctorQuestionsResponse(report);
    } else if (promptKey === 'risks') {
      userLabel = '⚠️ Are there any critical risks or urgent findings in this report?';
      responseHtml = generateRisksResponse(report);
    } else {
      userLabel = promptKey;
      responseHtml = processCustomAiQuery(promptKey, report);
    }

    appendAiMessage('user', escapeHtml(userLabel));
    setTimeout(() => {
      appendAiMessage('assistant', responseHtml);
    }, 150);
  }

  function processCustomAiQuery(text, report) {
    const q = (text || '').toLowerCase();
    if (q.includes('early') || q.includes('detect') || q.includes('disease') || q.includes('prevent') || q.includes('risk') || q.includes('stage') || q.includes('cancer') || q.includes('stroke') || q.includes('arthritis') || q.includes('stone') || q.includes('heart') || q.includes('finding')) {
      return generateEarlyDetectionResponse(report);
    } else if (q.includes('summary') || q.includes('explain') || q.includes('simple') || q.includes('mean') || q.includes('what is')) {
      return generateSummaryResponse(report);
    } else if (q.includes('doctor') || q.includes('ask') || q.includes('question')) {
      return generateDoctorQuestionsResponse(report);
    } else if (q.includes('urgent') || q.includes('risk') || q.includes('danger') || q.includes('bad') || q.includes('warning')) {
      return generateRisksResponse(report);
    } else {
      return generateEarlyDetectionResponse(report);
    }
  }

  /* =========================================================================
     Report helpers: copy summary and source tracing
     ========================================================================= */
  function activeReport() {
    return state.reports.find(r => r.id === state.activeReportId) || state.reports[0];
  }

  function summaryText(item) {
    const a = item.matchingAnalysis;
    return [
      `${item.examType} (${item.bodyRegion}, ${item.sampleDate})`,
      `Summary: ${a.findingSummary}`,
      'Key findings:',
      ...a.structuredFindings.map(f => `- ${f.label}: ${f.value}`),
      `In simple words: ${a.plainLanguageExplanation}`,
      '',
      'Fictional sample. Not for medical decisions.'
    ].join('\n');
  }

  async function copySummary() {
    const text = summaryText(activeReport());
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
    }
    showToast(ok ? 'Summary copied.' : 'Could not copy. Please select the text instead.');
  }

  function traceTo(idx) {
    const item = activeReport();
    const evidence = state.traces && state.traces[idx];
    const textEl = document.getElementById('trace-text');
    const hintEl = document.getElementById('trace-hint');
    if (!item || !evidence || !textEl) return;
    const start = item.reportText.indexOf(evidence);
    if (start < 0) {
      hintEl.textContent = 'Could not find that sentence in the report.';
      return;
    }
    const before = item.reportText.slice(0, start);
    const after = item.reportText.slice(start + evidence.length);
    textEl.innerHTML = `${escapeHtml(before)}<mark class="trace-mark">${escapeHtml(evidence)}</mark>${escapeHtml(after)}`;
    hintEl.textContent = 'Highlighted below: the part of the report this finding comes from.';
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('trace-section').scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
  }

  /* =========================================================================
     Scan Viewer (display only, simple illustrations)
     ========================================================================= */
  const scan = { zoom: 1, invert: false, lastFocus: null };

  function scanKind(region) {
    const r = (region || '').toLowerCase();
    if (/thorax|lung|chest/.test(r)) return 'chest';
    if (/knee|joint/.test(r)) return 'knee';
    if (/head|brain/.test(r)) return 'brain';
    if (/abdom|pelvis/.test(r)) return 'abdomen';
    if (/spine|back/.test(r)) return 'spine';
    return 'generic';
  }

  const SCAN_ART = {
    chest: `
      <path d="M40 190 C38 120 50 60 100 45 C150 60 162 120 160 190 Z" fill="#2b3037" filter="url(#soft)"/>
      <ellipse cx="73" cy="110" rx="26" ry="45" fill="#0c0f12" filter="url(#soft)"/>
      <ellipse cx="127" cy="110" rx="26" ry="45" fill="#0c0f12" filter="url(#soft)"/>
      <ellipse cx="108" cy="128" rx="17" ry="24" fill="#8a929b" opacity=".55" filter="url(#soft)"/>
      <rect x="97" y="48" width="6" height="142" fill="#d3d9df" opacity=".55"/>
      <g stroke="#d3d9df" stroke-width="2.5" fill="none" opacity=".45">
        <path d="M97 70 Q60 70 46 95"/><path d="M103 70 Q140 70 154 95"/>
        <path d="M97 92 Q58 92 44 122"/><path d="M103 92 Q142 92 156 122"/>
        <path d="M97 114 Q58 114 45 148"/><path d="M103 114 Q142 114 155 148"/>
      </g>`,
    brain: `
      <ellipse cx="100" cy="100" rx="70" ry="82" fill="none" stroke="#e6eaee" stroke-width="7"/>
      <ellipse cx="100" cy="100" rx="63" ry="75" fill="#6d747c" filter="url(#soft)"/>
      <path d="M100 78 C86 72 78 84 82 98 C86 110 96 108 100 100 C104 108 114 110 118 98 C122 84 114 72 100 78Z" fill="#14171a"/>
      <line x1="100" y1="25" x2="100" y2="175" stroke="#4a5058" stroke-width="1.5"/>`,
    abdomen: `
      <path d="M100 8 L10 170 A110 110 0 0 0 190 170 Z" fill="#1c2024"/>
      <ellipse cx="78" cy="105" rx="30" ry="22" fill="#7c848c" opacity=".7" filter="url(#soft)"/>
      <ellipse cx="128" cy="120" rx="20" ry="14" fill="#9aa2aa" opacity=".6" filter="url(#soft)"/>
      <ellipse cx="100" cy="152" rx="40" ry="10" fill="#000" opacity=".55" filter="url(#soft)"/>`,
    spine: `
      <g fill="#cfd6dd" opacity=".7">
        <rect x="82" y="20" width="36" height="28" rx="6" transform="rotate(-4 100 34)"/>
        <rect x="80" y="56" width="38" height="28" rx="6" transform="rotate(-2 100 70)"/>
        <rect x="80" y="92" width="38" height="28" rx="6"/>
        <rect x="82" y="128" width="38" height="28" rx="6" transform="rotate(3 100 142)"/>
        <rect x="86" y="164" width="38" height="26" rx="6" transform="rotate(7 105 177)"/>
      </g>`,
    knee: `
      <g fill="#cfd6dd" opacity=".75">
        <path d="M70 10 H130 C134 50 132 80 126 92 H74 C68 80 66 50 70 10Z"/>
        <path d="M72 108 H128 C132 140 130 175 126 192 H74 C70 175 68 140 72 108Z"/>
      </g>
      <rect x="72" y="93" width="56" height="13" rx="6" fill="#0c0f12" opacity=".8" filter="url(#soft)"/>
      <ellipse cx="146" cy="100" rx="10" ry="16" fill="#aab2ba" opacity=".7" filter="url(#soft)"/>
      <path d="M92 90 V110 M108 90 V110" stroke="#8a929b" stroke-width="3" opacity=".7"/>`,
    generic: `
      <ellipse cx="100" cy="100" rx="72" ry="72" fill="#2b3037" filter="url(#soft)"/>
      <ellipse cx="100" cy="100" rx="45" ry="45" fill="#6d747c" filter="url(#soft)"/>`
  };

  function scanSvg(kind) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Simple illustration of a ${kind} scan">
      <defs><filter id="soft"><feGaussianBlur stdDeviation="2"/></filter></defs>
      <rect width="200" height="200" fill="#0b0d10"/>
      ${SCAN_ART[kind] || SCAN_ART.generic}
      <text x="196" y="195" text-anchor="end" font-size="7" fill="#7b838c">ILLUSTRATION</text>
    </svg>`;
  }

  function scanTargetFor(item) {
    return { kind: scanKind(item.bodyRegion), caption: `${item.examType} · ${item.bodyRegion}` };
  }

  function updateScan() {
    scanCanvas.style.transform = `scale(${scan.zoom})`;
    scanCanvas.style.filter = scan.invert ? 'invert(1)' : 'none';
    scanZoomLabel.textContent = Math.round(scan.zoom * 100) + '%';
    btnScanInvert.setAttribute('aria-pressed', String(scan.invert));
  }

  function openScan(target) {
    scan.zoom = 1;
    scan.invert = false;
    scanCanvas.innerHTML = '';
    if (target.imageUrl) {
      const img = document.createElement('img');
      img.src = target.imageUrl;
      img.alt = 'Uploaded scan image';
      scanCanvas.appendChild(img);
    } else {
      scanCanvas.innerHTML = scanSvg(target.kind);
    }
    scanCaption.textContent = target.caption || '';
    scan.lastFocus = document.activeElement;
    scanModal.hidden = false;
    document.body.classList.add('modal-open');
    updateScan();
    scanClose.focus();
  }

  function closeScan() {
    if (scanModal.hidden) return;
    scanModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (scan.lastFocus && scan.lastFocus.focus) scan.lastFocus.focus();
  }

  function setupScanViewer() {
    scanClose.addEventListener('click', closeScan);
    scanModal.addEventListener('click', (e) => { if (e.target === scanModal) closeScan(); });
    btnScanZoomIn.addEventListener('click', () => { scan.zoom = Math.min(3, scan.zoom + 0.25); updateScan(); });
    btnScanZoomOut.addEventListener('click', () => { scan.zoom = Math.max(0.5, scan.zoom - 0.25); updateScan(); });
    btnScanInvert.addEventListener('click', () => { scan.invert = !scan.invert; updateScan(); });
    btnScanReset.addEventListener('click', () => { scan.zoom = 1; scan.invert = false; updateScan(); });

    document.addEventListener('keydown', (e) => {
      if (scanModal.hidden) return;
      if (e.key === 'Escape') { closeScan(); return; }
      if (e.key === 'Tab') {
        const items = [...scanModal.querySelectorAll('button')];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* =========================================================================
     Upload page
     ========================================================================= */
  const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
  state.upload = null;

  function formatSize(bytes) {
    return bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + ' KB' : (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function renderUploadSamples() {
    uploadSampleBtns.innerHTML = state.reports.map(r =>
      `<button type="button" class="filter-chip" data-sample="${escapeHtml(r.id)}">${escapeHtml(r.examType)}</button>`
    ).join('');
  }

  function loadSampleIntoUpload(id) {
    const item = state.reports.find(r => r.id === id);
    if (!item) return;
    state.upload = { kind: 'sample', name: `${item.id}.txt`, size: 'sample', text: item.reportText, sampleId: item.id };
    renderUpload();
  }

  function handleFile(file) {
    if (!file) return;
    const lower = file.name.toLowerCase();
    const base = { name: file.name, size: formatSize(file.size), text: '' };

    if (file.size > MAX_UPLOAD_BYTES) {
      state.upload = { error: 'This file is larger than 25 MB. Please choose a smaller one.' };
      renderUpload();
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      state.upload = { error: 'Could not read this file. Please try another one.' };
      renderUpload();
    };

    if (file.type.startsWith('image/')) {
      reader.onload = (e) => { state.upload = { ...base, kind: 'image', imageUrl: e.target.result }; renderUpload(); };
      reader.readAsDataURL(file);
    } else if (file.type === 'text/plain' || /\.(txt|md)$/.test(lower)) {
      reader.onload = (e) => { state.upload = { ...base, kind: 'text', text: String(e.target.result) }; renderUpload(); };
      reader.readAsText(file);
    } else if (/\.docx$/.test(lower)) {
      readDocxText(file).then((text) => {
        state.upload = { ...base, kind: 'docx', text };
        renderUpload();
      }).catch(() => {
        state.upload = { ...base, kind: 'unsupported' };
        renderUpload();
      });
    } else if (/\.pdf$/.test(lower)) {
      state.upload = { ...base, kind: 'pdf', pdfUrl: URL.createObjectURL(file) };
      renderUpload();
    } else {
      state.upload = { error: 'This file type is not supported. Please use TXT, PDF, DOCX or an image.' };
      renderUpload();
    }
  }

  /* Read the text of a .docx file in the browser (a .docx is a zip; no library needed). */
  async function readDocxText(file) {
    const buf = new Uint8Array(await file.arrayBuffer());
    const dv = new DataView(buf.buffer);
    let eocd = -1;
    for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('Not a zip file');
    let p = dv.getUint32(eocd + 16, true);
    const count = dv.getUint16(eocd + 10, true);
    for (let n = 0; n < count; n++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const method = dv.getUint16(p + 10, true);
      const compSize = dv.getUint32(p + 20, true);
      const nameLen = dv.getUint16(p + 28, true);
      const extraLen = dv.getUint16(p + 30, true);
      const commentLen = dv.getUint16(p + 32, true);
      const localAt = dv.getUint32(p + 42, true);
      const name = new TextDecoder().decode(buf.subarray(p + 46, p + 46 + nameLen));
      if (name === 'word/document.xml') {
        const dataAt = localAt + 30 + dv.getUint16(localAt + 26, true) + dv.getUint16(localAt + 28, true);
        const raw = buf.subarray(dataAt, dataAt + compSize);
        let bytes = raw;
        if (method === 8) {
          const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
          bytes = new Uint8Array(await new Response(stream).arrayBuffer());
        } else if (method !== 0) {
          throw new Error('Unsupported zip method');
        }
        const xml = new DOMParser().parseFromString(new TextDecoder().decode(bytes), 'application/xml');
        return Array.from(xml.getElementsByTagName('w:p'))
          .map(par => Array.from(par.getElementsByTagName('w:t')).map(t => t.textContent).join(''))
          .join('\n').trim();
      }
      p += 46 + nameLen + extraLen + commentLen;
    }
    throw new Error('document.xml not found');
  }

  /* Split pasted report text into simple sections (Indication, Findings, Impression...). */
  function parseReportSections(text) {
    const heads = /^\s*(clinical indication|indication|comparison|findings?|impression|recommendations?)\s*:\s*(.*)$/i;
    const labels = { 'clinical indication': 'Reason for scan', indication: 'Reason for scan', comparison: 'Compared with',
      finding: 'Findings', findings: 'Findings', impression: 'Impression', recommendation: 'Recommendation', recommendations: 'Recommendation' };
    const out = [];
    let cur = null;
    text.split(/\r?\n/).forEach(line => {
      const m = line.match(heads);
      if (m) {
        cur = { name: labels[m[1].toLowerCase()], text: m[2].trim() };
        out.push(cur);
      } else if (cur && line.trim()) {
        cur.text += (cur.text ? '\n' : '') + line.trim();
      }
    });
    return out;
  }

  function renderUploadSections() {
    const box = document.getElementById('upload-sections');
    if (!box) return;
    const text = (state.upload && state.upload.text) || '';
    if (!text.trim()) { box.innerHTML = '<p class="muted-note">Add some report text to see it split into parts.</p>'; return; }
    const parts = parseReportSections(text);
    box.innerHTML = parts.length
      ? parts.map(s => `<div class="parsed-part"><div class="parsed-label">${escapeHtml(s.name)}</div><p>${escapeHtml(s.text)}</p></div>`).join('')
      : '<p class="muted-note">No headings such as "Findings:" or "Impression:" were found.</p>';
  }

  function renderUploadTerms() {
    const box = document.getElementById('upload-terms');
    if (!box) return;
    const text = (state.upload && state.upload.text) || '';
    if (!text.trim()) {
      box.innerHTML = '<p class="muted-note">Add some report text to see simple meanings.</p>';
      return;
    }
    const found = findTerms(text);
    box.innerHTML = found.length
      ? `<div class="terms-grid compact">${found.map(termHtml).join('')}</div>`
      : '<p class="muted-note">No known medical words found. This tool only knows a small word list.</p>';
  }

  function renderUpload() {
    const u = state.upload || { kind: 'paste', text: '' };
    const esc = escapeHtml;
    let html = '';

    if (u.error) {
      html += `<div class="alert-box error" role="alert">${esc(u.error)}</div>`;
    }
    if (u.name) {
      html += `
        <div class="file-chip">
          <span><strong>${esc(u.name)}</strong>${u.size && u.size !== 'sample' ? ' · ' + esc(u.size) : ''}</span>
          <button type="button" class="btn btn-ghost" data-upload-clear>Remove</button>
        </div>`;
    }
    if (u.kind === 'image') {
      html += `
        <div class="upload-preview">
          <img id="upload-preview-img" alt="Uploaded scan preview">
          <button type="button" class="btn btn-secondary" data-upload-scan>Open in scan viewer</button>
        </div>`;
    }
    if (u.kind === 'unsupported') {
      html += '<div class="alert-box info" role="status">This Word file could not be read. Please paste the report text below instead.</div>';
    }
    if (u.kind === 'docx') {
      html += '<div class="alert-box info" role="status">Text was taken from your Word file. You can edit it below.</div>';
    }
    if (u.kind === 'pdf') {
      html += `
        <div class="alert-box info" role="status">PDF text cannot be read here. Your PDF is shown below for reference. Paste its text to see the parts and word meanings.</div>
        <object class="upload-pdf" data="${esc(u.pdfUrl)}" type="application/pdf" aria-label="PDF preview">
          <p class="muted-note">Your browser cannot show this PDF here.</p>
        </object>`;
    }

    html += `
      <section class="report-section">
        <h2 class="section-title">Report text</h2>
        <label for="upload-text" class="sr-only">Report text</label>
        <textarea id="upload-text" class="form-control upload-text" rows="6"
          placeholder="Paste or type report text here"></textarea>
        <p class="muted-note small">This only looks up known words. It does not analyse the report.</p>
      </section>

      <section class="report-section">
        <h2 class="section-title">Report parts</h2>
        <div id="upload-sections"></div>
      </section>

      <section class="report-section">
        <h2 class="section-title">Words found</h2>
        <div id="upload-terms"></div>
      </section>`;

    if (u.sampleId) {
      html += '<button type="button" class="btn btn-primary" data-open-sample>Open full sample analysis</button>';
    }

    uploadResult.innerHTML = html;
    document.getElementById('upload-text').value = u.text || '';
    if (u.kind === 'image') document.getElementById('upload-preview-img').src = u.imageUrl;
    renderUploadSections();
    renderUploadTerms();
  }

  function setupUpload() {
    btnBrowse.addEventListener('click', (e) => { e.stopPropagation(); uploadInput.click(); });
    uploadDrop.addEventListener('click', () => uploadInput.click());
    uploadDrop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); uploadInput.click(); }
    });
    uploadInput.addEventListener('change', () => {
      handleFile(uploadInput.files[0]);
      uploadInput.value = '';
    });

    ['dragenter', 'dragover'].forEach(ev => uploadDrop.addEventListener(ev, (e) => {
      e.preventDefault();
      uploadDrop.classList.add('drag');
    }));
    ['dragleave', 'drop'].forEach(ev => uploadDrop.addEventListener(ev, (e) => {
      e.preventDefault();
      uploadDrop.classList.remove('drag');
    }));
    uploadDrop.addEventListener('drop', (e) => handleFile(e.dataTransfer.files[0]));

    uploadSampleBtns.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-sample]');
      if (btn) loadSampleIntoUpload(btn.dataset.sample);
    });

    uploadResult.addEventListener('click', (e) => {
      if (e.target.closest('[data-upload-clear]')) {
        if (state.upload && state.upload.pdfUrl) URL.revokeObjectURL(state.upload.pdfUrl);
        state.upload = null;
        renderUpload();
      } else if (e.target.closest('[data-upload-scan]')) {
        openScan({ imageUrl: state.upload.imageUrl, caption: state.upload.name });
      } else if (e.target.closest('[data-open-sample]')) {
        showReportView(state.upload.sampleId, 'analysis');
      }
    });

    uploadResult.addEventListener('input', (e) => {
      if (e.target.id !== 'upload-text') return;
      if (!state.upload || state.upload.error) state.upload = { kind: 'paste', text: '' };
      state.upload.text = e.target.value;
      renderUploadSections();
      renderUploadTerms();
    });
  }

  /* =========================================================================
     Login verification code
     ========================================================================= */
  let captchaValue = '';

  function newCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = new Uint32Array(5);
    crypto.getRandomValues(bytes);
    captchaValue = Array.from(bytes, n => chars[n % chars.length]).join('');
    captchaCode.textContent = captchaValue.split('').join(' ');
    loginCaptcha.value = '';
    loginCaptcha.classList.remove('is-invalid');
    clearFieldError('login-captcha-feedback');
  }

  /* =========================================================================
     Wire up the new features
     ========================================================================= */
  function setupFeatureListeners() {
    // Text size, contrast, language
    document.querySelectorAll('[data-fs]').forEach(b => b.addEventListener('click', () => {
      prefs.fs = b.dataset.fs;
      applyPrefs();
    }));
    if (btnContrast) btnContrast.addEventListener('click', () => { prefs.hc = !prefs.hc; applyPrefs(); });
    if (langSelect) langSelect.addEventListener('change', () => { prefs.lang = langSelect.value; applyPrefs(); });

    // Top nav pages and footer links
    if (mainNavLinks) {
      mainNavLinks.querySelectorAll('.nav-link-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => goPage(btn.dataset.page));
      });
    }
    const footerLinks = document.getElementById('footer-links');
    if (footerLinks) {
      footerLinks.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-page]');
        if (btn) goPage(btn.dataset.page);
      });
    }

    if (termsSearch) termsSearch.addEventListener('input', renderTerms);
    if (captchaRefresh) captchaRefresh.addEventListener('click', newCaptcha);

    setupScanViewer();
    setupUpload();
  }

  /* =========================================================================
     Event Listeners
     ========================================================================= */
  function setupEventListeners() {
    // Brand Logo
    if (navBrandLogo) {
      navBrandLogo.addEventListener('click', () => {
        showDashboardView(true);
      });
    }

    // Top-Right Profile Pill Toggle
    if (userProfileTrigger && userProfileContainer) {
      userProfileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleProfileDropdown();
      });

      // Close Dropdown on Outside Click
      document.addEventListener('click', (e) => {
        if (!userProfileContainer.contains(e.target)) {
          toggleProfileDropdown(true);
        }
      });

      // Escape closes modals and dropdowns
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          toggleProfileDropdown(true);
        }
      });
    }

    // Logout
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        toggleProfileDropdown(true);
        showToast('Session active.');
      });
    }

    // Navigation switches
    if (linkGotoSignup) linkGotoSignup.addEventListener('click', () => showSignupStep1());
    if (navBtnGotoSignup) navBtnGotoSignup.addEventListener('click', () => showSignupStep1());
    if (navBtnGotoLogin) navBtnGotoLogin.addEventListener('click', () => showLoginView());
    if (linksGotoLogin) linksGotoLogin.forEach(b => b.addEventListener('click', () => showLoginView()));

    // Login Form Submit
    if (formLogin) formLogin.addEventListener('submit', handleLoginSubmit);

    // Sign Up Subcard 1 -> Subcard 2
    if (formSignupCard1) formSignupCard1.addEventListener('submit', handleSignupCard1Submit);

    // Sign Up Subcard 2 Back to 1
    if (btnBackCard1) btnBackCard1.addEventListener('click', () => showSignupStep1());
    if (btnBackToStep1) btnBackToStep1.addEventListener('click', () => showSignupStep1());

    // Sign Up Final Submit
    if (formSignupCard2) formSignupCard2.addEventListener('submit', handleSignupCard2Submit);

    // Live Uniqueness Check for Username
    let userDebounce = null;
    if (regUsername) {
      regUsername.addEventListener('input', () => {
        clearTimeout(userDebounce);
        userDebounce = setTimeout(validateUsernameUniqueness, 200);
      });
    }

    // Filter Chips on Home Page
    if (sampleCategoryFilters) {
      sampleCategoryFilters.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          state.activeFilter = chip.dataset.region;
          syncFilterUI();
          renderReportCards();
        });
      });
    }

    // Top nav bar filter tabs
    if (mainNavLinks) {
      mainNavLinks.querySelectorAll('.nav-link-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          showDashboardView(true);
          mainNavLinks.querySelectorAll('.nav-link-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeFilter = btn.dataset.filter;
          state.searchQuery = '';
          if (reportSearchInput) reportSearchInput.value = '';
          syncFilterUI();
          renderReportCards();
        });
      });
    }

    // Search Input
    if (reportSearchInput) {
      reportSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderReportCards();
      });
    }

    // Landing
    const btnExplore = document.getElementById('btn-explore-samples');
    if (btnExplore) btnExplore.addEventListener('click', exploreSamples);

    // Back to Samples (report page)
    if (viewReport) {
      viewReport.addEventListener('click', (e) => {
        if (e.target.closest('[data-back]')) showDashboardView(true);
        else if (e.target.closest('[data-analysis]')) showReportView(state.activeReportId, 'analysis');
        else if (e.target.closest('[data-detail]')) showReportView(state.activeReportId, 'detail');
        else if (e.target.closest('[data-scan]')) openScan(scanTargetFor(activeReport()));
        else if (e.target.closest('[data-copy]')) copySummary();
        else if (e.target.closest('[data-print]')) window.print();
        else if (e.target.closest('[data-trace]')) traceTo(Number(e.target.closest('[data-trace]').dataset.trace));
      });
    }

    // Ask AI modal triggers & events
    if (aiModalClose) {
      aiModalClose.addEventListener('click', closeAiModal);
    }
    if (aiModal) {
      aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) closeAiModal();
      });
    }
    document.querySelectorAll('.ai-pill-btn[data-ai-query]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ai-pill-btn').forEach(b => b.classList.remove('active-pill'));
        btn.classList.add('active-pill');
        handleAiPrompt(btn.dataset.aiQuery);
      });
    });
    if (aiInputForm) {
      aiInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = aiInputBox.value.trim();
        if (!val) return;
        aiInputBox.value = '';
        handleAiPrompt(val);
      });
    }

    // Global listener for any [data-ask-ai] click
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-ask-ai]');
      if (btn) {
        openAiModal(btn.dataset.askAi || '');
      }
    });
  }

  function setupPasswordToggles() {
    document.querySelectorAll('.toggle-pwd').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (input) {
          const isPwd = input.type === 'password';
          input.type = isPwd ? 'text' : 'password';
          btn.setAttribute('aria-pressed', isPwd ? 'true' : 'false');
          btn.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
          btn.style.color = isPwd ? 'var(--color-brand-navy)' : 'var(--color-text-muted)';
        }
      });
    });
  }

  function setupDemoAccountButtons() {
    document.querySelectorAll('.demo-acc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        loginIdentifier.value = btn.dataset.user;
        loginPassword.value = btn.dataset.pass;
        loginAlertContainer.innerHTML = '';
        loginIdentifier.classList.remove('is-invalid');
        loginPassword.classList.remove('is-invalid');
        showToast(`Filled login for ${btn.dataset.user}`);
      });
    });
  }

  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) {
      el.className = 'field-feedback error';
      el.textContent = msg;
      const input = document.getElementById(id.replace('-feedback', ''));
      if (input) input.setAttribute('aria-invalid', 'true');
    }
  }

  function clearFieldError(id) {
    const el = document.getElementById(id);
    if (el) {
      el.className = 'field-feedback';
      el.textContent = '';
      const input = document.getElementById(id.replace('-feedback', ''));
      if (input) input.removeAttribute('aria-invalid');
    }
  }

  function showToast(msg) {
    toastText.textContent = msg;
    appToast.classList.add('show');
    clearTimeout(appToast._timer);
    appToast._timer = setTimeout(() => {
      appToast.classList.remove('show');
    }, 3000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  init();
});