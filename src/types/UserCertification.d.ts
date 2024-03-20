import { pki } from 'node-forge'

export interface UserCertification {
  brokerId: string
  userId: string
  vendorId: string
  toAddress: string
  userPubKey: pki.rsa.PublicKey
  expirationDate: number
}
