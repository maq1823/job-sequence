function createJobSequence(jobs) {
    if (typeof jobs !== 'string') {
        throw 'Non-string parameteres are not accepted';
    }
    if (jobs === '') {
        return '';
    }
};

module.exports = createJobSequence;