import { createHealthBar } from '../models/Character.js'
export default async function handleCharacterInfo(character, message) {
  try {
    console.log('character', character)
    const [currentHealth, maxHealth] = await character.getHealth()
    const charInfo = await character._getCharacterDoc()
    const level = await character.getLevel()
    const healthBarDisplay = createHealthBar(currentHealth, maxHealth)
    message.channel.send(
      `Health: ${currentHealth}/${maxHealth}\n${healthBarDisplay}\nYou are at level ${level}\n XP: ${charInfo.experience} / ${charInfo.experienceToNextLevel} \n Stats are 
      Strength: ${charInfo.stats.strength}
      Dexterity: ${charInfo.stats.dexterity}
      Constitution: ${charInfo.stats.constitution}
      Intelligence: ${charInfo.stats.intelligence}
      Wisdom: ${charInfo.stats.wisdom}
      Charisma: ${charInfo.stats.charisma}
      `
    )
  } catch (error) {
    console.error('Error retrieving level: ', error)
    message.channel.send('Error retrieving level. Please try again later.')
  }
}
