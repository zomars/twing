import {Test} from "tape";
import TwingTestCompilerStub from "../../../../compiler-stub";
import TwingNodeExpressionConstant from "../../../../../src/node/expression/constant";
import TwingNode from "../../../../../src/node";
import TwingTestEnvironmentStub from "../../../../environment-stub";
import TwingMap from "../../../../../src/map";
import TwingNodeExpressionFunction from "../../../../../src/node/expression/function";
import TwingFunction from "../../../../../src/function";

const tap = require('tap');

function twig_tests_function_dummy() {
}

function twig_tests_function_barbar(arg1: any = null, arg2: any = null, args: Array<any> = []) {
}

function createFunction(name: string, args: TwingMap<any, TwingNode> = new TwingMap()) {
    return new TwingNodeExpressionFunction(name, new TwingNode(args), 1);
}

tap.test('node/expression/function', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let name = 'function';
        let args = new TwingNode();
        let node = new TwingNodeExpressionFunction(name, args, 1);

        test.same(node.getAttribute('name'), name);
        test.same(node.getNode('arguments'), args);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let environment = new TwingTestEnvironmentStub();
        environment.addFunction(new TwingFunction('foo', twig_tests_function_dummy, {}));
        environment.addFunction(new TwingFunction('bar', twig_tests_function_dummy, {needs_environment: true}));
        environment.addFunction(new TwingFunction('foofoo', twig_tests_function_dummy, {needs_context: true}));
        environment.addFunction(new TwingFunction('foobar', twig_tests_function_dummy, {
            needs_environment: true,
            needs_context: true
        }));
        environment.addFunction(new TwingFunction('barbar', twig_tests_function_barbar, {is_variadic: true}));
        environment.addFunction(new TwingFunction('anonymous', function () {}));

        let compiler = new TwingTestCompilerStub(environment);

        test.test('basic', function (test: Test) {
            let node = createFunction('foo');

            test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'foo\').getCallable()(...[])');

            node = createFunction('foo', new TwingMap([
                [0, new TwingNodeExpressionConstant('bar', 1)],
                [1, new TwingNodeExpressionConstant('foobar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'foo\').getCallable()(...["bar", "foobar"])');

            node = createFunction('bar');

            test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'bar\').getCallable()(...[this.env])');

            node = createFunction('bar', new TwingMap([
                [0, new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'bar\').getCallable()(...[this.env, "bar"])');

            node = createFunction('foofoo');

            test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'foofoo\').getCallable()(...[context])');

            node = createFunction('foofoo', new TwingMap([
                [0, new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'foofoo\').getCallable()(...[context, "bar"])');

            node = createFunction('foobar');

            test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'foobar\').getCallable()(...[this.env, context])');

            node = createFunction('foobar', new TwingMap([
                [0, new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'foobar\').getCallable()(...[this.env, context, "bar"])');

            test.test('named arguments', function (test: Test) {
                let node = createFunction('date', new TwingMap([
                    ['timezone', new TwingNodeExpressionConstant('America/Chicago', 1)],
                    ['date', new TwingNodeExpressionConstant(0, 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'date\').getCallable()(...[this.env, 0, "America/Chicago"])');

                test.end();
            });

            test.test('arbitrary named arguments', function (test: Test) {
                let node = createFunction('barbar');

                test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'barbar\').getCallable()(...[])');

                node = createFunction('barbar', new TwingMap([
                    ['foo', new TwingNodeExpressionConstant('bar', 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'barbar\').getCallable()(...[null, null, ["bar"]])');

                node = createFunction('barbar', new TwingMap([
                    ['arg2', new TwingNodeExpressionConstant('bar', 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'barbar\').getCallable()(...[null, "bar"])');

                node = createFunction('barbar', new TwingMap([
                    [0, new TwingNodeExpressionConstant('1', 1)],
                    [1, new TwingNodeExpressionConstant('2', 1)],
                    [2, new TwingNodeExpressionConstant('3', 1)],
                    ['foo', new TwingNodeExpressionConstant('bar', 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'barbar\').getCallable()(...["1", "2", ["3", "bar"]])');

                test.end();
            });

            test.test('function as an anonymous function', function (test: Test) {
                let node = createFunction('anonymous', new TwingMap([
                    [0, new TwingNodeExpressionConstant('foo', 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'await this.env.getFunction(\'anonymous\').getCallable()(...["foo"])');

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});