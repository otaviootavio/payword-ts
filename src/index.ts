import { UserCertification } from './types/UserCertification'
import { PayWord } from './types/PayWord'
import { UserMessage } from './types/UserMessage'
import { UserCertificationSigned } from '../src/types'
import { UserMessageSigned } from './types/UserMessageSigned'
import {
  UserCertificationSchema,
  UserCertificationSignedSchema,
  UserMessageSchema,
  UserMessageSignedSchema,
  lengthSchema,
  messageInputSchema,
} from './schemas'
import { md, sha256, pki } from 'node-forge'

export function hash(messageInput: string): string {
  messageInputSchema.parse(messageInput)
  const md = sha256.create()
  md.update(messageInput)
  return md.digest().toHex()
}

export function sign(data: string, privKey: pki.rsa.PrivateKey): string {
  const messageDigest = md.sha1.create()
  messageDigest.update(data, 'utf8')
  const signature = privKey.sign(messageDigest)
  return signature
}

export function verify(
  data: string,
  signature: string,
  pubKey: pki.rsa.PublicKey
): boolean {
  const messageDigest = md.sha1.create()
  messageDigest.update(data, 'utf8')
  return pubKey.verify(messageDigest.digest().bytes(), signature)
}

export function getHashChainItemByMessage(
  messageInput: string,
  length: number
): string {
  messageInputSchema.parse(messageInput)
  lengthSchema.parse(length)

  if (length === 0) return messageInput
  else return getHashChainItemByMessage(hash(messageInput), length - 1)
}

export function getHashChainArrayByMessage(
  messageInput: string,
  length: number
): string[] {
  messageInputSchema.parse(messageInput)
  lengthSchema.parse(length)

  const hashChain: string[] = [messageInput]
  if (hashChain.length === 0) {
    throw new Error('Cannot hash the last element because hashChain is empty.')
  }
  for (let i = 0; i < length; i++) {
    const lastHash = hashChain[hashChain.length - 1] ?? ''
    const newHash: string = hash(lastHash)
    hashChain.push(newHash)
  }
  return hashChain
}

export function isPayWordValid(
  payWord: PayWord,
  userMessage: UserMessage,
  n: number
): boolean {
  const calculatedWn = getHashChainItemByMessage(payWord.hj, n - payWord.j)
  const receivedWn = userMessage.hn
  return calculatedWn === receivedWn
}

export function generateUserCertification(
  userCertification: UserCertification,
  brokerPrivateKey: pki.rsa.PrivateKey
): UserCertificationSigned {
  UserCertificationSchema.parse(userCertification)
  const signature: string = sign(
    JSON.stringify(userCertification),
    brokerPrivateKey
  )

  return {
    signature,
    userCertification,
  }
}

export function verifyUserCertificationSigned(
  userCertificationSigned: UserCertificationSigned,
  brokerPublicKey: pki.rsa.PublicKey
): boolean {
  UserCertificationSignedSchema.parse(userCertificationSigned)
  const { signature, userCertification } = userCertificationSigned

  if (userCertification === null) {
    throw new Error('userCertification is undefined or null')
  }

  return verify(JSON.stringify(userCertification), signature, brokerPublicKey)
}

export function generateUserMessageSigned(
  userPrivateKey: pki.rsa.PrivateKey,
  userMessage: UserMessage
): UserMessageSigned {
  UserMessageSchema.parse(userMessage)
  const userDataMessage = JSON.stringify(userMessage)

  const signature: string = sign(userDataMessage, userPrivateKey)

  return {
    userMessage,
    signature,
  }
}

export function verifyUserMessageSigned(
  userMessageSigned: UserMessageSigned,
  userPublicKey: pki.rsa.PublicKey
): boolean {
  UserMessageSignedSchema.parse(userMessageSigned)
  const { signature, userMessage } = userMessageSigned

  return verify(JSON.stringify(userMessage), signature, userPublicKey)
}
