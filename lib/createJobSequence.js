function createJobSequence(jobsStr) {
    if (typeof jobsStr !== 'string') {
        throw 'Non-string parameteres are not accepted';
    }
    if (jobsStr === '') {
        return '';
    }
    const jobsArray = jobsStr.split(',');
    if (jobsArray.length === 1) {
        return parseJob(jobsArray[0]).name;
    }
    const jobs = jobsArray.map(it => parseJob(it.trim()));
    if (jobs.every(it => !it.precedent)) {
        return jobs.reduce((acc, val) => {
            return acc.concat(val.name);
        }, '');
    }

    const newJobs = [];
    for (const job of jobs) {
        // There should not be an entry in the newJobs that has a name starting with job.precedent
        if (newJobs.some(it => it.name.includes(job.name))) {
            continue;
        }
        if (!job.precedent) {
            newJobs.push(job);
        } else {
            let dependent;
            //find dependecy in newJobs list
            const indexOfDependentJobInNewJobs = newJobs.findIndex(it => it.name.includes(job.precedent));
            if (indexOfDependentJobInNewJobs >= 0) {
                dependent = newJobs[indexOfDependentJobInNewJobs];
                newJobs.splice(indexOfDependentJobInNewJobs, 1);
            }
            if (!dependent) {
                //find dependency in the orig array
                dependent = jobs.find(it => it.name.includes(job.precedent));
            }
            newJobs.push({
                name: `${dependent.name}${job.name}`,
                precedent: dependent.precedent ? dependent.precedent : null
            });
        }
    }
    const newJobString = newJobs.map(stringJob).reduce((acc, val) => { return acc + val + ',' }, '');
    return createJobSequence(newJobString.substr(0, newJobString.length - 1));

};

function parseJob(jobStr) {
    const splitted = jobStr.split('=>');
    const job = {
        name: splitted[0],
        precedent: splitted.length > 1 && splitted[1] !== '' ? splitted[1] : null
    };
    if (job.name === job.precedent) {
        throw 'Jobs can\'t depend on themselves';
    }
    if (job.name.includes(job.precedent)) {
        throw 'Circular dependency';
    }
    return job;
};

function stringJob(job) {
    return `${job.name}=>${job.precedent ? job.precedent : ''}`
}

module.exports = createJobSequence;