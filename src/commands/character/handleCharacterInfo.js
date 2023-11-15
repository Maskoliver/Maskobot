import { EmbedBuilder } from 'discord.js'
import { createHealthBar, createXPBar } from '../../models/Character.js'

export default async function handleCharacterInfo(character, message) {
  try {
    const [currentHealth, maxHealth] = await character.getHealth()
    const charInfo = await character._getCharacterDoc()
    const level = await character.getLevel()
    const healthBarDisplay = createHealthBar(currentHealth, maxHealth)
    const xpBarDisplay = createXPBar(
      charInfo.experience,
      charInfo.experienceToNextLevel
    )
    const embed = new EmbedBuilder()
      .setColor(0x0099ff) // EmbedBuilder uses a decimal color value
      .setTitle(`${charInfo.name} The ${charInfo.class}`)
      .setDescription(`${charInfo.race} - Level ${level}`)
      .addFields([
        {
          name: `Health   ${currentHealth}/${maxHealth}`,
          value: `${healthBarDisplay}`
        },
        {
          name: `XP   ${charInfo.experience}/${charInfo.experienceToNextLevel}`,
          value: `${xpBarDisplay} `
        },
        {
          name: 'Strength',
          value: `${charInfo.stats.strength.toString()}`,
          inline: true
        },
        {
          name: 'Dexterity',
          value: `${charInfo.stats.dexterity.toString()}`,
          inline: true
        },
        {
          name: 'Constitution',
          value: `${charInfo.stats.constitution.toString()}`,
          inline: true
        },
        {
          name: 'Intelligence',
          value: `${charInfo.stats.intelligence.toString()}`,
          inline: true
        },
        {
          name: 'Wisdom',
          value: `${charInfo.stats.wisdom.toString()}`,
          inline: true
        },
        {
          name: 'Charisma',
          value: `${charInfo.stats.charisma.toString()}`,
          inline: true
        }
      ])
      .setTimestamp()

    message.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Error retrieving level: ', error)
    message.channel.send('Error retrieving level. Please try again later.')
  }
}
