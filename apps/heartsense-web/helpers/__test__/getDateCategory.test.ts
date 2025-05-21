import { getDateCategory } from '../getDateCategory'

describe('getDateCategory', () => {
  const now = new Date()

  it('returns "Today" for today date', () => {
    const result = getDateCategory(new Date(now))
    expect(result).toBe('Today')
  })

  it('returns "Yesterday" for yesterday date', () => {
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const result = getDateCategory(yesterday)
    expect(result).toBe('Yesterday')
  })

  it('returns "Last Week" for date within last 7 days (but not yesterday)', () => {
    const lastWeek = new Date(now)
    lastWeek.setDate(now.getDate() - 3)
    const result = getDateCategory(lastWeek)
    expect(result).toBe('Last Week')
  })

  it('returns "Last Month" for date within last 30 days (but not last week)', () => {
    const lastMonth = new Date(now)
    lastMonth.setDate(now.getDate() - 15)
    const result = getDateCategory(lastMonth)
    expect(result).toBe('Last Month')
  })

  it('returns "Older" for dates more than 30 days ago', () => {
    const older = new Date(now)
    older.setDate(now.getDate() - 40)
    const result = getDateCategory(older)
    expect(result).toBe('Older')
  })
})
