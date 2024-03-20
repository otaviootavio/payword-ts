import dotenv from 'dotenv'
import {
  generateUserCertification,
  generateUserMessageSigned,
  getHashChainArrayByMessage,
  verifyUserMessageSigned,
  verifyUserCertificationSigned,
} from '../src'
import {
  UserCertification,
  UserCertificationSigned,
  UserMessageSigned,
  UserMessage,
} from '../src/types'
import { pki } from 'node-forge'

dotenv.config()
const brokerPrivateKey = pki.privateKeyFromPem(
  process.env['BROKER_PRIVATE_KEY'] ?? ''
)
const brokerPublicKey = pki.publicKeyFromPem(
  process.env['BROKER_PUBLIC_KEY'] ?? ''
)
const userPrivateKey = pki.privateKeyFromPem(
  process.env['USER_PRIVATE_KEY'] ?? ''
)
const userPublicKey = pki.publicKeyFromPem(process.env['USER_PUBLIC_KEY'] ?? '')

describe('Test certificate', () => {
  it('Generate and verify true certificate', () => {
    const userCertification: UserCertification = {
      brokerId: 'brokerId',
      userId: 'userId',
      vendorId: 'vendorId',
      expirationDate: 123321,
      toAddress: 'toAddress',
      userPubKey: userPublicKey,
    }

    const userCertificationSigned: UserCertificationSigned =
      generateUserCertification(userCertification, brokerPrivateKey)

    const isValid: boolean = verifyUserCertificationSigned(
      userCertificationSigned,
      brokerPublicKey
    )

    expect(isValid).toBe(true)
  })

  it('Generate and verify false certificate', () => {
    const userCertification: UserCertification = {
      brokerId: 'brokerId',
      userId: 'userId',
      vendorId: 'vendorId',
      expirationDate: 123321,
      toAddress: 'toAddress',
      userPubKey: userPublicKey,
    }

    const userCertificationSigned: UserCertificationSigned =
      generateUserCertification(userCertification, brokerPrivateKey)

    const falseCertificate: UserCertificationSigned = {
      ...userCertificationSigned,
      userCertification: {
        ...userCertificationSigned.userCertification,
        userId: 'fakeUserId',
      },
    }

    const isValid: boolean = verifyUserCertificationSigned(
      falseCertificate,
      brokerPublicKey
    )
    expect(isValid).toBe(false)
  })

  it('Generate and verify true message', () => {
    const userCertification: UserCertification = {
      brokerId: 'brokerId',
      userId: 'userId',
      vendorId: 'vendorId',
      expirationDate: 123321,
      toAddress: 'toAddress',
      userPubKey: userPublicKey,
    }

    const userCertificationSigned: UserCertificationSigned =
      generateUserCertification(userCertification, brokerPrivateKey)

    expect(
      verifyUserCertificationSigned(userCertificationSigned, brokerPublicKey)
    ).toBe(true)

    const h0: string = 'hashzero'
    const n = 100
    const hashArray: string[] = getHashChainArrayByMessage(h0, n)
    const hn: string = hashArray[n] ?? ''

    const userMessage: UserMessage = {
      expirationDate: 1010,
      hn,
      n,
      userCertificationSigned,
      vendorId: 'vendorId',
    }

    const userMessageSigned: UserMessageSigned = generateUserMessageSigned(
      userPrivateKey,
      userMessage
    )

    expect(verifyUserMessageSigned(userMessageSigned, userPublicKey)).toBe(true)
  })
})

describe('UserCertification validation', () => {
  it('should successfully validate a correct UserCertification', () => {
    const userCertification: UserCertification = {
      brokerId: 'brokerId',
      userId: 'userId',
      vendorId: 'vendorId',
      expirationDate: 123321,
      toAddress: 'toAddress',
      userPubKey: userPublicKey,
    }

    expect(() =>
      generateUserCertification(userCertification, brokerPrivateKey)
    ).not.toThrow()
  })

  it('should throw an error for invalid UserCertification', () => {
    const invalidUserCertification: UserCertification = {
      brokerId: '', // Invalid because it's empty
      userId: 'userId',
      vendorId: 'vendorId',
      expirationDate: 123321,
      toAddress: 'toAddress',
      userPubKey: userPublicKey,
    }

    expect(() =>
      generateUserCertification(invalidUserCertification, brokerPrivateKey)
    ).toThrow()
  })
})

describe('UserMessage validation', () => {
  it('should successfully validate a correct UserMessage', () => {
    const userMessage: UserMessage = {
      vendorId: 'vendorId',
      userCertificationSigned: {
        userCertification: {
          brokerId: 'brokerId',
          userId: 'userId',
          vendorId: 'vendorId',
          expirationDate: 123321,
          toAddress: 'toAddress',
          userPubKey: userPublicKey,
        },
        signature: 'validSignature',
      },
      hn: 'validHn',
      n: 100,
      expirationDate: 123321,
    }

    expect(() =>
      generateUserMessageSigned(userPrivateKey, userMessage)
    ).not.toThrow()
  })

  it('should throw an error for invalid UserMessage', () => {
    const invalidUserMessage: UserMessage = {
      vendorId: '', // Invalid because it's empty
      userCertificationSigned: {
        userCertification: {
          brokerId: 'brokerId',
          userId: 'userId',
          vendorId: 'vendorId',
          expirationDate: 123321,
          toAddress: 'toAddress',
          userPubKey: userPublicKey,
        },
        signature: 'validSignature',
      },
      hn: 'validHn',
      n: 100,
      expirationDate: 123321,
    }

    expect(() =>
      generateUserMessageSigned(userPrivateKey, invalidUserMessage)
    ).toThrow()
  })
})
