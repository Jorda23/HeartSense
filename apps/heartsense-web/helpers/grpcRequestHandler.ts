import { NextRequest, NextResponse } from 'next/server'

export async function handleGrpcCall<TRequest, TResponse>(
  req: NextRequest,
  buildRequest: (url: URL) => TRequest,
  grpcFunction: (
    request: TRequest,
    callback: (error: any, response: TResponse) => void
  ) => void,
  apiNameForLogging: string
): Promise<Response> {
  const url = new URL(req.url)
  const request = buildRequest(url)

  try {
    const response = await new Promise<TResponse>((resolve, reject) => {
      grpcFunction(request, (error, result) => {
        if (error) {
          return reject(error)
        }
        return resolve(result)
      })
    })

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error(`[${apiNameForLogging}] gRPC failure:`, error)

    const isGrpcError = Boolean(error.message)

    const errorResponse: any = {
      error: isGrpcError ? 'gRPC Error' : 'Internal Server Error',
      details: error.message,
    }

    if (isGrpcError) {
      errorResponse.debug = {
        ...request,
        raw: req.url,
      }
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
