import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryMatches extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('Twing.regexParser(')
            .subcompile(this.getNode('right'))
            .raw(').test(')
            .subcompile(this.getNode('left'))
            .raw(')')
        ;
    }
}

export default TwingNodeExpressionBinaryMatches;