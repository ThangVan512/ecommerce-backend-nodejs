"use strict";

const mongoose = require("mongoose");
const config = require("../configs/config.mongodb.js");
const connectString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
console.log("Connecting to MongoDB at:", connectString);
const { countConnect } = require('../helpers/check.connect');
class Database {
    constructor() {
        this.connect();
    }

    connect(type = "mongodb") {
        if (1 === 1) {
        mongoose.set("debug", true);
        mongoose.set("debug", {
            color: true,
            shell: true,
            format: "pretty",
        });
        mongoose
            .connect(connectString, {
            maxPoolSize: 50,})
            .then(() => {
            console.log("MongoDB connected successfully", countConnect());
            })
            .catch((err) => {
            console.error("MongoDB connection error:", err);
            });
            }
        }
        static getInstance() {
        if (!Database.instance) {
        Database.instance = new Database();
        }
        return Database.instance;
    } 
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
