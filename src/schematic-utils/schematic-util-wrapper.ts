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
    addExportToModule, getSourceFile
} from "schematics-utilities";
import {strings} from "@angular-devkit/core";
import {classify,dasherize} from "@angular-devkit/core/src/utils/strings";
// import {addDeclarationToModule, addExportToModule} from "../schematics-angular-utils/ast-utils";
const stringUtils = { dasherize, classify };

export class AddToModuleContext {
    source: any;
    relativePath: string;
    classifiedName: string;
}

export interface MyModuleOptions extends ModuleOptions{
    module?: string;
    name: string;
    flat?: boolean;
    path?: string;
    skipImport?: boolean;
    formRegistry?: string;
    type?:string;
    formRef?:string;
}

export function showHead(type:string, context: SchematicContext, options:any){
        // Show the options for this Schematics.
        context.logger.info('-----------------------------------------------');
        context.logger.info('--- **  TIBCO CLOUD COMPONENT GENERATOR  ** ---');
        context.logger.info('--- **                V1.050             ** ---');
        context.logger.info('-----------------------------------------------');
        context.logger.info('--- ** TYPE: TIBCO CUSTOM FORM (' + type.toUpperCase() + ')** ---');
        context.logger.info('-----------------------------------------------');
        context.logger.info('Building TIBCO Cloud Component, with the following settings: ' + JSON.stringify(options));
}

export function addDependencies(options: any, context: SchematicContext, host: Tree){
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
export function formChain(options: any, type: string){
    return chain([
        (_tree: Tree, context: SchematicContext) => {showHead(type, context,options);},
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
            const moduleNameNew = options.name + '-'+type+ '-form';
            const parsedPath = parseName(options.path+ '/custom-forms/', moduleNameNew);
            console.log('parsedPath: ' , parsedPath);
            options.name = parsedPath.name;
            context.logger.info('options.name: ' + options.name);
            options.path = parsedPath.path;
            context.logger.info('options.path: ' + options.path);
            options.export = false;
            // context.logger.info('Adding declaration: ' + options.export);
            options.type = type;
           console.warn('Options: ',options);
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
            options.module = options.module.replace('.ts','.dev');
            // console.warn('Options (DEV): ',options);
        },
        addDeclarationToNgModule(options, false),
        addEntryPointToNgModule(options),
        () => {
            options.module = options.module.replace('.dev','.build');
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
export function updateFormRegistry(options: MyModuleOptions){
    return (host: Tree) => {
        console.log('Updating form registry: ' ,options);
        if(options.formRegistry && options.formRef && options.type && options.name){
            var fRegBuffer = host.read(options.formRegistry);
            if(fRegBuffer) {
                var content = fRegBuffer.toString();
                // console.warn('Form Registry: ', content);
                console.log('--- Updating Form Registry ---')
                const recorder = host.beginUpdate(options.formRegistry);
                console.log('-        ID: ' + options.formRef);
                console.log('-      TYPE: ' + options.type);
                console.log('-      NAME: ' + options.name);
                const toInsert = "\n  new FormRecord('"+options.formRef+"', '"+options.type+"', '"+options.name+"', '"+ options.name + " " + options.type + " Form', "+ classify(options.name ) + "Component),";
                console.log('- INSERTING: ' + toInsert);
                const searchString = 'FORM_REGISTRY = [';
                recorder.insertRight(content.indexOf(searchString) + searchString.length, toInsert);
                // Add the import statement
                const importStatement = 'import {' + classify(options.name) +'Component} from \'./custom-forms/' + dasherize(options.name) + '/' + dasherize(options.name) + '.component\';\n';
                recorder.insertRight(0,importStatement);
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
    // console.log('addDeclarationToNgModule:' , options.module);
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
    // console.log('Add Declaration', host);
    console.log('Adding Declaration:' , options.module);
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    // console.log('context.source:',context.source);
    // console.log('modulePath:',modulePath);
    // console.log('context.classifiedName:',context.classifiedName);
    // console.log('context.relativePath:',context.relativePath);
    const declarationChanges = addDeclarationToModule(context.source,
        modulePath,
        context.classifiedName,
        context.relativePath);
    // console.log('declarationChanges:',declarationChanges);
    const declarationRecorder = host.beginUpdate(modulePath);
    // console.log('mp:',modulePath);
    for (const change of declarationChanges) {
        if (change instanceof InsertChange) {
            declarationRecorder.insertLeft(change.pos, change.toAdd);
            // console.log('change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        }
    }
    host.commitUpdate(declarationRecorder);
};

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
        if (change instanceof InsertChange) {
            exportRecorder.insertLeft(change.pos, change.toAdd);
        }
    }
    host.commitUpdate(exportRecorder);
};

// Function to add an Entry point to the module
function addEntryPoint(host: Tree, options: MyModuleOptions) {
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    console.log('Adding Entry Point: ',modulePath);
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
        if (change instanceof InsertChange) {
            declarationRecorder.insertLeft(change.pos, change.toAdd);
            // console.log('AE]change.pos:',change.pos , ' change.toAdd:',change.toAdd);
        }
    }
    host.commitUpdate(declarationRecorder);
};

//Function to build up the AddToModule Context class
function createAddToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {
    console.log('Create Add to Module Context: ' , options.module);
    const result = new AddToModuleContext();
    // console.log('options.module: ', options.module);
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
