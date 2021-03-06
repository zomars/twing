import TwingTestIntegrationTestCase from "../../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('parent.twig', require('./parent.twig'));
        templates.set('use1.twig', require('./use1.twig'));
        templates.set('use2.twig', require('./use2.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};