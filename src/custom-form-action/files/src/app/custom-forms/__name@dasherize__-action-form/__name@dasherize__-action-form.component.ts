import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseCustomFormComponent} from '../../form-components/base-custom-form/base-custom-form.component';
import {MatDatepicker} from '@angular/material/datepicker';
import { Moment } from 'moment';

@Component({
    selector: 'app-<%= dasherize(name) %>-action-form',
    templateUrl: './<%= dasherize(name) %>-action-form.component.html',
    styleUrls: ['./<%= dasherize(name) %>-action-form.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class <%= classify(name) %>ActionFormComponent extends BaseCustomFormComponent implements OnInit {

    @ViewChild(MatDatepicker, {static: false}) picker: MatDatepicker<Moment>;

    constructor(public formBuilder: FormBuilder) {
        super();
    }

    formGroup: FormGroup;
    sampleAppFormGroup: FormGroup;

    populateForm = () => {

        /*
        * The form should work on a data model that matches that expected when running the process
        *
        * You can see an example data payload for a form by running a generated form in the Case Management App
        * and reviewing the console log (warnings) - filter for *** Forms::
        *
        * For example: when opening a case action (intial data):
        *
        * *** Forms: Initial Form Data (JSON): {"SampleApp":{"field1":"test1","field2":"test2","field3":"test3","state":"Created"}}
        *
        * For example: when clicking submit on a case action:
        *
        * *** Forms: JSON:  {"SampleApp":{"field1":"test1","field2":"test2","field3":"test3"}}
        *
        */

        // These are the attributes inside the 'SampleApp' object
        // Since actions have input data we need to populate the form with the existing data
        // Forms receive input data in the data input parameter inherited from BaseCustomForm
        this.sampleAppFormGroup = this.formBuilder.group(
            {
                // setup formGroups according to your form data structure
                // you can use getDeepVal to populate the form with data from the input data using ./[] notations
                // see implementation in BaseCustomForm for more details
                field1: this.getDeepVal(this.data, 'SampleApp.field1'),
                field2: this.getDeepVal(this.data, 'SampleApp.field2'),
                field3: this.getDeepVal(this.data, 'SampleApp.field3')
            }
        );

        // this is the top level form object (case type name - SampleApp)
        // only needed for creators and actions
        this.formGroup = this.formBuilder.group({
                SampleApp: this.sampleAppFormGroup
            }
        );

    }

    ngOnInit() {
        // note: existing case data will be passed for an action
        this.populateForm();
    }

    public updateData = (data) => {
        // if case page is refreshed - this will be called to update case data
        this.data = data;
        this.populateForm();
    }

    // Note submit is handled by the inherited onSubmit method from BaseCustomFormComponent but you can over-ride it here if required:

    /*public onSubmit = (formdata: any) => {
      console.warn('*** Forms: Custom form - Submitting form data: ', formdata);
      this.formSubmitted.emit(formdata);
    }*/
}




