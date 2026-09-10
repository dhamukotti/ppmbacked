// eventEmitter.js
const EventEmitter = require('events')
class TaskEventEmitter extends EventEmitter {}

const taskEventEmitter = new TaskEventEmitter()
module.exports = taskEventEmitter
