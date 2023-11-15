import { commandsList, helpCommand } from './commandList.js'

const commandHandlers = commandsList.reduce((acc, command) => {
  acc[command.name] = command.handler
  return acc
}, {})

commandHandlers[helpCommand.name] = helpCommand.handler

export default {
  getHandler(command) {
    return commandHandlers[command]
  }
}
