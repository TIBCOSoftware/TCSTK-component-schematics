import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {RouteAction} from '@tibco-tcstk/tc-core-lib';
import {LiveAppsCaseCockpitComponent,Roles,RouteAccessControlConfig} from '@tibco-tcstk/tc-liveapps-lib';
import {CustomFormDefs} from '@tibco-tcstk/tc-forms-lib';

@Component({
    selector: 'app-<%= dasherize(name) %>',
    templateUrl: './<%= dasherize(name) %>.component.html',
    styleUrls: ['./<%= dasherize(name) %>-style.css']
})

export class <%= classify(name) %>Component  {



}
