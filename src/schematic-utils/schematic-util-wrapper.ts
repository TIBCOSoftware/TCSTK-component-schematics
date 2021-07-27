import {
    apply,
    chain,
    mergeWith,
    Rule,
    SchematicContext,
    SchematicsException,
    template,
    Tree,
    url
} from "@angular-devkit/schematics";
import {
    getWorkspace,
    getProjectFromWorkspace,
    findModuleFromOptions,
    parseName,
    addEntryComponentToModule,
    buildRelativePath,
    InsertChange,
    ModuleOptions,
    addDeclarationToModule,
    addExportToModule, getSourceFile, addPackageJsonDependency, NodeDependency, addImportToModule, NodeDependencyType
} from "schematics-utilities";
import {strings} from "@angular-devkit/core";
import {classify, dasherize} from "@angular-devkit/core/src/utils/strings";
// import {typescript} from "schematics-utilities/dist/cdk";
// import {addDeclarationToModule, addExportToModule} from "../schematics-angular-utils/ast-utils";
const stringUtils = {dasherize, classify};

export class AddToModuleContext {
    source: any;
    relativePath: string;
    classifiedName: string;
}

export interface MyModuleOptions extends ModuleOptions {
    module?: string;
    name: string;
    flat?: boolean;
    path?: string;
    skipImport?: boolean;
    formRegistry?: string;
    type?: string;
    formRef?: string;
    doAddRoutes?: boolean;
    doAddConfig?: boolean;
    doAddMapping?: boolean;
}

export function showHead(type: string, context: SchematicContext, options: any) {
    // Show the options for this Schematics.
    context.logger.info('-----------------------------------------------');
    context.logger.info('--- **  TIBCO CLOUD COMPONENT GENERATOR  ** ---');
    context.logger.info('--- **                V2.3.3             ** ---');
    context.logger.info('-----------------------------------------------');
    context.logger.info('--- ** TYPE: ' + type.toUpperCase());
    context.logger.info('-----------------------------------------------');
    context.logger.info('Building TIBCO Cloud Component, with the following settings: ' + JSON.stringify(options));
}

export function addDependencies(options: any, context: SchematicContext, host: Tree) {
    context.logger.log('info', "Name: " + options.name);
    context.logger.info('Adding dependencies...');
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
        workspace,
        // Takes the first project in case it's not provided by CLI
        options.project ? options.project : Object.keys(workspace['projects'])[0]
    );
    const moduleName = options.name + 'Component';
    const sourceLoc = './' + options.name + '/' + options.name + '.component';
    context.logger.info('moduleName: ' + moduleName);
    context.logger.info('sourceLoc: ' + sourceLoc);
    context.logger.info('Project Root: ' + project.root);
    if (!options.project) {
        options.project = Object.keys(workspace.projects)[0];
    }
    if (options.path === undefined) {
        const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
        options.path = `/${project.root}/src/${projectDirName}`;
    }
    options.module = findModuleFromOptions(host, options);
    const moduleNameNew = options.name;
    const parsedPath = parseName(options.path, moduleNameNew);
    options.name = parsedPath.name;
    context.logger.info('options.name: ' + options.name);
    options.path = parsedPath.path;
    context.logger.info('options.path: ' + options.path);
    options.export = false;
    context.logger.info('Installed Dependencies...');
    return options;
}


// Function for form
export function formChain(options: any, type: string) {
    return chain([
        (_tree: Tree, context: SchematicContext) => {
            showHead('CUSTOM FORM: ' + type, context, options);
        },
        // Adding dependencies
        (host: Tree, context: SchematicContext) => {
            context.logger.log('info', "Name: " + options.name);
            context.logger.info('Adding dependencies...');
            const workspace = getWorkspace(host);
            const project = getProjectFromWorkspace(
                workspace,
                // Takes the first project in case it's not provided by CLI
                options.project ? options.project : Object.keys(workspace['projects'])[0]
            );
            // updateFormRegistry(project, host, context);
            const moduleName = options.name + 'Component';
            const sourceLoc = './custom-forms/' + options.name + '/' + options.name + '.component';
            context.logger.info('moduleName: ' + moduleName);
            context.logger.info('sourceLoc: ' + sourceLoc);
            context.logger.info('Project Root: ' + project.root);
            if (!options.project) {
                options.project = Object.keys(workspace.projects)[0];
            }
            if (options.path === undefined) {
                const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
                options.path = `/${project.root}/src/${projectDirName}`;
            }
            options.module = findModuleFromOptions(host, options);
            const moduleNameNew = options.name + '-' + type + '-form';
            const parsedPath = parseName(options.path + '/custom-forms/', moduleNameNew);
            console.log('parsedPath: ', parsedPath);
            options.name = parsedPath.name;
            context.logger.info('options.name: ' + options.name);
            options.path = parsedPath.path;
            context.logger.info('options.path: ' + options.path);
            options.export = false;
            // context.logger.info('Adding declaration: ' + options.export);
            options.type = type;
            console.warn('Options: ', options);
        },
        //Apply Template
        mergeWith(apply(url('./files'), [
            template({
                ...strings,
                INDEX: options.index,
                name: options.name,
            }),
        ])),
        addDeclarationToNgModule(options, false),
        addEntryPointToNgModule(options),
        () => {
            options.module = options.module.replace('.ts', '.dev');
            // console.warn('Options (DEV): ',options);
        },
        addDeclarationToNgModule(options, false),
        addEntryPointToNgModule(options),
        () => {
            options.module = options.module.replace('.dev', '.build');
            // console.warn('Options (BUILD): ',options);
        },
        addDeclarationToNgModule(options, false),
        addEntryPointToNgModule(options),
        () => {
            options.formRegistry = '/src/app/form.registry.ts';
            // console.warn('Options (Form Registry): ',options);
        },
        updateFormRegistry(options)
    ]);
}

// Function to update the form registry
export function updateFormRegistry(options: MyModuleOptions) {
    return (host: Tree) => {
        console.log('Updating form registry: ', options);
        if (options.formRegistry && options.formRef && options.type && options.name) {
            var fRegBuffer = host.read(options.formRegistry);
            if (fRegBuffer) {
                var content = fRegBuffer.toString();
                // console.warn('Form Registry: ', content);
                console.log('--- Updating Form Registry ---')
                const recorder = host.beginUpdate(options.formRegistry);
                console.log('-        ID: ' + options.formRef);
                console.log('-      TYPE: ' + options.type);
                console.log('-      NAME: ' + options.name);
                const toInsert = "\n  new FormRecord('" + options.formRef + "', '" + options.type + "', '" + options.name + "', '" + options.name + " " + options.type + " Form', " + classify(options.name) + "Component),";
                console.log('- INSERTING: ' + toInsert);
                const searchString = 'FORM_REGISTRY = [';
                recorder.insertRight(content.indexOf(searchString) + searchString.length, toInsert);
                // Add the import statement
                const importStatement = 'import {' + classify(options.name) + 'Component} from \'./custom-forms/' + dasherize(options.name) + '/' + dasherize(options.name) + '.component\';\n';
                recorder.insertRight(0, importStatement);
                host.commitUpdate(recorder);
            }
        }
        return host;
    };
}

// wrapper to create a rule
export function addEntryPointToNgModule(options: ModuleOptions): Rule {
    return (host: Tree) => {
        addEntryPoint(host, options);
        return host;
    };
}

// wrapper to create a rule
export function addDeclarationToNgModule(options: ModuleOptions, exports: boolean): Rule {
    // console.log('addDeclarationToNgModule:' , options);
    return (host: Tree) => {
        addDeclaration(host, options);
        if (exports) {
            addExport(host, options);
        }
        return host;
    };
}

// Function to add a declaration to a module
function addDeclaration(host: Tree, options: ModuleOptions) {
    //console.log('Add Declaration', host);
    // console.log('Adding Declaration:' , options.module);
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    //console.log('context.source:',context.source);
    //console.log('modulePath:',modulePath);
    //console.log('context.classifiedName:',context.classifiedName);
    //console.log('context.relativePath:',context.relativePath);
    const declarationChanges = addDeclarationToModule(context.source,
        modulePath,
        context.classifiedName,
        context.relativePath);
    // console.log('declarationChanges:',declarationChanges);
    const declarationRecorder = host.beginUpdate(modulePath);
    // console.log('mp: ',modulePath);
    for (const myChange of declarationChanges) {
        // FIXED FOR ANGULAR 10; ADDED A CAST TO InsertChange
        let newChange: InsertChange = <InsertChange>myChange;
        //if (myChange instanceof InsertChange) {
        declarationRecorder.insertLeft(newChange.pos, newChange.toAdd);
        //console.log('change.pos:',newChange.pos , ' change.toAdd:',newChange.toAdd);
        //}
    }
    // console.log('Commit Update: ' , declarationRecorder);
    host.commitUpdate(declarationRecorder);
}

// Function to add an export to a module
function addExport(host: Tree, options: ModuleOptions) {
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    const exportChanges = addExportToModule(context.source,
        modulePath,
        context.classifiedName,
        context.relativePath);
    const exportRecorder = host.beginUpdate(modulePath);
    for (const change of exportChanges) {
        // FIXED FOR ANGULAR 10; ADDED A CAST TO InsertChange
        let newChange: InsertChange = <InsertChange>change;
        //if (change instanceof InsertChange) {
        exportRecorder.insertLeft(newChange.pos, newChange.toAdd);
        //}
    }
    host.commitUpdate(exportRecorder);
}

// Function to add an Entry point to the module
function addEntryPoint(host: Tree, options: MyModuleOptions) {
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    console.log('Adding Entry Point: ', modulePath);
    // console.log('AE]context.source:',context.source);
    // console.log('AE]modulePath:',modulePath);
    // console.log('AE]context.classifiedName:',context.classifiedName);
    // console.log('AE]context.relativePath:',context.relativePath);
    const declarationChanges = addEntryComponentToModule(context.source,
        modulePath,
        context.classifiedName,
        context.relativePath);
    //console.log('declarationChanges:',declarationChanges);
    const declarationRecorder = host.beginUpdate(modulePath);
    // console.log('mp:',modulePath);
    for (const change of declarationChanges) {
        // FIXED FOR ANGULAR 10; ADDED A CAST TO InsertChange
        let newChange: InsertChange = <InsertChange>change;
        //if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(newChange.pos, newChange.toAdd);
        // console.log('AE]change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        //}
    }
    host.commitUpdate(declarationRecorder);
}

//Function to build up the AddToModule Context class
function createAddToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {
    console.log('Create Add to Module Context: ', options.module);
    const result = new AddToModuleContext();
    console.log('options.module: ', options.module);
    if (!options.module) {
        throw new SchematicsException(`Module not found.`);
    }
    const text = host.read(options.module);
    if (text === null) {
        throw new SchematicsException(`File ${options.module} does not exist!`);
    }
    result.source = getSourceFile(host, options.module);
    const componentPath = `${options.path}/`
        + stringUtils.dasherize(options.name) + '/'
        + stringUtils.dasherize(options.name)
        + '.component';
    result.relativePath = buildRelativePath(options.module, componentPath);
    result.classifiedName = stringUtils.classify(`${options.name}Component`);
    return result;
}


export function addPackageDependencies(host: Tree, dependencies: NodeDependency[]): Tree {
    //const dependencies: NodeDependency[] = [{ type: NodeDependencyType.Default, version: '4.17.10', name: 'lodash-es' }];
    dependencies.forEach(dependency => addPackageJsonDependency(host, dependency));
    return host;
}

// Function to import a library to node modules
function addImport(host: Tree, options: ModuleOptions, lib: string, importPath: string) {
    if (!options.module) {
        throw new SchematicsException(`Module not found.`);
    }
    const modulePath = options.module || '';
    console.log('Adding Import to Point: ', modulePath);
    console.log('Library to Import: ' + lib)
    console.log('      Import Path: ' + importPath);
    // @ts-ignore
    const importChanges = addImportToModule(getSourceFile(host, options.module), modulePath, lib, importPath);
    // TODO: Fix this to update to (schematics-utilities - 2.0.1)
    /*
    //const sourceFile:typescript.SourceFile = getSourceFile(host, options.module);
    const sourceFile:any = getSourceFile(host, options.module);
    console.log('ADDING SOURCE FILE: ' , sourceFile);
    const importChanges = addImportToModule(sourceFile, modulePath, lib, importPath );
    console.log('DONE ADDING SOURCE FILE: ' , importChanges);*/
    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of importChanges) {
        // FIXED FOR ANGULAR 10; ADDED A CAST TO InsertChange
        let newChange: InsertChange = <InsertChange>change;
        //if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(newChange.pos, newChange.toAdd);
        //console.log('change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        //}
    }
    host.commitUpdate(declarationRecorder);
}

export function addImportToNgModule(options: ModuleOptions, lib: string, importPath: string): Rule {
    return (host: Tree) => {
        addImport(host, options, lib, importPath);
        return host;
    };
}

export function addSpotfireLibs(): Rule {
    return (host: Tree) => {
        //console.log(' ' + host + ' ' + context);
        console.log('Adding Spotfire Libraries...');
        const dependencies: NodeDependency[] = [
            //TODO: make versions configurable
            {type: NodeDependencyType.Default, version: '^0.15.0', name: '@tibco/spotfire-wrapper'},
            {type: NodeDependencyType.Default, version: '^2.4.1', name: '@tibco-tcstk/tc-spotfire-lib'}];
        addPackageDependencies(host, dependencies);
        console.log('Spotfire Libraries, added to package.json. Please run "npm install" to install them...');
        return host;
    }
}

export class routeConfig {
    path: string;
    component: string;
    configResolverName: string;
    resolver: string;
    useClaimsResolver: boolean
}

/*

*/

const sFSettingImport = "import {SettingsSpotfireComponent, SpotfireConfigResolver} from \"@tibco-tcstk/tc-spotfire-lib\";\n";
const sFSettingsString = "  {\n" +
    "    path: 'spotfire-settings',\n" +
    "    component: SettingsSpotfireComponent,\n" +
    "    resolve: {\n" +
    "      spotfireConfigHolder: SpotfireConfigResolver,\n" +
    "      claimsHolder: ClaimsResolver\n" +
    "    }\n" +
    "  },";

const sFMappingImport = "import {\n" +
    "  SettingsSpotfireCreateCaseMappingComponent,\n" +
    "  SpotfireMarkingLiveappsConfigResolver\n" +
    "} from \"@tibco-tcstk/tc-spotfire-lib\";\n";
const sFMappingString = "\n" +
    "  {\n" +
    "    path: 'spotfire-create-live-apps-case-mapping',\n" +
    "    component: SettingsSpotfireCreateCaseMappingComponent,\n" +
    "    resolve: {\n" +
    "      spotfireMappingConfigHolder: SpotfireMarkingLiveappsConfigResolver,\n" +
    "      claimsHolder: ClaimsResolver\n" +
    "    }\n" +
    "  },";
const sfConfigResolver = "\n  SpotfireConfigResolver,";
const sfConfigResolverDef = "\n      ,spotfireConfigHolder: SpotfireConfigResolver";
const sfMarkingResolver = "\n  SpotfireMarkingLiveappsConfigResolver,";
const sfMarkingResolverDef = "\n      ,spotfireMappingConfigHolder: SpotfireMarkingLiveappsConfigResolver";
// import {SpotfireConfigResolver} from '@tibco-tcstk/tc-spotfire-lib';
const sFSettingResolverImport = "import {SpotfireConfigResolver} from '@tibco-tcstk/tc-spotfire-lib';\n";
// import {SpotfireMarkingLiveappsConfigResolver} from '@tibco-tcstk/tc-spotfire-lib';
const sFSettingMappingImport = "import {SpotfireMarkingLiveappsConfigResolver} from '@tibco-tcstk/tc-spotfire-lib';\n";

// Function to update the route configuration
export function addSFRoutes(options: MyModuleOptions) {
    console.log('Spotfire Routes:');
    return (host: Tree) => {
        if (options.doAddRoutes) {
            console.log('Adding Spotfire Routes...');
            const doSFMapping = options.doAddMapping;
            // Adding the configuration route
            const configST = 'CONFIGURATION_ROUTE_CONFIG = [';
            const routeLocation = 'src/app/route-config/starter-app-route-config/configuration-route-config/configuration-route-config.ts';
            host = insertIntoFile(host, routeLocation, [''], sFSettingImport, 0);
            host = insertIntoFile(host, routeLocation, [configST], sFSettingsString, 0);
            if (doSFMapping) {
                host = insertIntoFile(host, routeLocation, [''], sFMappingImport, 0);
                host = insertIntoFile(host, routeLocation, [configST], sFMappingString, 0);
            }
            const providersST = 'CONFIGURATION_ROUTE_PROVIDERS = [';
            host = insertIntoFile(host, routeLocation, [providersST], sfConfigResolver, 0);
            if (doSFMapping) {
                host = insertIntoFile(host, routeLocation, [providersST], sfMarkingResolver, 0);
            }
            const routeHomeLocation = 'src/app/route-config/starter-app-route-config/starter-app-route-config.ts';
            const pathST = ["path: 'home',", "resolve: {", '}'];
            host = insertIntoFile(host, routeHomeLocation, [''], sFSettingResolverImport, 0);
            host = insertIntoFile(host, routeHomeLocation, pathST, sfConfigResolverDef, -1);
            if (doSFMapping) {
                host = insertIntoFile(host, routeHomeLocation, [''], sFSettingMappingImport, 0);
                host = insertIntoFile(host, routeHomeLocation, pathST, sfMarkingResolverDef, -1);
            }
        } else {
            console.log('Skipping Adding of Spotfire Routes......');
        }
        return host;
    };
}

const sFMenuConfig = "    ,{\n" +
    "      \"entry\": \"Spotfire\",\n" +
    "      \"icon\": \"tcs-spotfire-icon\",\n" +
    "      \"options\": [\n" +
    "        \"Settings\"\n" +
    "      ]\n" +
    "    }";

const sFMenuConfigMapping = ",{\n" +
    "      \"entry\": \"Spotfire\",\n" +
    "      \"icon\": \"tcs-spotfire-icon\",\n" +
    "      \"options\": [\n" +
    "        \"Settings\",\n" +
    "        \"Create Live Apps Case Mapping\"\n" +
    "      ]\n" +
    "    }\n";

// Function to update the MENU configuration
export function addSFMenuConfig(options: MyModuleOptions) {
    console.log('Spotfire Menu Configurations:');
    return (host: Tree) => {
        if (options.doAddConfig) {
            console.log('Adding Spotfire Menu Configurations');
            const doSFMapping = options.doAddMapping;
            const configMenuLocation = 'src/assets/config/configurationMenuConfig.json';
            var fRegBuffer = host.read(configMenuLocation);
            if (fRegBuffer) {
                let content = fRegBuffer.toString();
                let location = content.lastIndexOf("]") - 1;
                const recorder = host.beginUpdate(configMenuLocation);
                let toInsertAfter = sFMenuConfig;
                if (doSFMapping) {
                    toInsertAfter = sFMenuConfigMapping;
                }
                recorder.insertRight(location, toInsertAfter);
                host.commitUpdate(recorder);
            }
        } else {
            console.log('Skipping Adding of Spotfire Menu Configurations...');
        }
        return host;
    };
}


// Function to insert into a file
// Leave search string blank ("") to add to the beginning of the file
function insertIntoFile(host: Tree, fileName: string, searchString: string[], toInsertAfter: string, offset: number) {
    var fRegBuffer = host.read(fileName);
    if (fRegBuffer) {
        var content = fRegBuffer.toString();
        console.log('--- INSERTING INTO FILE (' + fileName + ') ---');
        console.log('- SEARCH STRING: ' + searchString);
        const recorder = host.beginUpdate(fileName);
        console.log('- INSERTING: ' + toInsertAfter);
        if (searchString[0] === "") {
            recorder.insertRight(0, toInsertAfter);
        } else {
            let insertAt = offset;
            let tempSearchString = content;
            for (let st of searchString) {
                console.log(st);
                let tempLoc = tempSearchString.indexOf(st) + st.length;
                tempSearchString = tempSearchString.substring(tempLoc);
                insertAt += tempLoc;
            }
            recorder.insertRight(insertAt, toInsertAfter);
        }
        host.commitUpdate(recorder);
    }
    return host;
}


export function createFile(path: string, content: string): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        tree.create(path, content);
        return tree;
    };
}
