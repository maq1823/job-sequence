function createJobSequence(jobs) {
    if (typeof jobs !== 'string'){
        throw 'Non-string parameteres are not accepted';
    }
};

module.exports = createJobSequence;