import {
  generateUserCertification,
  getHashChainItemByMessage,
  isPayWordValid,
} from '../src'
import dotenv from 'dotenv'
import { UserMessage, PayWord, UserCertification } from '../src/types'
import { pki } from 'node-forge'

dotenv.config()
const brokerPrivateKey = pki.privateKeyFromPem(
  process.env['BROKER_PRIVATE_KEY'] ?? ''
)
// const brokerPublicKey = pki.publicKeyFromPem(
//   process.env['BROKER_PUBLIC_KEY'] ?? ''
// )
// const userPrivateKey = pki.privateKeyFromPem(
//   process.env['USER_PRIVATE_KEY'] ?? ''
// )
const userPublicKey = pki.publicKeyFromPem(process.env['USER_PUBLIC_KEY'] ?? '')

describe('Test payword', () => {
  it('Should validade payword', () => {
    const userCertification: UserCertification = {
      brokerId: 'brokerId',
      userId: 'userId',
      vendorId: 'vendorId',
      toAddress: 'toAddress',
      userPubKey: userPublicKey,
      expirationDate: 123321,
    }

    const userCertificationSigned = generateUserCertification(
      userCertification,
      brokerPrivateKey
    )

    const h0: string = 'segredo'
    const n: number = 100
    const hn: string = getHashChainItemByMessage(h0, n)

    const userMessage: UserMessage = {
      userCertificationSigned,
      vendorId: 'vendorId',
      hn,
      n,
      expirationDate: 10,
    }

    const j = 75
    const payWord: PayWord = { j, hj: getHashChainItemByMessage(h0, j) }

    expect(isPayWordValid(payWord, userMessage, n)).toBe(true)
  })

  it('Should deny a payword with wrong hash', () => {
    const userCertification: UserCertification = {
      brokerId: 'brokerId',
      userId: 'userId',
      vendorId: 'vendorId',
      toAddress: 'toAddress',
      userPubKey: userPublicKey,
      expirationDate: 123321,
    }

    const userCertificationSigned = generateUserCertification(
      userCertification,
      brokerPrivateKey
    )

    const h0: string = 'hashzero'
    const n = 100
    const hn = getHashChainItemByMessage(h0, 100)

    const userMessage: UserMessage = {
      userCertificationSigned,
      vendorId: 'vendorId',
      expirationDate: 123,
      hn,
      n,
    }

    const j = 66
    const payWord: PayWord = { j, hj: getHashChainItemByMessage(h0, j) }

    expect(isPayWordValid(payWord, userMessage, 1000)).toBe(false)
  })
})
