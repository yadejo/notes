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
]).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("notes", {
        url: "/notes",
        template: '<notes></notes>',
        authenticate: true
    })
        .state("login", {
        url: "/login",
        template: '<login></login>',
        authenticate: false
    })
        .state("register", {
        url: "/register",
        template: '<register></register>',
        authenticate: false
    });
    $urlRouterProvider.otherwise("/login");
}).run(function ($rootScope, $state, authService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !authService.isLoggedIn()) {
            $state.transitionTo("login");
            event.preventDefault();
        }
    });
});
/// <reference path="../../../typings/index.d.ts" />
var app;
(function (app) {
    var login;
    (function (login) {
        'use strict';
        var LoginCtrl = (function () {
            function LoginCtrl($scope, authService) {
                this.$scope = $scope;
                this.authService = authService;
            }
            LoginCtrl.$inject = ["$scope", "authService"];
            return LoginCtrl;
        }());
        login.LoginCtrl = LoginCtrl;
        angular
            .module('app.login', [])
            .directive("login", function () {
            return {
                templateUrl: 'app-templates/login/login.html',
                controller: LoginCtrl,
                controllerAs: 'loginVM'
            };
        })
            .controller("loginCtrl", LoginCtrl);
    })(login = app.login || (app.login = {}));
})(app || (app = {}));
/// <reference path="../../../typings/index.d.ts" />
var app;
(function (app) {
    var notes;
    (function (notes_1) {
        var NotesCtrl = (function () {
            function NotesCtrl($scope, notesService, $http) {
                var _this = this;
                this.$scope = $scope;
                this.notesService = notesService;
                this.$http = $http;
                this.onCheck = function (note, noteContainer) {
                    setTimeout(function () {
                        if (note.isComplete) {
                            _this.$scope.$apply(function () {
                                noteContainer.notes = noteContainer.notes.filter(function (n) { return n.id != note.id; });
                            });
                        }
                    }, 3000);
                };
                this.addNote = function (noteContainer) {
                    if (noteContainer.newNote.content) {
                        noteContainer.notes.push(noteContainer.newNote);
                        noteContainer.newNote = new Note(noteContainer.notes.length, "");
                    }
                };
                this.addContainer = function () {
                    if (_this.$scope.newContainerName) {
                        var container = new NoteContainer(_this.$scope.notes.length, _this.$scope.newContainerName);
                        _this.$scope.notes.push(container);
                        _this.$scope.newContainerName = "";
                    }
                };
                this.removeContainer = function (noteContainer) {
                    if (noteContainer.notes.length != 0) {
                        if (confirm("Do you really want to delete this container")) {
                            _this.$scope.notes = _this.$scope.notes.filter(function (n) { return n.id != noteContainer.id; });
                        }
                    }
                    else {
                        _this.$scope.notes = _this.$scope.notes.filter(function (n) { return n.id != noteContainer.id; });
                    }
                };
                //var notes = notesService.loadNotes();
                var notes = new Array();
                $scope.notes = notes;
            }
            NotesCtrl.$inject = ["$scope", "notesService", "$http"];
            return NotesCtrl;
        }());
        notes_1.NotesCtrl = NotesCtrl;
        var NotesService = (function () {
            function NotesService() {
            }
            return NotesService;
        }());
        notes_1.NotesService = NotesService;
        var NoteContainer = (function () {
            function NoteContainer(id, name) {
                this.id = id;
                this.name = name;
                this.newNote = new Note(0, "");
                this.notes = new Array();
            }
            return NoteContainer;
        }());
        var Note = (function () {
            function Note(id, content, isComplete) {
                if (isComplete === void 0) { isComplete = false; }
                this.id = id;
                this.content = content;
                this.isComplete = isComplete;
            }
            return Note;
        }());
        angular
            .module('app.notes', [])
            .directive("notes", function () {
            return {
                templateUrl: 'app-templates/notes/notes.html',
                controller: NotesCtrl,
                controllerAs: 'notesVM'
            };
        })
            .controller("notesCtrl", NotesCtrl)
            .factory("notesService", [function () { return new app.notes.NotesService(); }]);
    })(notes = app.notes || (app.notes = {}));
})(app || (app = {}));
/// <reference path="../../../typings/index.d.ts" />
var app;
(function (app) {
    var register;
    (function (register) {
        'use strict';
        var RegisterCtrl = (function () {
            function RegisterCtrl($scope, registerService) {
                this.$scope = $scope;
                this.registerService = registerService;
            }
            RegisterCtrl.$inject = ["$scope", "registerService"];
            return RegisterCtrl;
        }());
        register.RegisterCtrl = RegisterCtrl;
        var RegisterService = (function () {
            function RegisterService() {
                this.register = function (username, password) {
                    console.log(username + " " + password);
                };
            }
            return RegisterService;
        }());
        register.RegisterService = RegisterService;
        angular
            .module('app.register', [])
            .directive("register", function () {
            return {
                templateUrl: 'app-templates/register/register.html',
                controller: RegisterCtrl,
                controllerAs: 'registerVM'
            };
        })
            .controller("registerCtrl", RegisterCtrl)
            .factory("registerService", [function () { return new app.register.RegisterService(); }]);
    })(register = app.register || (app.register = {}));
})(app || (app = {}));
/// <reference path="../../../typings/index.d.ts" />
var app;
(function (app) {
    var shared;
    (function (shared) {
        var AuthService = (function () {
            function AuthService($http, $q, localStorageService, toastr) {
                var _this = this;
                this.$http = $http;
                this.$q = $q;
                this.localStorageService = localStorageService;
                this.toastr = toastr;
                this.serviceBase = "http://localhost:56361/";
                this.loggedIn = false;
                this.isLoggedIn = function () {
                    return _this.loggedIn;
                };
                this.login = function (username, password) {
                    var data = "grant_type=password&username=" + username + "&password=" + password;
                    var deferred = _this.$q.defer();
                    _this.$http.post(_this.serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                        .success(function (response) {
                        //hier
                        _this.loggedIn = true;
                        _this.localStorageService.set('authorizationData', { token: response.access_token });
                        deferred.resolve(response);
                    }).error(function (response) {
                        if (!response) {
                            _this.toastr.error("Server must be down...", "Error");
                        }
                        console.log(response);
                        _this.logout();
                    });
                    return deferred.promise;
                };
                this.logout = function () {
                    _this.localStorageService.remove('authorizationData');
                    _this.loggedIn = false;
                };
            }
            AuthService.factory = function () {
                var instance = function ($http, $q, localStorageService, toastr) { return new AuthService($http, $q, localStorageService, toastr); };
                return instance;
            };
            AuthService.$inject = ["$http", "$q", "localStorageService"];
            return AuthService;
        }());
        shared.AuthService = AuthService;
        angular
            .module('app.shared', ['LocalStorageModule', 'toastr'])
            .factory("authService", AuthService.factory());
    })(shared = app.shared || (app.shared = {}));
})(app || (app = {}));
angular.module("app.templates", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("app-templates/login/login.html", "<div id=\"login-inject\">\r\n\r\n	<h2>Login</h2>\r\n\r\n	<form id=\"login-form\" name=\"loginForm\">\r\n		<div class=\"form-group\">\r\n			<label for=\"username\">Username:</label>\r\n			<input type=\"text\" class=\"form-control\" id=\"username\" ng-model=\"username\" required>\r\n		</div>\r\n		<div class=\"form-group\">\r\n			<label for=\"password\">Password:</label>\r\n			<input type=\"password\" class=\"form-control\" id=\"password\" ng-model=\"password\" required>\r\n		</div>\r\n\r\n		<button type=\"button\" class=\"btn btn-default\" ng-click=\"loginVM.authService.login(username, password)\" ng-disabled=\"loginForm.$invalid\">Login</button> <span>or <a ui-sref=\"register\">register</a></span>\r\n	</form>\r\n\r\n</div>");
        $templateCache.put("app-templates/notes/notes.html", "<div class=\"new-note-container\">\r\n    <form class=\"form-inline\" ng-submit=\"notesVM.addContainer()\">\r\n        <div class=\"form-group\">\r\n            <label for=\"new-container\">New container: </label>\r\n            <input type=\"text\" class=\"form-control\" id=\"new-container\" ng-model=\"newContainerName\">\r\n        </div>\r\n\r\n        <button type=\"submit\" class=\"btn btn-default\">+</button>\r\n    </form>\r\n</div>\r\n\r\n<div class=\"note-wrapper\">\r\n\r\n        <div class=\"note-container\" ng-repeat=\"notecontainer in notes\">\r\n            <div class=\"note-container-name\"><span>{{notecontainer.name}} </span> <span title=\"Remove container\" ng-click=\"notesVM.removeContainer(notecontainer)\" class=\"glyphicon glyphicon-trash remove-container-icon\"></span></div>\r\n            \r\n            <div class=\"note\" ng-repeat=\"note in notecontainer.notes\">\r\n                <label class=\"note-name\" ng-class=\"{\'note-completed\': note.isComplete}\"><input type=\"checkbox\" ng-model=\"note.isComplete\" ng-change=\"notesVM.onCheck(note, notecontainer)\"> {{note.content}}</label>\r\n               \r\n            </div>\r\n\r\n             <form class=\"form-inline note-add-container\" ng-submit=\"notesVM.addNote(notecontainer)\">\r\n                 <div class=\"form-group\">\r\n                     <input class=\"form-control\" type=\"text\" ng-model=\"notecontainer.newNote.content\">\r\n                     <button class=\"btn btn-default\" type=\"submit\">+</button>\r\n                 </div>\r\n             </form>\r\n        </div>\r\n\r\n</div>");
        $templateCache.put("app-templates/register/register.html", "<div id=\"register-inject\">\r\n\r\n	<h2>Register</h2>\r\n<form id=\"register-form\" name=\"registerForm\">\r\n		<div class=\"form-group\">\r\n			<label for=\"name\">Name:</label>\r\n			<input type=\"text\" class=\"form-control\" id=\"name\" ng-model=\"name\" required>\r\n		</div>\r\n        <div class=\"form-group\">\r\n			<label for=\"email\">Email:</label>\r\n			<input type=\"email\" class=\"form-control\" id=\"email\" ng-model=\"email\" required>\r\n		</div>\r\n		<div class=\"form-group\">\r\n			<label for=\"password\">Password:</label>\r\n			<input type=\"password\" class=\"form-control\" id=\"password\" ng-model=\"password\" required>\r\n		</div>\r\n\r\n        <div class=\"form-group\">\r\n			<label for=\"confirm-password\">Confirm password:</label>\r\n			<input type=\"password\" class=\"form-control\" id=\"confirm-password\" ng-model=\"confirmPassword\" required>\r\n		</div>\r\n\r\n		<button type=\"button\" class=\"btn btn-default\" ng-click=\"registerVM.registerService.register(maakditnog)\" ng-disabled=\"registerForm.$invalid\">Register</button> <span>or back to <a ui-sref=\"login\">login</a></span>\r\n	</form>\r\n\r\n</div>");
    }]);
