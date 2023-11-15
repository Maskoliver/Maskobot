import { EmbedBuilder } from 'discord.js'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { Inventory } from './Inventory.js'

export class Character {
  constructor(charId, db) {
    this.charId = charId
    this.db = db
    this.charRef = doc(db, 'Characters', this.charId)
    this.inventory = new Inventory(charId, db)
  }

  async create(name, race, baseElement) {
    const defaultAttributes = Character.getDefaultAttributes(
      name,
      race,
      baseElement
    )
    await setDoc(this.charRef, defaultAttributes)
  }

  async levelUp() {
    const charDoc = await this._getCharacterDoc()
    const updatedAttributes = this._calculateLevelUp(charDoc)

    await updateDoc(this.charRef, updatedAttributes)
    return updatedAttributes.level
  }

  async getHealth() {
    const charDoc = await this._getCharacterDoc()
    return [charDoc.currentHealth, charDoc.maxHealth]
  }

  async getLevel() {
    const charDoc = await this._getCharacterDoc()
    return charDoc.level
  }

  async addItemToInventory(itemId, quantity) {
    await this.inventory.addItem(itemId, quantity)
  }

  async removeItemFromInventory(itemId, quantity) {
    await this.inventory.removeItem(itemId, quantity)
  }

  // And methods to display the inventory:

  async displayInventory(inventoryThread, charInfo) {
    const items = await this.inventory.getInventoryList()
    let fields = []
    if (items.length === 0) {
      fields.push({
        name: ' ',
        value: 'Your inventory is empty.'
      })
    } else {
      fields = items.map((item) => {
        return {
          name: item.item.name,
          value: `Quantity: ${item.quantity || '0'}` // Provide a default value
        }
      })
    }
    const embed = new EmbedBuilder()
      .setTitle(`${charInfo.name} Inventory`)
      .addFields(fields)
      .setColor('#0099ff')
      .setTimestamp()

    // Send the embed to the Discord channel
    await inventoryThread.send({ embeds: [embed] })
  }

  static getDefaultAttributes(name, race, baseElement) {
    return {
      name,
      race,
      baseElement,
      stats: {
        strength: 1,
        dexterity: 1,
        constitution: 1,
        intelligence: 1,
        wisdom: 1,
        charisma: 1
      },
      skills: {},
      class: 'Peasant',
      level: 1,
      maxHealth: 10,
      currentHealth: 10,
      experience: 0,
      experienceToNextLevel: 100
    }
  }

  async _getCharacterDoc() {
    const charDoc = await getDoc(this.charRef)
    if (!charDoc.exists()) throw new Error('Character does not exist')
    return charDoc.data()
  }

  _calculateLevelUp(charDoc) {
    return {
      level: charDoc.level + 1,
      health: charDoc.health + 10, // Adjust as needed
      experience: 0
    }
  }
}

export function createHealthBar(currentHealth, maxHealth, size = 14) {
  const healthEmoji = ':green_square:'
  const missingHealthEmoji = ':red_square:'

  const healthPoints = Math.round((currentHealth / maxHealth) * size)
  const missingHealthPoints = size - healthPoints

  return (
    healthEmoji.repeat(healthPoints) +
    missingHealthEmoji.repeat(missingHealthPoints)
  )
}

export function createXPBar(xp, totalXp, size = 14) {
  const xpEmoji = ':yellow_square:'
  const missingXPEmoji = ':white_large_square:'

  const xpPoints = Math.round((xp / totalXp) * size)
  const missingXPPoints = size - xpPoints

  return xpEmoji.repeat(xpPoints) + missingXPEmoji.repeat(missingXPPoints)
}
