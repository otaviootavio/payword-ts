import { UserCertificationSigned } from './UserCertificationSigned'

export interface UserMessage {
  vendorId: string
  userCertificationSigned: UserCertificationSigned
  hn: string
  n: number
  expirationDate: number
}
