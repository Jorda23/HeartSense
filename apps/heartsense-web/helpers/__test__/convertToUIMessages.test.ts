import { convertToUIMessages } from '../convertToUIMessages'

describe('convertToUIMessages', () => {
  it('returns an empty array if rawMessages is undefined', () => {
    const result = convertToUIMessages(undefined as any)
    expect(result).toEqual([])
  })

  it('returns an empty array if rawMessages is null', () => {
    const result = convertToUIMessages(null as any)
    expect(result).toEqual([])
  })

  it('maps valid rawMessages correctly', () => {
    const result = convertToUIMessages([
      {
        messageId: '1',
        content: 'Hello',
        sentAt: { seconds: '1713830400', nanos: 0 },
        isFromBot: true,
      },
    ])

    expect(result.length).toBe(1)
    expect(result[0]).toMatchObject({
      id: '1',
      content: 'Hello',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hello' }],
    })
  })
})
