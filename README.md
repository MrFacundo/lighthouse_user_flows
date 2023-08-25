This is a simple test project to try out the Ligthhouse Node mudule. The goal is to able to run tests and produce reports programatically for a given URL.

So far, this runs only locally (not dockerized), with the following dependencies:

- Google Chrome 
```	
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt-install ./google-chrome-stable_current_amd64.deb
```	

With the right environment Puppeteer should be able to run Chrome both headless and headfull (with GUI).

```
npm install

npm run test

URL, mode and device can be configured in config.js

```
