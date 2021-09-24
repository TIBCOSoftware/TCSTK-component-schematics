"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFile = exports.addSFMenuConfig = exports.addSFRoutes = exports.routeConfig = exports.addSpotfireLibs = exports.addImportToNgModule = exports.addPackageDependencies = exports.addDeclarationToNgModule = exports.addEntryPointToNgModule = exports.updateFormRegistry = exports.formChain = exports.addDependencies = exports.showHead = exports.AddToModuleContext = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const schematics_utilities_1 = require("schematics-utilities");
const core_1 = require("@angular-devkit/core");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
// import {typescript} from "schematics-utilities/dist/cdk";
// import {addDeclarationToModule, addExportToModule} from "../schematics-angular-utils/ast-utils";
const stringUtils = { dasherize: strings_1.dasherize, classify: strings_1.classify };
class AddToModuleContext {
}
exports.AddToModuleContext = AddToModuleContext;
function showHead(type, context, options) {
    // Show the options for this Schematics.
    context.logger.info('-----------------------------------------------');
    context.logger.info('--- **  TIBCO CLOUD COMPONENT GENERATOR  ** ---');
    context.logger.info('--- **                V2.3.3             ** ---');
    context.logger.info('-----------------------------------------------');
    context.logger.info('--- ** TYPE: ' + type.toUpperCase());
    context.logger.info('-----------------------------------------------');
    context.logger.info('Building TIBCO Cloud Component, with the following settings: ' + JSON.stringify(options));
}
exports.showHead = showHead;
function addDependencies(options, context, host) {
    context.logger.log('info', "Name: " + options.name);
    context.logger.info('Adding dependencies...');
    const workspace = schematics_utilities_1.getWorkspace(host);
    const project = schematics_utilities_1.getProjectFromWorkspace(workspace, 
    // Takes the first project in case it's not provided by CLI
    options.project ? options.project : Object.keys(workspace['projects'])[0]);
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
    options.module = schematics_utilities_1.findModuleFromOptions(host, options);
    const moduleNameNew = options.name;
    const parsedPath = schematics_utilities_1.parseName(options.path, moduleNameNew);
    options.name = parsedPath.name;
    context.logger.info('options.name: ' + options.name);
    options.path = parsedPath.path;
    context.logger.info('options.path: ' + options.path);
    options.export = false;
    context.logger.info('Installed Dependencies...');
    return options;
}
exports.addDependencies = addDependencies;
// Function for form
function formChain(options, type) {
    return schematics_1.chain([
        (_tree, context) => {
            showHead('CUSTOM FORM: ' + type, context, options);
        },
        // Adding dependencies
        (host, context) => {
            context.logger.log('info', "Name: " + options.name);
            context.logger.info('Adding dependencies...');
            const workspace = schematics_utilities_1.getWorkspace(host);
            const project = schematics_utilities_1.getProjectFromWorkspace(workspace, 
            // Takes the first project in case it's not provided by CLI
            options.project ? options.project : Object.keys(workspace['projects'])[0]);
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
            options.module = schematics_utilities_1.findModuleFromOptions(host, options);
            const moduleNameNew = options.name + '-' + type + '-form';
            const parsedPath = schematics_utilities_1.parseName(options.path + '/custom-forms/', moduleNameNew);
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
        schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign(Object.assign({}, core_1.strings), { INDEX: options.index, name: options.name })),
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
exports.formChain = formChain;
// Function to update the form registry
function updateFormRegistry(options) {
    return (host) => {
        console.log('Updating form registry: ', options);
        if (options.formRegistry && options.formRef && options.type && options.name) {
            var fRegBuffer = host.read(options.formRegistry);
            if (fRegBuffer) {
                var content = fRegBuffer.toString();
                // console.warn('Form Registry: ', content);
                console.log('--- Updating Form Registry ---');
                const recorder = host.beginUpdate(options.formRegistry);
                console.log('-        ID: ' + options.formRef);
                console.log('-      TYPE: ' + options.type);
                console.log('-      NAME: ' + options.name);
                const toInsert = "\n  new FormRecord('" + options.formRef + "', '" + options.type + "', '" + options.name + "', '" + options.name + " " + options.type + " Form', " + strings_1.classify(options.name) + "Component),";
                console.log('- INSERTING: ' + toInsert);
                const searchString = 'FORM_REGISTRY = [';
                recorder.insertRight(content.indexOf(searchString) + searchString.length, toInsert);
                // Add the import statement
                const importStatement = 'import {' + strings_1.classify(options.name) + 'Component} from \'./custom-forms/' + strings_1.dasherize(options.name) + '/' + strings_1.dasherize(options.name) + '.component\';\n';
                recorder.insertRight(0, importStatement);
                host.commitUpdate(recorder);
            }
        }
        return host;
    };
}
exports.updateFormRegistry = updateFormRegistry;
// wrapper to create a rule
function addEntryPointToNgModule(options) {
    return (host) => {
        addEntryPoint(host, options);
        return host;
    };
}
exports.addEntryPointToNgModule = addEntryPointToNgModule;
// wrapper to create a rule
function addDeclarationToNgModule(options, exports) {
    // console.log('addDeclarationToNgModule:' , options);
    return (host) => {
        addDeclaration(host, options);
        if (exports) {
            addExport(host, options);
        }
        return host;
    };
}
exports.addDeclarationToNgModule = addDeclarationToNgModule;
// Function to add a declaration to a module
function addDeclaration(host, options) {
    //console.log('Add Declaration', host);
    // console.log('Adding Declaration:' , options.module);
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    //console.log('context.source:',context.source);
    //console.log('modulePath:',modulePath);
    //console.log('context.classifiedName:',context.classifiedName);
    //console.log('context.relativePath:',context.relativePath);
    const declarationChanges = schematics_utilities_1.addDeclarationToModule(context.source, modulePath, context.classifiedName, context.relativePath);
    // console.log('declarationChanges:',declarationChanges);
    const declarationRecorder = host.beginUpdate(modulePath);
    // console.log('mp: ',modulePath);
    for (const myChange of declarationChanges) {
        // FIXED FOR ANGULAR 10; ADDED A CAST TO InsertChange
        let newChange = myChange;
        //if (myChange instanceof InsertChange) {
        declarationRecorder.insertLeft(newChange.pos, newChange.toAdd);
        //console.log('change.pos:',newChange.pos , ' change.toAdd:',newChange.toAdd);
        //}
    }
    // console.log('Commit Update: ' , declarationRecorder);
    host.commitUpdate(declarationRecorder);
}
// Function to add an export to a module
function addExport(host, options) {
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    const exportChanges = schematics_utilities_1.addExportToModule(context.source, modulePath, context.classifiedName, context.relativePath);
    const exportRecorder = host.beginUpdate(modulePath);
    for (const change of exportChanges) {
        // FIXED FOR ANGULAR 10; ADDED A CAST TO InsertChange
        let newChange = change;
        //if (change instanceof InsertChange) {
        exportRecorder.insertLeft(newChange.pos, newChange.toAdd);
        //}
    }
    host.commitUpdate(exportRecorder);
}
// Function to add an Entry point to the module
function addEntryPoint(host, options) {
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    console.log('Adding Entry Point: ', modulePath);
    // console.log('AE]context.source:',context.source);
    // console.log('AE]modulePath:',modulePath);
    // console.log('AE]context.classifiedName:',context.classifiedName);
    // console.log('AE]context.relativePath:',context.relativePath);
    const declarationChanges = schematics_utilities_1.addEntryComponentToModule(context.source, modulePath, context.classifiedName, context.relativePath);
    //console.log('declarationChanges:',declarationChanges);
    const declarationRecorder = host.beginUpdate(modulePath);
    // console.log('mp:',modulePath);
    for (const change of declarationChanges) {
        // FIXED FOR ANGULAR 10; ADDED A CAST TO InsertChange
        let newChange = change;
        //if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(newChange.pos, newChange.toAdd);
        // console.log('AE]change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        //}
    }
    host.commitUpdate(declarationRecorder);
}
//Function to build up the AddToModule Context class
function createAddToModuleContext(host, options) {
    console.log('Create Add to Module Context: ', options.module);
    const result = new AddToModuleContext();
    console.log('options.module: ', options.module);
    if (!options.module) {
        throw new schematics_1.SchematicsException(`Module not found.`);
    }
    const text = host.read(options.module);
    if (text === null) {
        throw new schematics_1.SchematicsException(`File ${options.module} does not exist!`);
    }
    result.source = schematics_utilities_1.getSourceFile(host, options.module);
    const componentPath = `${options.path}/`
        + stringUtils.dasherize(options.name) + '/'
        + stringUtils.dasherize(options.name)
        + '.component';
    result.relativePath = schematics_utilities_1.buildRelativePath(options.module, componentPath);
    result.classifiedName = stringUtils.classify(`${options.name}Component`);
    return result;
}
function addPackageDependencies(host, dependencies) {
    //const dependencies: NodeDependency[] = [{ type: NodeDependencyType.Default, version: '4.17.10', name: 'lodash-es' }];
    dependencies.forEach(dependency => schematics_utilities_1.addPackageJsonDependency(host, dependency));
    return host;
}
exports.addPackageDependencies = addPackageDependencies;
// Function to import a library to node modules
function addImport(host, options, lib, importPath) {
    if (!options.module) {
        throw new schematics_1.SchematicsException(`Module not found.`);
    }
    const modulePath = options.module || '';
    console.log('Adding Import to Point: ', modulePath);
    console.log('Library to Import: ' + lib);
    console.log('      Import Path: ' + importPath);
    // @ts-ignore
    const importChanges = schematics_utilities_1.addImportToModule(schematics_utilities_1.getSourceFile(host, options.module), modulePath, lib, importPath);
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
        let newChange = change;
        //if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(newChange.pos, newChange.toAdd);
        //console.log('change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        //}
    }
    host.commitUpdate(declarationRecorder);
}
function addImportToNgModule(options, lib, importPath) {
    return (host) => {
        addImport(host, options, lib, importPath);
        return host;
    };
}
exports.addImportToNgModule = addImportToNgModule;
function addSpotfireLibs() {
    return (host) => {
        //console.log(' ' + host + ' ' + context);
        console.log('Adding Spotfire Libraries...');
        const dependencies = [
            //TODO: make versions configurable
            { type: schematics_utilities_1.NodeDependencyType.Default, version: '^0.15.0', name: '@tibco/spotfire-wrapper' },
            { type: schematics_utilities_1.NodeDependencyType.Default, version: '^2.4.1', name: '@tibco-tcstk/tc-spotfire-lib' }
        ];
        addPackageDependencies(host, dependencies);
        console.log('Spotfire Libraries, added to package.json. Please run "npm install" to install them...');
        return host;
    };
}
exports.addSpotfireLibs = addSpotfireLibs;
class routeConfig {
}
exports.routeConfig = routeConfig;
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
function addSFRoutes(options) {
    console.log('Spotfire Routes:');
    return (host) => {
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
        }
        else {
            console.log('Skipping Adding of Spotfire Routes......');
        }
        return host;
    };
}
exports.addSFRoutes = addSFRoutes;
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
function addSFMenuConfig(options) {
    console.log('Spotfire Menu Configurations:');
    return (host) => {
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
        }
        else {
            console.log('Skipping Adding of Spotfire Menu Configurations...');
        }
        return host;
    };
}
exports.addSFMenuConfig = addSFMenuConfig;
// Function to insert into a file
// Leave search string blank ("") to add to the beginning of the file
function insertIntoFile(host, fileName, searchString, toInsertAfter, offset) {
    var fRegBuffer = host.read(fileName);
    if (fRegBuffer) {
        var content = fRegBuffer.toString();
        console.log('--- INSERTING INTO FILE (' + fileName + ') ---');
        console.log('- SEARCH STRING: ' + searchString);
        const recorder = host.beginUpdate(fileName);
        console.log('- INSERTING: ' + toInsertAfter);
        if (searchString[0] === "") {
            recorder.insertRight(0, toInsertAfter);
        }
        else {
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
function createFile(path, content) {
    return (tree, _context) => {
        tree.create(path, content);
        return tree;
    };
}
exports.createFile = createFile;
//# sourceMappingURL=schematic-util-wrapper.js.map