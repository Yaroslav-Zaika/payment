angular.module('payment')
	.controller('mainCtrl', ['$scope', 'ngDialog', function ($scope, ngDialog) {

		$scope.openDialog = function () {
			ngDialog.openConfirm({
				template: 'templates/paymentDialog.html',
				controller: 'mainCtrl'
			});
		};
		
		$scope.continue = function (payment) {
			if (payment && payment.sum && payment.system && payment.system.value) {
				if (isFinite(payment.sum) && payment.sum > 0) {
					ngDialog.close('ngdialog1');
				}
			}
		};
	}]);