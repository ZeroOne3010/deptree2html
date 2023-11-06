#!/usr/bin/env node

const https = require('https');
const readline = require('readline');
const fs = require('fs');

const args = process.argv;
const ignorePackagesIndex = args.findIndex(arg => arg === '--ignore-packages') + 1;
const ignorePackages = ignorePackagesIndex > 0 && args.length > ignorePackagesIndex
  ? args[ignorePackagesIndex].split(",")
  : undefined;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let deps = {};
let depsArray = [];

function getLatestVersion(groupId, artifactId) {
  return new Promise((resolve, reject) => {
      const url = `https://search.maven.org/solrsearch/select?q=g:${groupId}+AND+a:${artifactId}&rows=1&wt=json`;
      const options = {
        hostname: 'search.maven.org',
        path: `https://search.maven.org/solrsearch/select?q=g:${groupId}+AND+a:${artifactId}&rows=1&wt=json`,
        method: 'GET',
        accept: 'application/json',
        headers: {
          'User-Agent': 'depstree-latest-version-checker/0.0.1'
        }
      };
      https.get(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const jsonData = JSON.parse(data);
          const latestVersion = jsonData.response?.docs[0]?.latestVersion;
          if(!latestVersion) {
            console.error("Failed to parse latest version from response: ", jsonData);
          }
          resolve(latestVersion);
        });

      }).on('error', (error) => {
        reject(error);
      });
    }
  );
}

const CONCURRENCY_LIMIT = 1;
let inProgress = 0;
const results = {};

async function processDependency({groupId, artifactId}) {
  const latestVersion = await getLatestVersion(groupId, artifactId);
  results[`${groupId}:${artifactId}`] = {'latestVersion': latestVersion};
}

async function worker() {
  while (depsArray.length > 0) {
    const dependency = depsArray.shift();
    inProgress++;
    await processDependency(dependency)
      .catch(err => console.error(err))
      .finally(() => {
        inProgress--;
        checkCompletion();
      });
  }
}

function checkCompletion() {
  if (depsArray.length === 0 && inProgress === 0) {
    console.log("All workers have finished.");
    console.log("Results:", JSON.stringify(results));
    const fileData = {
      'date': new Date(),
      'packages': results
    };
    let fileName = 'latestVersions.json';
    fs.writeFileSync(fileName, JSON.stringify(fileData, null, 2), 'utf8');
    console.log("Results written to " + fileName)
  }
}

rl.on('line', function (line) {
  const match = line.match(/INFO]([\s\\+\\\-|]*)([\w\.\-]+):([\w\.\-]+):([\w\.\-]+):([\w\.\-]+):?(\w+)?$/);
  if (match) {
    const level = match[1].length;
    const groupId = match[2];
    const artifactId = match[3];
    const packaging = match[4];
    const version = match[5];
    const scope = match[6];

    const newNode = {groupId, artifactId, version};

    const artifactName = `${newNode.groupId}:${newNode.artifactId}:${newNode.version}`;
    if (ignorePackages && ignorePackages.find(ignoredPackage => artifactName.startsWith(ignoredPackage))) {
      return;
    }
    deps[artifactName] = newNode;
  }
});

rl.on('close', function () {
  depsArray = Object.values(deps);
  depsArray.sort((a, b) => {
    const fullNameA = `${a.groupId}:${a.artifactId}:${a.version}`;
    const fullNameB = `${b.groupId}:${b.artifactId}:${b.version}`;
    return fullNameA.localeCompare(fullNameB);
  })
  console.error(`${depsArray.length} dependencies read successfully, now starting to query them...`);

  // Start workers
  for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
    worker();
  }

});
