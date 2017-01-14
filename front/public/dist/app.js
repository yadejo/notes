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
]).config(function ($stateProvider, $urlRouterProvider, $httpProvider, toastrConfig) {
    $stateProvider
        .state("notes", {
        url: "/notes",
        template: '<notes></notes>',
        authenticate: true
    })
        .state("login", {
        url: "/login",
        template: '<login></login>',
        authenticate: false,
        params: {
            email: ""
        }
    })
        .state("register", {
        url: "/register",
        template: '<register></register>',
        authenticate: false
    });
    $urlRouterProvider.otherwise("/login");
    $httpProvider.interceptors.push("authInterceptorService");
    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right',
        progressBar: true,
        closeButton: true
    });
}).run(function ($rootScope, $state, authService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if ((toState.name === "register" || toState.name === "login") && authService.isLoggedIn()) {
            $state.transitionTo("notes");
            event.preventDefault();
        }
        if (toState.authenticate && !authService.isLoggedIn()) {
            $state.transitionTo("login");
            event.preventDefault();
        }
    });
});
var MainCtrl = (function () {
    function MainCtrl($scope, authService) {
        this.$scope = $scope;
        this.authService = authService;
    }
    MainCtrl.$inject = ["$scope", "authService"];
    return MainCtrl;
}());
myApp
    .controller("mainCtrl", MainCtrl);
/// <reference path="../../../typings/index.d.ts" />
var app;
(function (app) {
    var login;
    (function (login) {
        'use strict';
        var LoginCtrl = (function () {
            function LoginCtrl($scope, authService, $state) {
                this.$scope = $scope;
                this.authService = authService;
                this.$state = $state;
                var email = $state.params.email;
                if (email) {
                    $scope.username = email;
                }
            }
            LoginCtrl.$inject = ["$scope", "authService", "$state"];
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
                        if (note.IsComplete) {
                            _this.notesService.removeNote(noteContainer.ID, note.ID);
                            _this.$scope.$apply(function () {
                                noteContainer.Notes = noteContainer.Notes.filter(function (n) { return n.ID != note.ID; });
                            });
                        }
                    }, 3000);
                };
                this.addNote = function (noteContainer) {
                    if (!noteContainer.newNote)
                        return;
                    if (noteContainer.newNote.Content) {
                        _this.notesService.addNote(noteContainer.ID, noteContainer.newNote.Content).then(function (response) {
                            noteContainer.newNote.ID = response.data;
                            noteContainer.Notes.push(noteContainer.newNote);
                            noteContainer.newNote = new Note();
                        });
                    }
                };
                this.addContainer = function () {
                    if (_this.$scope.newContainerName) {
                        _this.notesService.addContainer(_this.$scope.newContainerName).then(function (response) {
                            var container = new NoteContainer();
                            container.ID = response.data;
                            container.Name = _this.$scope.newContainerName;
                            _this.$scope.notes.push(container);
                            _this.$scope.newContainerName = "";
                        });
                    }
                };
                this.removeContainer = function (noteContainer) {
                    if (noteContainer.Notes.length != 0) {
                        if (confirm("Do you really want to delete this container")) {
                            _this.notesService.removeContainer(noteContainer.ID);
                            _this.$scope.notes = _this.$scope.notes.filter(function (n) { return n.ID != noteContainer.ID; });
                        }
                    }
                    else {
                        _this.notesService.removeContainer(noteContainer.ID);
                        _this.$scope.notes = _this.$scope.notes.filter(function (n) { return n.ID != noteContainer.ID; });
                    }
                };
                var notes = notesService.loadNotes().then(function (response) {
                    var data = JSON.stringify(response.data);
                    var notes = JSON.parse(data);
                    $scope.notes = notes;
                });
            }
            NotesCtrl.$inject = ["$scope", "notesService", "$http"];
            return NotesCtrl;
        }());
        notes_1.NotesCtrl = NotesCtrl;
        var NotesService = (function () {
            function NotesService($http, toastr) {
                var _this = this;
                this.$http = $http;
                this.toastr = toastr;
                this.apiBase = "https://notes.zawada.be/";
                this.loadNotes = function () {
                    return _this.$http.get(_this.apiBase + "api/note", null);
                };
                this.addContainer = function (name) {
                    return _this.$http.post(_this.apiBase + "api/note?name=" + name, null).success(function (response) {
                        return response;
                    }).error(function (response) {
                        _this.toastr.error("Container was not created", "Error");
                    });
                };
                this.addNote = function (containerId, content) {
                    return _this.$http.post(_this.apiBase + "api/note/" + containerId + "?todo=" + content, null).success(function (response) {
                        return response;
                    }).error(function (response) {
                        _this.toastr.error("Container was not created", "Error");
                    });
                };
                this.removeNote = function (containerId, noteId) {
                    _this.$http.delete(_this.apiBase + "api/note/" + containerId + "/" + noteId, null);
                };
                this.removeContainer = function (containerId) {
                    _this.$http.delete(_this.apiBase + "api/note/" + containerId, null).then(function (response) {
                    });
                };
            }
            NotesService.factory = function () {
                var instance = function ($http, toastr) { return new NotesService($http, toastr); };
                return instance;
            };
            return NotesService;
        }());
        notes_1.NotesService = NotesService;
        var NoteContainer = (function () {
            function NoteContainer() {
                this.Notes = new Array();
                this.newNote = new Note();
            }
            return NoteContainer;
        }());
        var Note = (function () {
            function Note() {
            }
            return Note;
        }());
        angular
            .module('app.notes', ['toastr'])
            .directive("notes", function () {
            return {
                templateUrl: 'app-templates/notes/notes.html',
                controller: NotesCtrl,
                controllerAs: 'notesVM'
            };
        })
            .controller("notesCtrl", NotesCtrl)
            .factory("notesService", NotesService.factory());
    })(notes = app.notes || (app.notes = {}));
})(app || (app = {}));
/// <reference path="../../../typings/index.d.ts" />
// import {Registration} from '../models/Registration';
var app;
(function (app) {
    var register;
    (function (register) {
        'use strict';
        var RegisterCtrl = (function () {
            function RegisterCtrl($scope, authService) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.executeValidateEmail = function () {
                    var email = _this.$scope.registration.Email;
                    _this.$scope.validMail = _this.validateEmail(email);
                    _this.$scope.showMailValidation = !_this.$scope.validMail;
                };
                this.validate = function () {
                    if (!_this.$scope.registration)
                        return false;
                    var pw = _this.$scope.registration.Password;
                    var pwC = _this.$scope.registration.ConfirmPassword;
                    var email = _this.$scope.registration.Email;
                    _this.$scope.validMail = _this.validateEmail(email);
                    _this.$scope.showMailValidation = !_this.$scope.validMail;
                    _this.$scope.canRegister = ((pw === pwC) && (pw.length >= 6) && (_this.$scope.validMail));
                };
                this.validateEmail = function (email) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                };
                $scope.register = function (registration) {
                    authService.register(registration);
                };
                $scope.$watch('registration.Password', function () {
                    _this.validate();
                });
                $scope.$watch('registration.ConfirmPassword', function () {
                    _this.validate();
                });
            }
            RegisterCtrl.$inject = ["$scope", "authService"];
            return RegisterCtrl;
        }());
        register.RegisterCtrl = RegisterCtrl;
        angular
            .module('app.register', [])
            .directive("register", function () {
            return {
                templateUrl: 'app-templates/register/register.html',
                controller: RegisterCtrl,
                controllerAs: 'registerVM'
            };
        });
    })(register = app.register || (app.register = {}));
})(app || (app = {}));
/// <reference path="../../../typings/index.d.ts" />
var app;
(function (app) {
    var intercept;
    (function (intercept) {
        var AuthInterceptorService = (function () {
            function AuthInterceptorService($q, localStorageService, $injector) {
                var _this = this;
                this.$q = $q;
                this.localStorageService = localStorageService;
                this.$injector = $injector;
                this.request = function (config) {
                    config.headers = config.headers || {};
                    var authData = _this.localStorageService.get('authorizationData');
                    if (authData) {
                        config.headers.Authorization = 'Bearer ' + authData.token;
                    }
                    return config;
                };
                this.responseError = function (rejection) {
                    if (rejection.status === 401) {
                        var authData = _this.localStorageService.get('authorizationData');
                        var authService = _this.$injector.get('authService');
                        var state = _this.$injector.get('$state');
                        if (authData) {
                            console.log('nope');
                        }
                        authService.logout();
                        state.go('login');
                    }
                    return _this.$q.reject(rejection);
                };
            }
            AuthInterceptorService.factory = function () {
                var instance = function ($q, localStorageService, $injector) { return new AuthInterceptorService($q, localStorageService, $injector); };
                return instance;
            };
            return AuthInterceptorService;
        }());
        intercept.AuthInterceptorService = AuthInterceptorService;
        angular
            .module('app.intercept', ['LocalStorageModule'])
            .factory("authInterceptorService", AuthInterceptorService.factory());
    })(intercept = app.intercept || (app.intercept = {}));
})(app || (app = {}));
/// <reference path="../../../typings/index.d.ts" />
var app;
(function (app) {
    var shared;
    (function (shared) {
        var AuthService = (function () {
            function AuthService($http, $q, localStorageService, toastr, $state) {
                var _this = this;
                this.$http = $http;
                this.$q = $q;
                this.localStorageService = localStorageService;
                this.toastr = toastr;
                this.$state = $state;
                this.serviceBase = "https://notes.zawada.be/";
                this.loggedIn = false;
                this.isLoggedIn = function () {
                    var authData = _this.localStorageService.get('authorizationData');
                    if (authData)
                        return true;
                    else
                        return false;
                };
                this.userName = function () {
                    var authData = _this.localStorageService.get('authorizationData');
                    if (authData) {
                        var email = authData.username;
                        return email.substring(0, email.indexOf("@"));
                    }
                };
                this.login = function (username, password) {
                    var data = "grant_type=password&username=" + username + "&password=" + password;
                    var deferred = _this.$q.defer();
                    _this.$http.post(_this.serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                        .success(function (response) {
                        _this.loggedIn = true;
                        _this.localStorageService.set('authorizationData', { token: response.access_token, username: username });
                        _this.$state.go("notes");
                        deferred.resolve(response);
                    }).error(function (response) {
                        if (!response) {
                            _this.toastr.error("Server must be down...", "Error");
                        }
                        else {
                            _this.toastr.error(response.error_description, "Error");
                        }
                        console.log(response);
                        _this.logout();
                    });
                    return deferred.promise;
                };
                this.register = function (registration) {
                    _this.logout();
                    _this.$http.post(_this.serviceBase + "api/account/register", registration, { headers: { 'Content-Type': 'application/json' } }).success(function (response) {
                        _this.toastr.success("Redirecting you to login...", "Registration successful");
                        setTimeout(function () {
                            _this.$state.go("login", { email: registration.Email });
                        }, 3000);
                    }).error(function (response) {
                        var modelState = response.ModelState;
                        var errorArr = modelState[Object.keys(modelState)[0]];
                        _this.toastr.error(errorArr[1], "Error");
                    });
                };
                this.logout = function () {
                    _this.localStorageService.remove('authorizationData');
                    _this.loggedIn = false;
                };
            }
            AuthService.factory = function () {
                var instance = function ($http, $q, localStorageService, toastr, $state) { return new AuthService($http, $q, localStorageService, toastr, $state); };
                return instance;
            };
            AuthService.$inject = ["$http", "$q", "localStorageService", "toastr", "$state"];
            return AuthService;
        }());
        shared.AuthService = AuthService;
        angular
            .module('app.shared', ['LocalStorageModule', 'toastr'])
            .factory("authService", AuthService.factory());
    })(shared = app.shared || (app.shared = {}));
})(app || (app = {}));
angular.module("app.templates", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("app-templates/login/login.html", "<div id=\"login-inject\">\r\n	<h2>Login</h2>\r\n	<div ng-hide=\"loginVM.authService.isLoggedIn()\">\r\n	\r\n		\r\n	<form id=\"login-form\" name=\"loginForm\" ng-submit=\"loginVM.authService.login(username, password)\">\r\n		<div class=\"form-group\">\r\n			<label for=\"username\">Username:</label>\r\n			<input type=\"text\" class=\"form-control\" id=\"username\" ng-model=\"username\" required>\r\n		</div>\r\n		<div class=\"form-group\">\r\n			<label for=\"password\">Password:</label>\r\n			<input type=\"password\" class=\"form-control\" id=\"password\" ng-model=\"password\" required>\r\n		</div>\r\n\r\n		<button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"loginForm.$invalid\">Login</button> <span>or <a ui-sref=\"register\">register</a></span>\r\n	</form>\r\n</div>\r\n\r\n<div ng-show=\"loginVM.authService.isLoggedIn()\">\r\n	<p>You are already logged in, {{loginVM.authService.userName()}}</p>\r\n	<p>Click <a href=\"\" ng-click=\"loginVM.authService.logout()\">here</a> to log out.</p>\r\n</div>\r\n</div>");
        $templateCache.put("app-templates/notes/notes.html", "<div class=\"new-note-container\">\r\n            <form ng-submit=\"notesVM.addContainer()\">\r\n            <label for=\"new-container\">New container: </label>\r\n                <div class=\"input-group\">\r\n                \r\n                    <input type=\"text\" class=\"form-control\" ng-model=\"newContainerName\">\r\n                    <span class=\"input-group-btn\">\r\n                        <button class=\"btn btn-default\" type=\"button\">+</button>\r\n                    </span>\r\n                </div>\r\n            </form>\r\n</div>\r\n\r\n<div class=\"note-wrapper\">\r\n\r\n        <div class=\"note-container\" ng-repeat=\"notecontainer in notes\">\r\n            <div class=\"note-container-name\"><span>{{notecontainer.Name}} </span> <span title=\"Remove container\" ng-click=\"notesVM.removeContainer(notecontainer)\" class=\"glyphicon glyphicon-trash remove-container-icon\"></span></div>\r\n            \r\n            <div class=\"note\" ng-repeat=\"note in notecontainer.Notes\">\r\n                <label class=\"note-name\" ng-class=\"{\'note-completed\': note.IsComplete}\"><input type=\"checkbox\" ng-model=\"note.IsComplete\" ng-change=\"notesVM.onCheck(note, notecontainer)\"> {{note.Content}}</label>\r\n            </div>\r\n            <form ng-submit=\"notesVM.addNote(notecontainer)\">\r\n                <div class=\"input-group note-add-container\">\r\n                    <input type=\"text\" class=\"form-control\" ng-model=\"notecontainer.newNote.Content\">\r\n                        <span class=\"input-group-btn\">\r\n                        <button class=\"btn btn-default\" type=\"submit\">+</button>\r\n                    </span>\r\n                </div>\r\n            </form>\r\n\r\n             \r\n        </div>\r\n\r\n</div>");
        $templateCache.put("app-templates/register/register.html", "<div id=\"register-inject\">\r\n\r\n	<h2>Register</h2>\r\n<form id=\"register-form\" name=\"registerForm\" ng-submit=\"register(registration)\" ng-init=\"valid=false\">\r\n        <div class=\"form-group\">\r\n			<label for=\"email\">Email:</label>\r\n			<input class=\"form-control\" id=\"email\" ng-model=\"registration.Email\" ng-blur=\"registerVM.executeValidateEmail()\" required>\r\n		</div>\r\n		<div class=\"form-group\">\r\n			<label for=\"password\">Password:</label>\r\n			<input type=\"password\" class=\"form-control\" id=\"password\" ng-model=\"registration.Password\" required>\r\n		</div>\r\n\r\n        <div class=\"form-group\">\r\n			<label for=\"confirm-password\">Confirm password:</label>\r\n			<input type=\"password\" class=\"form-control\" id=\"confirm-password\" ng-model=\"registration.ConfirmPassword\" required>\r\n		</div>\r\n\r\n		<p style=\"color:red;\" ng-show=\"registration.Password!=registration.ConfirmPassword && registration.ConfirmPassword\">Passwords must match</p>\r\n		<p style=\"color: red;\" ng-show=\"registration.Password.length < 6\">Password must be at least 6 characters</p>\r\n		<p style=\"color: red;\" ng-show=\"showMailValidation\">Please enter a valid e-mail address</p>\r\n\r\n		<button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"!canRegister\">Register</button> <span>or back to <a ui-sref=\"login\">login</a></span>\r\n	</form>\r\n\r\n</div>");
    }]);
