
import { Component, OnInit } from '@angular/core';
import {LiveAppsHomeCockpitComponent} from '@tibco-tcstk/tc-liveapps-lib';

@Component({
    selector: 'app-<%= name %>-home-cockpit',
    templateUrl: './<%= name %>-home-cockpit.component.html',
    styleUrls: ['./<%= name %>-home-cockpit.component.css']
})

export class <%= classify(name) %>HomeCockpitComponent extends LiveAppsHomeCockpitComponent {

}
