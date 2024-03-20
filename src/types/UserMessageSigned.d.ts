import { UserMessage } from './UserMessage'

export interface UserMessageSigned {
  userMessage: UserMessage
  signature: string
}
