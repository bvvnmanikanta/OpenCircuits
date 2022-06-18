import {OperatorFormat} from "./Constants/DataStructures";
import {FORMATS}        from "./Constants/Formats";

import {DigitalComponent} from "digital/models/DigitalComponent";
import {DigitalObjectSet} from "digital/models/DigitalObjectSet";

import {GenerateInputTree}        from "./GenerateInputTree";
import {GenerateTokens}           from "./GenerateTokens";
import {TreeToCircuit}            from "./TreeToCircuit";
import {ValidateInputOutputTypes} from "./Utils";


/**
 * Main driver function for parsing an expression into a circuit.
 *
 * @param  inputs A map correlating input name to the DigitalComponent it represents.
 * @param  expression The expression to be parsed.
 * @param  output The DigitalComponent to use as an output, port 0 will be used.
 * @param  ops The strings used to represent the different operators.
 * @returns The circuit generated by the given expression, null on error (see above).
 * @throws {Error} Parenthesis do not include anything (such as "()").
 * @throws {Error} An opening parenthesis is missing a corresponding closing parenthesis (such as "(").
 * @throws {Error} A closing parenthesis is missing a corresponding opening parenthesis (such as ")").
 * @throws {Error} `|`, `&`, or `^` are missing an operand on their left (such as "a|").
 * @throws {Error} `|`, `&`, `^`, or `!` are missing an operand on their right (such as "!a").
 * @throws {Error} There is no operator between two inputs (such as "a b").
 * @throws {Error} The expression references an input not found in inputs.
 * @throws {Error} If ops is missing the keys "|", "^", "&", "(", ")", or "separator".
 * @throws {Error} If the value in ops for keys "|", "^", "&", "(", ")", or "separator" is "".
 */
export function ExpressionToCircuit(inputs: Map<string, DigitalComponent>,
                                    expression: string,
                                    output: DigitalComponent,
                                    ops: OperatorFormat = FORMATS[0]): DigitalObjectSet {

    ValidateInputOutputTypes(inputs, output);

    const tokenList = GenerateTokens(expression, ops);

    const connectedTree = GenerateInputTree(tokenList, ops.ops);

    const fullCircuit = TreeToCircuit(connectedTree, inputs, output);

    return DigitalObjectSet.From(fullCircuit);
}