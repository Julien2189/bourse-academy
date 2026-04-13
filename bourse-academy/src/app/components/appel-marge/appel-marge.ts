import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-appel-marge',
  standalone: true,
  imports: [],
  templateUrl: './appel-marge.html',
  styleUrl: './appel-marge.css',
})
export class AppelMarge implements AfterViewInit {

  ngAfterViewInit(): void {
    this.calcMargin();
  }

  private byId<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement | null;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement | null;

    body?.classList.toggle('open');
    arrow?.classList.toggle('open');
  }

  calcMargin(): void {
    const capital = parseFloat(this.byId<HTMLInputElement>('sim-capital')?.value || '10000');
    const levier = parseFloat(this.byId<HTMLSelectElement>('sim-levier')?.value || '30');
    const usagePct = parseFloat(this.byId<HTMLInputElement>('sim-usage')?.value || '50');
    const mcLevel = parseFloat(this.byId<HTMLInputElement>('sim-mc-level')?.value || '100');

    const margeUtilisee = capital * (usagePct / 100);
    const positionNotional = margeUtilisee * levier;
    const margeLibre = capital - margeUtilisee;
    const niveauMarge = margeUtilisee > 0 ? (capital / margeUtilisee) * 100 : 0;
    const equiteMinMC = margeUtilisee * (mcLevel / 100);
    const perteAvantMC = capital - equiteMinMC;
    const perteAvantMCpct = capital > 0 ? (perteAvantMC / capital) * 100 : 0;
    const stopOutLevel = mcLevel * 0.5;
    const equiteMinSO = margeUtilisee * (stopOutLevel / 100);
    const perteAvantSO = capital - equiteMinSO;

    const metricsEl = this.byId<HTMLElement>('sim-metrics');
    if (!metricsEl) return;

    const metrics = [
      {
        label: 'Position notionnelle',
        value: positionNotional.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €',
        color: 'var(--blue)'
      },
      {
        label: 'Marge utilisée',
        value: margeUtilisee.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' € (' + usagePct + '%)',
        color: 'var(--gold)'
      },
      {
        label: 'Marge libre',
        value: margeLibre.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €',
        color: margeLibre > capital * 0.3 ? 'var(--green)' : 'var(--red)'
      },
      {
        label: 'Niveau de marge actuel',
        value: niveauMarge.toFixed(0) + '%',
        color: niveauMarge > 200 ? 'var(--green)' : niveauMarge > 120 ? 'var(--gold)' : 'var(--red)'
      },
      {
        label: 'Perte avant Margin Call',
        value: '-' + perteAvantMC.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' € (' + perteAvantMCpct.toFixed(1) + '%)',
        color: perteAvantMCpct > 20 ? 'var(--green)' : perteAvantMCpct > 10 ? 'var(--gold)' : 'var(--red)'
      },
      {
        label: 'Perte avant Stop Out',
        value: '-' + perteAvantSO.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €',
        color: 'var(--red)'
      }
    ];

    metricsEl.innerHTML = metrics.map(m => `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">${m.label}</div>
        <div style="font-family:IBM Plex Mono,monospace;font-size:16px;font-weight:700;color:${m.color}">${m.value}</div>
      </div>
    `).join('');

    const verdictEl = this.byId<HTMLElement>('sim-verdict');
    if (!verdictEl) return;

    let verdict = '';
    let bg = '';
    let border = '';

    if (niveauMarge > 300) {
      verdict = `✅ <strong>Position très sécurisée.</strong> Votre niveau de marge est excellent. Vous pouvez absorber une perte de ${perteAvantMCpct.toFixed(1)}% avant tout appel de marge.`;
      bg = 'rgba(0,212,170,.08)';
      border = '1px solid rgba(0,212,170,.3)';
    } else if (niveauMarge > 150) {
      verdict = `⚠️ <strong>Situation correcte mais surveillez.</strong> Une baisse de ${perteAvantMCpct.toFixed(1)}% de votre capital déclencherait le margin call.`;
      bg = 'rgba(245,197,24,.08)';
      border = '1px solid rgba(245,197,24,.3)';
    } else if (niveauMarge > 100) {
      verdict = `🚨 <strong>ZONE DE DANGER.</strong> Vous êtes très proche du seuil de margin call. Une perte de seulement ${perteAvantMCpct.toFixed(1)}% suffit.`;
      bg = 'rgba(255,140,66,.08)';
      border = '1px solid rgba(255,140,66,.3)';
    } else {
      verdict = `💀 <strong>MARGIN CALL IMMINENT OU DÉJÀ DÉCLENCHÉ.</strong> Le broker peut liquider vos positions à tout moment.`;
      bg = 'rgba(255,77,109,.1)';
      border = '1px solid rgba(255,77,109,.4)';
    }

    verdictEl.innerHTML = `<div style="font-size:14px;line-height:1.7;color:var(--text)">${verdict}</div>`;
    verdictEl.style.background = bg;
    verdictEl.style.border = border;
    verdictEl.style.borderRadius = '8px';
  }
}