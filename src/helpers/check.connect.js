'usse strict'

const { default: mongoose } = require("mongoose")
const os = require("os");
const process = require("process"); 
const _SECONDS = 5000;
// This function counts the number of active connections to the MongoDB database
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  if (numConnection > 0) {
    const connection = mongoose.connections[0];
    console.log(`Number of connections: ${numConnection}`);
  }
}

const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss; // Convert to MB
    // Example thresholds
    const maxConnections = numCores * 5; // Example: 5 connections per core
    console.log(`Number of connections: ${numConnection}`);
    console.log(`Number of CPU cores: ${numCores}`);
    console.log('Memory Usage:', (memoryUsage / 1024 / 1024).toFixed(2), 'MB');
    if(numConnection > maxConnections) {
      console.warn(`High number of connections: ${numConnection} (max: ${maxConnections})`);
    }
  }, _SECONDS);  // Check every 5 seconds
}
module.exports = { countConnect, checkOverLoad };