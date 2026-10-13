
"use strict";

// Menu de navegação para celular
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menu");
  });
});

// Pesquisa e filtros dos materiais
const searchInput = document.getElementById("materialSearch");
const filterButtons = document.querySelectorAll(".filter");
const materialCards = document.querySelectorAll(".material-card");
const noResults = document.getElementById("noResults");

let currentFilter = "todos";

function filterMaterials() {
  const searchTerm = searchInput.value
    .trim()
    .toLocaleLowerCase("pt-BR");

  let visibleCount = 0;

  materialCards.forEach((card) => {
    const type = card.dataset.type;
    const searchableText = (
      card.dataset.search + " " + card.innerText
    ).toLocaleLowerCase("pt-BR");

    const matchesFilter =
      currentFilter === "todos" || type === currentFilter;

    const matchesSearch = searchableText.includes(searchTerm);
    const visible = matchesFilter && matchesSearch;

    card.hidden = !visible;

    if (visible) visibleCount++;
  });

  noResults.hidden = visibleCount > 0;
}

searchInput.addEventListener("input", filterMaterials);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    filterMaterials();
  });

  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );
});

// Checklist de sustentabilidade
const checklistItems = document.querySelectorAll(
  '#checklist input[type="checkbox"]'
);
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.getElementById("progressTrack");
const resetChecklist = document.getElementById("resetChecklist");

function updateProgress() {
  const completed = [...checklistItems].filter(
    (item) => item.checked
  ).length;

  const total = checklistItems.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressText.textContent =
    `${completed} de ${total} ações concluídas`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(percent));

  if (completed === total && total > 0) {
    progressText.textContent = "Parabéns! Você concluiu todas as ações!";
  }
}

checklistItems.forEach((item) => {
  item.addEventListener("change", updateProgress);
});

resetChecklist.addEventListener("click", () => {
  checklistItems.forEach((item) => {
    item.checked = false;
  });

  updateProgress();
});

updateProgress();

// Quiz educativo
const questions = [
  {
    question: "Onde devemos descartar pilhas usadas?",
    options: [
      "No lixo orgânico",
      "Em pontos de coleta específicos",
      "Junto com restos de comida",
      "No vaso sanitário"
    ],
    answer: 1,
    explanation:
      "Pilhas podem conter substâncias perigosas e devem ser levadas a pontos de coleta apropriados."
  },
  {
    question: "Qual é uma atitude correta antes de reciclar embalagens?",
    options: [
      "Encher a embalagem com água",
      "Misturar com restos de comida",
      "Retirar o excesso de resíduos",
      "Queimar a embalagem"
    ],
    answer: 2,
    explanation:
      "Retirar o excesso de resíduos ajuda a manter os recicláveis limpos. Não é necessário desperdiçar água."
  },
  {
    question: "Qual destes resíduos é orgânico?",
    options: [
      "Lata de alumínio",
      "Garrafa de vidro",
      "Pilha usada",
      "Casca de banana"
    ],
    answer: 3,
    explanation:
      "Cascas de frutas são resíduos orgânicos e podem ser destinadas à compostagem, quando disponível."
  },
  {
    question: "Qual é o principal benefício da coleta seletiva?",
    options: [
      "Aumentar o desperdício",
      "Reduzir o aproveitamento de materiais",
      "Facilitar a reciclagem e reduzir impactos ambientais",
      "Misturar todos os resíduos"
    ],
    answer: 2,
    explanation:
      "A coleta seletiva facilita a recuperação de materiais e contribui para a redução dos impactos ambientais."
  }
];

const quizCounter = document.getElementById("quizCounter");
const quizScore = document.getElementById("quizScore");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestion = document.getElementById("nextQuestion");
const restartQuiz = document.getElementById("restartQuiz");

let questionIndex = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const question = questions[questionIndex];

  answered = false;
  quizCounter.textContent =
    `Pergunta ${questionIndex + 1} de ${questions.length}`;
  quizScore.textContent = `Acertos: ${score}`;
  quizQuestion.textContent = question.question;
  quizOptions.replaceChildren();
  quizFeedback.textContent = "";
  nextQuestion.hidden = true;
  restartQuiz.hidden = true;

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;

    button.addEventListener("click", () => {
      answerQuestion(index);
    });

    quizOptions.appendChild(button);
  });
}

function answerQuestion(selectedIndex) {
  if (answered) return;

  answered = true;

  const question = questions[questionIndex];
  const buttons = quizOptions.querySelectorAll("button");

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.answer) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("wrong");
    }
  });

  if (selectedIndex === question.answer) {
    score++;
    quizFeedback.textContent = "✅ Resposta correta! " + question.explanation;
  } else {
    quizFeedback.textContent = "❌ Não foi dessa vez. " + question.explanation;
  }

  quizScore.textContent = `Acertos: ${score}`;

  if (questionIndex < questions.length - 1) {
    nextQuestion.hidden = false;
  } else {
    quizCounter.textContent = "Quiz concluído!";
    quizFeedback.textContent +=
      ` Resultado final: ${score} de ${questions.length} acertos.`;

    restartQuiz.hidden = false;
  }
}

nextQuestion.addEventListener("click", () => {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  }
});

restartQuiz.addEventListener("click", () => {
  questionIndex = 0;
  score = 0;
  renderQuestion();
});

renderQuestion();
