const TwingTestIntegrationTestCase = require("../base");

export = class extends TwingTestIntegrationTestCase {
    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            foo: false
        }
    }
};