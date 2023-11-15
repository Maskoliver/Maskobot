export default async function handleEquipItem(character, message, args) {
  // args[0] should be the item name or ID
  const itemName = args[0]

  try {
    // Add logic to equip the item
    // This should change the character's stats accordingly
    await character.inventory.equipItem(itemName)

    await message.channel.send(`You have equipped ${itemName}.`)
  } catch (error) {
    console.error('Error equipping item: ', error)
    await message.channel.send(
      `There was an error equipping the item: ${itemName}`
    )
  }
}
