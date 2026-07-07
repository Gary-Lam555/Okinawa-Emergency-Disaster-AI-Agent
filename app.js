import { shelters } from './js/shelters.js';
import { disasters } from './js/disasters.js';
import { AIAgent } from './js/agent.js';
import { DisasterReporter } from './js/reporter.js';

// Application State
const state = {
  currentLanguage: 'en',
  activeTab: 'dashboard',
  selectedShelter: null,
  agentInstance: new AIAgent('en'),
  reporterInstance: new DisasterReporter('en')
};

// DOM Elements
const elements = {
  navBtns: document.querySelectorAll('.nav-btn'),
  tabPanes: document.querySelectorAll('.tab-pane'),
  langBtns: document.querySelectorAll('.lang-switch .lang-btn'),
  
  // Language Switch Tags
  labelsEnJa: document.querySelectorAll('[data-en]'),
  
  // Dashboard
  alertsFeed: document.getElementById('dashboard-alerts-feed'),
  activeAlertCount: document.getElementById('active-alert-count'),
  muniStatusGrid: document.getElementById('municipal-status-grid'),
  mapNodes: document.querySelectorAll('.map-node'),
  mapOverlay: document.getElementById('map-hover-overlay'),
  mapOverlayName: document.getElementById('map-overlay-name'),
  mapOverlayStatus: document.getElementById('map-overlay-status'),
  
  // AI Agent Chat
  chatFeed: document.getElementById('chat-box-feed'),
  chatInput: document.getElementById('chat-user-input'),
  chatSendBtn: document.getElementById('chat-send-btn'),
  chatSuggestions: document.getElementById('suggest-chips'),
  
  // Shelter Locator
  shelterSearch: document.getElementById('shelter-search'),
  shelterFilterMuni: document.getElementById('shelter-filter-muni'),
  shelterFilterStatus: document.getElementById('shelter-filter-status'),
  filterTsunami: document.getElementById('filter-tsunami'),
  filterEarthquake: document.getElementById('filter-earthquake'),
  filterFlood: document.getElementById('filter-flood'),
  shelterCardsList: document.getElementById('shelter-cards-list'),
  shelterSvgMap: document.getElementById('shelter-svg-map'),
  shelterMapPins: document.getElementById('shelter-map-pins'),
  selectedShelterPanel: document.getElementById('selected-shelter-panel'),
  shelterDetailName: document.getElementById('shelter-detail-name'),
  shelterDetailAddr: document.getElementById('shelter-detail-addr'),
  shelterDetailCap: document.getElementById('shelter-detail-cap'),
  shelterDetailOcc: document.getElementById('shelter-detail-occ'),
  shelterDetailTsu: document.getElementById('shelter-detail-tsu'),
  routeGuidanceBtn: document.getElementById('route-guidance-btn'),
  
  // Disaster Reporter
  reporterForm: document.getElementById('disaster-report-form'),
  reportType: document.getElementById('report-type'),
  reportMuni: document.getElementById('report-municipality'),
  reportSeverity: document.getElementById('report-severity'),
  reportDesc: document.getElementById('report-desc'),
  reportTrapped: document.getElementById('report-trapped'),
  
  // Assessment Result
  assessmentResultBox: document.getElementById('assessment-result-box'),
  assessHeaderContainer: document.getElementById('assess-header-container'),
  assessLevelText: document.getElementById('assess-level-text'),
  assessScoreVal: document.getElementById('assess-score-val'),
  assessLifeThreat: document.getElementById('assess-life-threat'),
  assessStepsList: document.getElementById('assess-steps-list'),
  assessSheltersList: document.getElementById('assess-shelters-list'),
  
  // Mobile Nav Toggles
  mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
  appSidebar: document.getElementById('app-sidebar')
};

// Initialize Application
function init() {
  setupEventListeners();
  updateBilingualTexts();
  renderDashboardAlerts();
  renderMunicipalStatusGrid();
  renderShelters();
  initAgentChat();
  lucide.createIcons();
}

// Event Listeners Routing
function setupEventListeners() {
  // Tab Navigation
  elements.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
      if (window.innerWidth <= 1024) {
        elements.appSidebar.classList.remove('mobile-sidebar-active');
      }
    });
  });

  // Language Switching
  elements.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Mobile Menu Toggle
  elements.mobileMenuToggle.addEventListener('click', () => {
    elements.appSidebar.classList.toggle('mobile-sidebar-active');
  });

  // Interactive Map Overlays
  elements.mapNodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const muni = e.target.getAttribute('data-muni');
      if (muni) showMapOverlay(muni, e);
    });
    node.addEventListener('mouseleave', hideMapOverlay);
    node.addEventListener('click', (e) => {
      const muni = e.target.getAttribute('data-muni');
      if (muni) {
        elements.shelterFilterMuni.value = muni;
        switchTab('shelter');
        renderShelters();
      }
    });
  });

  // Chat actions
  elements.chatSendBtn.addEventListener('click', handleUserSendMessage);
  elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserSendMessage();
  });
  
  // Suggested Chips
  elements.chatSuggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggest-btn')) {
      const query = state.currentLanguage === 'en' 
        ? e.target.getAttribute('data-query') 
        : e.target.getAttribute('data-query-ja');
      elements.chatInput.value = query;
      handleUserSendMessage();
    }
  });

  // Shelter Filters
  elements.shelterSearch.addEventListener('input', renderShelters);
  elements.shelterFilterMuni.addEventListener('change', renderShelters);
  elements.shelterFilterStatus.addEventListener('change', renderShelters);
  elements.filterTsunami.addEventListener('change', renderShelters);
  elements.filterEarthquake.addEventListener('change', renderShelters);
  elements.filterFlood.addEventListener('change', renderShelters);

  // Router button
  elements.routeGuidanceBtn.addEventListener('click', triggerRouteSimulation);

  // Disaster Reporter Form Submission
  elements.reporterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleDisasterReportSubmit();
  });
}

// Change Application Tab
function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Update nav buttons active states
  elements.navBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update visible pane
  elements.tabPanes.forEach(pane => {
    if (pane.id === `tab-${tabId}-content`) {
      pane.style.display = 'block';
      pane.classList.add('active');
    } else {
      pane.style.display = 'none';
      pane.classList.remove('active');
    }
  });
  
  // Tab-specific scroll focus
  if (tabId === 'agent') {
    elements.chatFeed.scrollTop = elements.chatFeed.scrollHeight;
  }
}

// Set System Language
function setLanguage(lang) {
  state.currentLanguage = lang;
  state.agentInstance.setLanguage(lang);
  state.reporterInstance.setLanguage(lang);

  // Toggle button classes
  elements.langBtns.forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update text elements containing data-en/data-ja
  updateBilingualTexts();

  // Re-run renders to show translated data lists
  renderDashboardAlerts();
  renderMunicipalStatusGrid();
  renderShelters();
  
  // Clear chat feed and re-initialize welcome message in correct language
  elements.chatFeed.innerHTML = '';
  initAgentChat();

  // Update input placeholders
  if (lang === 'ja') {
    elements.chatInput.placeholder = "避難方法、避難所の状況、災害危険度などを質問...";
    elements.shelterSearch.placeholder = "避難所名で検索...";
    elements.reportDesc.placeholder = "被災状況を記入してください。（例：強風で窓ガラスが割れた、道路冠水、国道58号線で土砂崩れ...）";
  } else {
    elements.chatInput.placeholder = "Ask about evacuation, shelter status, or threat levels...";
    elements.shelterSearch.placeholder = "Search shelters by name...";
    elements.reportDesc.placeholder = "Describe the scene. (e.g. strong winds broke windows, water flooding streets, landslide on route 58...)";
  }
}

// Loops through UI and updates translations
function updateBilingualTexts() {
  elements.labelsEnJa.forEach(el => {
    const text = state.currentLanguage === 'en' 
      ? el.getAttribute('data-en') 
      : el.getAttribute('data-ja');
    if (text) {
      // If it has children, don't destroy icons - replace only text nodes
      if (el.children.length > 0) {
        // Find text node child and update
        for (const child of el.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            child.textContent = text;
          }
        }
      } else {
        el.textContent = text;
      }
    }
  });
}

// ----------------------------------------------------
// DASHBOARD LOGIC
// ----------------------------------------------------

function renderDashboardAlerts() {
  const isEn = state.currentLanguage === 'en';
  const reports = state.reporterInstance.getReports();
  
  elements.activeAlertCount.textContent = `${reports.length} Active`;
  
  elements.alertsFeed.innerHTML = '';
  
  if (reports.length === 0) {
    elements.alertsFeed.innerHTML = `<p style="color: var(--text-muted); text-align: center;">${isEn ? 'No active alerts.' : '現在警報はありません。'}</p>`;
    return;
  }

  reports.forEach(r => {
    const level = r.assessment.level;
    const severityClass = level === 'Critical' || level === 'High' ? 'alert-severity-critical' : 'alert-severity-high';
    const typeLabel = r.type.toUpperCase();
    const timeString = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const html = `
      <div class="alert-item">
        <div class="alert-icon-box">
          <i data-lucide="alert-triangle" class="${severityClass}"></i>
        </div>
        <div class="alert-info-box">
          <div class="alert-headline">${isEn ? r.municipality : getMuniJa(r.municipality)} • ${typeLabel} WARNING</div>
          <div class="alert-meta">
            <span>Time: ${timeString}</span>
            <span>Severity: <span style="font-weight: 700;">${level}</span></span>
          </div>
          <p class="alert-body">${r.description}</p>
        </div>
      </div>
    `;
    elements.alertsFeed.insertAdjacentHTML('beforeend', html);
  });
  
  lucide.createIcons();
}

function renderMunicipalStatusGrid() {
  const isEn = state.currentLanguage === 'en';
  const municipalities = [
    { name: 'Naha', nameJa: '那覇市' },
    { name: 'Okinawa City', nameJa: '沖縄市' },
    { name: 'Uruma', nameJa: 'うるま市' },
    { name: 'Nago', nameJa: '名護市' },
    { name: 'Ishigaki', nameJa: '石垣市' },
    { name: 'Miyakojima', nameJa: '宮古島市' }
  ];

  elements.muniStatusGrid.innerHTML = '';

  municipalities.forEach(muni => {
    // Get highest severity report in this municipality
    const muniReports = state.reporterInstance.getReports().filter(r => r.municipality.toLowerCase() === muni.name.toLowerCase());
    let statusText = isEn ? 'Normal' : '正常';
    let statusClass = 'muni-status-safe';
    let dotColor = 'var(--accent-green)';
    
    if (muniReports.length > 0) {
      const highest = muniReports.reduce((max, r) => r.severity > max.severity ? r : max, muniReports[0]);
      if (highest.severity >= 3) {
        statusText = isEn ? 'DANGER' : '避難指示';
        statusClass = 'muni-status-critical';
        dotColor = 'var(--accent-red)';
      } else {
        statusText = isEn ? 'WARNING' : '注意警戒';
        statusClass = 'muni-status-warning';
        dotColor = 'var(--accent-amber)';
      }
    }
    
    // Update map dots colors in HTML directly
    const mapNode = document.getElementById(`node-${muni.name.toLowerCase().replace(' ', '')}`);
    if (mapNode) {
      mapNode.setAttribute('fill', dotColor);
    }

    const html = `
      <div class="municipal-card" onclick="elements.shelterFilterMuni.value='${muni.name}'; switchTab('shelter'); renderShelters();">
        <span class="muni-name">${muni.name}</span>
        <span class="muni-name-ja">${muni.nameJa}</span>
        <span class="muni-status ${statusClass}">${statusText}</span>
      </div>
    `;
    elements.muniStatusGrid.insertAdjacentHTML('beforeend', html);
  });
}

function showMapOverlay(municipalityName, event) {
  const isEn = state.currentLanguage === 'en';
  const muniReports = state.reporterInstance.getReports().filter(r => r.municipality.toLowerCase() === municipalityName.toLowerCase());
  
  elements.mapOverlayName.textContent = isEn ? `${municipalityName} Area` : `${getMuniJa(municipalityName)}地域`;
  
  if (muniReports.length > 0) {
    const alertTypes = muniReports.map(r => r.type.toUpperCase()).join(', ');
    elements.mapOverlayStatus.innerHTML = `
      <span style="color: var(--accent-red); font-weight: 700;">${isEn ? 'WARNINGS ACTIVE' : '警報発令中'}</span><br/>
      🚨 ${alertTypes}
    `;
  } else {
    elements.mapOverlayStatus.innerHTML = `<span style="color: var(--accent-green);">${isEn ? 'Status: Safe / Normal' : '状況：平常・安全'}</span>`;
  }

  elements.mapOverlay.style.display = 'block';
  
  // Position overlay near cursor or node
  const rect = event.target.getBoundingClientRect();
  const containerRect = event.target.ownerSVGElement.parentNode.getBoundingClientRect();
  
  elements.mapOverlay.style.left = `${(rect.left - containerRect.left) + 20}px`;
  elements.mapOverlay.style.top = `${(rect.top - containerRect.top) - 10}px`;
}

function hideMapOverlay() {
  elements.mapOverlay.style.display = 'none';
}

// Helper to translate municipalities
function getMuniJa(muni) {
  const mapping = {
    'Naha': '那覇市',
    'Okinawa City': '沖縄市',
    'Uruma': 'うるま市',
    'Nago': '名護市',
    'Ishigaki': '石垣市',
    'Miyakojima': '宮古島市'
  };
  return mapping[muni] || muni;
}

// ----------------------------------------------------
// AI AGENT CHAT LOGIC
// ----------------------------------------------------

function initAgentChat() {
  const welcomeHTML = `
    <div class="message-bubble agent">
      <span class="msg-header">${state.currentLanguage === 'en' ? 'OkiSafe Emergency Agent' : '沖縄防災AIエージェント'} • Just Now</span>
      <div class="msg-content">
        ${state.agentInstance.getDefaultResponse()}
      </div>
    </div>
  `;
  elements.chatFeed.innerHTML = welcomeHTML;
}

function handleUserSendMessage() {
  const text = elements.chatInput.value.trim();
  if (!text) return;

  // Append user message
  appendChatMessage(text, 'user');
  elements.chatInput.value = '';

  // Show simulated loading bubbles
  const loadingId = 'loading-' + Date.now();
  const loadingHtml = `
    <div class="message-bubble agent" id="${loadingId}">
      <span class="msg-header">${state.currentLanguage === 'en' ? 'OkiSafe Emergency Agent' : '沖縄防災AIエージェント'} • Thinking</span>
      <div class="msg-content" style="opacity: 0.6; display: flex; gap: 0.25rem;">
        <span class="pulse-dot" style="width:6px; height:6px; background:#fff; border-radius:50%; animation: pulse-ring 1s infinite;"></span>
        <span class="pulse-dot" style="width:6px; height:6px; background:#fff; border-radius:50%; animation: pulse-ring 1s infinite 0.2s;"></span>
        <span class="pulse-dot" style="width:6px; height:6px; background:#fff; border-radius:50%; animation: pulse-ring 1s infinite 0.4s;"></span>
      </div>
    </div>
  `;
  elements.chatFeed.insertAdjacentHTML('beforeend', loadingHtml);
  elements.chatFeed.scrollTop = elements.chatFeed.scrollHeight;

  // Answer response with a delay (simulate thinking)
  setTimeout(() => {
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();

    const responseHTML = state.agentInstance.getResponse(text);
    appendChatMessage(responseHTML, 'agent');
  }, 1000);
}

function appendChatMessage(content, sender) {
  const isUser = sender === 'user';
  const nameLabel = isUser 
    ? (state.currentLanguage === 'en' ? 'You' : 'あなた') 
    : (state.currentLanguage === 'en' ? 'OkiSafe Emergency Agent' : '沖縄防災AIエージェント');
  
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const html = `
    <div class="message-bubble ${sender}">
      <span class="msg-header">${nameLabel} • ${timeString}</span>
      <div class="msg-content">${isUser ? `<p>${escapeHTML(content)}</p>` : content}</div>
    </div>
  `;
  
  elements.chatFeed.insertAdjacentHTML('beforeend', html);
  elements.chatFeed.scrollTop = elements.chatFeed.scrollHeight;
  lucide.createIcons();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ----------------------------------------------------
// SHELTER LOCATOR LOGIC
// ----------------------------------------------------

function renderShelters() {
  const isEn = state.currentLanguage === 'en';
  const searchVal = elements.shelterSearch.value.toLowerCase();
  const muniVal = elements.shelterFilterMuni.value;
  const statusVal = elements.shelterFilterStatus.value;
  
  // Filter checkboxes
  const tsunamiOnly = elements.filterTsunami.checked;
  const earthquakeOnly = elements.filterEarthquake.checked;
  const floodOnly = elements.filterFlood.checked;

  const filtered = shelters.filter(s => {
    // Search filter
    const nameMatch = s.name.toLowerCase().includes(searchVal) || s.nameJa.includes(searchVal);
    const addrMatch = s.address.toLowerCase().includes(searchVal) || s.addressJa.includes(searchVal);
    if (!nameMatch && !addrMatch) return false;

    // Municipality filter
    if (muniVal !== 'all' && s.municipality.toLowerCase() !== muniVal.toLowerCase()) return false;

    // Status filter
    if (statusVal === 'Open' && s.status !== 'Open') return false;

    // Safety checks
    if (tsunamiOnly && !s.tsunamiSafe) return false;
    if (earthquakeOnly && !s.earthquakeResistant) return false;
    if (floodOnly && !s.floodSafe) return false;

    return true;
  });

  // Render cards
  elements.shelterCardsList.innerHTML = '';
  
  if (filtered.length === 0) {
    elements.shelterCardsList.innerHTML = `<p style="color: var(--text-muted); padding: 1rem; text-align: center;">${isEn ? 'No shelters found.' : '条件に合致する避難所はありません。'}</p>`;
  } else {
    filtered.forEach(s => {
      const statusClass = s.status === 'Open' ? 'shelter-badge-open' : 'shelter-badge-full';
      const statusText = s.status;
      
      const tags = [];
      if (s.tsunamiSafe) tags.push(isEn ? 'Tsunami Safe' : '津波安全');
      if (s.earthquakeResistant) tags.push(isEn ? 'EQ Resistant' : '耐震性');
      if (s.floodSafe) tags.push(isEn ? 'Flood Safe' : '水害対策');
      
      const tagsHtml = tags.map(t => `<span class="tag-badge">${t}</span>`).join('');

      const html = `
        <div class="shelter-card ${state.selectedShelter?.id === s.id ? 'selected' : ''}" data-id="${s.id}">
          <div class="shelter-card-header">
            <div>
              <span class="shelter-card-title">${isEn ? s.name : s.nameJa}</span>
              <span class="shelter-card-title-ja">${isEn ? s.municipality : s.municipalityJa}</span>
            </div>
            <span class="shelter-badge ${statusClass}">${statusText}</span>
          </div>
          <div class="shelter-card-info">
            <span>📍 ${isEn ? s.address : s.addressJa}</span>
            <span>📞 ${s.contact}</span>
          </div>
          <div class="shelter-card-tags">
            ${tagsHtml}
          </div>
        </div>
      `;
      elements.shelterCardsList.insertAdjacentHTML('beforeend', html);
    });

    // Add card click events
    document.querySelectorAll('.shelter-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const shelterObj = shelters.find(s => s.id === id);
        selectShelter(shelterObj);
      });
    });
  }

  // Draw pins on SVG map
  drawShelterMapPins(filtered);
}

// Convert coordinates to map pixels
function getMapCoords(lat, lng) {
  // Longitude maps to X (range 124.0 to 128.0)
  // X = 50 + (long - 124.0) * (400 / 4.0)
  const x = 50 + (lng - 124.0) * 100;
  
  // Latitude maps to Y (range 24.0 to 27.0)
  // Y = 300 - (lat - 24.0) * (250 / 3.0)
  const y = 300 - (lat - 24.0) * 83.33;
  
  return { x, y };
}

function drawShelterMapPins(filteredList) {
  elements.shelterMapPins.innerHTML = '';
  
  filteredList.forEach(s => {
    const coords = getMapCoords(s.latitude, s.longitude);
    const pinColor = s.id === state.selectedShelter?.id ? '#ffffff' : (s.status === 'Open' ? 'var(--accent-blue)' : 'var(--accent-red)');
    const strokeColor = s.id === state.selectedShelter?.id ? 'var(--accent-red)' : 'rgba(0,0,0,0.5)';
    const strokeWidth = s.id === state.selectedShelter?.id ? 3 : 1;
    const size = s.id === state.selectedShelter?.id ? 10 : 7;
    
    // SVG Pin Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'map-shelter-node');
    circle.setAttribute('cx', coords.x);
    circle.setAttribute('cy', coords.y);
    circle.setAttribute('r', size);
    circle.setAttribute('fill', pinColor);
    circle.setAttribute('stroke', strokeColor);
    circle.setAttribute('stroke-width', strokeWidth);
    circle.setAttribute('data-id', s.id);
    
    circle.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = e.target.getAttribute('data-id');
      const shelterObj = shelters.find(sh => sh.id === id);
      selectShelter(shelterObj);
    });

    elements.shelterMapPins.appendChild(circle);
  });
}

function selectShelter(shelterObj) {
  state.selectedShelter = shelterObj;
  
  // Highlight selected card and pin
  renderShelters();

  // Populate floating detail card
  const isEn = state.currentLanguage === 'en';
  elements.shelterDetailName.textContent = isEn ? shelterObj.name : shelterObj.nameJa;
  elements.shelterDetailAddr.textContent = isEn ? shelterObj.address : shelterObj.addressJa;
  elements.shelterDetailCap.textContent = isEn ? `${shelterObj.capacity} people` : `${shelterObj.capacity} 名`;
  elements.shelterDetailOcc.textContent = isEn ? `${shelterObj.currentOccupancy} people` : `${shelterObj.currentOccupancy} 名`;
  
  elements.shelterDetailTsu.textContent = shelterObj.tsunamiSafe ? (isEn ? 'YES' : '安全基準適合') : (isEn ? 'NO' : '不適合');
  elements.shelterDetailTsu.style.color = shelterObj.tsunamiSafe ? 'var(--accent-green)' : 'var(--accent-red)';
  
  // Show Panel
  elements.selectedShelterPanel.style.display = 'flex';
}

function triggerRouteSimulation() {
  if (!state.selectedShelter) return;
  const isEn = state.currentLanguage === 'en';
  
  // Draw simulated route path from mock user position (e.g. Center of Naha)
  // Let's assume user starts in Naha (26.21, 127.68)
  const startCoords = getMapCoords(26.2124, 127.6809);
  const endCoords = getMapCoords(state.selectedShelter.latitude, state.selectedShelter.longitude);
  
  // Create SVG path element
  const pathId = 'route-path';
  const existingPath = document.getElementById(pathId);
  if (existingPath) existingPath.remove();
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', pathId);
  path.setAttribute('d', `M ${startCoords.x} ${startCoords.y} Q ${(startCoords.x+endCoords.x)/2 - 20} ${(startCoords.y+endCoords.y)/2 - 30} ${endCoords.x} ${endCoords.y}`);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'var(--accent-red)');
  path.setAttribute('stroke-width', '3');
  path.setAttribute('stroke-dasharray', '8, 4');
  path.setAttribute('style', 'animation: route-dash 2s linear infinite;');
  
  elements.shelterMapPins.appendChild(path);
  
  // Add quick keyframe animation to document
  if (!document.getElementById('route-animation-styles')) {
    const style = document.createElement('style');
    style.setAttribute('id', 'route-animation-styles');
    style.innerHTML = `
      @keyframes route-dash {
        to {
          stroke-dashoffset: -20;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Simulate routing announcement in chatbot
  switchTab('agent');
  appendChatMessage(
    isEn 
      ? `Simulated evacuation path generated to <strong>${state.selectedShelter.name}</strong> from your Naha location. Directions:<br/>
         1. Travel inland away from Kumoji Creek.<br/>
         2. Walk uphill towards Yorimiya district (approx 1.8km, 25 mins).<br/>
         3. Walk on foot; avoid car gridlock.`
      : `現在地（那覇市泉崎）から<strong>${state.selectedShelter.nameJa}</strong>への避難ルートを作成しました：<br/>
         1. 久茂地川などの河川から離れ、内陸へ進んでください。<br/>
         2. 寄宮方面の高台へ向かって歩いてください（約1.8km、徒歩25分）。<br/>
         3. 渋滞を避けるため、自動車での移動は控えてください。`,
    'agent'
  );
}

// ----------------------------------------------------
// DISASTER REPORTER & ASSESSMENT LOGIC
// ----------------------------------------------------

function handleDisasterReportSubmit() {
  const type = elements.reportType.value;
  const municipality = elements.reportMuni.value;
  const severity = parseInt(elements.reportSeverity.value);
  const description = elements.reportDesc.value.trim();
  const peopleTrapped = elements.reportTrapped.checked;
  
  if (!type || !municipality || !description) return;
  
  const reportObj = {
    type,
    municipality,
    severity,
    description,
    peopleTrapped
  };

  const newReport = state.reporterInstance.assessReport(reportObj);
  
  // Re-render dashboard alerts
  renderDashboardAlerts();
  renderMunicipalStatusGrid();

  // Populate Assessment Screen
  const level = newReport.assessment.level;
  const score = newReport.assessment.score;
  
  elements.assessLevelText.textContent = `${level.toUpperCase()} THREAT LEVEL`;
  elements.assessScoreVal.textContent = score;

  // Set colors based on threat level
  elements.assessHeaderContainer.className = 'assessment-header-box'; // reset
  if (level === 'Critical' || level === 'High') {
    elements.assessHeaderContainer.classList.add('assessment-critical');
  } else {
    elements.assessHeaderContainer.classList.add('assessment-moderate');
  }

  elements.assessLifeThreat.textContent = newReport.assessment.lifeThreat;
  
  // Evacuation steps loading
  elements.assessStepsList.innerHTML = '';
  newReport.assessment.evacuationSteps.forEach(step => {
    elements.assessStepsList.innerHTML += `<li>${step}</li>`;
  });

  // Recommended shelters
  const isEn = state.currentLanguage === 'en';
  elements.assessSheltersList.innerHTML = '';
  
  if (newReport.assessment.recommendedShelters.length > 0) {
    newReport.assessment.recommendedShelters.forEach(s => {
      const html = `
        <div class="shelter-card" onclick="elements.shelterFilterMuni.value='${municipality}'; switchTab('shelter'); renderShelters();">
          <div class="shelter-card-header">
            <div>
              <span class="shelter-card-title" style="font-size: 0.9rem;">${s.name}</span>
            </div>
            <span class="shelter-badge shelter-badge-open">${s.status}</span>
          </div>
          <div class="shelter-card-info" style="font-size: 0.75rem;">
            <span>📍 ${s.address}</span>
            <span>📞 ${s.contact}</span>
          </div>
        </div>
      `;
      elements.assessSheltersList.insertAdjacentHTML('beforeend', html);
    });
  } else {
    elements.assessSheltersList.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">${isEn ? 'No immediate shelters found. Move to high ground.' : '推奨避難所が見つかりません。直ちに高台へ避難してください。'}</p>`;
  }

  // Display assessment block
  elements.assessmentResultBox.style.display = 'block';
  elements.assessmentResultBox.scrollIntoView({ behavior: 'smooth' });
  
  // Append a notification in the chatbot as well!
  setTimeout(() => {
    appendChatMessage(
      isEn 
        ? `⚠️ <strong>AI Disaster Alert:</strong> New ${type.toUpperCase()} report registered for ${municipality} area.<br/>
           Our safety model has calculated a <strong>Threat Score of ${score}/100 (${level})</strong>.<br/>
           Evacuation recommendation: <em>"${newReport.assessment.evacuationSteps[0]}"</em>. Please head to active shelters.`
        : `⚠️ <strong>AI 災害アラート:</strong> ${getMuniJa(municipality)}地域にて、新しい${newReport.type === 'flood' ? '大雨洪水' : newReport.type}の被災状況報告を受理しました。<br/>
           AIモデルは<strong>危険度スコア：${score}/100（${level === 'Critical' ? '致命的' : '注意警戒'}）</strong>と分析しました。<br/>
           推奨避難行動: <em>「${newReport.assessment.evacuationSteps[0]}」</em>。開設中の避難所へ移動してください。`,
      'agent'
    );
  }, 1500);

  // Clear Form fields
  elements.reportDesc.value = '';
  elements.reportTrapped.checked = false;
  elements.reportSeverity.value = 2;
  lucide.createIcons();
}

// Run initializer
window.addEventListener('DOMContentLoaded', init);
