import { Character } from './models/Character.js'

export async function handleMessage(message, db) {
  const userId = message.author.id
  const character = new Character(userId, db)

  switch (
    message.content.split(' ')[0] // Split to handle commands with arguments
  ) {
    case '!createCharacter':
      await handleCreateCharacter(character, message)
      break
    case '!levelUp':
      await handleLevelUp(character, message)
      break
    case '!getLevel':
      await handleGetLevel(character, message)
      break
    case '!addItem':
      await handleAddItem(character, message)
      break
    case '!removeItem':
      await handleRemoveItem(character, message)
      break
    case '!getInventory':
      await handleGetInventory(character, message)
      break
    default:
      // Handle other commands or ignore
      break
  }
}

async function handleCreateCharacter(character, message) {
  try {
    const args = message.content.split(' ') // Split the message into parts
    // args[0] will be '!createCharacter', args[1] should be the name, args[2] the class
    if (args.length < 3) {
      message.channel.send(
        'Please provide a character name and class. Example: !createCharacter John Warrior'
      )
      return
    }

    const name = args[1]
    const characterClass = args[2]

    await character.create(name, characterClass)
    message.channel.send(`Character ${name} the ${characterClass} created!`)
  } catch (error) {
    console.error('Error creating character: ', error)
    message.channel.send('Error creating character. Please try again later.')
  }
}

async function handleLevelUp(character, message) {
  try {
    const newLevel = await character.levelUp()
    message.channel.send(`You are now level ${newLevel}!`)
  } catch (error) {
    console.error('Error leveling up: ', error)
    message.channel.send('Error leveling up. Please try again later.')
  }
}

async function handleGetLevel(character, message) {
  try {
    const level = await character.getLevel()
    message.channel.send(`You are level ${level}.`)
  } catch (error) {
    console.error('Error getting level: ', error)
    message.channel.send('Error getting level. Please try again later.')
  }
}

async function handleAddItem(character, message) {
  try {
    const item = message.content.split(' ').slice(1).join(' ') // Extract the item name
    await character.inventory.addItem(item)
    message.channel.send(`Item "${item}" added to your inventory.`)
  } catch (error) {
    console.error('Error adding item: ', error)
    message.channel.send('Error adding item. Please try again later.')
  }
}

// New function to handle removing an item from the inventory
async function handleRemoveItem(character, message) {
  try {
    const item = message.content.split(' ').slice(1).join(' ') // Extract the item name
    await character.inventory.removeItem(item)
    message.channel.send(`Item "${item}" removed from your inventory.`)
  } catch (error) {
    console.error('Error removing item: ', error)
    message.channel.send('Error removing item. Please try again later.')
  }
}

// New function to retrieve the character's inventory
async function handleGetInventory(character, message) {
  try {
    const inventory = await character.inventory.getInventory()
    message.channel.send(`Your inventory: ${inventory.join(', ')}`)
  } catch (error) {
    console.error('Error retrieving inventory: ', error)
    message.channel.send('Error retrieving inventory. Please try again later.')
  }
}
