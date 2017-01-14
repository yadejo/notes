/// <reference path="../../../typings/index.d.ts" />

module app.login {

    'use strict';

    export interface ILoginCtrl {}

    export interface ILoginScope extends ng.IScope{
        username: string;
    }

    export class LoginCtrl implements ILoginCtrl {
        static $inject = ["$scope", "authService", "$state"];
        constructor(
            public $scope: ILoginScope,
            public authService: any,
            public $state: any
        ){
            var email: string = $state.params.email;

            if(email){
                $scope.username = email;
            }


        }
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
