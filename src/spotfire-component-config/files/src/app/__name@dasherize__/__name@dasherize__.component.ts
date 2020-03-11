import { Component, OnInit } from '@angular/core';
import {SpotfireConfig, SpotfireMarkingCreateCaseConfig} from '@tibco-tcstk/tc-spotfire-lib';
import {ActivatedRoute} from '@angular/router';

/**
 * <%= name %>
 * detailed Component Description
 *
 */
@Component({
    selector: '<%= dasherize(name) %>',
    templateUrl: './<%= dasherize(name) %>.component.html',
    styleUrls: ['./<%= dasherize(name) %>-style.css']
})


/**
 * Class Description of the Component
 */
export class <%=  classify(name) %>Component implements OnInit {

    sfMarkingOn = '*';
    sfMarkingMaxRows = 1000;

    selectedMarking = {};

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
        showPageNavigation: false,
        showAnalysisInfo: false,
        showReloadAnalysis: false,
        showStatusBar: false,
        showToolBar: false,
        showUndoRedo: false
    };

    public sFConfig: SpotfireConfig;
    public sFMarkingConfig: SpotfireMarkingCreateCaseConfig;

    constructor (private activeRoute: ActivatedRoute){
        this.sFConfig = activeRoute.snapshot.data.spotfireConfigHolder;
        this.sFMarkingConfig = activeRoute.snapshot.data.spotfireMappingConfigHolder;
    }

    marking(sMarking)
    {
        console.log('Marking: ', sMarking);
        this.selectedMarking = JSON.stringify(sMarking);
    }

    ngOnInit() {
        // on init
    }
}
