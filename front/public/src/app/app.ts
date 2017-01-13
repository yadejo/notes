/// <reference path="../../../typings/index.d.ts" />

angular.module('notesApp', [
    'app.login',
    'app.register',
    'app.templates',
    'app.notes',
    'ui.router',
    'app.shared',
    'angular-loading-bar',
    'ngAnimate'
]).config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state("notes", {
            url: "/notes",
            template: '<notes></notes>',
            authenticate:true
        })
        .state("login", {
            url: "/login",
            template: '<login></login>',
            authenticate:false
        })
        .state("register", {
            url:"/register",
            template: '<register></register>',
            authenticate:false
        });

        $urlRouterProvider.otherwise("/login");

}).run(function($rootScope, $state, authService){
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        
            if(toState.authenticate && !authService.isLoggedIn()){
                $state.transitionTo("login");
                event.preventDefault();
            }      

    });
});