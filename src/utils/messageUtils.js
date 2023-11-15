import { ChannelType } from 'discord.js'
export function shouldIgnoreMessage(message) {
  // If the message is from a bot, ignore it.
  if (message.author.bot) return true

  // If the message does not start with '!' and is not from a thread, ignore it.
  return (
    !message.content.startsWith('!') &&
    message.channel.type !== ChannelType.GuildPublicThread &&
    message.channel.type !== ChannelType.GuildPrivateThread
  )
}
