angular.module('payment', ['ngDialog'])
	.config(['ngDialogProvider', function (ngDialogProvider) {
		ngDialogProvider.setDefaults({
			className: 'ngdialog-theme-default',
			showClose: true,
			closeByDocument: false,
			closeByEscape: true
		});
}]);