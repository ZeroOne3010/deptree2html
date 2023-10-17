#!/bin/bash

# Define the URL of the JavaScript file from your GitHub repository
URL="https://raw.githubusercontent.com/ZeroOne3010/depstree2html/main/depstree2html.js"

# Download the JavaScript file
curl -O $URL

# Make the JavaScript file executable
chmod +x depstree2html.js

# Move it to a directory in the user's PATH
mv depstree2html.js /usr/local/bin/

echo "Installation complete. You can now use depstree2html.js."
