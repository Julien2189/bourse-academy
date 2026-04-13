import { Component, AfterViewInit } from '@angular/core';

type QuizItem = {
  q: string;
  opts: string[];
  correct: number;
  exp: string;
};

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements AfterViewInit {

  qIndex = 0;
  score = 0;
  answered = false;

  readonly quizData: QuizItem[] = [
    {
      q: 'Qu’est-ce qu’une action ?',
      opts: [
        'Une dette d’entreprise',
        'Une fraction du capital d’une entreprise',
        'Un produit dérivé',
        'Une devise'
      ],
      correct: 1,
      exp: 'Une action représente une part du capital d’une entreprise.'
    },
    {
      q: 'Que signifie un ordre au marché ?',
      opts: [
        'Il s’exécute immédiatement au meilleur prix disponible',
        'Il s’exécute seulement à votre prix exact',
        'Il attend la clôture',
        'Il annule les autres ordres'
      ],
      correct: 0,
      exp: 'Un ordre au marché s’exécute immédiatement, mais le prix exact n’est pas garanti.'
    },
    {
      q: 'Quel est le principal avantage d’un ETF ?',
      opts: [
        'Effet de levier automatique',
        'Diversification à faible coût',
        'Garantie de gains',
        'Absence de risque'
      ],
      correct: 1,
      exp: 'Un ETF permet d’investir sur un panier d’actifs avec peu de frais.'
    }
  ];

  ngAfterViewInit(): void {
    this.loadQuestion();
  }

  private byId<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  loadQuestion(): void {
    if (!this.quizData.length) return;

    const q = this.quizData[this.qIndex];

    const scoreEl = this.byId<HTMLElement>('quizScore');
    const questionEl = this.byId<HTMLElement>('quizQuestion');
    const optsEl = this.byId<HTMLElement>('quizOptions');
    const feedbackEl = this.byId<HTMLElement>('quizFeedback');
    const nextEl = this.byId<HTMLElement>('quizNext');
    const prevEl = this.byId<HTMLElement>('quizPrev');
    const resultEl = this.byId<HTMLElement>('quizResult');

    if (resultEl) resultEl.style.display = 'none';

    if (scoreEl) scoreEl.textContent = `Question ${this.qIndex + 1} / ${this.quizData.length}`;
    if (questionEl) questionEl.textContent = q.q;

    if (optsEl) {
      optsEl.innerHTML = '';

      q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => this.selectAnswer(i));
        optsEl.appendChild(btn);
      });
    }

    if (feedbackEl) {
      feedbackEl.className = 'quiz-feedback';
      feedbackEl.textContent = '';
    }

    this.answered = false;

    if (nextEl) {
      nextEl.style.display = 'inline-block';
      nextEl.textContent = this.qIndex === this.quizData.length - 1 ? 'Voir résultat' : 'Suivant →';
    }

    if (prevEl) {
      prevEl.style.display = this.qIndex > 0 ? 'inline-block' : 'none';
    }
  }

  selectAnswer(i: number): void {
    if (this.answered) return;

    this.answered = true;
    const q = this.quizData[this.qIndex];

    document.querySelectorAll('.quiz-option').forEach((btn, idx) => {
      if (idx === q.correct) {
        btn.classList.add('correct');
      } else if (idx === i && i !== q.correct) {
        btn.classList.add('wrong');
      }
    });

    const fb = this.byId<HTMLElement>('quizFeedback');
    if (!fb) return;

    if (i === q.correct) {
      this.score++;
      fb.className = 'quiz-feedback good show';
      fb.textContent = '✅ Correct ! ' + q.exp;
    } else {
      fb.className = 'quiz-feedback bad show';
      fb.textContent = '❌ Incorrect. ' + q.exp;
    }
  }

  quizNext(): void {
    const fb = this.byId<HTMLElement>('quizFeedback');

    if (!this.answered) {
      if (fb) {
        fb.className = 'quiz-feedback bad show';
        fb.textContent = '⚠️ Sélectionnez une réponse.';
      }
      return;
    }

    this.qIndex++;

    if (this.qIndex >= this.quizData.length) {
      this.showResult();
    } else {
      this.loadQuestion();
    }
  }

  quizPrev(): void {
    if (this.qIndex > 0) {
      this.qIndex--;
      this.loadQuestion();
    }
  }

  showResult(): void {
    const optionsEl = this.byId<HTMLElement>('quizOptions');
    const questionEl = this.byId<HTMLElement>('quizQuestion');
    const feedbackEl = this.byId<HTMLElement>('quizFeedback');
    const nextEl = this.byId<HTMLElement>('quizNext');
    const prevEl = this.byId<HTMLElement>('quizPrev');
    const res = this.byId<HTMLElement>('quizResult');
    const finalScore = this.byId<HTMLElement>('finalScore');
    const finalMsg = this.byId<HTMLElement>('finalMsg');

    if (optionsEl) optionsEl.innerHTML = '';
    if (questionEl) questionEl.textContent = '';
    if (feedbackEl) feedbackEl.className = 'quiz-feedback';
    if (nextEl) nextEl.style.display = 'none';
    if (prevEl) prevEl.style.display = 'none';
    if (res) res.style.display = 'block';

    const pct = Math.round((this.score / this.quizData.length) * 100);

    if (finalScore) finalScore.textContent = `${this.score} / ${this.quizData.length}`;
    if (finalMsg) {
      finalMsg.textContent =
        pct >= 80 ? '🏆 Excellent ! Vous maîtrisez bien les bases.' :
        pct >= 60 ? '📈 Bon niveau ! Continuez à approfondir.' :
        pct >= 40 ? '📚 Correct, mais relisez certains modules.' :
        '🔄 Reprenez les bases, elles sont essentielles.';
    }
  }

  restartQuiz(): void {
    this.qIndex = 0;
    this.score = 0;
    this.answered = false;
    this.loadQuestion();
  }
}