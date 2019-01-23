import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-<%= name %>',
    templateUrl: './<%= name %>.component.html',
    styleUrls: ['./<%= name %>.component.css']
})
export class <%= name %>Component implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
