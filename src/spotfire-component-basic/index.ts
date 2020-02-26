import {apply, chain, mergeWith, Rule, SchematicContext, template, Tree, url} from "@angular-devkit/schematics";
import {strings} from "@angular-devkit/core";
import {
  addDeclarationToNgModule,
  addDependencies,
  showHead,
  addPackageDependencies,
  addImportToNgModule
} from "../schematic-utils/schematic-util-wrapper";
import {NodeDependency, NodeDependencyType} from "schematics-utilities";

// Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
export default function (options: any): Rule {
  // The chain rule allows us to chain multiple rules and apply them one after the other.
  options.name = options.name + '-spotfire';
  return chain([
    (_tree: Tree, context: SchematicContext) => {
      showHead("SPOTFIRE - BASIC ", context,options);
    },
    (host: Tree, context: SchematicContext) => {
      options = addDependencies(options, context, host);
    },
    (host: Tree, context: SchematicContext) => {
      console.log(' ' + host + ' ' + context);
      console.log('Adding spotfire lib imports to module ');
      // addDeclarationToNgModule(host, )

    //options = addDependencies(options, context, host);
    },
    (host: Tree) => {
      //console.log(' ' + host + ' ' + context);
      console.log('Adding Spotfire Libraries...');
      const dependencies: NodeDependency[] = [
          { type: NodeDependencyType.Default, version: '^0.7.3', name: '@tibco/spotfire-wrapper' },
          { type: NodeDependencyType.Default, version: '^1.2.1', name: '@tibco-tcstk/tc-spotfire-lib' }];
      addPackageDependencies(host, dependencies);
      console.log('Spotfire Libraries, added to package.json. Please run "npm install" to install them...');

    },
    mergeWith(apply(url('./files'), [
      template({
        ...strings,
        INDEX: options.index,
        name: options.name,
        sfserver: options.sfserver,
        sflocation: options.sflocation
      }),
    ])),

    addDeclarationToNgModule(options, false),
    addImportToNgModule(options, 'TcSpotfireLibModule', '@tibco-tcstk/tc-spotfire-lib')

  ]);
}
