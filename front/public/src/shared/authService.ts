/// <reference path="../../../typings/index.d.ts" />


module app.shared{

    export interface IAuthService{
        isLoggedIn(): boolean;
        login(username: string, password: string): ng.IPromise<{}>;
        logout(): void;
    }

    export class AuthService implements IAuthService{
        private serviceBase: string = "http://localhost:56361/"
        loggedIn: boolean = false;
    

        static $inject = ["$http", "$q", "localStorageService"];

        constructor(public $http: ng.IHttpService, public $q: ng.IQService, 
            public localStorageService: any, public toastr: any){

        }

        isLoggedIn = () =>{
            return this.loggedIn;
        }   

        login = (username: string, password: string) => {
            var data = "grant_type=password&username="+username+"&password=" + password;

            var deferred = this.$q.defer();
            
            this.$http.post(this.serviceBase + 'token', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                .success((response:any): void =>{
                    //hier
                    this.loggedIn = true;
                    this.localStorageService.set('authorizationData', {token: response.access_token})

                    deferred.resolve(response);
                }).error((response:any) : void=>{
                    if(!response){
                        this.toastr.error("Server must be down...", "Error");
                    }
                    console.log(response);
                    this.logout();
                });
             
             return deferred.promise;
        }

        logout = () =>{
            this.localStorageService.remove('authorizationData');

            this.loggedIn = false;
        }

        static factory(){
            var instance = ($http: ng.IHttpService, $q: ng.IQService, localStorageService: any, toastr: any) => new AuthService($http, $q, localStorageService, toastr);

            return instance;
        }
             
    }

angular
        .module('app.shared', ['LocalStorageModule', 'toastr'])
        .factory("authService", AuthService.factory());
}