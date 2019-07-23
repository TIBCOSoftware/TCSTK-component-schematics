import {Rule} from '@angular-devkit/schematics';
import {formChain} from "../utils/form-utils";

export default function (options: any): Rule {
  // Call the form chain function to create the generic chain
  return formChain(options, 'CREATOR');

}
