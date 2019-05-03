# TIBCO Cloud Quick Starter Kit

This repository is a starter kit to get going with TIBCO Cloud Starters

### Create your first Cloud App

To create your first app run

```bash
ng new --collection=@tibco-tcstk/application-template MyCloudStarter
```

### Create your own cloud component

```bash
ng generate @tibco-tcstk/component-template:comp-base --name component_base
ng generate @tibco-tcstk/component-template:comp-events --name component_events
ng generate @tibco-tcstk/component-template:comp-liveapps --name component_live_apps
ng generate @tibco-tcstk/component-template:comp-spotfire --name component_spotfire
ng generate @tibco-tcstk/component-template:comp-tci --name component_tci
```


### To publish, simply do:

```bash
npm run build
npm publish
npm install
```

That's it!
