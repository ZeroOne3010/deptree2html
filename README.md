# Maven Dependency Viewer

Easily visualize your Maven project dependencies as an HTML file with links the Maven Repository.


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

Open **output.html** in your browser to view the dependencies.
