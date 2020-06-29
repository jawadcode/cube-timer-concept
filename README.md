# Cube Timer Concept
## What is this?
This is a concept for a speedcube timer app (as in webapp) that i intend to make "soon", it uses [scramble generating web workers from cstimer](https://github.com/cs0x7f/cstimer/tree/master/src/js)
Note: I modified one file, removed some and added the main.js file
## How to use:
If you want to use this for some reason, you can `npm install` then `npm start` or just grab all of the files in `/public` and host them.
## TODO:
- Add IndexedDB storage
- Redesign some things
- Possibly make it responsive
## The Web App
Once I have finished adding all of the appropriate functionality to this, i intend on starting development on an angular app with a mongodb database (Not decided on hosting yet). It will have authentication so solves can be backed up on the database and assigned to a user (This could be an automatic thing, like every 50 solves or so). The solves would save to indexedDB immediatly and then (occasionally) to the actual DB and when someone signs in on another device, the solves are grabbed from the DB and saved to indexedDB and then displayed.
##### This is in pretty early stages and it is just a concept so its future is uncertain, reality will probably hit soon...