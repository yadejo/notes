/// <reference path="../../../typings/index.d.ts" />


module app.intercept{
    export class AuthInterceptorService{

        constructor(public $q: ng.IQService, public localStorageService: any){

        }

        public request = (config:any) =>{
            config.headers = config.headers || {};

            var authData = this.localStorageService.get('authorizationData');

            if(authData){
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        }

        public responseError = (rejection: any) =>{
            if(rejection.status===401){
                var authData = this.localStorageService.get('authorizationData');
               console.log('nope');
               if(authData){
                   
               }
               
            }
            return this.$q.reject(rejection);
    }


        static factory(){
            var instance = ($q: ng.IQService, localStorageService: any) => new AuthInterceptorService($q, localStorageService);

            return instance;
        }
    }


    angular
        .module('app.intercept', ['LocalStorageModule'])
        .factory("authInterceptorService", AuthInterceptorService.factory());
}