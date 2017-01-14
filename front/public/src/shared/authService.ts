/// <reference path="../../../typings/index.d.ts" />


module app.shared{

    export interface IAuthService{
        isLoggedIn(): boolean;
        login(username: string, password: string): ng.IPromise<{}>;
        logout(): void;
        register(registration: any): any;
    }

    export class AuthService implements IAuthService{
        private serviceBase: string = "https://notes.zawada.be/"
        loggedIn: boolean = false;
    
 
        static $inject = ["$http", "$q", "localStorageService", "toastr", "$state"];

        constructor(public $http: ng.IHttpService, public $q: ng.IQService, 
            public localStorageService: any, public toastr: any, public $state:any){

        }

        isLoggedIn = () =>{
           var authData = this.localStorageService.get('authorizationData');

            if(authData)
                return true;
            else
                return false;
        }

        userName = () =>{
            var authData = this.localStorageService.get('authorizationData');
            
            if(authData){
                var email: string = authData.username;
                return email.substring(0, email.indexOf("@"));
            }
        }   

        login = (username: string, password: string) => {
            var data = "grant_type=password&username="+username+"&password=" + password;

            var deferred = this.$q.defer();
            
            this.$http.post(this.serviceBase + 'token', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                .success((response:any): void =>{
               
                    this.loggedIn = true;
                    this.localStorageService.set('authorizationData', {token: response.access_token, username: username})

                    this.$state.go("notes");
                    deferred.resolve(response);
                }).error((response:any) : void=>{
                    if(!response){
                        this.toastr.error("Server must be down...", "Error");
                    }
                    else{
                        this.toastr.error(response.error_description, "Error");
                    }
                    console.log(response);
                    this.logout();
                });
             
             return deferred.promise;
        }

        register = (registration: any) => {
            this.logout();
            this.$http.post(this.serviceBase + "api/account/register", registration, {headers: {'Content-Type': 'application/json'}}).success((response:any) : void=>{
                this.toastr.success("Redirecting you to login...", "Registration successful");
                setTimeout(()=>{
                    this.$state.go("login", {email: registration.Email});
                }, 3000)
            }).error((response:any):void=>{
                var modelState = response.ModelState;
                var errorArr = modelState[Object.keys(modelState)[0]];
                this.toastr.error(errorArr[1], "Error");
            });
        }

        logout = () =>{
            this.localStorageService.remove('authorizationData');

            this.loggedIn = false;
        }

        static factory(){
            var instance = ($http: ng.IHttpService, $q: ng.IQService, localStorageService: any, toastr: any, $state:any) => new AuthService($http, $q, localStorageService, toastr, $state);

            return instance;
        }
             
    }

angular
        .module('app.shared', ['LocalStorageModule', 'toastr'])
        .factory("authService", AuthService.factory());
}