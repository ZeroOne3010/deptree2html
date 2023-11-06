# Maven Dependency Viewer

Easily visualize your Maven project dependencies as an HTML file with links the Maven Repository.

Also includes an application to check for the latest versions of all of your dependencies and to list them in the
output.

## Prerequisites

* Node.js
* Maven

## Installation

Copy [depstree2html.js](depstree2html.js) for yourself, then run the following commands:

```shell
# Make the JavaScript file executable
chmod +x depstree2html.js

# Move it to a directory in your PATH:
sudo mv depstree2html.js /usr/local/bin/depstree2html
```

## Usage

To generate an HTML file with your Maven dependencies, navigate to your Maven project directory and run:
```shell
mvn dependency:tree | depstree2html > output.html
```

To exclude specific packages from being linked, use the `--ignore-packages` option followed by a comma-separated list of
package prefixes to ignore. For example:

```shell
mvn dependency:tree | depstree2html --ignore-packages org.acme,com.example > output.html
```

This will generate output.html without linking dependencies that start with `org.acme` or `com.example`.

Finally, open **output.html** in your browser to view the dependencies.

### Viewing the latest versions of your dependencies

To find out the latest version of each dependency, run the `depstree-latest-version-checker.js` script.
It will take approximately a minute to query each hundred dependencies, and in the end the latest version of each
dependency will be written to `latestVersions.json`. When you have this file in the directory where you then run
`depstree2html`, the results will be amended with info about the latest versions. Note that you should also use the
`--ignore-packages` option with `depstree-latest-version-checker.js`.
