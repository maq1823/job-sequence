function createJobSequence(jobsStr) {

    // Throw error if input is not string
    if (typeof jobsStr !== 'string') {
        throw 'Non-string parameteres are not accepted';
    }

    // Return empty sequence if inpu is empty
    if (jobsStr.trim() === '') {
        return '';
    }

    // Seperate  jobs and put in a list 
    const jobsArray = jobsStr.split(',');
    
    // If we have only one job, return it
    if (jobsArray.length === 1) {
        return parseJob(jobsArray[0]).name;
    }

    // Parse job list for simplicity
    const jobs = jobsArray.map(it => parseJob(it.trim()));

    // If all jobs have no dependency, return a sequence containing all of them in default order
    if (jobs.every(it => !it.precedent)) {
        return jobs.reduce((acc, val) => {
            return acc.concat(val.name);
        }, '');
    }

    /* Iterate over job list and try to resolve each one's dependency and repeat until we have a job
    list containing job without dependency. eg: a=>b,b=>e should become ba =>e and then eba=>*/
    const newJobs = [];
    for (const job of jobs) {

        /* If this job has already been visited and resolved, we will be able to find a job in newJobs
        which contains this job's name. We ignore already resolved jobs */
        if (newJobs.some(it => it.name.includes(job.name))) {
            continue;
        }

        // If this job has no dependency, just add it to the new list
        if (!job.precedent) {
            newJobs.push(job);
        } 

        /* if this job has dependency, try to find the dependency job either in the already resolved
        list(newJobs) or jobs */
        else {
            let dependent;

            // Find dependecy job in newJobs list
            const indexOfDependentJobInNewJobs = newJobs.findIndex(it => it.name.includes(job.precedent));
            if (indexOfDependentJobInNewJobs >= 0) {
                dependent = newJobs[indexOfDependentJobInNewJobs];
                newJobs.splice(indexOfDependentJobInNewJobs, 1);
            }

            // Find dependency job in jobs if it's not found yet
            if (!dependent) {

                //find dependency in the orig array
                dependent = jobs.find(it => it.name.includes(job.precedent));
            }

            // Resolve the dependency and create a new job and add it to newJobs list
            newJobs.push({
                name: `${dependent.name}${job.name}`,
                precedent: dependent.precedent ? dependent.precedent : null
            });
        }
    }

    // Create string representation of the newJobs list and return it
    const newJobString = newJobs.map(stringJob).reduce((acc, val) => { return acc + val + ',' }, '');
    return createJobSequence(newJobString.substr(0, newJobString.length - 1));

};

function parseJob(jobStr) {
    const splitted = jobStr.split('=>');
    const job = {
        name: splitted[0],
        precedent: splitted.length > 1 && splitted[1] !== '' ? splitted[1] : null
    };

    // Check if this job is dependent on itself
    if (job.name === job.precedent) {
        throw 'Jobs can\'t depend on themselves';
    }

    // Check if this job has a circular dependency
    if (job.name.includes(job.precedent)) {
        throw 'Circular dependency';
    }
    return job;
};

function stringJob(job) {
    return `${job.name}=>${job.precedent ? job.precedent : ''}`
}

module.exports = createJobSequence;