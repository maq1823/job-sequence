function createJobSequence(jobs) {
    if (typeof jobs !== 'string') {
        throw 'Non-string parameteres are not accepted';
    }
    if (jobs === '') {
        return '';
    }
    const jobsArray = jobs.split(',');
    if (jobsArray.length === 1) {
        return parseJob(jobsArray[0]).name;
    }
    const parsedJobs = jobsArray.map(it => parseJob(it));
    return parsedJobs.reduce((acc, val) => {
        return acc.concat(val.name);
    }, '');
};

function parseJob(job) {
    const splitted = job.split('=>');
    return {
        name: splitted[0],
        precedent: splitted.length > 1 ? splitted[1] : null
    };
}

module.exports = createJobSequence;