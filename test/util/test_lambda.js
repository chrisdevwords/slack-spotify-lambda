const { describe, it } = require('mocha');
const { expect, config } = require('chai');

const{ response } = require('../../src/util/lambda');

const context = describe;


config.includeStack = true;

describe('The Lambda Utils', () => {

    describe('#response', () => {
        context('by default', () => {
            it('formats an response with headers', () => {
                const { headers } = response()
                expect(headers).to.be.an('Object');
                expect(headers['Content-Type']).to.eq('application/json');
            });
            it('formats an response with a status code', () => {
                const { statusCode } = response();
                expect(statusCode).to.eq(200);
            });
            it('formats a body with a responseCode', () => {
                const { body } = response();
                expect(body).to.be.a('String');
                const { statusCode } = JSON.parse(body);
                expect(statusCode).to.eq(200);
            });
        });

        context('when passed a body', () => {

            const input = { message: 'howdy!', goodToSeeYou:true };

            it('maps the properties coverts the object to json', () => {
                const { body } = response(input);
                const { message, goodToSeeYou } = JSON.parse(body);
                expect(body).to.be.a('String');
                expect(message).to.eq('howdy!');
                expect(goodToSeeYou).to.eq(true);
            });

            it('still includes a status code', () => {
                const { body } = response(input);
                const { statusCode } = JSON.parse(body);
                expect(statusCode).to.eq(200);
            });
        });

        context('when passed a statusCode', () => {
            it('maps it to the response', () => {
                const { statusCode } = response({}, 404);
                expect(statusCode).to.eq(404);
            });

            it('maps it to the body', () => {
                const { body } = response({}, 404);
                const { statusCode } = JSON.parse(body);
                expect(statusCode).to.eq(404);
            });
        });

        context('when passed headers', () => {
            it('maps to the response', () => {
                const { headers } = response({}, 200, {
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
                expect(headers['Content-Type'])
                    .to.eq('application/x-www-form-urlencoded');
            });

            it('should still include a JSON content type by default', () => {
                const { headers } = response({}, 200, {
                    'Accept': 'application/json,*/*'
                });
                expect(headers['Accept'])
                    .to.eq('application/json,*/*');
                expect(headers['Content-Type'])
                    .to.eq('application/json');
            });
        });
    });
});
