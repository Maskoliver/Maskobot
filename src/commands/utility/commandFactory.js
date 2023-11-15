import { commandsList, helpCommand } from './commandList.js'

const commandHandlers = commandsList.reduce((acc, command) => {
  acc[command.name] = { handler: command.handler, category: command.category }
  return acc
}, {})

commandHandlers[helpCommand.name] = {
  handler: helpCommand.handler,
  category: helpCommand.category
}

export default {
  getHandler(command) {
    return commandHandlers[command] ? commandHandlers[command].handler : null
  },
  getCommandData(command) {
    return commandHandlers[command]
  }
}
