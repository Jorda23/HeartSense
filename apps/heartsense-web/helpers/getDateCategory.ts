export enum DateCategory {
  Today = 'Today',
  Yesterday = 'Yesterday',
  LastWeek = 'Last Week',
  LastMonth = 'Last Month',
  Older = 'Older',
}

export function getDateCategory(date: Date): DateCategory {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const oneDay = 86400000

  if (diff < oneDay && now.getDate() === date.getDate()) {
    return DateCategory.Today
  }

  if (diff < 2 * oneDay && now.getDate() - date.getDate() === 1) {
    return DateCategory.Yesterday
  }

  if (diff < 7 * oneDay) {
    return DateCategory.LastWeek
  }

  if (diff < 30 * oneDay) {
    return DateCategory.LastMonth
  }

  return DateCategory.Older
}
