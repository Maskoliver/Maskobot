// Item.js
export class Item {
  constructor(id, name, baseStats, rarity) {
    this.id = id
    this.name = name
    this.baseStats = baseStats
    this.rarity = rarity
  }

  // Calculate the final stats of the item based on its rarity.
  getStats() {
    const rarityBonus = this.getRarityBonus()
    let finalStats = {}
    Object.keys(this.baseStats).forEach((stat) => {
      finalStats[stat] =
        this.baseStats[stat] + this.baseStats[stat] * rarityBonus
    })
    return finalStats
  }

  // Determine the bonus multiplier based on the item's rarity.
  getRarityBonus() {
    const rarityMultipliers = {
      Broken: 0,
      Common: 0.1,
      Uncommon: 0.2,
      Rare: 0.3,
      Epic: 0.5,
      Legendary: 1
    }
    return rarityMultipliers[this.rarity] || 0
  }

  // Add any additional methods you might need for item interactions.
}

// You might also have a function to create an item instance from an item database.
export async function createItemFromDatabase(itemId, db) {
  // Fetch the item details from the database.
  const itemDoc = await getDoc(doc(db, 'Items', itemId))
  if (!itemDoc.exists()) throw new Error('Item does not exist')

  const itemData = itemDoc.data()
  return new Item(itemId, itemData.name, itemData.baseStats, itemData.rarity)
}
