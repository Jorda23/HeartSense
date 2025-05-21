import { convertTimestampToDate } from '../convertTimestampToDate'
import { Timestamp } from '@/protos/generated/google/protobuf/Timestamp'

describe('convertTimestampToDate', () => {
  it('correctly converts Timestamp to JavaScript Date', () => {
    const timestamp: Timestamp = {
      seconds: '1617181723',
      nanos: 500000000,
    }

    const expected = new Date(
      Number(timestamp.seconds) * 1000 + timestamp.nanos / 1_000_000
    )
    const result = convertTimestampToDate(timestamp)

    expect(result.getTime()).toBe(expected.getTime())
  })

  it('returns correct date when nanos is zero', () => {
    const timestamp: Timestamp = {
      seconds: '1617181723',
      nanos: 0,
    }

    const expected = new Date(Number(timestamp.seconds) * 1000)
    const result = convertTimestampToDate(timestamp)

    expect(result.toISOString()).toBe(expected.toISOString())
  })
})
