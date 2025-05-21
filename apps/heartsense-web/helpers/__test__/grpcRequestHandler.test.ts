import { handleGrpcCall } from '@/helpers/grpcRequestHandler'
import { NextRequest } from 'next/server'

function createMockRequest(urlString: string): NextRequest {
  return { url: urlString } as unknown as NextRequest
}

jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server')

  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn((body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      })),
    },
  }
})

describe('handleGrpcCall', () => {
  const dummyUrl =
    'http://localhost/api/test?user_id=test-user&operation_id=op-1&operation_name=test-op'

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and response when gRPC call succeeds', async () => {
    const mockResponse = { message: 'Success' }
    const grpcFunction = jest.fn((request, callback) => {
      callback(null, mockResponse)
    })

    const res = await handleGrpcCall(
      createMockRequest(dummyUrl),
      (url) => ({
        user_id: url.searchParams.get('user_id'),
      }),
      grpcFunction,
      'TestAPI'
    )

    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(mockResponse)
    expect(grpcFunction).toHaveBeenCalledTimes(1)
  })

  it('should return 500 and error details when gRPC call fails', async () => {
    const mockError = new Error('gRPC failed')
    const grpcFunction = jest.fn((request, callback) => {
      callback(mockError, null)
    })

    const res = await handleGrpcCall(
      createMockRequest(dummyUrl),
      (url) => ({
        user_id: url.searchParams.get('user_id'),
      }),
      grpcFunction,
      'TestAPI'
    )

    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.error).toBe('gRPC Error')
    expect(data.details).toBe('gRPC failed')
    expect(data.debug).toHaveProperty('user_id', 'test-user')
    expect(data.debug).toHaveProperty('raw', dummyUrl)
    expect(grpcFunction).toHaveBeenCalledTimes(1)
  })

  it('should return 500 and error details when gRPC call fails', async () => {
    const mockError = { message: 'gRPC failed' }

    const grpcFunction = jest.fn((_request, callback) => {
      callback(mockError, null)
    })

    const res = await handleGrpcCall(
      createMockRequest('http://localhost/api/test?user_id=test-user'),
      (url) => ({
        user_id: url.searchParams.get('user_id'),
      }),
      grpcFunction,
      'TestAPI'
    )

    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.error).toBe('gRPC Error')
    expect(data.details).toBe('gRPC failed')
    expect(data.debug).toHaveProperty('user_id', 'test-user')
  })
})
