let characterCreationStates = {}

export async function startCharacterCreationProcess(uid, message) {
  const userId = uid
  if (characterCreationStates[userId]) {
    message.channel.send(
      'You are already in the process of creating a character.'
    )
    return
  }

  characterCreationStates[userId] = { step: 'name' }

  const thread = await message.channel.threads.create({
    name: `${message.author.username}'s Character Creation`,
    autoArchiveDuration: 60,
    reason: 'Character creation thread'
  })
  characterCreationStates[userId].threadId = thread.id
  characterCreationStates[userId].thread = thread

  thread.send(
    `${message.author}, welcome to character creation! Let's start with your character's name.`
  )
}

export function isCharacterCreationInProgress(userId) {
  return characterCreationStates.hasOwnProperty(userId)
}

export async function handleCharacterCreationResponse(message, character) {
  const userId = message.author.id
  const userState = characterCreationStates[userId]

  if (!userState || message.channel.id !== userState.threadId) {
    return // No character creation process in progress for this user
  }

  switch (userState.step) {
    case 'name':
      userState.characterName = message.content
      userState.step = 'race'
      sendRaceOptions(message.channel, userId, character)
      break
    case 'race':
      // After race is chosen, the element selection will be prompted by sendElementOptions
      break
    case 'element':
      // The element is set in the reaction collector, so no need to handle it here
      break
  }
}

async function finalizeCharacterCreation(userId, userState, character) {
  await character.create(
    userState.characterName,
    userState.characterRace,
    userState.characterElement
  )
  delete characterCreationStates[userId]
  const thread = userState.thread
  thread.send(
    `You have succesfully created ${userState.characterName} the Peasant!`
  )

  setTimeout(async () => {
    try {
      await thread.delete('Character creation completed')
    } catch (error) {
      console.error('Failed to delete the character creation thread:', error)
    }
  }, 3000)
}

async function sendRaceOptions(channel, userId, character) {
  const raceMessage = await channel.send(
    'Choose your race:\n1: Human :one:\n2: Elf :two:\n3: Dwarf :three:\n...'
  )

  const reactions = ['1️⃣', '2️⃣', '3️⃣']
  for (const reaction of reactions) {
    await raceMessage.react(reaction)
  }

  const collector = raceMessage.createReactionCollector({
    filter: (reaction, user) =>
      reactions.includes(reaction.emoji.name) && user.id === userId,
    max: 1,
    time: 60000 // 60 seconds
  })

  collector.on('collect', (reaction, user) => {
    const chosenRaceIndex = reactions.indexOf(reaction.emoji.name)
    characterCreationStates[userId].characterRace =
      getRaceByIndex(chosenRaceIndex)
    characterCreationStates[userId].step = 'element'
    sendElementOptions(channel, userId, character)
  })
}

async function sendElementOptions(channel, userId, character) {
  const elementMessage = await channel.send(
    'Choose your element:\n1: Fire :one:\n2: Air :two:\n3: Water :three:\n4: Earth :four:'
  )

  const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣']
  for (const reaction of reactions) {
    await elementMessage.react(reaction)
  }

  const collector = elementMessage.createReactionCollector({
    filter: (reaction, user) =>
      reactions.includes(reaction.emoji.name) && user.id === userId,
    max: 1,
    time: 60000 // 60 seconds
  })

  collector.on('collect', (reaction, user) => {
    const chosenElementIndex = reactions.indexOf(reaction.emoji.name)
    characterCreationStates[userId].characterElement =
      getElementByIndex(chosenElementIndex)
    finalizeCharacterCreation(
      userId,
      characterCreationStates[userId],
      character
    )
  })
}

function getRaceByIndex(index) {
  const races = ['Human', 'Elf', 'Dwarf']
  return races[index]
}

function getElementByIndex(index) {
  const elements = ['Fire', 'Air', 'Water', 'Earth']
  return elements[index]
}
