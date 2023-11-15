import handleCharacterInfo from '../character/handleCharacterInfo.js'
import handleHealthPoints from '../character/handleHealthPoints.js'
import handleLevel from '../character/handleLevel.js'
import handleHelp from '../utility/handleHelp.js'
// Import other command handler files here

export const commandsList = [
  {
    name: '!hp',
    description: 'Show your current health points',
    handler: handleHealthPoints
  },
  {
    name: '!level',
    description: 'Show your current level',
    handler: handleLevel
  },
  {
    name: '!ci',
    description: 'Show your character info',
    handler: handleCharacterInfo
  }
]

// Export an additional entry for help that can be dynamically generated
export const helpCommand = {
  name: '!!help',
  description: 'Show this help message',
  handler: handleHelp
}
