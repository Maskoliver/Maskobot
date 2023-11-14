import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore'

export class Inventory {
  constructor(charId, db) {
    this.charId = charId
    this.db = db
    this.invRef = doc(db, 'Inventories', this.charId)
  }

  // Add an item to the character's inventory
  async addItem(item) {
    await updateDoc(this.invRef, {
      inventory: arrayUnion(item)
    })
  }

  // Remove an item from the character's inventory
  async removeItem(item) {
    await updateDoc(this.invRef, {
      inventory: arrayRemove(item)
    })
  }

  // Retrieve the character's inventory
  async getInventory() {
    const charDoc = await getDoc(this.invRef)
    if (!charDoc.exists()) {
      throw new Error('Character does not exist')
    }
    return charDoc.data().inventory || []
  }
}
