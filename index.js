import WhatappWeb from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

const { Client, NoAuth } = WhatappWeb

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const GROUP_NAME = 'Prueba-1'
const NUMBERS = ['']

if (!NUMBERS.length) throw new Error('❌ No hay números para añadir al grupo.')

const client = new Client({
  authStrategy: new NoAuth()
  // authStrategy: new LocalAuth()
})

client.on('qr', qr => {
  console.log({ qr })
  qrcode.generate(qr, { small: true })
})

client.on('ready', async () => {
  console.log('¡Celular conectado correctamente!')

  try {
    const chats = await client.getChats()
    const groupChat = chats.find((chat) => chat.name === GROUP_NAME)

    if (groupChat?.isGroup) {
      groupChat?.sendMessage('Probando...')

      const participantsToAdd = NUMBERS.map((number) => `51${number}@c.us`)

      console.log('Añadiendo participantes...')

      for (const participant of participantsToAdd) {
        console.log(`Añadiendo a "${participant}"...`)
        await groupChat.addParticipants([participant])
        await sleep(5000)
      }

      console.log('¡Participantes añadidos!')
    }
  } catch (error) {
    console.error(error)
  }
})

client.initialize()
