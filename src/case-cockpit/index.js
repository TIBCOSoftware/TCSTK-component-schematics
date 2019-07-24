"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const schematic_util_wrapper_1 = require("../schematic-utils/schematic-util-wrapper");
// Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
function default_1(options) {
    // The chain rule allows us to chain multiple rules and apply them one after the other.
    return schematics_1.chain([
        (_tree, context) => {
            schematic_util_wrapper_1.showHead("CASE COCKPIT", context, options);
        },
        (host, context) => { options = schematic_util_wrapper_1.addDependencies(options, context, host); },
        schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, { INDEX: options.index, name: options.name })),
        ])),
        schematic_util_wrapper_1.addDeclarationToNgModule(options, false)
    ]);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map