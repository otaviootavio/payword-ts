import { UserCertification } from './UserCertification'

export interface UserCertificationSigned {
  userCertification: UserCertification
  signature: string
}
