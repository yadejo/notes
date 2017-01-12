/// <reference path="../../../typings/index.d.ts" />

module app.register {

    'use strict';

    export interface IRegisterCtrl {}

    export class RegisterCtrl implements IRegisterCtrl {
        static $inject = ["$scope", "registerService"];
        constructor(
            public $scope: ng.IScope,
            public registerService: RegisterService
        ){}
    }

    export interface IRegisterService {
        register(username: string, password: string): void;
    }
    export class RegisterService implements IRegisterService {
        public register = (username: string, password:string) =>{
            console.log(username + " " + password);
        }
    }

    angular
        .module('app.register', [])
        .directive("register", function(): ng.IDirective {
            return {
                templateUrl: 'app-templates/register/register.html',
                controller:  RegisterCtrl,
                controllerAs: 'registerVM'
            };
        })
        .controller("registerCtrl", RegisterCtrl)
        .factory("registerService", [() => new app.register.RegisterService()]);
}
