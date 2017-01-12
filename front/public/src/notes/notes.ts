/// <reference path="../../../typings/index.d.ts" />

module app.notes {

    export interface INotesCtrl { }

    export interface INotesScope extends ng.IScope {
        notes: Array<NoteContainer>;
        newContainerName: string;
    }

    export class NotesCtrl implements INotesCtrl {
        static $inject = ["$scope", "notesService", "$http"];

        constructor(
            public $scope: INotesScope,
            public notesService: NotesService,
            public $http: ng.IHttpService
        ) {
            //var notes = notesService.loadNotes();
            var notes = new Array<NoteContainer>();
            $scope.notes = notes;
        }

        onCheck = (note: Note, noteContainer: NoteContainer) => {
            setTimeout(() => {
                if (note.isComplete) {
                    this.$scope.$apply(function () {
                        noteContainer.notes = noteContainer.notes.filter((n) => { return n.id != note.id });
                    });
                }
            }, 3000)


        }

        addNote = (noteContainer: NoteContainer) => {
            if (noteContainer.newNote.content) {
                noteContainer.notes.push(noteContainer.newNote)
                noteContainer.newNote = new Note(noteContainer.notes.length, "");
            }

        }

        addContainer = () => {
            if (this.$scope.newContainerName) {
                var container = new NoteContainer(this.$scope.notes.length, this.$scope.newContainerName);
                this.$scope.notes.push(container);
                this.$scope.newContainerName = "";
            }
        }

        removeContainer = (noteContainer: NoteContainer) => {
            if (noteContainer.notes.length != 0) {
                if (confirm("Do you really want to delete this container")) {
                    this.$scope.notes = this.$scope.notes.filter((n) => { return n.id != noteContainer.id });

                }
            }
            else {
                this.$scope.notes = this.$scope.notes.filter((n) => { return n.id != noteContainer.id });
            }
        }
    }

    export interface INotesService {
        // loadNotes(): Array<NoteContainer>;
    }
    export class NotesService implements INotesService {
        
    }

    class NoteContainer {
        id: number;
        name: string;
        notes: Array<Note>;
        newNote: Note;

        constructor(id: number, name: string) {
            this.id = id;
            this.name = name;
            this.newNote = new Note(0, "");
            this.notes = new Array<Note>();
        }

    }

    class Note {
        id: number;
        isComplete: boolean;
        content: string;

        constructor(id: number, content: string, isComplete: boolean = false) {
            this.id = id;
            this.content = content;
            this.isComplete = isComplete;
        }
    }

    angular
        .module('app.notes', [])
        .directive("notes", function (): ng.IDirective {
            return {
                templateUrl: 'app-templates/notes/notes.html',
                controller: NotesCtrl,
                controllerAs: 'notesVM'
            };
        })
        .controller("notesCtrl", NotesCtrl)
        .factory("notesService", [() => new app.notes.NotesService()]);
}
