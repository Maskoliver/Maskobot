// In your handleInventory.js or similar file
export default async function handleInventory(character, message) {
  try {
    // Create a private thread for inventory interaction
    const charInfo = await character._getCharacterDoc()

    const inventoryThread = await message.channel.threads.create({
      name: `${charInfo.name}'s Inventory`,
      autoArchiveDuration: 60,
      reason: 'Private Inventory Interaction'
    })

    // Notify the user
    await message.channel.send(
      `${charInfo.name}, your inventory has been opened in a private thread.`
    )
    inventoryThread.send(`${charInfo.name}, welcome to your inventory.`)
    const inventoryEmbed = character.displayInventory(inventoryThread, charInfo)

    // Load and display the inventory in the thread
    // ... (load and display inventory logic)
  } catch (error) {
    console.error('Error handling inventory: ', error)
    await message.channel.send('There was an error opening your inventory.')
  }
}
