/// <reference path="../../../typings/index.d.ts" />
angular.module('notesApp', [
    'app.login',
    'app.templates',
    'app.notes'
]);
/// <reference path="../../../typings/index.d.ts" />
var app;
(function (app) {
    var login;
    (function (login) {
        'use strict';
        var LoginCtrl = (function () {
            function LoginCtrl($scope, loginService) {
                this.$scope = $scope;
                this.loginService = loginService;
            }
            LoginCtrl.$inject = ["$scope", "loginService"];
            return LoginCtrl;
        }());
        login.LoginCtrl = LoginCtrl;
        var LoginService = (function () {
            function LoginService() {
                this.login = function (username, password) {
                    console.log(username + " " + password);
                };
            }
            return LoginService;
        }());
        login.LoginService = LoginService;
        angular
            .module('app.login', [])
            .directive("login", function () {
            return {
                templateUrl: 'app-templates/login/login.html',
                controller: LoginCtrl,
                controllerAs: 'loginVM'
            };
        })
            .controller("loginCtrl", LoginCtrl)
            .factory("loginService", [function () { return new app.login.LoginService(); }]);
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
angular.module("app.templates", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("app-templates/login/login.html", "<div id=\"login-inject\">\n\n	<h2>Login</h2>\n\n	<form id=\"login-form\" name=\"loginForm\">\n		<div class=\"form-group\">\n			<label for=\"username\">Username:</label>\n			<input type=\"text\" class=\"form-control\" id=\"username\" ng-model=\"username\" required>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"password\">Password:</label>\n			<input type=\"password\" class=\"form-control\" id=\"password\" ng-model=\"password\" required>\n		</div>\n\n		<button type=\"button\" class=\"btn btn-default\" ng-click=\"loginVM.loginService.login(username, password)\" ng-disabled=\"loginForm.$invalid\">Login</button>\n	</form>\n\n\n\n\n\n	<!--<button ng-click=\"demoCtrlVM.demoService.getExcited = !demoCtrlVM.demoService.getExcited\">\n		Go ahead, click me - I\'m wired up to ng ready to go!\n	</button>\n	<div ng-show=\"demoCtrlVM.demoService.getExcited\">\n		<h3>Yeeehaww!</h3>\n	</div>-->\n\n</div>");
        $templateCache.put("app-templates/notes/notes.html", "<div class=\"new-note-container\">\r\n    <form class=\"form-inline\" ng-submit=\"notesVM.addContainer()\">\r\n        <div class=\"form-group\">\r\n            <label for=\"new-container\">New container: </label>\r\n            <input type=\"text\" class=\"form-control\" id=\"new-container\" ng-model=\"newContainerName\">\r\n        </div>\r\n\r\n        <button type=\"submit\" class=\"btn btn-default\">+</button>\r\n    </form>\r\n</div>\r\n\r\n<div class=\"note-wrapper\">\r\n\r\n        <div class=\"note-container\" ng-repeat=\"notecontainer in notes\">\r\n            <div class=\"note-container-name\"><span>{{notecontainer.name}} </span> <span title=\"Remove container\" ng-click=\"notesVM.removeContainer(notecontainer)\" class=\"glyphicon glyphicon-trash remove-container-icon\"></span></div>\r\n            \r\n            <div class=\"note\" ng-repeat=\"note in notecontainer.notes\">\r\n                <label class=\"note-name\" ng-class=\"{\'note-completed\': note.isComplete}\"><input type=\"checkbox\" ng-model=\"note.isComplete\" ng-change=\"notesVM.onCheck(note, notecontainer)\"> {{note.content}}</label>\r\n               \r\n            </div>\r\n\r\n             <form class=\"form-inline note-add-container\" ng-submit=\"notesVM.addNote(notecontainer)\">\r\n                 <div class=\"form-group\">\r\n                     <input class=\"form-control\" type=\"text\" ng-model=\"notecontainer.newNote.content\">\r\n                     <button class=\"btn btn-default\" type=\"submit\">+</button>\r\n                 </div>\r\n             </form>\r\n        </div>\r\n\r\n</div>");
    }]);
