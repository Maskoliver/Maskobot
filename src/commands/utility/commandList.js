import handleCharacterInfo from '../character/handleCharacterInfo.js'
import handleHealthPoints from '../character/handleHealthPoints.js'
import handleLevel from '../character/handleLevel.js'
import handleEquipItem from '../inventory/handleEquipItem.js'
import handleInventory from '../inventory/handleInventory.js' // Import the inventory handler
import handleUseItem from '../inventory/handleUseItem.js' // Import the use item handler
import handleHelp from '../utility/handleHelp.js'
// Import other command handler files here

export const commandsList = [
  {
    name: '!hp',
    description: 'Show your current health points',
    handler: handleHealthPoints,
    category: 'general'
  },
  {
    name: '!level',
    description: 'Show your current level',
    handler: handleLevel,
    category: 'general'
  },
  {
    name: '!ci',
    description: 'Show your character info',
    handler: handleCharacterInfo,
    category: 'general'
  },
  {
    name: '!inventory',
    description: 'Show your inventory',
    handler: handleInventory,
    category: 'general'
  },
  {
    name: '!use',
    description: 'Use an item from your inventory',
    handler: handleUseItem,
    category: 'inventory'
  },
  {
    name: '!equip',
    description: 'Equip an item from your inventory',
    handler: handleEquipItem,
    category: 'general'
  }
]

// Export an additional entry for help that can be dynamically generated
export const helpCommand = {
  name: '!!help',
  description: 'Show this help message',
  handler: handleHelp,
  category: 'general'
}
