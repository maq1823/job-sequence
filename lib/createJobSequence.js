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
    const parsedJobs = jobsArray.map(it => parseJob(it.trim()));
    if (parsedJobs.every(it => !it.precedent)) {
        return parsedJobs.reduce((acc, val) => {
            return acc.concat(val.name);
        }, '');
    }

    const newJobs = [];
    for (const job of parsedJobs) {
        // There should not be an entry in the newJobs that has a name starting with job.precedent
        if (newJobs.some(it => it.name.charAt(0) === job.name)) {
            continue;
        }
        if (!job.precedent) {
            newJobs.push(job);
        } else {
            //find dependency in the orig array
            const depJob = parsedJobs.find(it => it.name === job.precedent);
            newJobs.push({
                name: `${depJob.name}${job.name}`,
                precedent: depJob.precedent ? depJob.precedent : null
            });
        }
    }
    const newJobString = newJobs.map(stringJob).reduce((acc, val) => { return acc + val + ',' }, '');
    console.info(newJobString)
    return createJobSequence(newJobString.substr(0, newJobString.length - 1));

};

function parseJob(job) {
    const splitted = job.split('=>');
    return {
        name: splitted[0],
        precedent: splitted.length > 1 && splitted[1] !== '' ? splitted[1] : null
    };
};

function stringJob(job) {
    return `${job.name}=>${job.precedent ? job.precedent : ''}`
}

module.exports = createJobSequence;