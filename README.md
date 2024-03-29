# TIBCO Cloud™ Composer - Component Schematics

<img src="https://community.tibco.com/sites/default/files/tibco_labs_final_with_tm2-01.png" alt="drawing" width="100"/>Powered by [TIBCO Labs™](https://community.tibco.com/wiki/tibco-labs)

Component Schematics, will generate code in order for you to customize apps.

### Create your first TIBCO Cloud™ App

To create your first app, simply run:

```bash
tcli new 
```
**Note**: if you don't have tcli run:
```
npm install -g gulp-cli gulp @tibco-tcstk/cloud-cli
```

## Create your own component
Simply type:
```bash
tcli schematic-add
```
And choose the schematic to use.

Or use one of these commands 
```
ng generate @tibco-tcstk/component-template:case-cockpit CustomCaseCockpit
ng generate @tibco-tcstk/component-template:home-cockpit CustomHomeCockpit
ng generate @tibco-tcstk/component-template:custom-form-creator CustomFormCreator
ng generate @tibco-tcstk/component-template:custom-form-action CustomFormAction
ng generate @tibco-tcstk/component-template:custom-form-casedata CustomFormCaseData
ng generate @tibco-tcstk/component-template:analytics-cockpit CustomAnalyticsCockpit
ng generate @tibco-tcstk/component-template:spotfire-component-basic CustomSpotfireComponent
ng generate @tibco-tcstk/component-template:spotfire-component-config CustomSpotfireComponentWithConfig

```
You can change the entries starting with custom into any name you like.

## Custom Home or Case Cockpit
After you install a custom case cockpit, edit the home.component.html or case.component.html file to use your own custom component. (See the instructions in the file)


##Form Reference
For the custom forms you will have to enter an Form Reference(ID):
You can get the form reference by running the generated form in case manager and looking at the console log.
You will see entries like this:
 ```
 (filter for *** Forms:)\n * *** Forms: > Using auto-rendered form (formRef): SampleApp.SampleApp.creator.Create SampleApp,
```

> Part of [TIBCO Cloud Composer](https://tibcosoftware.github.io/TCSToolkit/)

![Logo](https://tibcosoftware.github.io/TIBCO-LABS/about/tibcolabs-brand.png "Labs Logo")

# License
Copyright © 2022. TIBCO Software Inc.<br>
This file is subject to the license terms contained in the license file that is distributed with this file.

For more license details and dependent third party components referenced by this library, see here:
- [TIBCO Cloud Composer License PDF](https://tibcosoftware.github.io/TCSToolkit/about/TIB_cloud-composer_license.pdf)
- [TIBCO Cloud Composer License TXT](https://tibcosoftware.github.io/TCSToolkit/about/TIB_cloud-composer_license.txt)

