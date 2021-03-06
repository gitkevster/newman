/* global describe, it, exec, expect */
var fs = require('fs'),
    path = require('path'),

    exportedGlobalsPath = path.join(__dirname, '..', '..', 'out', 'test-globals.json');

describe('--export-globals', function () {
    this.timeout(1000 * 60); // set 60s timeout

    afterEach(function () {
        try { fs.unlinkSync(exportedGlobalsPath); }
        catch (e) { console.error(e); }
    });

    it('`newman run` should export globals to a file', function (done) {
        // eslint-disable-next-line max-len
        exec('node ./bin/newman.js run test/cli/single-get-request.json -g test/cli/simple-variables.json --export-globals out/test-globals.json', function (code) {
            var globals;

            try { globals = JSON.parse(fs.readFileSync(exportedGlobalsPath).toString()); }
            catch (e) { console.error(e); }

            expect(code).be(0);
            expect(globals).be.ok();
            expect(globals).have.property('_postman_exported_at');
            expect(globals).have.property('values');
            expect(globals.values).eql([
                { key: 'var-1', value: 'value-1', type: 'any' },
                { key: 'var-2', value: 'value-2', type: 'any' }
            ]);
            done();
        });
    });

    it('`newman run` should export globals to a file even if collection is failing', function (done) {
        // eslint-disable-next-line max-len
        exec('node ./bin/newman.js run test/cli/single-request-failing.json -g test/cli/simple-variables.json --export-globals out/test-globals.json', function (code) {
            var globals;

            try { globals = JSON.parse(fs.readFileSync(exportedGlobalsPath).toString()); }
            catch (e) { console.error(e); }

            expect(code).not.be(0);
            expect(globals).be.ok();
            expect(globals).have.property('_postman_exported_at');
            expect(globals).have.property('values');
            expect(globals.values).eql([
                { key: 'var-1', value: 'value-1', type: 'any' },
                { key: 'var-2', value: 'value-2', type: 'any' }
            ]);
            done();
        });
    });
});
