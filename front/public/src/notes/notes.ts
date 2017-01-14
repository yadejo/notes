/// <reference path="../../../typings/index.d.ts" />

module app.notes {

    export interface INotesCtrl { }

    export interface INotesScope extends ng.IScope {
        notes: Array<INoteContainer>;
        newContainerName: string;
    }

    export class NotesCtrl implements INotesCtrl {
        static $inject = ["$scope", "notesService", "$http"];

        constructor(
            public $scope: INotesScope,
            public notesService: NotesService,
            public $http: ng.IHttpService
        ) {
            var notes = notesService.loadNotes().then((response:any)=>{
                var data = JSON.stringify(response.data);
                
                let notes: Array<INoteContainer> = JSON.parse(data);

                $scope.notes = notes;
                console.log(notes);

                console.log($scope.notes);

            });
        }

        onCheck = (note: Note, noteContainer: NoteContainer) => {
            setTimeout(() => {
                if (note.IsComplete) {                    
                    this.notesService.removeNote(noteContainer.ID, note.ID);
                    this.$scope.$apply(function () {
                        
                        noteContainer.Notes = noteContainer.Notes.filter((n) => { return n.ID != note.ID });
                    });
                }
            }, 3000)


        }

        addNote = (noteContainer: NoteContainer) => {
            if(!noteContainer.newNote) return;
            if (noteContainer.newNote.Content) {
                this.notesService.addNote(noteContainer.ID, noteContainer.newNote.Content).then((response:any) =>{
                    
                noteContainer.newNote.ID = response.data;
                noteContainer.Notes.push(noteContainer.newNote)
                noteContainer.newNote = new Note();
                });

                
            }

        }

        addContainer = () => {
            if (this.$scope.newContainerName) {             
                this.notesService.addContainer(this.$scope.newContainerName).then((response:any) => {
                    var container = new NoteContainer()
                    container.ID = response.data;
                    container.Name = this.$scope.newContainerName;

                    this.$scope.notes.push(container);
                    this.$scope.newContainerName = "";
                });
               
            }
        }

        removeContainer = (noteContainer: NoteContainer) => {
            if (noteContainer.Notes.length != 0) {
                if (confirm("Do you really want to delete this container")) {
                    this.notesService.removeContainer(noteContainer.ID);
                    this.$scope.notes = this.$scope.notes.filter((n) => { return n.ID != noteContainer.ID });

                }
            }
            else {
                this.notesService.removeContainer(noteContainer.ID);
                this.$scope.notes = this.$scope.notes.filter((n) => { return n.ID != noteContainer.ID });
            }
        }
    } 

    export interface INotesService {
        loadNotes();
        addContainer(name : string) : number;
    }
    export class NotesService  {

        apiBase : string ="http://notes.zawada.be/"

        constructor(public $http: ng.IHttpService, public toastr: any){

        }

        loadNotes= () => {
            
             return this.$http.get(this.apiBase + "api/note", null);
        
        }

        addContainer = (name: string) =>{
            return this.$http.post(this.apiBase + "api/note?name=" + name, null).success((response:any)=>{
                return response;
            }).error((response:any)=>{
                this.toastr.error("Container was not created", "Error");
            });
        }

        addNote = (containerId: number, content: string) =>{
            return this.$http.post(this.apiBase + "api/note/" + containerId + "?todo=" + content, null).success((response:any)=>{
                return response;
            }).error((response:any)=>{
                this.toastr.error("Container was not created", "Error");
            });
        }

        removeNote = (containerId: number, noteId:number)=>{
            this.$http.delete(this.apiBase + "api/note/" + containerId + "/" + noteId, null);
        }

        removeContainer = (containerId : number) =>{
            this.$http.delete(this.apiBase + "api/note/" + containerId, null).then((response:any)=>{
                console.log(response);
            })
        }


        static factory(){
            var instance = ($http: ng.IHttpService, toastr: any) => new NotesService($http, toastr);

            return instance;
        }
    }

    class NoteContainer implements INoteContainer{
        ID: number;
        Name: string;
        Notes: Array<Note>;
        newNote: Note;

        constructor(){
            this.Notes = new Array<Note>();
            this.newNote = new Note();
        }


    }

    interface INoteContainer{
        ID:number;
        Name:string;
        Notes: Array<INote>;        
    }

    interface INote{
        ID:number;
        IsComplete:boolean;
        Content:string;
    }

    class Note implements INote{
        ID: number;
        IsComplete: boolean;
        Content: string;
    }

    angular
        .module('app.notes', ['toastr'])
        .directive("notes", function (): ng.IDirective {
            return {
                templateUrl: 'app-templates/notes/notes.html',
                controller: NotesCtrl,
                controllerAs: 'notesVM'
            };
        })
        .controller("notesCtrl", NotesCtrl)
        .factory("notesService", NotesService.factory());
}
