document.addEventListener("DOMContentLoaded", function() {
  const welcomeScreen = document.getElementById("welcome-screen");
  const startButton = document.getElementById("start-button");
  const surveyScreen = document.getElementById("survey-screen");
  const questionNumber = document.getElementById("question-number");
  const question = document.getElementById("question");
  const ratings = document.getElementsByName("rating");
  const previousButton = document.getElementById("previous-button");
  const nextButton = document.getElementById("next-button");
  const skipButton = document.getElementById("skip-button");
  const feedback = document.getElementById("feedback");
  const submitButton = document.getElementById("submit-button");
  const thankyouScreen = document.getElementById("thankyou-screen");

  let currentQuestionIndex = 0;
  let answers = [];

  const questions = [
    {
      question: "How satisfied are you with our products?",
      type: "rating",
      min: 1,
      max: 5
    },
    {
      question: "How fair are the prices compared to similar retailers?",
      type: "rating",
      min: 1,
      max: 5
    },
    {
      question: "How satisfied are you with the value for money of your purchase?",
      type: "rating",
      min: 1,
      max: 5
    },
    {
      question: "On a scale of 1-10, how likely are you to recommend us to your friends and family?",
      type: "rating",
      min: 1,
      max: 10
    },
    {
      question: "What could we do to improve our service?",
      type: "text"
    }
  ];

  startButton.addEventListener("click", function() {
    welcomeScreen.style.display = "none";
    surveyScreen.style.display = "block";
    showQuestion(currentQuestionIndex);
  });

  previousButton.addEventListener("click", function() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
    }
  });

  nextButton.addEventListener("click", function() {
    if (validateAnswer()) {
      saveAnswer();
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
      } else {
        showConfirmationDialog();
      }
    }
  });

  skipButton.addEventListener("click", function() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
    }
  });

  submitButton.addEventListener("click", function() {
    submitSurvey();
  });

  function showQuestion(index) {
    const currentQuestion = questions[index];
    questionNumber.textContent = `${index + 1}/${questions.length}`;
    question.textContent = currentQuestion.question;
    feedback.style.display = currentQuestion.type === "text" ? "block" : "none";

    if (currentQuestion.type === "rating") {
      ratings.forEach(function(rating) {
        rating.checked = false;
        rating.disabled = false;
        rating.addEventListener("click", function() {
          skipButton.disabled = true;
          nextButton.disabled = false;
        });
      });
    }

    if (answers[index]) {
      if (currentQuestion.type === "rating") {
        const selectedRating = answers[index];
        ratings[selectedRating - 1].checked = true;
        nextButton.disabled = false;
      } else {
        feedback.value = answers[index];
        nextButton.disabled = false;
      }
    } else {
      if (currentQuestion.type === "rating") {
        nextButton.disabled = true;
        skipButton.disabled = false;
      } else {
        nextButton.disabled = true;
      }
    }

    if (index === 0) {
      previousButton.disabled = true;
    } else {
      previousButton.disabled = false;
    }
  }

  function validateAnswer() {
    if (questions[currentQuestionIndex].type === "rating") {
      const selectedRating = Array.from(ratings).find(rating => rating.checked);
      if (selectedRating) {
        return true;
      } else {
        alert("Please select a rating");
        return false;
      }
    } else {
      return true;
    }
  }

  function saveAnswer() {
    if (questions[currentQuestionIndex].type === "rating") {
      const selectedRating = Array.from(ratings).findIndex(rating => rating.checked);
      answers[currentQuestionIndex] = selectedRating + 1;
    } else {
      answers[currentQuestionIndex] = feedback.value;
    }
  }

  function showConfirmationDialog() {
    const confirmation = confirm("Are you sure you want to submit the survey?");
    if (confirmation) {
      submitSurvey();
    }
  }

  function submitSurvey() {
    // Save answers to the database or local storage
    // Set flag as 'COMPLETED'

    surveyScreen.style.display = "none";
    thankyouScreen.style.display = "block";

    setTimeout(function() {
      thankyouScreen.style.display = "none";
      welcomeScreen.style.display = "block";
      currentQuestionIndex = 0;
      answers = [];
    }, 5000);
  }
});
