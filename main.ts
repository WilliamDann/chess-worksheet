import Env  from './env';
import init from './init';

console.log("starting app...");

init();
Env.instance().app.listen(8080);

console.log("✔ started on on http://localhost:8080")