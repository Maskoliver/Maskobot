import handleHealthPoints from './handleHealthPoints.js'
// Import other command handler files here

const commandHandlers = {
  '!hp': handleHealthPoints
  // Map other commands to their handlers
}

export default {
  getHandler(command) {
    return commandHandlers[command]
  }
}
