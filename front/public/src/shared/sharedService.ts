/// <reference path="../../../typings/index.d.ts" />




    export interface ISharedService{
        isLoggedIn: boolean;
    }

    export class SharedService implements ISharedService{
        isLoggedIn: boolean;

        constructor(){
            this.isLoggedIn = true;
        }
    }

export let shared = angular
        .module('app.shared', [])
        .service("sharedService", [() => new SharedService()]);
