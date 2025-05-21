import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Weather, SAMPLE } from '../Weather'

jest.mock('classnames', () => jest.fn(() => ''))

describe('Weather Component', () => {
  it('renders the current temperature correctly', () => {
    render(<Weather />)

    const temp = Math.ceil(SAMPLE.current.temperature_2m)
    expect(screen.getByText(`${temp}°C`)).toBeInTheDocument()
  })

  it('displays the correct high and low temperatures for the day', () => {
    render(<Weather weatherAtLocation={SAMPLE} />)

    const high = Math.ceil(
      Math.max(...SAMPLE.hourly.temperature_2m.slice(0, 24))
    )
    const low = Math.ceil(
      Math.min(...SAMPLE.hourly.temperature_2m.slice(0, 24))
    )

    expect(screen.getByText(`H:${high}° L:${low}°`)).toBeInTheDocument()
  })

  it('renders the correct number of hourly temperatures (default: 6)', () => {
    render(<Weather weatherAtLocation={SAMPLE} />)

    const hourlyTemps = screen.getAllByText(/°C/)
    expect(hourlyTemps.length).toBeGreaterThanOrEqual(6)
  })

  it('updates to mobile layout when window width is less than 768px', () => {
    global.innerWidth = 500
    global.dispatchEvent(new Event('resize'))

    render(<Weather weatherAtLocation={SAMPLE} />)

    const hourlyTemps = screen.getAllByText(/°C/)
    expect(hourlyTemps.length).toBeGreaterThanOrEqual(5)
  })
})
