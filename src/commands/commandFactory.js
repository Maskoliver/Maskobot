import handleCharacterInfo from './handleCharacterInfo.js'
import handleHealthPoints from './handleHealthPoints.js'
import handleHelp from './handleHelp.js'
import handleLevel from './handleLevel.js'
// Import other command handler files here

const commandHandlers = {
  '!hp': handleHealthPoints,
  '!!help': handleHelp,
  '!level': handleLevel,
  '!ci': handleCharacterInfo
  // Map other commands to their handlers
}

export default {
  getHandler(command) {
    return commandHandlers[command]
  }
}
