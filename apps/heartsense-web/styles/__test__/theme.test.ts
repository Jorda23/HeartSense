import { colors, themeOptions } from '@nassa/rocket-ui-web'

describe('theme', () => {
  it('should display themes variables', () => {
    expect.assertions(1)
    expect(themeOptions.palette.primary.main).toBe(colors.madison)
  })
})
