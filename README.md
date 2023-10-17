# Maven Dependency Viewer

Easily visualize your Maven project dependencies as an HTML file with links the Maven Repository.


## Prerequisites

* Node.js
* Maven

## Installation

Run the following commands:

```shell
curl -O https://raw.githubusercontent.com/ZeroOne3010/depstree2html/main/install.sh
chmod +x install.sh
./install.sh
```

## Usage

To generate an HTML file with your Maven dependencies, navigate to your Maven project directory and run:
```shell
mvn dependency:tree | node mavendependencyviewer.js > output.html
```

Open **output.html** in your browser to view the dependencies.
