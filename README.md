
- install NodeJs and npm
- Clone the repo
- Run 'npm ci' to install dependencies
- Run 'npm run test' to run tests
- Import module and use it like this :
```javascript
import createJobSequence from 'job-sequence'
const seq = createJobSequence('a=>,b=>c,c=>f,d=>a,e=>,f=>b');
console.info(seq);
```
