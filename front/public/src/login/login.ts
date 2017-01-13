/// <reference path="../../../typings/index.d.ts" />

module app.login {

    'use strict';

    export interface ILoginCtrl {}

    export class LoginCtrl implements ILoginCtrl {
        static $inject = ["$scope", "authService"];
        constructor(
            public $scope: ng.IScope,
            public authService: any
        ){}
    }

    angular
        .module('app.login', [])
        .directive("login", function(): ng.IDirective {
            return {
                templateUrl: 'app-templates/login/login.html',
                controller:  LoginCtrl,
                controllerAs: 'loginVM'
            };
        })
        .controller("loginCtrl", LoginCtrl);
}
