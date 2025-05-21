'use client'

import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { LoaderIcon } from '@/public/Icons'
import { gapi } from 'gapi-script'

const CLIENT_ID =
  '331097709828-6c6mj91atj5ivnf7pq8hsfse6ipck81s.apps.googleusercontent.com'

const SCOPES =
  'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read'

export default function Page() {
  const [steps, setSteps] = useState<number | null>(null)
  const [calories, setCalories] = useState<number | null>(null)
  const [heartPoints, setHeartPoints] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      })
    }
    gapi.load('client:auth2', start)
  }, [])

  const authenticate = () => {
    const auth = gapi.auth2.getAuthInstance()
    auth.signIn().then(() => {
      setLoading(true)
      fetchHealthData()
    })
  }

  const fetchHealthData = async () => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const startTime = sevenDaysAgo.getTime()
    const endTime = now.getTime()

    try {
      // PASOS
      const stepsRes = await gapi.client.request({
        path: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        method: 'POST',
        body: {
          aggregateBy: [
            {
              dataSourceId:
                'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
              dataTypeName: 'com.google.step_count.delta',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime,
        },
      })

      console.log('Steps Response:', stepsRes)

      const steps =
        stepsRes.result.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]
          ?.intVal || 0

      // CALORÍAS
      const caloriesRes = await gapi.client.request({
        path: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        method: 'POST',
        body: {
          aggregateBy: [
            {
              dataSourceId:
                'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
              dataTypeName: 'com.google.calories.expended',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime,
        },
      })

      console.log('Calories Response:', caloriesRes)

      const calories =
        caloriesRes.result.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]
          ?.fpVal || 0

      // HEART POINTS
      const heartPointsRes = await gapi.client.request({
        path: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        method: 'POST',
        body: {
          aggregateBy: [
            {
              dataSourceId:
                'derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes',
              dataTypeName: 'com.google.heart_minutes',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime,
        },
      })

      console.log('Heart Points Response:', heartPointsRes)

      const heartPoints =
        heartPointsRes.result.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]
          ?.fpVal || 0

      setSteps(steps)
      setCalories(calories)
      setHeartPoints(heartPoints)
    } catch (err) {
      console.error('Error al obtener datos:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Estado de salud del paciente</h2>

      <Button
        variant="contained"
        onClick={authenticate}
        disabled={loading}
        startIcon={loading && <LoaderIcon />}
      >
        {loading ? 'Cargando datos...' : 'Conectar con Google Fit'}
      </Button>

      {steps !== null && (
        <p className="text-lg">
          Pasos dados: <strong>{steps}</strong>
        </p>
      )}

      {calories !== null && (
        <p className="text-lg">
          Calorías quemadas: <strong>{calories.toFixed(0)} kcal</strong>
        </p>
      )}

      {heartPoints !== null && (
        <p className="text-lg">
          Heart Points: <strong>{heartPoints}</strong>
        </p>
      )}
    </main>
  )
}
