let args = process.argv.slice(2);
import getSync from './getSync.js';

let argObj = {};

if (args.includes('--alter=true')) {
    argObj['alter'] = true;
} else if (args.includes('--force=true')) {
    argObj['force'] = true;
}
console.log(argObj);

getSync();
