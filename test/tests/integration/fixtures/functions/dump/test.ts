import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"dump" function';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getConfig() {
        return {
            debug: true,
            autoescape: false
        }
    }

    getData() {
        return {
            foo: 'foo',
            bar: 'bar'
        }
    }
};