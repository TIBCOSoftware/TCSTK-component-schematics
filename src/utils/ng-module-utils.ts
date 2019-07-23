
// Option A: Directly referencing the private APIs
// import { ModuleOptions, buildRelativePath } from "@schematics/angular/utility/find-module";
// import { Rule, Tree, SchematicsException } from "@angular-devkit/schematics";
// import { dasherize, classify } from "@angular-devkit/core";
// import { addDeclarationToModule, addExportToModule } from "@schematics/angular/utility/ast-utils";
// import { InsertChange } from "@schematics/angular/utility/change";

// Option B: Using a fork of the private APIs b/c they can change

import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { AddToModuleContext } from './add-to-module-context';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';

const { dasherize, classify } = strings;

// Referencing forked and copied private APIs 
import { ModuleOptions, buildRelativePath } from '../schematics-angular-utils/find-module';
import {
  addDeclarationToModule,
  addEntryComponentToModule,
  addExportToModule
} from '../schematics-angular-utils/ast-utils';
import { InsertChange } from '../schematics-angular-utils/change';

const stringUtils = { dasherize, classify };

export function addDeclarationToNgModule(options: ModuleOptions, exports: boolean): Rule {
  console.log('addDeclarationToNgModule:' , options.module);
  return (host: Tree) => {
    addDeclaration(host, options);
    if (exports) {
      addExport(host, options);
    }
    return host;
  };
}

export function addEntryPointToNgModule(options: ModuleOptions): Rule {
  return (host: Tree) => {
    addEntryPoint(host, options);

    return host;
  };
}

function createAddToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {
  console.log('createAddToModuleContext:' , options.module);
  const result = new AddToModuleContext();
  console.log('options.module: ', options.module);
  if (!options.module) {
    throw new SchematicsException(`Module not found.`);
  }

  const text = host.read(options.module);

  if (text === null) {
    throw new SchematicsException(`File ${options.module} does not exist!`);
  }
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(options.module, sourceText, ts.ScriptTarget.Latest, true);
/* HUGO: Removed name in path -> get it from the input*/
  const componentPath = `${options.path}/`
      + stringUtils.dasherize(options.name) + '/'
      + stringUtils.dasherize(options.name)
      + '.component';
 /*
  const componentPath = `${options.path}/`
      + stringUtils.dasherize(options.name)
      + '.component';
*/
  result.relativePath = buildRelativePath(options.module, componentPath);

  result.classifiedName = stringUtils.classify(`${options.name}Component`);

  return result;

}

function addDeclaration(host: Tree, options: ModuleOptions) {
  // console.log('Add Declaration', host);
  console.log('addDeclaration:' , options.module);
  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  // console.log('context.source:',context.source);
  console.log('modulePath:',modulePath);
  console.log('context.classifiedName:',context.classifiedName);
  console.log('context.relativePath:',context.relativePath);

  const declarationChanges = addDeclarationToModule(context.source,
    modulePath,
      context.classifiedName,
      context.relativePath);
  //console.log('declarationChanges:',declarationChanges);

  const declarationRecorder = host.beginUpdate(modulePath);
  console.log('mp:',modulePath);
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
      console.log('change.pos:',change.pos , ' change.toAdd:',change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
};


function addEntryPoint(host: Tree, options: ModuleOptions) {

  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

 // console.log('AE]context.source:',context.source);
  console.log('AE]modulePath:',modulePath);
  console.log('AE]context.classifiedName:',context.classifiedName);
  console.log('AE]context.relativePath:',context.relativePath);

  const declarationChanges = addEntryComponentToModule(context.source,
      modulePath,
      context.classifiedName,
      context.relativePath);
  //console.log('declarationChanges:',declarationChanges);

  const declarationRecorder = host.beginUpdate(modulePath);
  console.log('mp:',modulePath);
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
      console.log('AE]change.pos:',change.pos , ' change.toAdd:',change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
};


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
