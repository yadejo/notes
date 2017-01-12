/// <reference path="../../../typings/index.d.ts" />

module app.login {

    'use strict';

    export interface ILoginCtrl {}

    export class LoginCtrl implements ILoginCtrl {
        static $inject = ["$scope", "loginService"];
        constructor(
            public $scope: ng.IScope,
            public loginService: LoginService
        ){}
    }

    export interface ILoginService {
        login(username: string, password: string): void;
    }
    export class LoginService implements ILoginService {
        public login = (username: string, password:string) =>{
            console.log(username + " " + password);
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
        .controller("loginCtrl", LoginCtrl)
        .factory("loginService", [() => new app.login.LoginService()]);
}
