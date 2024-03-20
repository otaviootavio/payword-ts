import { writeFileSync } from 'fs'
import { pki } from 'node-forge'
const { privateKey: userPrivateKey, publicKey: userPublicKey } =
  pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 })

const { privateKey: brokerPrivateKey, publicKey: brokerPublicKey } =
  pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 })

const brokerSecret = 'brokerSecret'
const brokerName = 'brokerName'
const userName = 'userName'

const envContent = `
BROKER_SECRET=${brokerSecret}
BROKER_NAME=${brokerName}
USER_NAME=${userName}
BROKER_PRIVATE_KEY="${pki.privateKeyToPem(brokerPrivateKey)}"
BROKER_PUBLIC_KEY="${pki.publicKeyToPem(brokerPublicKey)}"
USER_PRIVATE_KEY="${pki.privateKeyToPem(userPrivateKey)}"
USER_PUBLIC_KEY="${pki.publicKeyToPem(userPublicKey)}"
`.trim()

writeFileSync('.env', envContent)

console.log('Environment variables generated and saved to .env file.')
