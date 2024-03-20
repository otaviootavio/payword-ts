import { z } from 'zod'

export const messageInputSchema = z
  .string()
  .min(1, 'MessageInput cannot be an empty string.')

export const lengthSchema = z.number().nonnegative('Length cannot be negative.')

export const PayWordSchema = z.object({
  hj: z.string(),
  j: z.number(),
})

export const UserCertificationSchema = z.object({
  brokerId: z.string().min(1, 'brokerId cannot be empty'),
  userId: z.string().min(1, 'userId cannot be empty'),
  vendorId: z.string().min(1, 'vendorId cannot be empty'),
  toAddress: z.string(),
  userPubKey: z.any(),
  expirationDate: z.number(),
})

export const UserCertificationSignedSchema = z.object({
  userCertification: UserCertificationSchema,
  signature: z.string(),
})

export const UserMessageSchema = z.object({
  vendorId: z.string().min(1, 'vendorId cannot be empty'),
  userCertificationSigned: UserCertificationSignedSchema,
  hn: z.string(),
  n: z.number(),
  expirationDate: z.number(),
})

export const UserMessageSignedSchema = z.object({
  userMessage: UserMessageSchema,
  signature: z.string(),
})
