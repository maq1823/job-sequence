const createJobSequence = require('./createJobSequence');

describe('createJobSequence module tests', () => {
    test('non-string input throws error', () => {
        try {
            createJobSequence(1);
        } catch (error) {
            expect(error).toEqual('Non-string parameteres are not accepted');
        }
    });
    test('empty string input returns empty sequence', () => {
        expect(createJobSequence('')).toEqual('');
    });
    test('single job without dependency input returns single job sequence', () => {
        expect(createJobSequence('a=>')).toEqual('a');
    });
    test('a=>,b=>,c=> input returns abc', () => {
        expect(createJobSequence('a=>,b=>,c=>')).toEqual('abc');
    });
    test('a=>,b=>c,c=> input returns acb', () => {
        expect(createJobSequence('a=>,b=>c,c=>')).toEqual('acb');
    });
    test('a=>,b=>c,c=>f,d=>a,e=>b,f=> input returns adfcbe', () => {
        expect(createJobSequence('a=>,b=>c,c=>f,d=>a,e=>b,f=>')).toEqual('adfcbe');
    });
    test('a=>,b=>c,c=>c input throws error', () => {
        try {
            createJobSequence('a=>,b=>c,c=>c');
        } catch (error) {
            expect(error).toEqual('Jobs can\'t depend on themselves');
        }
    });
    test('a=>,b=>c,c=>f,d=>a,e=>,f=>b input throws error', () => {
        try {
            createJobSequence('a=>,b=>c,c=>f,d=>a,e=>,f=>b');
        } catch (error) {
            expect(error).toEqual('Circular dependency');
        }
    });
    test('a=>,b=>d,c=>a,d=>e,e=>a,f=> input returns acedbf', () => {
        expect(createJobSequence('a=>,b=>d,c=>a,d=>e,e=>a,f=>')).toEqual('acedbf');
    });
});