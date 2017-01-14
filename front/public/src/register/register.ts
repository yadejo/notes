/// <reference path="../../../typings/index.d.ts" />

// import {Registration} from '../models/Registration';

module app.register {

    'use strict';

    export interface IRegisterCtrl {}

    export interface IRegisterScope extends ng.IScope{
        register(registration: any):void;
        registration: any;
        canRegister:boolean;
        validMail:boolean;
        showMailValidation: boolean;
    }

    export class RegisterCtrl implements IRegisterCtrl {
        static $inject = ["$scope", "authService"];
        constructor(
            public $scope: IRegisterScope,
            public authService: any
        ){            
            $scope.register = (registration: any) =>{
                authService.register(registration);
            }

            $scope.$watch('registration.Password', ()=>{
               this.validate();
            });

            $scope.$watch('registration.ConfirmPassword', ()=>{
                this.validate();
            })

        }

        executeValidateEmail = () =>{
            var email: string = this.$scope.registration.Email;
            
            this.$scope.validMail = this.validateEmail(email);

            this.$scope.showMailValidation = !this.$scope.validMail;
        }

        validate = () =>{
            if(!this.$scope.registration) return false;

            var pw: string = this.$scope.registration.Password;
            var pwC:string = this.$scope.registration.ConfirmPassword;
            var email: string = this.$scope.registration.Email;

            this.$scope.validMail = this.validateEmail(email);

            this.$scope.showMailValidation = !this.$scope.validMail;

            this.$scope.canRegister = ((pw === pwC) && (pw.length >= 6) && ( this.$scope.validMail));
        }

        validateEmail= (email):boolean => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
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
        });
}
