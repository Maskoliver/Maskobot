import { ChannelType, EmbedBuilder } from 'discord.js'

export default async function handleInventory(character, message) {
  try {
    const charInfo = await character._getCharacterDoc()
    if (message.client.inventoryThreads.has(character.charId)) {
      const threadId = message.client.inventoryThreads.get(character.charId)
      const thread = await message.channel.threads.fetch(threadId)
      if (thread) {
        await displayInventory(character, thread, charInfo)
        console.log('Inventory thread already exists, displaying inventory')
        return thread
      } else {
      }
    }
    const inventoryThread = await message.channel.threads.create({
      name: `${charInfo.name}'s Inventory`,
      autoArchiveDuration: 60,
      reason: 'Private Inventory Interaction',
      type: ChannelType.PrivateThread
    })
    if (!inventoryThread) {
      throw new Error('Failed to create inventory thread')
    }
    message.client.inventoryThreads.set(character.charId, inventoryThread.id)
    const threadLink = `https://discord.com/channels/${message.guild.id}/${inventoryThread.id}`
    await message.channel.send(
      `${charInfo.name}, your inventory has been opened in a private thread. Click here to view: ${threadLink}`
    )
    // Display the inventory in the thread
    await displayInventory(character, inventoryThread, charInfo)

    // Return the thread for further use if necessary
    return inventoryThread
  } catch (error) {
    console.error('Error handling inventory: ', error)
    await message.channel.send('There was an error opening your inventory.')
    return null
  }
}

async function displayInventory(character, thread, charInfo) {
  const inventoryData = await character.getInventoryData()
  const embed = new EmbedBuilder()
    .setTitle(`${charInfo.name}'s Inventory`)
    .addFields(
      inventoryData.length > 0
        ? inventoryData
        : [{ name: '\u200B', value: 'Your inventory is currently empty.' }]
    )
    .setColor('#0099ff')
    .setTimestamp()

  await thread.send({ embeds: [embed] })
}
