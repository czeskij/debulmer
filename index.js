const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');

const bulmaClasses = require('./bulmaClasses').bulmaClasses;
const ignoreList = require('./ignoreList').ignoreList;
const projectInfo = require('./package.json');

const lookupForBulma = (summary) => {
    console.log(`${projectInfo.name} ${projectInfo.version}`);

    // check for package.json to determine if it's project root directory
    if (fs.readdirSync(process.cwd()).includes('package.json')) {
        console.log('Project root detected');

        recursive(process.cwd(), ignoreList, function (err, filePaths) {
            if (filePaths.length > 0) {
                console.log(`${filePaths.length} stylesheet files found`);
                let classesCount = 0;
                let bulmaClassesCount = 0;

                filePaths.forEach(filePath => {
                    const file = fs.readFileSync(filePath, 'utf8');
                    const classes = file.match(/[\.|\#]+[A-Za-z\-]+/g);

                    classesCount += classes.length;

                    classes.forEach(className => {
                        if (bulmaClasses.includes(className)) {
                            if (summary) {
                                bulmaClassesCount++;
                            } else {
                                console.log(`${filePath}: ${className}`);
                            }                            
                        }
                    });
                });

                if (summary) {
                    console.log(`Found ${classesCount} CSS classes. ${bulmaClassesCount} of them ${bulmaClassesCount === (1 || 0) ? 'is' : 'are'} used by Bulma.`);
                    console.log(`Project is debulmed in ${100 - (Math.round(bulmaClassesCount / classesCount * 100))}%`)
                }
            } else {
                console.log('No stylesheet files found');
            }            
        });
    } else {
        console.error('ERROR: debulmer should be run in Node project root directory.');
    }
}

exports.lookupForBulma = lookupForBulma;
