/// <reference path="../../../typings/index.d.ts" />

var myApp = angular.module('notesApp', [
    'app.login',
    'app.register',
    'app.templates',
    'app.notes',
    'app.intercept',
    'ui.router',
    'app.shared',
    'angular-loading-bar',
    'ngAnimate'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider, toastrConfig){
    $stateProvider
        .state("notes", {
            url: "/notes",
            template: '<notes></notes>',
            authenticate:true
        })
        .state("login", {
            url: "/login",
            template: '<login></login>',
            authenticate:false,
            params:{
                email:""
            }
        })
        .state("register", {
            url:"/register",
            template: '<register></register>',
            authenticate:false
        });

        $urlRouterProvider.otherwise("/login");
        $httpProvider.interceptors.push("authInterceptorService");


        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right',
            progressBar: true,
            closeButton: true
        });
}).run(function($rootScope, $state, authService){
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

            if((toState.name ==="register" || toState.name === "login" )&& authService.isLoggedIn()){
                $state.transitionTo("notes");
                event.preventDefault();
            }
        
            if(toState.authenticate && !authService.isLoggedIn()){
                $state.transitionTo("login");
                event.preventDefault();
            }      

    });
});


 class MainCtrl  {
        static $inject = ["$scope", "authService"];
        constructor(
            public $scope: ng.IScope,
            public authService: any
        ){}

    }

     myApp
         .controller("mainCtrl", MainCtrl);