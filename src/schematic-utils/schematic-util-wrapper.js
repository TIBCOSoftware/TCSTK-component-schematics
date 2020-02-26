"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const schematics_utilities_1 = require("schematics-utilities");
const core_1 = require("@angular-devkit/core");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
// import {addDeclarationToModule, addExportToModule} from "../schematics-angular-utils/ast-utils";
const stringUtils = { dasherize: strings_1.dasherize, classify: strings_1.classify };
class AddToModuleContext {
}
exports.AddToModuleContext = AddToModuleContext;
function showHead(type, context, options) {
    // Show the options for this Schematics.
    context.logger.info('-----------------------------------------------');
    context.logger.info('--- **  TIBCO CLOUD COMPONENT GENERATOR  ** ---');
    context.logger.info('--- **                V1.2.1             ** ---');
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
        (_tree, context) => { showHead('CUSTOM FORM: ' + type, context, options); },
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
    // console.log('addDeclarationToNgModule:' , options.module);
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
    // console.log('Add Declaration', host);
    console.log('Adding Declaration:', options.module);
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    // console.log('context.source:',context.source);
    // console.log('modulePath:',modulePath);
    // console.log('context.classifiedName:',context.classifiedName);
    // console.log('context.relativePath:',context.relativePath);
    const declarationChanges = schematics_utilities_1.addDeclarationToModule(context.source, modulePath, context.classifiedName, context.relativePath);
    // console.log('declarationChanges:',declarationChanges);
    const declarationRecorder = host.beginUpdate(modulePath);
    // console.log('mp:',modulePath);
    for (const change of declarationChanges) {
        if (change instanceof schematics_utilities_1.InsertChange) {
            declarationRecorder.insertLeft(change.pos, change.toAdd);
            // console.log('change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        }
    }
    host.commitUpdate(declarationRecorder);
}
;
// Function to add an export to a module
function addExport(host, options) {
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    const exportChanges = schematics_utilities_1.addExportToModule(context.source, modulePath, context.classifiedName, context.relativePath);
    const exportRecorder = host.beginUpdate(modulePath);
    for (const change of exportChanges) {
        if (change instanceof schematics_utilities_1.InsertChange) {
            exportRecorder.insertLeft(change.pos, change.toAdd);
        }
    }
    host.commitUpdate(exportRecorder);
}
;
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
        if (change instanceof schematics_utilities_1.InsertChange) {
            declarationRecorder.insertLeft(change.pos, change.toAdd);
            // console.log('AE]change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        }
    }
    host.commitUpdate(declarationRecorder);
}
;
//Function to build up the AddToModule Context class
function createAddToModuleContext(host, options) {
    console.log('Create Add to Module Context: ', options.module);
    const result = new AddToModuleContext();
    // console.log('options.module: ', options.module);
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
    const importChanges = schematics_utilities_1.addImportToModule(schematics_utilities_1.getSourceFile(host, options.module), modulePath, lib, importPath);
    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of importChanges) {
        if (change instanceof schematics_utilities_1.InsertChange) {
            declarationRecorder.insertLeft(change.pos, change.toAdd);
            //console.log('change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        }
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
//# sourceMappingURL=schematic-util-wrapper.js.map