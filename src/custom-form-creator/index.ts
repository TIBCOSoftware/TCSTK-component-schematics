import {Rule} from '@angular-devkit/schematics';
import {formChain} from "../schematic-utils/schematic-util-wrapper";

export default function (options: any): Rule {
  // Call the form chain function to create the generic chain
  return formChain(options, 'creator');

}
