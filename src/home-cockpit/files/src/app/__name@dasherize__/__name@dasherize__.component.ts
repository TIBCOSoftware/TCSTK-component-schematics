import { Component, EventEmitter , Input, Output, SimpleChanges} from '@angular/core';
import {RouteAction} from '@tibco-tcstk/tc-core-lib';
import {LiveAppsHomeCockpitComponent,Roles,RouteAccessControlConfigurationElement} from '@tibco-tcstk/tc-liveapps-lib';
import {CustomFormDefs} from '@tibco-tcstk/tc-forms-lib';

@Component({
    selector: 'app-<%= dasherize(name) %>',
    templateUrl: './<%= dasherize(name) %>.component.html',
    styleUrls: ['./<%= dasherize(name) %>-style.css']
})

export class <%= classify(name) %>Component extends LiveAppsHomeCockpitComponent implements OnChanges {

    /**
     * The Application ID of the UI (should ideally be unique as it is shared state key)
     */
@Input() uiAppId: string;

    /**
     * The list of LA Application IDs you want to handle
     */
@Input() appIds: string[];

    /**
     * sandboxId - this comes from claims resolver
     */
@Input() sandboxId: number;

    /**
     * The name of the logged user
     */
@Input() userName: string;

    /**
     * The ID of the logged user
     */
@Input() userId: string;

    /**
     * * NOT USED but is the email address of the user (comes from resolver)
     */
@Input() email: string;

    /**
     * page title comes from config resolver
     */
@Input() title: string;

    /**
     * Roles - The users current roles
     */
@Input() roles: Roles;

    /**
     * RouteAccessControlConfig - basically the config for access control
     */
@Input() access: RouteAccessControlConfigurationElement;

    /**
     * Custom Form configuration file
     */
@Input() customFormDefs: CustomFormDefs;

    /**
     * Enable legacy workitems
     */
@Input() legacyWorkitems: boolean = this.legacyWorkitems ? this.legacyWorkitems : false;

    /**
     * Enable legacy creators
     */

@Input() legacyCreators: boolean = this.legacyCreators ? this.legacyCreators : false;
    /**
     * ~event routeAction : Component requests route to another page
     * ~payload RouteAction : RouteAction object to tell caller to navigate somewhere
     */
@Output() routeAction: EventEmitter<RouteAction> = new EventEmitter<RouteAction>();

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }
}
