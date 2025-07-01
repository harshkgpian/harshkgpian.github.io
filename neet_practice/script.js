const questions = [
  {
    "question": "An attribute found in plants but not animals is",
    "options": [
      "Metabolism",
      "Sexual reproduction",
      "Autotrophy",
      "Asexual reproduction"
    ],
    "correct_option": 2,
    "explanation": "Autotrophy is the ability to synthesize food from inorganic substances using light (photosynthesis), which is unique to plants and some bacteria, not animals.",
    "source": "NEETPrep[1][5]"
  },
  {
    "question": "Which of the following is less general in characters as compared to genus?",
    "options": [
      "Species",
      "Family",
      "Class",
      "Division"
    ],
    "correct_option": 0,
    "explanation": "Species is the lowest and most specific taxonomic category among the options. Genus is more general than species but less general than family, class, or division.",
    "source": "NEETPrep[1][5]"
  },
  {
    "question": "Consider the following two statements:\nI. In the single-celled organisms, we are not very clear about the usage of the two terms – growth and reproduction.\nII. When it comes to unicellular organisms like bacteria, unicellular algae or amoeba, reproduction is synonymous with growth, i.e., increase in number of cells.\nWhich of the following is correct?",
    "options": [
      "Both I and II are true and II explains I",
      "Both I and II are true but II does not explain I",
      "I is true but II is false",
      "Both I and II are false"
    ],
    "correct_option": 0,
    "explanation": "In single-celled organisms, growth and reproduction are often used interchangeably since the increase in number of cells is a direct result of reproduction.",
    "source": "NEETPrep[1][5]"
  },
  {
    "question": "A transcription unit in DNA is defined primarily by the three regions in DNA and these are with respect to upstream and downstream end. Which option is correct?",
    "options": [
      "Structural gene, Transposons, Operator gene",
      "Inductor, Repressor, Structural gene",
      "Promoter, Structural gene, Terminator",
      "Repressor, Operator gene, Structural gene"
    ],
    "correct_option": 2,
    "explanation": "A transcription unit consists of a promoter (upstream), structural gene, and terminator (downstream). The promoter and terminator flank the structural gene.",
    "source": "NEET 2024 Question Paper[2]"
  },
  {
    "question": "Which plant group is known for having a vascular system?",
    "options": [
      "Bryophytes",
      "Algae",
      "Pteridophytes",
      "Fungi"
    ],
    "correct_option": 2,
    "explanation": "Pteridophytes are the first plant group to have a well-developed vascular system (xylem and phloem).",
    "source": "Infinity Learn[6]"
  },
  {
    "question": "Match the stamens with the correct example:\nA. Monoadelphous\nB. Diadelphous\nC. Polyadelphous\nD. Epiphyllous",
    "options": [
      "A-I, B-II, C-IV, D-III",
      "A-IV, B-II, C-I, D-III",
      "A-III, B-I, C-IV, D-II",
      "A-IV, B-I, C-II, D-III"
    ],
    "correct_option": 1,
    "explanation": "Monoadelphous: China-rose; Diadelphous: Pea; Polyadelphous: Citrus; Epiphyllous: Lily.",
    "source": "NEET 2024 Question Paper[2]"
  },
  {
    "question": "Which of the following taxonomic categories are correctly matched to their standard termination of names with respect to biological classification of plants?",
    "options": [
      "Division: -phyta, Class: -opsida, Family: -idae",
      "Division: -phyta, Class: -opsida, Order: -ales",
      "Class: -opsida, Order: -ales, Family: -idae",
      "Division: -phyta, Class: -opsida, Order: -ales, Family: -idae"
    ],
    "correct_option": 1,
    "explanation": "Correct terminations: Division: -phyta, Class: -opsida, Order: -ales. Family in plants typically ends with -aceae, not -idae.",
    "source": "NEETPrep[1][5]"
  }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results-container');
const scoreContainer = document.getElementById('score-container');
const reviewContainer = document.getElementById('review-container');
const explanationContainer = document.getElementById('explanation-container');
const explanationText = document.getElementById('explanation-text');
const sourceText = document.getElementById('source-text');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showResults();
    return;
  }
  const question = questions[currentQuestionIndex];
  questionEl.textContent = question.question;

  optionsContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.classList.add('option');
    optionEl.textContent = option;
    optionEl.dataset.index = index;
    optionEl.addEventListener('click', () => selectOption(optionEl));
    optionsContainer.appendChild(optionEl);
  });

  nextBtn.style.display = 'none';
  explanationContainer.style.display = 'none';
}

function selectOption(optionEl) {
  const options = document.querySelectorAll('.option');
  options.forEach(opt => opt.classList.remove('selected'));
  optionEl.classList.add('selected');
  nextBtn.style.display = 'block';
}

function showExplanation(selectedOptionIndex) {
  const question = questions[currentQuestionIndex];
  const isCorrect = selectedOptionIndex === question.correct_option;

  explanationText.textContent = question.explanation;
  sourceText.textContent = `Source: ${question.source}`;
  explanationContainer.style.display = 'block';

  const options = document.querySelectorAll('.option');
  options.forEach((opt, idx) => {
    if (idx === question.correct_option) opt.classList.add('correct');
    if (idx === selectedOptionIndex && !isCorrect) opt.classList.add('incorrect');
  });
}

function showResults() {
  questionEl.style.display = 'none';
  optionsContainer.style.display = 'none';
  nextBtn.style.display = 'none';
  resultsContainer.style.display = 'block';
  explanationContainer.style.display = 'none';

  scoreContainer.innerHTML = `You scored ${score} out of ${questions.length}!`;
  reviewContainer.innerHTML = '';

  questions.forEach((q, idx) => {
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');
    reviewItem.innerHTML = `
      <h4>${idx + 1}. ${q.question}</h4>
      <p><strong>Your answer:</strong> ${q.options[userAnswers[idx]] || "Not answered"}</p>
      <p><strong>Correct answer:</strong> ${q.options[q.correct_option]}</p>
      <p><strong>Explanation:</strong> ${q.explanation}</p>
      <p><em>Source: ${q.source}</em></p>
    `;
    reviewContainer.appendChild(reviewItem);
  });
}

nextBtn.addEventListener('click', () => {
  const selectedOption = document.querySelector('.option.selected');
  if (!selectedOption) {
    alert('Please select an option!');
    return;
  }
  const selectedOptionIndex = parseInt(selectedOption.dataset.index);
  userAnswers[currentQuestionIndex] = selectedOptionIndex;

  if (selectedOptionIndex === questions[currentQuestionIndex].correct_option) {
    score++;
  }

  showExplanation(selectedOptionIndex);
  nextBtn.style.display = 'none';
});

continueBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  showQuestion();
});

restartBtn.addEventListener('click', () => {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  questionEl.style.display = 'block';
  optionsContainer.style.display = 'block';
  nextBtn.style.display = 'block';
  resultsContainer.style.display = 'none';
  showQuestion();
});

// Start the quiz
showQuestion();
