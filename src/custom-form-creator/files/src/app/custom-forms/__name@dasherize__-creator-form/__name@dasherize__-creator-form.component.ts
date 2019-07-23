import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseCustomFormComponent} from '../../form-components/base-custom-form/base-custom-form.component';
import {MatDatepicker} from '@angular/material';
import { Moment } from 'moment';

@Component({
    selector: 'app-<%= dasherize(name) %>-creator-form',
    templateUrl: './<%= dasherize(name) %>-creator-form.component.html',
    styleUrls: ['./<%= dasherize(name) %>-creator-form.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class <%= classify(name) %>CreatorFormComponent extends BaseCustomFormComponent implements OnInit {

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
        * For example: when clicking submit on a case creator:
        *
        * *** Forms: JSON:  {"SampleApp":{"field1":"test1","field2":"test2","field3":"test3"}}
        *
        */

        // These are the attributes inside the 'SampleApp' object
        this.sampleAppFormGroup = this.formBuilder.group(
            {
                // setup formGroups according to your form data structure
                // initial values are blank since this is a case creator
                field1: '',
                field2: '',
                field3: ''
            }
        );

        // this is the top level form object (case type name - 'SampleApp')
        // only needed for creators and actions
        this.formGroup = this.formBuilder.group({
                SampleApp: this.sampleAppFormGroup
            }
        );

    }

    ngOnInit() {
        // note no input data passed for creator
        this.populateForm();
    }

    // Note submit is handled by the inherited onSubmit method from BaseCustomFormComponent but you can over-ride it here if required:

    /*public onSubmit = (formdata: any) => {
      console.warn('*** Forms: Custom form - Submitting form data: ', formdata);
      this.formSubmitted.emit(formdata);
    }*/

}
