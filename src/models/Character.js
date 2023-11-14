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

export function createHealthBar(currentHealth, maxHealth, size = 10) {
  const healthEmoji = ':green_square:'
  const missingHealthEmoji = ':red_square:'

  const healthPoints = Math.round((currentHealth / maxHealth) * size)
  const missingHealthPoints = size - healthPoints

  return (
    healthEmoji.repeat(healthPoints) +
    missingHealthEmoji.repeat(missingHealthPoints)
  )
}
