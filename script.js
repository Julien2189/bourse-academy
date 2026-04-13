
// =====================
// PROGRESS BAR
// =====================
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
});

// =====================
// FADE IN OBSERVER
// =====================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// =====================
// CONCEPT ACCORDION
// =====================
function toggleConcept(header) {
  const body = header.nextElementSibling;
  const arrow = header.querySelector('.concept-arrow');
  body.classList.toggle('open');
  arrow.classList.toggle('open');
}

// =====================
// TABS
// =====================
function switchTab(id, btn) {
  document.querySelectorAll('#assetTabs .tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#actifs .tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
}
function switchTabAnalyse(id, btn) {
  document.querySelectorAll('#analyseTabs .tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#analyse .tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
}

// =====================
// API CONFIG PANEL
// =====================
function toggleApiDrawer() {
  const d = document.getElementById('apiDrawer');
  d.classList.toggle('open');
  const saved = localStorage.getItem('twelveApiKey');
  if (saved) document.getElementById('twelveApiKey').value = saved;
}

function saveAndFetch() {
  const key = document.getElementById('twelveApiKey').value.trim();
  if (!key) { alert('Entrez une clé API Twelve Data valide.'); return; }
  localStorage.setItem('twelveApiKey', key);
  setStatus('load', 'Connexion à Twelve Data...');
  toggleApiDrawer();
  fetchAllPrices(key);
}

function clearApiKey() {
  localStorage.removeItem('twelveApiKey');
  document.getElementById('twelveApiKey').value = '';
  setStatus('idle', 'Clé effacée — données simulées actives');
  buildSimulatedTicker();
}

function setStatus(type, msg) {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  dot.className = 'dot dot-' + type;
  txt.textContent = msg;
}

// =====================
// LIVE PRICES — TWELVE DATA
// =====================
const TWELVE_STOCKS = ['AAPL','NVDA','MSFT','TSLA','BRK.B','AMZN','MC.PA','TTE.PA','BNP.PA','SAN.PA','AIR.PA','RMS.PA'];
const TWELVE_FOREX  = ['EUR/USD','GBP/USD','USD/JPY','USD/CHF','EUR/GBP','AUD/USD','XAU/USD','XAG/USD'];
const TWELVE_INDICES= ['CAC40:Euronext','SPX:NYSE','IXIC:NASDAQ'];

// Map for index symbol to Twelve Data symbol
const INDEX_MAP = { 'CAC40':'CAC40:Euronext','SPX':'SPX:NYSE' };

async function fetchBatch(symbols, apiKey, type='stock') {
  const sym = symbols.join(',');
  const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(sym)}&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch(e) {
    console.error('Twelve Data fetch error:', e);
    return {};
  }
}

async function fetchCoinGecko() {
  // CoinGecko free API — no key needed
  const ids = 'bitcoin,ethereum,solana,binancecoin';
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch(e) {
    console.error('CoinGecko error:', e);
    return {};
  }
}

function fmtPrice(v, symbol='') {
  if (v === null || v === undefined || isNaN(v)) return '—';
  const n = parseFloat(v);
  // Forex pairs: 4 decimals
  if (symbol.includes('/') && !symbol.includes('XAU') && !symbol.includes('XAG') && !symbol.includes('BRENT')) {
    return n.toFixed(4);
  }
  // JPY pairs: 2 decimals
  if (symbol.includes('JPY')) return n.toFixed(2);
  // Large prices
  if (n > 1000) return n.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2});
  return n.toFixed(2);
}

function fmtChange(pct) {
  if (pct === null || pct === undefined || isNaN(pct)) return {html:'—', cls:''};
  const n = parseFloat(pct);
  const sign = n >= 0 ? '+' : '';
  const arrow = n >= 0 ? '▲' : '▼';
  const cls = n >= 0 ? 'change-up' : 'change-down';
  return { html: `<span class="${cls}">${sign}${n.toFixed(2)}% ${arrow}</span>`, cls };
}

function setPrice(symbol, price, changePct, currency='') {
  const pEl = document.getElementById('price-' + symbol);
  const cEl = document.getElementById('change-' + symbol);
  const cur = currency ? currency + ' ' : '';
  if (pEl) pEl.innerHTML = cur + fmtPrice(price, symbol);
  if (cEl) {
    const ch = fmtChange(changePct);
    cEl.innerHTML = ch.html;
  }
}

async function fetchAllPrices(apiKey) {
  setStatus('load', 'Chargement des prix actions & forex...');

  // 1. CRYPTO via CoinGecko (free, no key)
  try {
    const crypto = await fetchCoinGecko();
    if (crypto.bitcoin) {
      setPrice('BTC', crypto.bitcoin.usd, crypto.bitcoin.usd_24h_change, '$');
      setPrice('ETH', crypto.ethereum.usd, crypto.ethereum.usd_24h_change, '$');
      setPrice('SOL', crypto.solana?.usd, crypto.solana?.usd_24h_change, '$');
      setPrice('BNB', crypto.binancecoin?.usd, crypto.binancecoin?.usd_24h_change, '$');
      console.log('CoinGecko OK');
    }
  } catch(e) { console.warn('CoinGecko fail', e); }

  if (!apiKey) {
    setStatus('idle', 'Crypto chargée (CoinGecko) • Ajoutez clé Twelve Data pour actions/forex');
    buildTickerFromDOM();
    return;
  }

  // 2. STOCKS (FR + US) via Twelve Data
  try {
    const allStocks = [...TWELVE_STOCKS];
    const stockData = await fetchBatch(allStocks, apiKey, 'stock');

    let stockOk = 0;
    allStocks.forEach(sym => {
      const d = stockData[sym] || stockData;
      // if single symbol returned directly
      const item = allStocks.length === 1 ? stockData : stockData[sym];
      if (item && item.close && item.status !== 'error') {
        const price = parseFloat(item.close);
        const prev = parseFloat(item.previous_close);
        const chg = prev ? ((price - prev) / prev) * 100 : null;
        const currency = sym.includes('.PA') ? '€' : '$';
        setPrice(sym, price, chg, currency);
        stockOk++;
      }
    });
    console.log(`Stocks: ${stockOk}/${allStocks.length} OK`);
  } catch(e) { console.warn('Stocks fetch fail', e); }

  // 3. FOREX + METALS via Twelve Data
  try {
    const fxData = await fetchBatch(TWELVE_FOREX, apiKey, 'forex');
    TWELVE_FOREX.forEach(sym => {
      const item = fxData[sym];
      if (item && item.close && item.status !== 'error') {
        const price = parseFloat(item.close);
        const prev = parseFloat(item.previous_close);
        const chg = prev ? ((price - prev) / prev) * 100 : null;
        const currency = (sym.includes('XAU') || sym.includes('XAG')) ? '$' : '';
        setPrice(sym, price, chg, currency);
      }
    });
  } catch(e) { console.warn('Forex fetch fail', e); }

  // 4. INDICES
  try {
    const indicesSymbols = ['CAC40:Euronext', 'SPX:NYSE', 'IXIC:NASDAQ'];
    const idxData = await fetchBatch(indicesSymbols, apiKey);
    const cacItem = idxData['CAC40:Euronext'];
    if (cacItem && cacItem.close && cacItem.status !== 'error') {
      const price = parseFloat(cacItem.close);
      const prev = parseFloat(cacItem.previous_close);
      const chg = prev ? ((price - prev) / prev) * 100 : null;
      const priceEl = document.getElementById('chartPrice');
      const changeEl = document.getElementById('chartChange');
      const metaEl = document.getElementById('chartMeta');
      const badgeEl = document.getElementById('cacLiveBadge');
      if (priceEl) priceEl.innerHTML = price.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2});
      if (changeEl && chg !== null) {
        const ch = fmtChange(chg);
        changeEl.innerHTML = ch.html;
      }
      if (metaEl) metaEl.textContent = `Cours de clôture Twelve Data • Mis à jour: ${new Date().toLocaleTimeString('fr-FR')}`;
      if (badgeEl) badgeEl.innerHTML = '<span class="live-badge">LIVE</span>';
    }
  } catch(e) { console.warn('Index fetch fail', e); }

  setStatus('ok', `Prix réels chargés · ${new Date().toLocaleTimeString('fr-FR')} · Actualisation auto dans 60s`);
  buildTickerFromDOM();

  // Auto-refresh every 60 seconds
  setTimeout(() => fetchAllPrices(apiKey), 60000);
}

// =====================
// TICKER FROM DOM DATA
// =====================
function buildTickerFromDOM() {
  const items = [
    { id: 'price-BTC', label: 'BTC', change: 'change-BTC', sym: 'BTC' },
    { id: 'price-ETH', label: 'ETH', change: 'change-ETH', sym: 'ETH' },
    { id: 'price-AAPL', label: 'AAPL', change: 'change-AAPL' },
    { id: 'price-NVDA', label: 'NVDA', change: 'change-NVDA' },
    { id: 'price-MC.PA', label: 'LVMH', change: 'change-MC.PA' },
    { id: 'price-TTE.PA', label: 'TotalEnergies', change: 'change-TTE.PA' },
    { id: 'price-EUR/USD', label: 'EUR/USD', change: 'change-EUR/USD' },
    { id: 'price-GBP/USD', label: 'GBP/USD', change: 'change-GBP/USD' },
    { id: 'price-XAU/USD', label: 'OR', change: 'change-XAU/USD' },
    { id: 'chartPrice', label: 'CAC 40', change: 'chartChange' },
  ];

  let tickerParts = [];
  items.forEach(item => {
    const pEl = document.getElementById(item.id);
    const cEl = document.getElementById(item.change);
    if (!pEl) return;
    const price = pEl.textContent.trim();
    if (!price || price.includes('⏳') || price.includes('chargement')) return;
    const change = cEl ? cEl.textContent.trim() : '';
    const isUp = change.includes('+') || change.includes('▲');
    const isDown = change.includes('▼') || (change.startsWith('-') && !change.startsWith('-0.00'));
    const emoji = isUp ? '🟢' : isDown ? '🔴' : '⚪';
    tickerParts.push(`${emoji} ${item.label} ${price} ${change}`);
  });

  tickerParts.push('📊 BOURSE ACADEMY — DE ZÉRO À HERO');

  if (tickerParts.length > 1) {
    const ticker = document.getElementById('liveTicker');
    if (ticker) ticker.textContent = tickerParts.join('   |   ') + '   |   ';
  }
}

function buildSimulatedTicker() {
  const ticker = document.getElementById('liveTicker');
  if (ticker) ticker.textContent = '⚙️ Configurez une clé API (bouton ⚙️ en bas à droite) pour les prix réels   |   📊 BOURSE ACADEMY — DE ZÉRO À HERO   |   ';
}

// =====================
// PRICE CHART CANVAS
// =====================
function drawChart(prices) {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = (canvas.offsetWidth || 800) * (window.devicePixelRatio || 1);
  canvas.height = 160 * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  const W = canvas.offsetWidth || 800, H = 160;
  ctx.clearRect(0, 0, W, H);

  if (!prices || prices.length < 2) {
    // Simulated
    prices = [];
    let p = 7800;
    for (let i = 0; i < 120; i++) { p += (Math.random() - 0.47) * 35; prices.push(p); }
  }

  const mn = Math.min(...prices), mx = Math.max(...prices);
  const rng = mx - mn || 1;
  const toY = v => H - ((v - mn) / rng) * (H - 20) - 10;
  const toX = i => (i / (prices.length - 1)) * W;

  const isUp = prices[prices.length-1] >= prices[0];
  const lineColor = isUp ? '#00d4aa' : '#ff4d6d';
  const fillColor = isUp ? 'rgba(0,212,170,' : 'rgba(255,77,109,';

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, fillColor + '0.15)');
  grad.addColorStop(1, fillColor + '0)');
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(prices[0]));
  prices.forEach((pr, i) => ctx.lineTo(toX(i), toY(pr)));
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  ctx.beginPath();
  ctx.moveTo(toX(0), toY(prices[0]));
  prices.forEach((pr, i) => ctx.lineTo(toX(i), toY(pr)));
  ctx.strokeStyle = lineColor; ctx.lineWidth = 2; ctx.stroke();
}
setTimeout(() => drawChart(), 400);
window.addEventListener('resize', () => drawChart());

// =====================
// QUIZ DATA
// =====================
const quizData = [
  { q: "Qu'est-ce qu'un PIP en Forex sur la paire EUR/USD ?", opts: ["0.01", "0.001", "0.0001", "0.00001"], correct: 2, exp: "Un PIP (Point In Price) sur EUR/USD est la 4ème décimale, soit 0.0001. Pour un lot standard (100 000 unités), 1 pip ≈ 10$." },
  { q: "Le levier maximum autorisé par l'ESMA pour les particuliers sur le Forex (paires majeures) est :", opts: ["10:1", "30:1", "100:1", "500:1"], correct: 1, exp: "Depuis 2018, l'ESMA limite le levier à 30:1 pour les paires majeures, 20:1 pour les autres paires, 10:1 pour les indices majeurs, 2:1 pour les cryptos." },
  { q: "Qu'est-ce qu'un ETF ?", opts: ["Un type d'obligation d'État", "Un fonds coté en bourse qui réplique un indice", "Un contrat à terme sur matières premières", "Un compte épargne fiscal"], correct: 1, exp: "ETF = Exchange Traded Fund. C'est un fonds qui réplique passivement un indice (CAC 40, S&P 500…) et se négocie en bourse comme une action ordinaire. Frais très faibles (~0.07-0.50%/an)." },
  { q: "Quelle est la relation entre les taux d'intérêt et le prix des obligations ?", opts: ["Corrélation positive : quand les taux montent, les prix montent", "Corrélation négative : quand les taux montent, les prix baissent", "Aucune corrélation", "Cela dépend du pays émetteur"], correct: 1, exp: "Relation inverse fondamentale : quand les taux d'intérêt montent, les obligations existantes (à taux fixe) deviennent moins attractives → leur prix baisse. La duration mesure cette sensibilité." },
  { q: "Le Golden Cross en analyse technique est :", opts: ["La MA 50 croise la MA 200 à la hausse", "Le prix dépasse un niveau de résistance majeur", "Deux bougies haussières consécutives", "La MA 20 croise la MA 50 à la baisse"], correct: 0, exp: "Le Golden Cross = la moyenne mobile 50 jours croise à la hausse la moyenne mobile 200 jours. C'est un signal haussier à moyen terme très suivi. L'inverse (Death Cross) est un signal baissier." },
  { q: "Un trader risque 1% de son capital par trade. Son capital est 20 000€. Son stop loss est à 50 pips (valeur pip = 10$). Quelle doit être sa taille de position ?", opts: ["0.1 lot", "0.2 lot", "0.4 lot", "2 lots"], correct: 2, exp: "Capital risqué = 20 000 × 1% = 200€. Position = 200 / (50 × 10) = 200/500 = 0.4 lot. C'est le position sizing : la base de toute gestion du risque." },
  { q: "Quel indicateur mesure la volatilité implicite du marché S&P 500 et est souvent appelé 'l'indicateur de peur' ?", opts: ["RSI", "VIX", "MACD", "Bollinger Bands"], correct: 1, exp: "Le VIX (Volatility Index) mesure la volatilité implicite du S&P 500 via les options. Un VIX > 30 indique une forte peur du marché. Historiquement, les pics de VIX correspondent souvent à des points bas du marché." },
  { q: "Dans le monde des cryptomonnaies, le 'Halving' Bitcoin correspond à :", opts: ["La division du prix du Bitcoin par 2", "La réduction de moitié de la récompense des mineurs", "La limite à 50% des transactions quotidiennes", "L'interdiction du Bitcoin dans 50% des pays"], correct: 1, exp: "Le Halving survient tous les ~210 000 blocs (~4 ans). La récompense des mineurs est divisée par 2. Historiquement associé à des bull runs dans les 12-18 mois qui suivent." },
  { q: "Le RSI est à 82 sur une action. Que cela signifie-t-il en analyse technique ?", opts: ["L'action est en survente, signal d'achat", "L'action est en surachat, possible signal de prudence", "Le volume est excessif", "La tendance est neutre"], correct: 1, exp: "RSI > 70 = zone de surachat. Cela ne signifie PAS forcément que le prix va baisser immédiatement, mais la probabilité d'une correction augmente. En tendance forte, le RSI peut rester en surachat longtemps." },
  { q: "Quelle enveloppe fiscale française permet l'exonération d'impôt sur le revenu sur les plus-values après 5 ans ?", opts: ["CTO (Compte-Titres Ordinaire)", "Assurance-Vie", "PEA (Plan Épargne Actions)", "PERP"], correct: 2, exp: "Le PEA permet d'investir en actions européennes. Après 5 ans de détention, les plus-values sont exonérées d'IR (seulement 17.2% de prélèvements sociaux). Plafond : 150 000€." },
  { q: "Qu'est-ce que le 'Theta' dans les options financières ?", opts: ["La sensibilité au prix du sous-jacent", "La perte de valeur quotidienne due au passage du temps", "La sensibilité à la volatilité implicite", "Le taux de variation du delta"], correct: 1, exp: "Theta = time decay. Chaque jour qui passe, une option perd de la valeur car il reste moins de temps pour que le mouvement attendu se produise. L'acheteur d'options souffre du theta." },
  { q: "Un 'Short Squeeze' se produit quand :", opts: ["Les vendeurs à découvert ferment massivement leurs positions en rachetant", "Le marché baisse brutalement suite à des ventes massives", "Un broker impose des restrictions sur les ventes à découvert", "Les prix atteignent un niveau de support majeur"], correct: 0, exp: "Un short squeeze : les vendeurs à découvert subissent des pertes quand le prix monte. Ils sont forcés de racheter → ce rachat massif fait encore monter le prix → effet boule de neige. Ex: GameStop 2021." },
  { q: "Dans l'analyse fondamentale, un ratio P/E de 8x pour une entreprise profitable signifie que :", opts: ["L'action est très chère et surévaluée", "L'action est potentiellement sous-évaluée ou un value play", "L'entreprise perd de l'argent", "Le prix est 8 fois le chiffre d'affaires"], correct: 1, exp: "P/E = Prix / Bénéfice par action. Un P/E de 8 signifie que vous payez 8 fois les bénéfices annuels → c'est historiquement bas et peut indiquer une sous-évaluation (value stock)." },
  { q: "Quelle est la différence fondamentale entre un Future et une Option ?", opts: ["Les futures ont une date d'expiration, pas les options", "Un future est une obligation d'acheter/vendre, une option est un droit", "Les options ne peuvent être achetées qu'en Bourse", "Les futures sont uniquement sur matières premières"], correct: 1, exp: "Future = OBLIGATION d'exécuter le contrat à l'échéance. Option = DROIT d'exécuter (mais pas obligation). L'acheteur d'option paie une prime pour ce droit." },
  { q: "Selon la statistique ESMA, quel pourcentage approximatif des traders particuliers sur CFD/Forex perdent de l'argent ?", opts: ["30-40%", "45-55%", "74-89%", "95-99%"], correct: 2, exp: "Selon les données ESMA, entre 74% et 89% des comptes retail perdent de l'argent sur les CFD/Forex. Cela souligne l'importance de la formation, de la gestion du risque, et de commencer avec un compte démo." }
];

let qIndex = 0, score = 0, answered = false;
function loadQuestion() {
  const q = quizData[qIndex];
  document.getElementById('quizScore').textContent = `Question ${qIndex + 1} / ${quizData.length}`;
  document.getElementById('quizQuestion').textContent = q.q;
  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    opts.appendChild(btn);
  });
  document.getElementById('quizFeedback').className = 'quiz-feedback';
  document.getElementById('quizFeedback').textContent = '';
  answered = false;
  document.getElementById('quizNext').textContent = qIndex === quizData.length - 1 ? 'Voir résultat' : 'Suivant →';
  document.getElementById('quizPrev').style.display = qIndex > 0 ? 'inline-block' : 'none';
}
function selectAnswer(i) {
  if (answered) return;
  answered = true;
  const q = quizData[qIndex];
  document.querySelectorAll('.quiz-option').forEach((btn, idx) => {
    if (idx === q.correct) btn.classList.add('correct');
    else if (idx === i && i !== q.correct) btn.classList.add('wrong');
  });
  const fb = document.getElementById('quizFeedback');
  if (i === q.correct) { score++; fb.className = 'quiz-feedback good show'; fb.textContent = '✅ Correct ! ' + q.exp; }
  else { fb.className = 'quiz-feedback bad show'; fb.textContent = '❌ Incorrect. ' + q.exp; }
}
function quizNext() {
  if (!answered) { document.getElementById('quizFeedback').className = 'quiz-feedback bad show'; document.getElementById('quizFeedback').textContent = '⚠️ Sélectionnez une réponse.'; return; }
  qIndex++;
  if (qIndex >= quizData.length) showResult();
  else loadQuestion();
}
function quizPrev() { if (qIndex > 0) { qIndex--; loadQuestion(); } }
function showResult() {
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizQuestion').textContent = '';
  document.getElementById('quizFeedback').className = 'quiz-feedback';
  document.getElementById('quizNext').style.display = 'none';
  document.getElementById('quizPrev').style.display = 'none';
  const res = document.getElementById('quizResult');
  res.style.display = 'block';
  const pct = Math.round((score / quizData.length) * 100);
  document.getElementById('finalScore').textContent = score + ' / ' + quizData.length;
  const msgs = { 80: '🏆 Excellent ! Vous maîtrisez les marchés financiers.', 60: '📈 Bon niveau ! Continuez à approfondir.', 40: '📚 Correct, mais relisez les modules essentiels.' };
  document.getElementById('finalMsg').textContent = pct >= 80 ? msgs[80] : pct >= 60 ? msgs[60] : pct >= 40 ? msgs[40] : '🔄 Retournez au début du cours, les bases sont importantes !';
}
function restartQuiz() {
  qIndex = 0; score = 0; answered = false;
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizNext').style.display = 'inline-block';
  loadQuestion();
}
loadQuestion();

// =====================
// GLOSSAIRE
// =====================
const glossaire = [
  { t: "Action", d: "Titre de propriété représentant une fraction du capital d'une entreprise. Donne droit aux dividendes et au vote en AG." },
  { t: "Ask (Offre)", d: "Prix le plus bas auquel un vendeur accepte de vendre un actif. C'est le prix auquel vous achetez." },
  { t: "Backtest", d: "Test d'une stratégie de trading sur des données historiques pour évaluer sa performance passée avant de la déployer en réel." },
  { t: "Bear Market", d: "Marché baissier : baisse de plus de 20% depuis un sommet. Opposé du Bull Market. Psychologie dominante : peur." },
  { t: "Bid (Demande)", d: "Prix le plus haut qu'un acheteur accepte de payer. C'est le prix auquel vous vendez un actif." },
  { t: "Blockchain", d: "Technologie de registre distribué et immuable. Base des cryptomonnaies. Chaque bloc contient des transactions vérifiées." },
  { t: "Bull Market", d: "Marché haussier : hausse de plus de 20% depuis un creux. Psychologie optimiste et acheteuse dominante." },
  { t: "Call", d: "Option d'achat. Donne le droit (pas l'obligation) d'acheter un actif à un prix fixé (strike) avant l'échéance." },
  { t: "CAC 40", d: "Indice des 40 plus grandes capitalisations françaises sur Euronext Paris. Créé en 1987, base 1000 points." },
  { t: "CFD", d: "Contract for Difference. Contrat sur la différence de prix entre ouverture et fermeture. Pas de propriété de l'actif, levier possible." },
  { t: "Couverture (Hedge)", d: "Stratégie visant à réduire le risque d'une position en prenant une position inverse sur un actif corrélé." },
  { t: "Delta", d: "Greek des options : mesure la variation du prix de l'option pour une variation de 1$ du sous-jacent. Entre 0 et 1 pour un call." },
  { t: "Diversification", d: "Répartition du capital sur plusieurs actifs non corrélés pour réduire le risque global du portefeuille sans sacrifier le rendement." },
  { t: "Dividende", d: "Part des bénéfices distribuée par une entreprise à ses actionnaires, généralement trimestriellement ou annuellement." },
  { t: "Drawdown", d: "Perte maximale mesurée depuis le point haut d'un portefeuille jusqu'au point le plus bas avant un nouveau sommet." },
  { t: "EPS (Earnings Per Share)", d: "Bénéfice net de l'entreprise divisé par le nombre d'actions en circulation. Indicateur de rentabilité par action." },
  { t: "ETF", d: "Exchange Traded Fund. Fonds indiciel coté en bourse, diversification instantanée à faibles frais. Réplique un indice." },
  { t: "Effet de levier", d: "Mécanisme permettant de contrôler une position plus grande que son capital. Amplifie gains ET pertes proportionnellement." },
  { t: "Fibonacci", d: "Niveaux de retracement issus de la suite de Fibonacci utilisés pour identifier des zones de support/résistance potentielles." },
  { t: "FOMO", d: "Fear Of Missing Out. Biais psychologique poussant à prendre des trades précipités par peur de manquer un mouvement." },
  { t: "Forex (FX)", d: "Marché des changes où s'échangent les paires de devises. Plus grand marché financier mondial : 7 500 Mds$/jour." },
  { t: "Futures", d: "Contrats standardisés d'achat/vente d'un actif à un prix et une date futurs fixés. Négociés sur marchés organisés." },
  { t: "Gap", d: "Saut de prix entre la clôture d'une session et l'ouverture de la suivante. Souvent lié à des nouvelles importantes." },
  { t: "Golden Cross", d: "Croisement haussier de la MA 50 au-dessus de la MA 200. Signal achat à moyen terme très suivi par les techniciens." },
  { t: "IPO", d: "Initial Public Offering. Introduction en Bourse d'une entreprise. Permet de lever des capitaux via une offre d'actions au public." },
  { t: "Liquidité", d: "Facilité avec laquelle un actif peut être acheté ou vendu sans impacter significativement son prix. Mesurée par le spread et le volume." },
  { t: "Lot (Forex)", d: "Unité standard de transaction en Forex. 1 lot = 100 000 unités de devise de base. Mini-lot = 10 000, micro-lot = 1 000." },
  { t: "MACD", d: "Moving Average Convergence Divergence. Indicateur de momentum basé sur la différence entre deux moyennes mobiles exponentielles." },
  { t: "Margin Call", d: "Appel de marge : le broker exige des fonds supplémentaires car la position perdante a consommé trop de la marge disponible." },
  { t: "Market Cap", d: "Capitalisation boursière = Cours de l'action × Nombre total d'actions en circulation. Mesure la taille d'une entreprise." },
  { t: "NFP", d: "Non-Farm Payrolls. Rapport mensuel US sur les créations d'emploi hors agriculture. Impact majeur sur USD et marchés mondiaux." },
  { t: "Options", d: "Contrats financiers donnant le droit (call = achat, put = vente) mais pas l'obligation d'acheter/vendre un actif à un prix fixé." },
  { t: "Ordre Limit", d: "Ordre d'achat ou de vente à un prix spécifié ou meilleur. Garantit le prix mais pas l'exécution si le marché n'atteint pas ce niveau." },
  { t: "Ordre Market", d: "Ordre s'exécutant immédiatement au meilleur prix disponible. Garantit l'exécution mais pas le prix (risque de slippage)." },
  { t: "P/E (PER)", d: "Price-to-Earnings Ratio. Cours de l'action divisé par le bénéfice par action. Mesure combien on paie pour 1€ de bénéfice." },
  { t: "PEA", d: "Plan Épargne Actions. Enveloppe fiscale française permettant d'investir en actions européennes avec exonération IR après 5 ans." },
  { t: "Pip", d: "Point In Price. Plus petite variation de prix standard en Forex. Pour EUR/USD = 0.0001 (4ème décimale)." },
  { t: "Position Long", d: "Achat d'un actif en espérant une hausse de son prix. Contraire de short (vente à découvert). Risque limité au capital investi." },
  { t: "Position Short", d: "Vente à découvert d'un actif en espérant une baisse de son prix. On emprunte l'actif, le vend, puis rachète moins cher." },
  { t: "Put", d: "Option de vente. Donne le droit (pas l'obligation) de vendre un actif à un prix fixé (strike) avant l'échéance." },
  { t: "Risk/Reward", d: "Rapport entre le gain potentiel et la perte potentielle d'un trade. Un R/R de 1:3 signifie que pour 100€ risqués, on vise 300€." },
  { t: "RSI", d: "Relative Strength Index. Oscillateur 0-100. >70 = surachat. <30 = survente. Mesure la force relative des mouvements de prix." },
  { t: "S&P 500", d: "Indice des 500 plus grandes entreprises américaines. Référence mondiale, représente ~80% de la capitalisation US totale." },
  { t: "Scalping", d: "Style de trading ultra-court terme cherchant à profiter de très petits mouvements de prix, souvent en secondes ou minutes." },
  { t: "Slippage", d: "Écart entre le prix d'ordre attendu et le prix d'exécution réel. Survient lors de forte volatilité ou faible liquidité." },
  { t: "Spread", d: "Différence entre le prix Ask et le prix Bid. Représente le coût implicite de la transaction et la rémunération du market maker." },
  { t: "Stablecoin", d: "Cryptomonnaie dont la valeur est indexée sur une devise traditionnelle (ex: USDT, USDC = 1 dollar). Réduit la volatilité crypto." },
  { t: "Stop Loss", d: "Ordre automatique de vente/rachat se déclenchant à un niveau de prix défini pour limiter les pertes sur une position." },
  { t: "Swing Trading", d: "Style de trading visant à capturer des mouvements de tendance sur plusieurs jours ou semaines. Utilisent graphiques 4h/daily." },
  { t: "Take Profit", d: "Ordre de clôture automatique d'une position lorsqu'elle atteint un niveau de profit déterminé à l'avance." },
  { t: "Theta", d: "Greek des options : mesure la perte de valeur quotidienne d'une option due au passage du temps (time decay). Négatif pour l'acheteur." },
  { t: "VIX", d: "Volatility Index. Mesure la volatilité implicite du S&P 500. Surnommé 'indice de la peur'. >30 = forte anxiété du marché." },
  { t: "Volume", d: "Nombre de titres ou contrats échangés sur une période. Confirme la force d'un mouvement de prix. Volume fort = signal fiable." },
  { t: "Warrant", d: "Produit à effet de levier émis par une banque, similaire à une option mais non standardisé. Date d'expiration et barrière désactivante." },
  { t: "Yield", d: "Rendement en %. Pour une obligation : coupon annuel / prix × 100. Pour une action : dividende annuel / cours × 100." }
];

function buildGlossary(filter = '') {
  const grid = document.getElementById('glossaryGrid');
  grid.innerHTML = '';
  glossaire.filter(g => !filter || g.t.toLowerCase().includes(filter.toLowerCase()) || g.d.toLowerCase().includes(filter.toLowerCase()))
    .forEach(g => {
      const div = document.createElement('div');
      div.className = 'glossary-item';
      div.innerHTML = `<h4>${g.t}</h4><p>${g.d}</p>`;
      grid.appendChild(div);
    });
}
function filterGlossary() { buildGlossary(document.getElementById('glossarySearch').value); }
buildGlossary();

// =====================
// HERO COUNTER ANIMATION
// =====================
function animateCounters() {
  document.querySelectorAll('.hero-stat .num').forEach(el => {
    const target = parseInt(el.textContent);
    let cur = 0;
    const step = target / 40;
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.round(cur);
      if (cur >= target) clearInterval(iv);
    }, 30);
  });
}

// =====================
// SIMULATEUR APPEL DE MARGE
// =====================
function calcMargin() {
  const capital   = parseFloat(document.getElementById('sim-capital')?.value) || 10000;
  const levier    = parseFloat(document.getElementById('sim-levier')?.value) || 30;
  const usagePct  = parseFloat(document.getElementById('sim-usage')?.value) || 50;
  const mcLevel   = parseFloat(document.getElementById('sim-mc-level')?.value) || 100;

  const margeUtilisee    = capital * (usagePct / 100);
  const positionNotional = margeUtilisee * levier;
  const margeLibre       = capital - margeUtilisee;
  const niveauMarge      = (capital / margeUtilisee) * 100;
  // Perte max avant MC = équité doit rester >= margeUtilisee * mcLevel/100
  const equiteMinMC      = margeUtilisee * (mcLevel / 100);
  const perteAvantMC     = capital - equiteMinMC;
  const perteAvantMCpct  = (perteAvantMC / capital) * 100;
  // Stop out (typically 50% of mc level)
  const stopOutLevel     = mcLevel * 0.5;
  const equiteMinSO      = margeUtilisee * (stopOutLevel / 100);
  const perteAvantSO     = capital - equiteMinSO;

  const metricsEl = document.getElementById('sim-metrics');
  if (!metricsEl) return;

  const metrics = [
    { label: 'Position notionnelle', value: positionNotional.toLocaleString('fr-FR', {maximumFractionDigits:0}) + ' €', color: 'var(--blue)' },
    { label: 'Marge utilisée', value: margeUtilisee.toLocaleString('fr-FR', {maximumFractionDigits:0}) + ' € (' + usagePct + '%)', color: 'var(--gold)' },
    { label: 'Marge libre', value: margeLibre.toLocaleString('fr-FR', {maximumFractionDigits:0}) + ' €', color: margeLibre > capital * 0.3 ? 'var(--green)' : 'var(--red)' },
    { label: 'Niveau de marge actuel', value: niveauMarge.toFixed(0) + '%', color: niveauMarge > 200 ? 'var(--green)' : niveauMarge > 120 ? 'var(--gold)' : 'var(--red)' },
    { label: 'Perte avant Margin Call', value: '-' + perteAvantMC.toLocaleString('fr-FR', {maximumFractionDigits:0}) + ' € (' + perteAvantMCpct.toFixed(1) + '%)', color: perteAvantMCpct > 20 ? 'var(--green)' : perteAvantMCpct > 10 ? 'var(--gold)' : 'var(--red)' },
    { label: 'Perte avant Stop Out', value: '-' + perteAvantSO.toLocaleString('fr-FR', {maximumFractionDigits:0}) + ' €', color: 'var(--red)' },
  ];

  metricsEl.innerHTML = metrics.map(m => `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px">
      <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">${m.label}</div>
      <div style="font-family:IBM Plex Mono,monospace;font-size:16px;font-weight:700;color:${m.color}">${m.value}</div>
    </div>
  `).join('');

  const verdictEl = document.getElementById('sim-verdict');
  let verdict = '', bg = '', border = '';
  if (niveauMarge > 300) {
    verdict = '✅ <strong>Position très sécurisée.</strong> Votre niveau de marge est excellent. Vous pouvez absorber une perte de ' + perteAvantMCpct.toFixed(1) + '% avant tout appel de marge.';
    bg = 'rgba(0,212,170,.08)'; border = '1px solid rgba(0,212,170,.3)';
  } else if (niveauMarge > 150) {
    verdict = '⚠️ <strong>Situation correcte mais surveillez.</strong> Une baisse de ' + perteAvantMCpct.toFixed(1) + '% de votre capital déclencherait le margin call. Envisagez de réduire votre exposition si le marché est très volatile.';
    bg = 'rgba(245,197,24,.08)'; border = '1px solid rgba(245,197,24,.3)';
  } else if (niveauMarge > 100) {
    verdict = '🚨 <strong>ZONE DE DANGER.</strong> Vous êtes très proche du seuil de margin call. Une perte de seulement ' + perteAvantMCpct.toFixed(1) + '% suffit. Réduisez immédiatement votre exposition ou déposez des fonds supplémentaires.';
    bg = 'rgba(255,140,66,.08)'; border = '1px solid rgba(255,140,66,.3)';
  } else {
    verdict = '💀 <strong>MARGIN CALL IMMINENT OU DÉJÀ DÉCLENCHÉ.</strong> Votre niveau de marge est inférieur au seuil requis. Le broker peut liquider vos positions à tout moment. AGISSEZ IMMÉDIATEMENT.';
    bg = 'rgba(255,77,109,.1)'; border = '1px solid rgba(255,77,109,.4)';
  }

  verdictEl.innerHTML = '<div style="font-size:14px;line-height:1.7;color:var(--text)">' + verdict + '</div>';
  verdictEl.style.background = bg;
  verdictEl.style.border = border;
  verdictEl.style.borderRadius = '8px';
}

// Init simulateur on load
setTimeout(calcMargin, 800);

// =====================
// THEME TOGGLE (Dark / Light)
// =====================
function toggleTheme() {
  const body = document.body;
  const btn  = document.getElementById('themeBtn');
  const isLight = body.classList.toggle('light-mode');
  btn.textContent = isLight ? '🌙' : '☀️';
  btn.title = isLight ? 'Passer en mode sombre' : 'Passer en mode clair';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  // Redraw chart with new colours
  drawChart();
}

// Apply saved theme on load
(function applyTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
    const btn = document.getElementById('themeBtn');
    if (btn) { btn.textContent = '☀️'; btn.title = 'Passer en mode sombre'; }
  }
})();

// =====================
// BURGER MENU
// =====================
function toggleMenu() {
  const menu   = document.getElementById('mobileMenu');
  const burger = document.getElementById('burgerBtn');
  const isOpen = menu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  const menu   = document.getElementById('mobileMenu');
  const burger = document.getElementById('burgerBtn');
  menu.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  const menu   = document.getElementById('mobileMenu');
  const burger = document.getElementById('burgerBtn');
  if (menu && menu.classList.contains('open')) {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  }
});

// Close menu on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// Highlight active section link in mobile menu
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links = document.querySelectorAll('.mobile-menu a');
  let current = '';
  sections.forEach(s => {
    const top = s.getBoundingClientRect().top;
    if (top <= 120) current = s.id;
  });
  links.forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

