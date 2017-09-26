var app = angular.module("experimentApp", ["firebase"])
  .constant('PHASES', {
    'SHOW_QUESTION_ONLY': 'SHOW_QUESTION_ONLY',
    'SHOW_QUESTION_FULL': 'SHOW_QUESTION_FULL',
    'TIMEOUT': 'TIMEOUT',
    'ANSWERED': 'ANSWERED'
  })
  .constant('QUESTIONS', QUESTIONS)
  .controller('experimentCtrl', function ($scope, $timeout, $firebaseArray, PHASES, QUESTIONS) {
    var ref = firebase.database().ref().child('results'),
      resultsDatabaseRef = $firebaseArray(ref),
      startTime,
      questionTimeout,
      responses = [];

    $scope.QUESTIONS = QUESTIONS;
    $scope.began = false;

    // Starts the questionnaire
    $scope.beginQuestionnaire = function() {
      $scope.began = true;
      startTime = Date.now();
      nextQuestion();
    };

    function nextQuestion() {
      // Setting the bias
      $scope.bias = Math.random() > 0.5;

      // Question navigation logic
      if (isNaN($scope.currentQuestionIndex)) {
        $scope.currentQuestionIndex = 0;
      } else {
        if ($scope.currentQuestionIndex >= QUESTIONS.length - 1) {
          return completed();
        }

        $scope.currentQuestionIndex++;
      }

      // Setting the current question
      $scope.currentQuestion = $scope.bias ? QUESTIONS[$scope.currentQuestionIndex].biased : QUESTIONS[$scope.currentQuestionIndex].unbiased;

      // Start with instruction phase
      $scope.questionPhase = PHASES.SHOW_QUESTION_ONLY;

      // Go to task phase after 5 seconds
      $timeout(function () {
        // Actually call the task
        var question = QUESTIONS[$scope.currentQuestionIndex]

        // Updated the question phase
        $scope.questionPhase = PHASES.SHOW_QUESTION_FULL;

        // Task phase timeout
        questionTimeout = $timeout(function () {
          $scope.questionPhase = PHASES.TIMEOUT;
          $scope.answerQuestion(-1);
        }, 15 * 1000);
      }, 5 * 1000);
    }

    $scope.answerQuestion = function(qIndex) {
      // Update question phase
      $scope.questionPhase = PHASES.ANSWERED;
      // Cancel task timeout
      $timeout.cancel(questionTimeout);
      // Record response
      responses.push([qIndex, $scope.bias]);
      // Call nextQuestion (wrapped in $apply - answerQuestion is called outside angular)
      nextQuestion();
    }

    function completed() {
      $scope.totalTime = Date.now() - startTime;
      $scope.completed = true;

      resultsDatabaseRef.$add({
        responses: responses,
        duration: $scope.totalTime
      });
    }
  })
  ;
