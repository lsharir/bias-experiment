var app = angular.module("resultsApp", ["firebase"])
  .controller('resultsCtrl', function ($scope, $timeout, $firebaseArray) {
    var ref = firebase.database().ref().child('results'),
      resultsDatabaseRef = $firebaseArray(ref);

    $scope.QUESTIONS = QUESTIONS;

    $scope.setQuestionIndex = function (index) {
      if ($scope.selectedQuestionIndex === index) {
        return;
      }

      $scope.selectedQuestionIndex = index;
      $scope.selectedQuestion = QUESTIONS[index];

      // Fetching recent results
      const relevantResults = $scope.results[$scope.selectedQuestionIndex]
      
      // Constructing empty pie chart data
      const pieChartData = {
        biased : $scope.selectedQuestion.biased.answers.map(answer => ({ label : answer, value : 0})),
        unbiased : $scope.selectedQuestion.unbiased.answers.map(answer => ({ label : answer, value : 0}))
      };

      // Increasing response values as required
      relevantResults.biased.forEach((answerIndex) => {
        pieChartData.biased[answerIndex].value++;
      });

      relevantResults.unbiased.forEach((answerIndex) => {
        pieChartData.unbiased[answerIndex].value++;
      });

      change(pieChartData.biased, pieChartData.unbiased);
    }


    resultsDatabaseRef.$watch(function () {
      const sortedResults = [];

      QUESTIONS.forEach(() => {
        sortedResults.push({
          biased : [],
          unbiased : []
        });
      })

      resultsDatabaseRef.forEach(function (entry) {
        entry.responses.forEach((response, qIndex) => {
          // When responses invalid, ignore them
          if (response[0] === -1) {
            return;
          }

          if (response[1]) {
            sortedResults[qIndex].biased.push(response[0])
          } else {
            sortedResults[qIndex].unbiased.push(response[0]);
          }
        });
      });

      $scope.results = sortedResults;
    });
  })
  ;