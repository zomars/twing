import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Exception for an unclosed tag';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected "endblock" tag (expecting closing tag for the "if" tag defined near line 4) in "index.twig" at line 16.';
    }
};