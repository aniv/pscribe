PScribe
============

PScribe is an [Express](http://expressjs.com/) application designed to persist my [Prismatic](http://getprismatic.com) activity to a hosted [MongoDB](http://www.mongodb.org) database. It picks up POST-ed JSON documents (via unofficial Prismatic APIs) and parses them into appropriate MongoDB collections. It is designed to run on the [AppFog](http://www.appfog.com) NodeJS infrastructure, and is the backend component of my Prismatic backup system.