#!/usr/bin/env node

const fs = require('fs');
const [inputFile, buildVer = 'latest', listBundled = false] = process.argv.slice(2);
let deps = {};

function processPackageName(node) {
    const version = (node.from && 'NOVER') || node.version;
    const packageName = `services-patch/patchman-ui/${node.name}${version}`.replace(/@/g, "");
    deps[packageName] = packageName;
}

function processPackage(node) {
    if (node.bundled && listBundled !== 'bundled' || node.dev) {
        return;
    }

    node.name && processPackageName(node);
    node.dependencies && processDeps(node);
}

function processDeps(parent) {
    Object.keys(parent.dependencies).forEach(dependency => {
        return processPackage({ ...parent.dependencies[dependency], name: dependency });
    });
}

try {
    const fileContent = fs.readFileSync(inputFile);
    let content = JSON.parse(fileContent);
    processDeps(content);
    const sortedDeps = Object.values(deps).sort();
    const file = fs.createWriteStream('patchman-ui.txt');
    sortedDeps.forEach(value => file.write(`${value}\n`));
    file.end();
} catch (e) {
    console.log(e);
    process.exit(1);
}
