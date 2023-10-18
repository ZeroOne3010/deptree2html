const readline = require('readline');

console.log('<!DOCTYPE html>');
console.log('<html lang="en">');
console.log('<head><title>Maven dependency tree</title>');
console.log('<style>');
console.log('body { font-family: Arial, sans-serif; }');
console.log('ul { list-style: none; padding-left: 2em; border-left: 1px solid #ccc; }');
console.log('li { margin: 0.5em 0; }');
console.log('a { text-decoration: none; color: blue; }');
console.log('a:hover { text-decoration: underline; }');
console.log('span.scope { color: grey; }');
console.log('</style>');
console.log('</head>');
console.log('<body>');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let root = {children: []};
let stack = [{node: root, level: -1}];

rl.on('line', function (line) {
  const match = line.match(/INFO]([\s\\+\\\-|]*)([\w\.\-]+):([\w\.\-]+):([\w\.\-]+):([\w\.\-]+):?(\w+)?$/);

  // Detect start of new module, output the previous one's contents, and reset the root:
  if (line.startsWith('[INFO] Building')) {
    const moduleName = line.split(' ')[2];  // Extract module name
    generateHTML(root.children);
    console.log(`<h1>${moduleName}</h1>`);
    root = {children: []};
    stack = [{node: root, level: -1}];

  } else if (match) {
    const level = match[1].length;
    const groupId = match[2];
    const artifactId = match[3];
    const packaging = match[4];
    const version = match[5];
    const scope = match[6];

    const newNode = {groupId, artifactId, packaging, version, scope, children: []};

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    stack[stack.length - 1].node.children.push(newNode);
    stack.push({node: newNode, level});
  }
});

rl.on('close', function () {
  // Output the contents of the final module, then close the file:
  generateHTML(root.children);
  console.log('</body>');
  console.log('</html>');
});

function generateHTML(nodes, indent = '') {
  if (nodes.length === 0) return;
  console.log(`${indent}<ul>`);
  for (const node of nodes) {
    const url = `https://mvnrepository.com/artifact/${node.groupId}/${node.artifactId}/${node.version}`;
    const dependency = `${node.groupId}:${node.artifactId}:${node.version}:${node.packaging}`;
    console.log(`${indent}  <li><a href="${url}" target="_blank">${dependency}</a>${!!node.scope ? ':<span class="scope">' + node.scope + '</span>' : ''}</li>`);
    generateHTML(node.children, `${indent}  `);
  }
  console.log(`${indent}</ul>`);
}
