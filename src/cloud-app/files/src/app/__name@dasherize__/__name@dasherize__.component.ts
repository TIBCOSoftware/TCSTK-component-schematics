import { Component, OnInit } from '@angular/core';

/**
 * <%= name %>
 * detailed Component Description
 *
 */
@Component({
    selector: 'app-<%= name %>',
    templateUrl: './<%= name %>.component.html',
    styleUrls: ['./<%= name %>-style.css']
})


/**
 * Class Description of the Component
 */
export class <%= name %>Component implements OnInit, OnDestroy {
@Input() sandboxId: number;


    // use the _destroyed$/takeUntil pattern to avoid memory leaks if a response was never received
private _destroyed$ = new Subject();

    somedata: any;

    constructor(private liveapps: LiveAppsService) { }

    /**
     * global Component Refresh Function
     */
public refresh = () => {
        // call live apps service to get required data
        // example live apps call
        /*
        const liveappscall = this.liveapps.getApplications(this.sandboxId)
            // process received data on response
            .pipe(
                // only get first response from the observable
                take(1),
                // on destroy clear down the observable to avoid memory leaks
                takeUntil(this._destroyed$),
                // on response map data
                map(applicationList => {
                    // do something with the response
                    this.somedata = applicationList;
            })
        );
        // subscribe to observable
        liveappscall.subscribe(null, error => { console.error('Error retrieving applications: ' + error.error.errorMsg); });
        */
    }

    ngOnInit() {
        // on init get required data
        this.refresh();
    }


    ngOnDestroy() {
        // on destroy
        this._destroyed$.next();
    }

}
