import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export class Inventory {
  constructor(charId, db) {
    this.charId = charId
    this.db = db
    this.inventoryRef = doc(db, 'Inventories', this.charId)
    this.items = [] // This will now store Item instances
  }

  async loadItems() {
    try {
      const inventoryDoc = await getDoc(this.inventoryRef)

      if (inventoryDoc.exists()) {
        const itemIds = inventoryDoc.data().items
        for (const itemId of Object.keys(itemIds)) {
          this.items[itemId] = {
            item: await createItemFromDatabase(itemId, this.db),
            quantity: itemIds[itemId]
          }
        }
      } else {
        // If the inventory does not exist, create a default empty inventory
        this.items = [] // Initialize with an empty object
        await setDoc(this.inventoryRef, { items: this._serializeItemsForDb() })
      }
    } catch (error) {
      console.error('Error loading inventory: ', error)
      throw new Error('Failed to load inventory')
    }
  }

  async addItem(itemId, quantity) {
    const itemDetails = await getItemDetails(itemId, this.db)
    if (!itemDetails) {
      throw new Error('Item does not exist')
    }

    if (this.items[itemId]) {
      this.items[itemId].quantity += quantity
    } else {
      this.items[itemId] = {
        item: new Item(
          itemId,
          itemDetails.name,
          itemDetails.baseStats,
          itemDetails.rarity
        ),
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
    return this.items
  }

  async useItem(itemId) {
    // Add logic for using an item
    // Example: If it's a health potion, it should affect the character's health
  }

  async equipItem(itemId) {
    // Add logic for equipping an item
    // Example: If it's a weapon, it should change the character's attack stats
  }

  _serializeItemsForDb() {
    let serializedItems = []
    for (const [itemId, itemData] of Object.entries(this.items)) {
      serializedItems[itemId] = itemData.quantity
    }
    return serializedItems
  }
}

// This function assumes you have a collection called 'Items' in your Firestore database.
async function getItemDetails(itemId, db) {
  const itemRef = doc(db, 'Items', itemId)
  const itemSnap = await getDoc(itemRef)

  if (itemSnap.exists()) {
    // The document data will be in the .data() method of the document snapshot.
    return itemSnap.data()
  } else {
    // Handle the case where the item does not exist in the database.
    console.error(`No item found with ID: ${itemId}`)
    return null // or throw an Error depending on how you want to handle this case.
  }
}
