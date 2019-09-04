const createJobSequence = require('./createJobSequence');

describe('createJobSequence module tests', () => {
    test('non-string input throws error', () => {
        try {
            createJobSequence(1);
        } catch (error) {
            expect(error).toEqual('Non-string parameteres are not accepted.')
        }
    });
});