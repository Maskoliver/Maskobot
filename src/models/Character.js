import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { Inventory } from './Inventory.js' // Import the Inventory class

export class Character {
  constructor(charId, db) {
    this.charId = charId
    this.db = db
    this.charRef = doc(db, 'Characters', this.charId)
    this.inventory = new Inventory(charId, db) // Create an Inventory instance
  }

  // Create a new character with default attributes
  async create(name, characterClass) {
    const defaultAttributes = {
      name,
      class: characterClass,
      level: 1,
      health: 100,
      experience: 0
    }

    await setDoc(this.charRef, defaultAttributes)
  }

  // Level up the character and increase attributes
  async levelUp() {
    const charDoc = await this._getCharacterDoc()
    const updatedAttributes = {
      level: charDoc.level + 1,
      health: charDoc.health + 10, // Example increment, adjust as needed
      experience: 0 // Reset experience or handle as needed
    }

    await updateDoc(this.charRef, updatedAttributes)
    return updatedAttributes.level
  }

  // Get current level of the character
  async getLevel() {
    const charDoc = await this._getCharacterDoc()
    return charDoc.level
  }

  // Private method to fetch character document
  async _getCharacterDoc() {
    const charDoc = await getDoc(this.charRef)
    if (!charDoc.exists()) {
      throw new Error('Character does not exist')
    }
    return charDoc.data()
  }
}
