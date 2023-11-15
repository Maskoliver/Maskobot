export default async function handleUseItem(character, message, args) {
  // args[0] should be the item name or ID
  const itemName = args[0]

  try {
    // Add logic to determine the effect of using the item
    // For example, if it's a health potion, it should restore health
    await character.inventory.useItem(itemName)

    await message.channel.send(`You have used ${itemName}.`)
  } catch (error) {
    console.error('Error using item: ', error)
    await message.channel.send(`There was an error using the item: ${itemName}`)
  }
}
