import {Component, EventEmitter, Input, Output, SimpleChanges, OnChanges} from '@angular/core';
import {RouteAction, TcButtonsHelperService} from '@tibco-tcstk/tc-core-lib';
import {LiveAppsHomeCockpitComponent, Roles, RouteAccessControlConfigurationElement, FormConfig, CaseType, TcRolesService} from '@tibco-tcstk/tc-liveapps-lib';
import {CustomFormDefs} from '@tibco-tcstk/tc-forms-lib';
import {SpotfireConfig, SpotfireMarkingCreateCaseConfig, TcSpotfireService} from '@tibco-tcstk/tc-spotfire-lib';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';

@Component({
    selector: '<%= dasherize(name) %>',
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
     * * Email address of the user (comes from resolver)
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
     * Custom Form Layout Configuration
     */
@Input() formConfig: FormConfig;

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
     * Allow override of forms framework
     * Options: bootstrap-4 or material-design
     */
@Input() formsFramework: string = this.formsFramework ? this.formsFramework : 'material-design';

    /**
     * ~event routeAction : Component requests route to another page
     * ~payload RouteAction : RouteAction object to tell caller to navigate somewhere
     */
@Output() routeAction: EventEmitter<RouteAction> = new EventEmitter<RouteAction>();

    // Set your own custom configuration of the Spotfire Report
    sfProps = {
        showAbout: false,
        showAnalysisInformationTool: false,
        showAuthor: false,
        showClose: false,
        showCustomizableHeader: false,
        showDodPanel: false,
        showExportFile: false,
        showExportVisualization: false,
        showFilterPanel: false,
        showHelp: false,
        showLogout: false,
        showPageNavigation: true,
        showAnalysisInfo: false,
        showReloadAnalysis: false,
        showStatusBar: false,
        showToolBar: false,
        showUndoRedo: false
    };

    // Holders for Spotfire and Marking Mapping configuration
    public sFConfig: SpotfireConfig;
    public sFMarkingConfig: SpotfireMarkingCreateCaseConfig;

    // Configuration for what marking to listen to and how many marking rows to pick up (maximum)
    public sfMarkingOn = '*';
    public sfMarkingMaxRows = 1000;

    // Variables for LiveApps Data and Marking
    private laData = {};
    private markingValue = {};

    // Set initial configuration from data in config
    constructor (protected buttonsHelper: TcButtonsHelperService, public dialog: MatDialog, protected rolesService: TcRolesService, protected sFHelper: TcSpotfireService, private activeRoute: ActivatedRoute){
        super(buttonsHelper, dialog, rolesService);
        this.sFConfig = activeRoute.snapshot.data.spotfireConfigHolder;
        this.sFMarkingConfig = activeRoute.snapshot.data.spotfireMappingConfigHolder;
    }

    // Function for changes
    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    // Function to pick up a marking change.
    marking(mark) {
        this.markingValue = mark;
    }

    // Create case in LiveApps based on marking
    public handleCreatorAppSelection = (application: CaseType): void => {
        this.laData = this.sFHelper.createLiveAppsData(this.markingValue, this.sFMarkingConfig);
        this.openCreatorDialog(application, this.laData, this.sandboxId, this.customFormDefs, false, this.formsFramework, this.formConfig);
    }
}
