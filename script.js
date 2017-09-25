var app = angular.module("experimentApp", ["firebase"])
  .constant('PHASES', {
    'SHOW_QUESTION_ONLY': 'SHOW_QUESTION_ONLY',
    'SHOW_QUESTION_FULL': 'SHOW_QUESTION_FULL',
    'TIMEOUT': 'TIMEOUT',
    'ANSWERED': 'ANSWERED'
  })
  .constant('QUESTIONS', [
    { 
      unbiased: {
        text: 'What is more likely to kill you?'
      },
      biased: {
        text: 'What is more likely to kill you',
        image: 'images/availability_bias.jpg'
      },
      answers : [
         'Your dog', 'Your furniture'
      ] 
    },
    { 
      unbiased: {
        text: 'What is more likely to kill you?'
      },
      biased: {
        text: 'What is more likely to kill you',
        image: 'images/availability_bias.jpg'
      },
      answers : [
         'Your dog', 'Your furniture'
      ] 
    },
    { 
      unbiased: {
        text: 'What is more likely to kill you?'
      },
      biased: {
        text: 'What is more likely to kill you',
        image: 'images/availability_bias.jpg'
      },
      answers : [
         'Your dog', 'Your furniture'
      ] 
    }
  ])
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
      $scope.bias = Math.random() > 0.5;

      // Question navigation logic
      if (isNaN($scope.currentQuestion)) {
        $scope.currentQuestion = 0;
      } else {
        if ($scope.currentQuestion >= QUESTIONS.length - 1) {
          return completed();
        }

        $scope.currentQuestion++;
      }

      // Start with instruction phase
      $scope.questionPhase = PHASES.SHOW_QUESTION_ONLY;

      // Go to task phase after 5 seconds
      $timeout(function () {
        // Actually call the task
        var question = QUESTIONS[$scope.currentQuestion]

        // Updated the question phase
        $scope.questionPhase = PHASES.SHOW_QUESTION_FULL;

        // Task phase timeout
        questionTimeout = $timeout(function () {
          $scope.questionPhase = PHASES.TIMEOUT;
          $scope.answerQuestion(-1);
        }, 10 * 1000);
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
