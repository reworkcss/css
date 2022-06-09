import {CssStylesheetAST} from '../type';
import Compiler from './compiler';

export default (
  node: CssStylesheetAST,
  options?: ConstructorParameters<typeof Compiler>[0]
) => {
  const compiler = new Compiler(options || {});
  return compiler.compile(node);
};
