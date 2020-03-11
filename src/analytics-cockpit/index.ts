import {apply, chain, mergeWith, Rule, SchematicContext, template, Tree, url} from "@angular-devkit/schematics";
import {strings} from "@angular-devkit/core";
import {addDeclarationToNgModule, addDependencies, showHead} from "../schematic-utils/schematic-util-wrapper";

// Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
export default function (options: any): Rule {
  // The chain rule allows us to chain multiple rules and apply them one after the other.
  return chain([
    (_tree: Tree, context: SchematicContext) => {
      showHead("ANALYTICS COCKPIT", context,options);
    },
    (host: Tree, context: SchematicContext) => {
      options = addDependencies(options, context, host);
    },
    mergeWith(apply(url('./files'), [
      template({
        ...strings,
        INDEX: options.index,
        name: options.name,
      }),
    ])),
    addDeclarationToNgModule(options, false)
  ]);
}
