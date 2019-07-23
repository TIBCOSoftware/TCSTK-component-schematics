import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseCustomFormComponent} from '../../form-components/base-custom-form/base-custom-form.component';
import {MatDatepicker} from '@angular/material';
import { Moment } from 'moment';

@Component({
    selector: 'app-<%= dasherize(name) %>-casedata-form',
    templateUrl: './<%= dasherize(name) %>-casedata-form.component.html',
    styleUrls: ['./<%= dasherize(name) %>-casedata-form.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class <%= classify(name) %>CasedataFormComponent extends BaseCustomFormComponent implements OnInit {

    @ViewChild(MatDatepicker, {static: false}) picker: MatDatepicker<Moment>;

    constructor(public formBuilder: FormBuilder) {
        super();
    }

    formGroup: FormGroup;

    /*
     * The form should work on a data model that matches that received from the case data APIs
     *
     * You can see an example data payload for a form by opening the case view in the
     * Cloud Starters Toolkit Case Management App and reviewing the console log (warnings)
     *  - filter for *** Forms::
     *
     * For example: when opening the case screen a generated form shows case data:
     *
     * *** Forms: Initial Form Data (JSON): {"field1":"test1","field2":"test2","field3":"test3","state":"Created"}
     *
     * Note that unlike creators/actions the data payload does not contain the outer case object ('SampleApp')
     */

    // These are the attributes that need to be populated in the form
    // We need to populate the form with the existing case data
    // Forms receive data in the data input parameter inherited from BaseCustomForm
    populateForm = () => {
        this.formGroup = this.formBuilder.group(
            {
                // setup formGroups according to your form data structure
                field1: this.getDeepVal(this.data, 'field1'),
                field2: this.getDeepVal(this.data, 'field2'),
                field3: this.getDeepVal(this.data, 'field3')
            }
        );
    }

    ngOnInit() {
        // input data will be passed as 'data' input parameter
        this.populateForm();
    }

    public updateData = (data) => {
        // if case page is refreshed - this will be called to update case data
        this.data = data;
        this.populateForm();
    }

    // Note there is normally no submit button for a case data form
    // and the template should contain read-only form fields

}
