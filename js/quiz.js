(function(){
	var app = angular.module('myQuiz', []);
	app.controller('QuizController',
		['$scope', '$http', '$sce', function($scope, $http, $sce) {
			$scope.score = 0;
			$scope.activeQuestion = -1;
			$scope.activeQuestionAnswered = 0;
			$scope.percentage = 0;

			$http.get('quiz_data.json').then(function(data) {
				$scope.questions = data.data;
				$scope.numQuestions = data.data.length;
			});

			$scope.selectAnswer = function(questionIndex, answerIndex) {
				var question = $scope.questions[questionIndex];
				var questionState = $scope.questions[questionIndex].questionState;

				if (questionState !== 'answered') {
					$scope.questions[questionIndex].selectedAnswer = answerIndex;
					var correctAnswer = question.correct;

					if(answerIndex === correctAnswer) {
					  $scope.questions[questionIndex].isCorrect = 'correct';
						$scope.score += 1;
					} else {
						$scope.questions[questionIndex].isCorrect = 'incorrect';
					}
					console.log("select answer", questionIndex, answerIndex);
					$scope.questions[questionIndex].questionState = 'answered';
				}

				$scope.percentage = (100 * $scope.score) / $scope.numQuestions
				console.log($scope.percentage);
			};

			$scope.isSelected = function(questionIndex, answerIndex) {
				return $scope.questions[questionIndex].selectedAnswer === answerIndex;
			};

			$scope.isCorrect = function(questionIndex, answerIndex) {
				return $scope.questions[questionIndex].questionState == 'answered' && $scope.questions[questionIndex].correct === answerIndex;
			};

			$scope.btnContinue = function() {
				return ++$scope.activeQuestion;
			};

			$scope.createShareLinks = function(percentage) {
				var url = 'http://example.com';
				var emailLink = '<a class="btn email" href="mailto:?subject=Try to beat my score&amp;body=I scored ' + percentage + '%25 on this quiz. Can you do better?">Email to a friend</a>';
				var twitterLink = '<a class="btn twitter" target="blank" href="http://twitter.com/share?text=I scored ' + percentage + '%25 on this quiz. Can you do better?&amp;hashtags=quiz&amp;url=' + url + '">Tweet your score</a>';
				var elements = emailLink + twitterLink;

				return $sce.trustAsHtml(elements);
			};
		}]);
})();
