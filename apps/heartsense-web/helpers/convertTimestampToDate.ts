import { Timestamp } from '@/protos/generated/google/protobuf/Timestamp'

export function convertTimestampToDate(timestamp: Timestamp): Date {
  return new Date(Number(timestamp.seconds))
}
