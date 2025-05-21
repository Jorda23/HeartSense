import { join } from 'path'
import { loadEnvConfig } from '@next/env'

export default async () => {
  const projectDir = join(__dirname, '../')
  loadEnvConfig(projectDir)
}
