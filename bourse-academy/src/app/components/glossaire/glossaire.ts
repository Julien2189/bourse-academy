import { AfterViewInit, Component } from '@angular/core';

type GlossaryItem = {
  t: string;
  d: string;
};

@Component({
  selector: 'app-glossaire',
  standalone: true,
  imports: [],
  templateUrl: './glossaire.html',
  styleUrl: './glossaire.css',
})
export class Glossaire implements AfterViewInit {

  readonly glossaire: GlossaryItem[] = [
  { t: 'Action', d: 'Part du capital d’une entreprise cotée. Acheter une action revient à devenir copropriétaire de l’entreprise.' },
  { t: 'Actif', d: 'Instrument financier ou valeur susceptible de prendre de la valeur ou de générer un revenu.' },
  { t: 'Ask', d: 'Prix vendeur le plus bas disponible sur le marché.' },
  { t: 'Bid', d: 'Prix acheteur le plus élevé disponible sur le marché.' },
  { t: 'Spread', d: 'Écart entre le prix d’achat (ask) et le prix de vente (bid).' },
  { t: 'Liquidité', d: 'Capacité d’un actif à être acheté ou vendu rapidement sans trop impacter son prix.' },
  { t: 'Volatilité', d: 'Mesure de l’amplitude des variations de prix d’un actif.' },
  { t: 'Carnet d’ordres', d: 'Liste des ordres d’achat et de vente en attente sur un actif.' },
  { t: 'Ordre au marché', d: 'Ordre exécuté immédiatement au meilleur prix disponible.' },
  { t: 'Ordre à cours limité', d: 'Ordre exécuté uniquement au prix fixé ou à un meilleur prix.' },
  { t: 'Stop Loss', d: 'Ordre automatique destiné à limiter une perte.' },
  { t: 'Take Profit', d: 'Ordre automatique destiné à sécuriser un gain.' },
  { t: 'Stop Limit', d: 'Ordre qui se déclenche à un niveau donné puis devient un ordre limité.' },
  { t: 'OCO', d: 'One Cancels the Other : deux ordres liés, si l’un s’exécute l’autre est annulé.' },
  { t: 'Slippage', d: 'Écart entre le prix attendu d’exécution et le prix réellement obtenu.' },

  { t: 'Spot', d: 'Marché au comptant. L’achat ou la vente de l’actif se fait immédiatement.' },
  { t: 'Future', d: 'Contrat à terme engageant à acheter ou vendre un actif à un prix fixé pour une date future.' },
  { t: 'Futures', d: 'Plural de future. Contrats à terme standardisés cotés sur un marché organisé.' },
  { t: 'Perpetual Future', d: 'Contrat future sans date d’expiration, très utilisé sur les plateformes crypto.' },
  { t: 'CFD', d: 'Contract for Difference : contrat permettant de spéculer sur la variation d’un actif sans le posséder.' },
  { t: 'ETF', d: 'Fonds coté en bourse qui réplique un indice ou un panier d’actifs.' },
  { t: 'Obligation', d: 'Titre de dette émis par un État ou une entreprise en échange d’un intérêt.' },
  { t: 'Option', d: 'Contrat donnant le droit, mais pas l’obligation, d’acheter ou vendre un actif à un prix fixé.' },
  { t: 'Call', d: 'Option donnant le droit d’acheter un actif à un prix déterminé.' },
  { t: 'Put', d: 'Option donnant le droit de vendre un actif à un prix déterminé.' },
  { t: 'Strike', d: 'Prix d’exercice d’une option.' },
  { t: 'Prime', d: 'Montant payé pour acheter une option.' },
  { t: 'Warrant', d: 'Produit dérivé donnant un droit d’achat ou de vente, souvent émis par une banque.' },
  { t: 'Turbo', d: 'Produit dérivé à effet de levier avec barrière désactivante.' },
  { t: 'SRD', d: 'Service de Règlement Différé permettant d’acheter ou vendre des actions à crédit en France.' },
  { t: 'OPCVM', d: 'Organisme de placement collectif regroupant l’argent de plusieurs investisseurs.' },

  { t: 'Levier', d: 'Mécanisme permettant de contrôler une position plus grande que le capital réellement engagé.' },
  { t: 'Marge', d: 'Somme bloquée comme garantie pour ouvrir ou maintenir une position à effet de levier.' },
  { t: 'Marge initiale', d: 'Capital requis au départ pour ouvrir une position à effet de levier.' },
  { t: 'Marge de maintenance', d: 'Niveau minimal de capital requis pour garder une position ouverte.' },
  { t: 'Marge libre', d: 'Part du capital encore disponible après la marge déjà utilisée.' },
  { t: 'Marge utilisée', d: 'Part du capital actuellement immobilisée pour maintenir les positions ouvertes.' },
  { t: 'Effet de levier', d: 'Autre nom du levier. Il amplifie les gains, mais aussi les pertes.' },
  { t: 'Position notionnelle', d: 'Valeur totale contrôlée sur le marché grâce au levier.' },
  { t: 'Margin Call', d: 'Alerte du broker quand la marge disponible devient insuffisante.' },
  { t: 'Stop Out', d: 'Liquidation automatique des positions lorsque le niveau de marge devient trop faible.' },
  { t: 'Mark-to-Market', d: 'Réévaluation quotidienne d’une position selon le prix du marché.' },
  { t: 'Variation Margin', d: 'Ajustement quotidien des gains ou pertes sur un contrat future.' },

  { t: 'Long', d: 'Position acheteuse prise dans l’espoir que le prix monte.' },
  { t: 'Short', d: 'Position vendeuse prise dans l’espoir que le prix baisse.' },
  { t: 'Short Selling', d: 'Vente à découvert pour profiter d’une baisse du marché.' },
  { t: 'Short Squeeze', d: 'Hausse brutale provoquée par le rachat forcé de vendeurs à découvert.' },
  { t: 'Drawdown', d: 'Perte maximale subie depuis un plus haut du capital.' },
  { t: 'Risk/Reward', d: 'Rapport entre le gain potentiel et la perte potentielle d’un trade.' },
  { t: 'Position Sizing', d: 'Méthode de calcul de la taille de position selon le risque accepté.' },

  { t: 'Pip', d: 'Plus petite variation standard d’une paire de devises sur le Forex.' },
  { t: 'Lot', d: 'Unité de taille standard pour trader sur le Forex.' },
  { t: 'Mini-lot', d: 'Taille réduite d’un lot standard sur le Forex.' },
  { t: 'Micro-lot', d: 'Très petite taille de position sur le Forex.' },
  { t: 'Forex', d: 'Marché des changes où s’échangent les devises.' },
  { t: 'Paire majeure', d: 'Paire de devises très liquide impliquant généralement le dollar américain.' },
  { t: 'Paire mineure', d: 'Paire de devises liquide mais moins échangée que les majeures.' },
  { t: 'Paire exotique', d: 'Paire de devises plus rare, souvent plus volatile et avec des spreads élevés.' },

  { t: 'Support', d: 'Zone de prix où la demande peut freiner la baisse.' },
  { t: 'Résistance', d: 'Zone de prix où l’offre peut freiner la hausse.' },
  { t: 'Tendance haussière', d: 'Suite de sommets et creux de plus en plus hauts.' },
  { t: 'Tendance baissière', d: 'Suite de sommets et creux de plus en plus bas.' },
  { t: 'Range', d: 'Phase de marché où le prix évolue entre un support et une résistance.' },
  { t: 'Cassure', d: 'Franchissement net d’un support ou d’une résistance.' },
  { t: 'Breakout', d: 'Autre terme pour désigner une cassure.' },

  { t: 'Bougie', d: 'Représentation graphique d’un mouvement de prix sur une période donnée.' },
  { t: 'Chandelier', d: 'Autre nom pour une bougie japonaise.' },
  { t: 'OHLC', d: 'Open, High, Low, Close : ouverture, plus haut, plus bas, clôture.' },
  { t: 'Doji', d: 'Bougie où l’ouverture et la clôture sont très proches, signalant une hésitation.' },
  { t: 'Marteau', d: 'Bougie avec longue mèche basse pouvant signaler un retournement haussier.' },
  { t: 'Étoile filante', d: 'Bougie avec longue mèche haute pouvant signaler un retournement baissier.' },
  { t: 'Engulfing', d: 'Figure de retournement où une bougie englobe entièrement la précédente.' },
  { t: 'Morning Star', d: 'Figure en trois bougies annonçant potentiellement un retournement haussier.' },
  { t: 'Evening Star', d: 'Figure en trois bougies annonçant potentiellement un retournement baissier.' },
  { t: 'Marubozu', d: 'Bougie sans ou avec très peu de mèches, montrant une forte domination acheteuse ou vendeuse.' },

  { t: 'RSI', d: 'Indicateur technique mesurant la force relative du mouvement des prix.' },
  { t: 'MACD', d: 'Indicateur technique basé sur des moyennes mobiles pour détecter le momentum.' },
  { t: 'Moyenne mobile', d: 'Indicateur lissant les prix sur une période donnée pour visualiser la tendance.' },
  { t: 'Moyenne mobile simple', d: 'Moyenne arithmétique des prix sur une période donnée.' },
  { t: 'Moyenne mobile exponentielle', d: 'Moyenne mobile donnant plus de poids aux prix récents.' },
  { t: 'Bandes de Bollinger', d: 'Indicateur de volatilité construit autour d’une moyenne mobile.' },
  { t: 'Fibonacci', d: 'Outil technique utilisé pour repérer des niveaux de retracement potentiels.' },
  { t: 'Volume', d: 'Quantité d’actifs échangés sur une période donnée.' },
  { t: 'OBV', d: 'On-Balance Volume : indicateur combinant volume et évolution du prix.' },
  { t: 'Momentum', d: 'Force et vitesse d’un mouvement de prix.' },

  { t: 'Analyse technique', d: 'Méthode d’analyse fondée sur les graphiques, les prix, les volumes et les indicateurs.' },
  { t: 'Analyse fondamentale', d: 'Méthode d’analyse basée sur les données financières et économiques.' },
  { t: 'Analyse de sentiment', d: 'Analyse basée sur l’humeur et le positionnement global des investisseurs.' },

  { t: 'PER', d: 'Price Earnings Ratio : ratio entre le prix d’une action et son bénéfice par action.' },
  { t: 'P/E', d: 'Autre écriture du PER, ratio cours / bénéfice par action.' },
  { t: 'PEG', d: 'Ratio PER ajusté à la croissance de l’entreprise.' },
  { t: 'EPS', d: 'Earnings Per Share : bénéfice par action.' },
  { t: 'BPA', d: 'Bénéfice par action, équivalent français de EPS.' },
  { t: 'EBITDA', d: 'Indicateur de performance avant intérêts, impôts, amortissements et dépréciations.' },
  { t: 'Cash Flow', d: 'Flux de trésorerie d’une entreprise.' },
  { t: 'Free Cash Flow', d: 'Trésorerie réellement disponible après les dépenses nécessaires.' },
  { t: 'ROE', d: 'Return on Equity : rendement des capitaux propres.' },
  { t: 'ROIC', d: 'Return on Invested Capital : rendement du capital investi.' },
  { t: 'Debt/Equity', d: 'Ratio entre la dette totale et les capitaux propres.' },
  { t: 'P/B', d: 'Price to Book : ratio entre le prix de l’action et sa valeur comptable.' },
  { t: 'EV/EBITDA', d: 'Ratio comparant la valeur d’entreprise à son EBITDA.' },

  { t: 'NFP', d: 'Non-Farm Payrolls : statistique mensuelle sur l’emploi américain, très surveillée.' },
  { t: 'CPI', d: 'Indice des prix à la consommation, mesure de l’inflation.' },
  { t: 'PIB', d: 'Produit intérieur brut, mesure de la richesse produite par un pays.' },
  { t: 'PMI', d: 'Indice d’activité économique des directeurs d’achat.' },
  { t: 'ISM', d: 'Indicateur américain d’activité économique dans l’industrie ou les services.' },
  { t: 'Banque centrale', d: 'Institution chargée de la politique monétaire d’un pays ou d’une zone.' },
  { t: 'Fed', d: 'Réserve fédérale américaine, banque centrale des États-Unis.' },
  { t: 'BCE', d: 'Banque centrale européenne.' },
  { t: 'Inflation', d: 'Hausse générale des prix dans une économie.' },

  { t: 'ETF à levier', d: 'ETF amplifiant les variations quotidiennes d’un indice.' },
  { t: 'ETF inverse', d: 'ETF conçu pour évoluer à l’inverse de son indice de référence.' },
  { t: 'DCA', d: 'Dollar Cost Averaging : investissement régulier d’un montant fixe dans le temps.' },
  { t: 'SCPI', d: 'Société civile de placement immobilier permettant d’investir indirectement dans l’immobilier.' },
  { t: 'REIT', d: 'Société cotée spécialisée dans l’immobilier et redistribuant une grande part de ses revenus.' },
  { t: 'Copy Trading', d: 'Système permettant de copier automatiquement les trades d’un autre trader.' },
  { t: 'Paper Trading', d: 'Simulation de trading sans argent réel.' },
  { t: 'Backtesting', d: 'Test d’une stratégie sur des données historiques.' },
  { t: 'Screener', d: 'Outil permettant de filtrer des actifs selon différents critères.' },

  { t: 'Bitcoin', d: 'Première cryptomonnaie, souvent considérée comme un or numérique.' },
  { t: 'Ethereum', d: 'Blockchain majeure permettant les smart contracts.' },
  { t: 'Altcoin', d: 'Toute cryptomonnaie autre que Bitcoin.' },
  { t: 'Stablecoin', d: 'Cryptomonnaie indexée sur une devise ou un actif stable.' },
  { t: 'Staking', d: 'Blocage de cryptomonnaies pour participer au réseau et recevoir des récompenses.' },
  { t: 'Wallet', d: 'Portefeuille numérique permettant de stocker des cryptomonnaies.' },
  { t: 'DeFi', d: 'Finance décentralisée reposant sur des applications blockchain sans intermédiaire.' },
  { t: 'NFT', d: 'Jeton numérique unique représentant un actif numérique ou une preuve de propriété.' },
  { t: 'Halving', d: 'Réduction de moitié de la récompense de minage du Bitcoin.' },
  { t: 'Funding Rate', d: 'Taux de financement périodique sur les perpetual futures crypto.' },

  { t: 'PEA', d: 'Plan d’Épargne en Actions offrant un cadre fiscal avantageux pour certains titres.' },
  { t: 'CTO', d: 'Compte-Titres Ordinaire permettant d’investir sur de nombreux actifs sans plafond.' },
  { t: 'Assurance-vie', d: 'Enveloppe d’épargne française offrant une fiscalité avantageuse sous conditions.' },
  { t: 'Flat Tax', d: 'Prélèvement forfaitaire unique de 30% en France sur certains revenus du capital.' },

  { t: 'AMF', d: 'Autorité des Marchés Financiers, régulateur français des marchés financiers.' },
  { t: 'ESMA', d: 'Autorité européenne des marchés financiers.' },
  { t: 'SEC', d: 'Régulateur des marchés financiers aux États-Unis.' },
  { t: 'Market Maker', d: 'Acteur fournissant en permanence des prix d’achat et de vente pour assurer la liquidité.' },
  { t: 'HFT', d: 'High Frequency Trading : trading algorithmique à très haute fréquence.' },
  { t: 'Fear & Greed Index', d: 'Indicateur mesurant le sentiment du marché entre peur et avidité.' },
  { t: 'Put/Call Ratio', d: 'Ratio entre le volume de puts et celui des calls, utilisé comme indicateur de sentiment.' },
  { t: 'COT Report', d: 'Rapport hebdomadaire sur le positionnement des acteurs majeurs des marchés futures.' }
];

  ngAfterViewInit(): void {
    this.buildGlossary();
  }

  private byId<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  buildGlossary(filter = ''): void {
    const grid = this.byId<HTMLElement>('glossaryGrid');
    if (!grid) return;

    grid.innerHTML = '';

    this.glossaire
      .filter(g =>
        !filter ||
        g.t.toLowerCase().includes(filter.toLowerCase()) ||
        g.d.toLowerCase().includes(filter.toLowerCase())
      )
      .forEach(g => {
        const div = document.createElement('div');
        div.className = 'glossary-item';
        div.innerHTML = `<h4>${g.t}</h4><p>${g.d}</p>`;
        grid.appendChild(div);
      });
  }

  filterGlossary(event?: Event): void {
    const value = (event?.target as HTMLInputElement | null)?.value
      ?? this.byId<HTMLInputElement>('glossarySearch')?.value
      ?? '';

    this.buildGlossary(value);
  }
}