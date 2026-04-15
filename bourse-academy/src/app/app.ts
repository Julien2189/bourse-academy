import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';

import { HeaderShell } from './components/header-shell/header-shell';
import { Hero } from './components/hero/hero';
import { Fondamentaux } from './components/fondamentaux/fondamentaux';
import { Actifs } from './components/actifs/actifs';
import { Contrats } from './components/contrats/contrats';
import { Analyse } from './components/analyse/analyse';
import { Strategies } from './components/strategies/strategies';
import { Risque } from './components/risque/risque';
import { AppelMarge } from './components/appel-marge/appel-marge';
import { Bougies } from './components/bougies/bougies';
import { InstrumentsAvances } from './components/instruments-avances/instruments-avances';
import { Psychologie } from './components/psychologie/psychologie';
import { Brokers } from './components/brokers/brokers';
import { Outils } from './components/outils/outils';
import { Reglementation } from './components/reglementation/reglementation';
import { Fiscalite } from './components/fiscalite/fiscalite';
import { Roadmap } from './components/roadmap/roadmap';
import { Quiz } from './components/quiz/quiz';
import { Glossaire } from './components/glossaire/glossaire';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderShell,
    Hero,
    Fondamentaux,
    Actifs,
    Contrats,
    Analyse,
    Strategies,
    Risque,
    AppelMarge,
    Bougies,
    InstrumentsAvances,
    Psychologie,
    Brokers,
    Outils,
    Reglementation,
    Fiscalite,
    Roadmap,
    Quiz,
    Glossaire,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private refreshTimer?: number;
  private chartTimer?: number;

  readonly TWELVE_STOCKS = [
    'AAPL', 'NVDA', 'MSFT', 'TSLA', 'BRK.B', 'AMZN',
    'MC.PA', 'TTE.PA', 'BNP.PA', 'SAN.PA', 'AIR.PA', 'RMS.PA'
  ];

  readonly TWELVE_FOREX = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF',
    'EUR/GBP', 'AUD/USD', 'XAU/USD', 'XAG/USD'
  ];

  ngAfterViewInit(): void {
    this.initProgressBar();
    this.initFadeObserver();
    this.applyTheme();
    this.buildSimulatedTicker();

    this.chartTimer = window.setTimeout(() => this.drawChart(), 400);

    const savedKey = localStorage.getItem('twelveApiKey');
    const keyInput = this.byId<HTMLInputElement>('twelveApiKey');

    if (savedKey && keyInput) {
      keyInput.value = savedKey;
      this.fetchAllPrices(savedKey);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();

    if (this.refreshTimer) window.clearTimeout(this.refreshTimer);
    if (this.chartTimer) window.clearTimeout(this.chartTimer);
  }

  private byId<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateProgressBar();
    this.updateActiveLink();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.drawChart();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const menu = this.byId<HTMLElement>('mobileMenu');
    const burger = this.byId<HTMLElement>('burgerBtn');
    const target = event.target as Node | null;

    if (!menu || !burger || !target) return;

    if (menu.classList.contains('open') && !menu.contains(target) && !burger.contains(target)) {
      this.closeMenu();
    }
  }

  // =====================
  // PROGRESS BAR
  // =====================

  private initProgressBar(): void {
    this.updateProgressBar();
  }

  private updateProgressBar(): void {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    const bar = this.byId<HTMLElement>('progressBar');
    if (bar) bar.style.width = `${pct}%`;
  }

  // =====================
  // FADE IN
  // =====================

  private initFadeObserver(): void {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach(el => this.observer?.observe(el));
  }

  // =====================
  // API PANEL
  // =====================

  toggleApiDrawer(): void {
    const drawer = this.byId<HTMLElement>('apiDrawer');
    drawer?.classList.toggle('open');

    const saved = localStorage.getItem('twelveApiKey');
    const input = this.byId<HTMLInputElement>('twelveApiKey');

    if (saved && input) {
      input.value = saved;
    }
  }

  saveAndFetch(): void {
    const input = this.byId<HTMLInputElement>('twelveApiKey');
    const key = input?.value.trim() ?? '';

    if (!key) {
      alert('Entrez une clé API Twelve Data valide.');
      return;
    }

    localStorage.setItem('twelveApiKey', key);
    this.setStatus('load', 'Connexion à Twelve Data...');
    this.toggleApiDrawer();
    this.fetchAllPrices(key);
  }

  clearApiKey(): void {
    localStorage.removeItem('twelveApiKey');

    const input = this.byId<HTMLInputElement>('twelveApiKey');
    if (input) input.value = '';

    this.setStatus('idle', 'Clé effacée — données simulées actives');
    this.buildSimulatedTicker();
  }

  setStatus(type: string, msg: string): void {
    const dot = this.byId<HTMLElement>('statusDot');
    const txt = this.byId<HTMLElement>('statusText');

    if (dot) dot.className = `dot dot-${type}`;
    if (txt) txt.textContent = msg;
  }

  // =====================
  // FETCH
  // =====================

  async fetchBatch(symbols: string[], apiKey: string): Promise<any> {
    const sym = symbols.join(',');
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(sym)}&apikey=${apiKey}`;

    try {
      const res = await fetch(url);
      return await res.json();
    } catch (error) {
      console.error('Twelve Data fetch error:', error);
      return {};
    }
  }

  async fetchCoinGecko(): Promise<any> {
    const ids = 'bitcoin,ethereum,solana,binancecoin';
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    try {
      const res = await fetch(url);
      return await res.json();
    } catch (error) {
      console.error('CoinGecko error:', error);
      return {};
    }
  }

  fmtPrice(v: any, symbol = ''): string {
    if (v === null || v === undefined || isNaN(v)) return '—';

    const n = parseFloat(v);

    if (symbol.includes('/') && !symbol.includes('XAU') && !symbol.includes('XAG') && !symbol.includes('BRENT')) {
      return n.toFixed(4);
    }

    if (symbol.includes('JPY')) return n.toFixed(2);

    if (n > 1000) {
      return n.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    return n.toFixed(2);
  }

  fmtChange(pct: any): { html: string; cls: string } {
    if (pct === null || pct === undefined || isNaN(pct)) {
      return { html: '—', cls: '' };
    }

    const n = parseFloat(pct);
    const sign = n >= 0 ? '+' : '';
    const arrow = n >= 0 ? '▲' : '▼';
    const cls = n >= 0 ? 'change-up' : 'change-down';

    return {
      html: `<span class="${cls}">${sign}${n.toFixed(2)}% ${arrow}</span>`,
      cls
    };
  }

  setPrice(symbol: string, price: any, changePct: any, currency = ''): void {
    const pEl = this.byId<HTMLElement>('price-' + symbol);
    const cEl = this.byId<HTMLElement>('change-' + symbol);
    const cur = currency ? `${currency} ` : '';

    if (pEl) pEl.innerHTML = cur + this.fmtPrice(price, symbol);

    if (cEl) {
      const ch = this.fmtChange(changePct);
      cEl.innerHTML = ch.html;
    }
  }

  async fetchAllPrices(apiKey?: string | null): Promise<void> {
    if (this.refreshTimer) window.clearTimeout(this.refreshTimer);

    this.setStatus('load', 'Chargement des prix actions & forex...');

    try {
      const crypto = await this.fetchCoinGecko();

      if (crypto.bitcoin) {
        this.setPrice('BTC', crypto.bitcoin.usd, crypto.bitcoin.usd_24h_change, '$');
        this.setPrice('ETH', crypto.ethereum?.usd, crypto.ethereum?.usd_24h_change, '$');
        this.setPrice('SOL', crypto.solana?.usd, crypto.solana?.usd_24h_change, '$');
        this.setPrice('BNB', crypto.binancecoin?.usd, crypto.binancecoin?.usd_24h_change, '$');
      }
    } catch (error) {
      console.warn('CoinGecko fail', error);
    }

    if (!apiKey) {
      this.setStatus('idle', 'Crypto chargée (CoinGecko) • Ajoutez clé Twelve Data pour actions/forex');
      this.buildTickerFromDOM();
      return;
    }

    try {
      const stockData = await this.fetchBatch(this.TWELVE_STOCKS, apiKey);

      this.TWELVE_STOCKS.forEach(sym => {
        const item = stockData[sym];
        if (item && item.close && item.status !== 'error') {
          const price = parseFloat(item.close);
          const prev = parseFloat(item.previous_close);
          const chg = prev ? ((price - prev) / prev) * 100 : null;
          const currency = sym.includes('.PA') ? '€' : '$';
          this.setPrice(sym, price, chg, currency);
        }
      });
    } catch (error) {
      console.warn('Stocks fetch fail', error);
    }

    try {
      const fxData = await this.fetchBatch(this.TWELVE_FOREX, apiKey);

      this.TWELVE_FOREX.forEach(sym => {
        const item = fxData[sym];
        if (item && item.close && item.status !== 'error') {
          const price = parseFloat(item.close);
          const prev = parseFloat(item.previous_close);
          const chg = prev ? ((price - prev) / prev) * 100 : null;
          const currency = sym.includes('XAU') || sym.includes('XAG') ? '$' : '';
          this.setPrice(sym, price, chg, currency);
        }
      });
    } catch (error) {
      console.warn('Forex fetch fail', error);
    }

    try {
      const indicesSymbols = ['CAC40:Euronext', 'SPX:NYSE', 'IXIC:NASDAQ'];
      const idxData = await this.fetchBatch(indicesSymbols, apiKey);
      const cacItem = idxData['CAC40:Euronext'];

      if (cacItem && cacItem.close && cacItem.status !== 'error') {
        const price = parseFloat(cacItem.close);
        const prev = parseFloat(cacItem.previous_close);
        const chg = prev ? ((price - prev) / prev) * 100 : null;

        const priceEl = this.byId<HTMLElement>('chartPrice');
        const changeEl = this.byId<HTMLElement>('chartChange');
        const metaEl = this.byId<HTMLElement>('chartMeta');
        const badgeEl = this.byId<HTMLElement>('cacLiveBadge');

        if (priceEl) {
          priceEl.innerHTML = price.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        }

        if (changeEl && chg !== null) {
          const ch = this.fmtChange(chg);
          changeEl.innerHTML = ch.html;
        }

        if (metaEl) {
          metaEl.textContent = `Cours de clôture Twelve Data • Mis à jour: ${new Date().toLocaleTimeString('fr-FR')}`;
        }

        if (badgeEl) {
          badgeEl.innerHTML = '<span class="live-badge">LIVE</span>';
        }
      }
    } catch (error) {
      console.warn('Index fetch fail', error);
    }

    this.setStatus('ok', `Prix réels chargés · ${new Date().toLocaleTimeString('fr-FR')} · Actualisation auto dans 60s`);
    this.buildTickerFromDOM();

    this.refreshTimer = window.setTimeout(() => this.fetchAllPrices(apiKey), 60000);
  }

  // =====================
  // TICKER
  // =====================

  buildTickerFromDOM(): void {
    const items = [
      { id: 'price-BTC', label: 'BTC', change: 'change-BTC' },
      { id: 'price-ETH', label: 'ETH', change: 'change-ETH' },
      { id: 'price-AAPL', label: 'AAPL', change: 'change-AAPL' },
      { id: 'price-NVDA', label: 'NVDA', change: 'change-NVDA' },
      { id: 'price-MC.PA', label: 'LVMH', change: 'change-MC.PA' },
      { id: 'price-TTE.PA', label: 'TotalEnergies', change: 'change-TTE.PA' },
      { id: 'price-EUR/USD', label: 'EUR/USD', change: 'change-EUR/USD' },
      { id: 'price-GBP/USD', label: 'GBP/USD', change: 'change-GBP/USD' },
      { id: 'price-XAU/USD', label: 'OR', change: 'change-XAU/USD' },
      { id: 'chartPrice', label: 'CAC 40', change: 'chartChange' }
    ];

    const tickerParts: string[] = [];

    items.forEach(item => {
      const pEl = this.byId<HTMLElement>(item.id);
      const cEl = this.byId<HTMLElement>(item.change);

      if (!pEl) return;

      const price = pEl.textContent?.trim() ?? '';
      if (!price || price.includes('⏳') || price.includes('chargement')) return;

      const change = cEl?.textContent?.trim() ?? '';
      const isUp = change.includes('+') || change.includes('▲');
      const isDown = change.includes('▼') || (change.startsWith('-') && !change.startsWith('-0.00'));
      const emoji = isUp ? '🟢' : isDown ? '🔴' : '⚪';

      tickerParts.push(`${emoji} ${item.label} ${price} ${change}`);
    });

    tickerParts.push('📊 BOURSE ACADEMY — DE ZÉRO À HERO');

    const ticker = this.byId<HTMLElement>('liveTicker');
    if (ticker && tickerParts.length > 1) {
      ticker.textContent = tickerParts.join('   |   ') + '   |   ';
    }
  }

  buildSimulatedTicker(): void {
    const ticker = this.byId<HTMLElement>('liveTicker');
    if (ticker) {
      ticker.textContent =
        '⚙️ Configurez une clé API (bouton ⚙️ en bas à droite) pour les prix réels   |   📊 BOURSE ACADEMY — DE ZÉRO À HERO   |   ';
    }
  }

  // =====================
  // CHART
  // =====================

  drawChart(prices?: number[]): void {
    const canvas = this.byId<HTMLCanvasElement>('priceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth || 800;
    const height = 160;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, width, height);

    if (!prices || prices.length < 2) {
      prices = [];
      let p = 7800;
      for (let i = 0; i < 120; i++) {
        p += (Math.random() - 0.47) * 35;
        prices.push(p);
      }
    }

    const mn = Math.min(...prices);
    const mx = Math.max(...prices);
    const rng = mx - mn || 1;

    const toY = (v: number) => height - ((v - mn) / rng) * (height - 20) - 10;
    const toX = (i: number) => (i / (prices.length - 1)) * width;

    const isUp = prices[prices.length - 1] >= prices[0];
    const lineColor = isUp ? '#00d4aa' : '#ff4d6d';
    const fillColor = isUp ? 'rgba(0,212,170,' : 'rgba(255,77,109,';

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, fillColor + '0.15)');
    grad.addColorStop(1, fillColor + '0)');

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(prices[0]));
    prices.forEach((pr, i) => ctx.lineTo(toX(i), toY(pr)));
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(prices[0]));
    prices.forEach((pr, i) => ctx.lineTo(toX(i), toY(pr)));
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // =====================
  // THEME
  // =====================

  toggleTheme(): void {
    document.body.classList.toggle('light-mode');
    this.updateThemeButton();
    this.drawChart();

    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  applyTheme(): void {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.body.classList.add('light-mode');
    }
    this.updateThemeButton();
  }

  private updateThemeButton(): void {
    const btn = this.byId<HTMLElement>('themeBtn');
    if (!btn) return;

    const isLight = document.body.classList.contains('light-mode');
    btn.textContent = isLight ? '🌙' : '☀️';
    btn.title = isLight ? 'Passer en mode sombre' : 'Passer en mode clair';
  }

  // =====================
  // MENU MOBILE
  // =====================

  toggleMenu(): void {
    const menu = this.byId<HTMLElement>('mobileMenu');
    const burger = this.byId<HTMLElement>('burgerBtn');

    if (!menu || !burger) return;

    const isOpen = menu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    const menu = this.byId<HTMLElement>('mobileMenu');
    const burger = this.byId<HTMLElement>('burgerBtn');

    menu?.classList.remove('open');
    burger?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = '';
  }

  updateActiveLink(): void {
    const sections = document.querySelectorAll('section[id], div[id]');
    const links = document.querySelectorAll('.mobile-menu a');
    let current = '';

    sections.forEach(s => {
      const top = (s as HTMLElement).getBoundingClientRect().top;
      if (top <= 120) current = (s as HTMLElement).id;
    });

    links.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active-link', href === '#' + current);
    });
  }
}