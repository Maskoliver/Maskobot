import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export class Inventory {
  constructor(charId, db) {
    this.charId = charId
    this.db = db
    this.inventoryRef = doc(db, 'Inventories', this.charId)
    this.items = {} // This will store Item instances keyed by itemId
  }

  async loadItems() {
    const inventoryDoc = await getDoc(this.inventoryRef)
    if (inventoryDoc.exists() && inventoryDoc.data().items) {
      const itemIds = inventoryDoc.data().items
      for (const [itemId, itemData] of Object.entries(itemIds)) {
        this.items[itemId] = {
          item: await this.getItemDetails(itemId),
          quantity: itemData
        }
      }
    } else {
      await setDoc(this.inventoryRef, { items: {} })
    }
  }

  async addItem(itemId, quantity) {
    const itemDetails = await this.getItemDetails(itemId)
    if (!itemDetails) {
      throw new Error('Item does not exist')
    }

    if (this.items[itemId]) {
      this.items[itemId].quantity += quantity
    } else {
      this.items[itemId] = {
        item: itemDetails,
        quantity: quantity
      }
    }

    await updateDoc(this.inventoryRef, { items: this._serializeItemsForDb() })
  }

  async removeItem(itemId, quantity) {
    if (this.items[itemId] && this.items[itemId].quantity >= quantity) {
      this.items[itemId].quantity -= quantity
      if (this.items[itemId].quantity === 0) {
        delete this.items[itemId]
      }
      await updateDoc(this.inventoryRef, { items: this._serializeItemsForDb() })
    } else {
      throw new Error('Not enough items or item does not exist')
    }
  }

  getInventoryList() {
    return Object.values(this.items) // Return an array of item objects
  }

  async useItem(itemId) {
    // Your logic for using an item
  }

  async equipItem(itemId) {
    // Your logic for equipping an item
  }

  _serializeItemsForDb() {
    const serializedItems = {}
    for (const [itemId, itemData] of Object.entries(this.items)) {
      serializedItems[itemId] = itemData.quantity
    }
    return serializedItems
  }

  async getItemDetails(itemId) {
    const itemRef = doc(this.db, 'Items', itemId)
    const itemSnap = await getDoc(itemRef)
    if (itemSnap.exists()) {
      return itemSnap.data()
    } else {
      console.error(`No item found with ID: ${itemId}`)
      return null
    }
  }
}
