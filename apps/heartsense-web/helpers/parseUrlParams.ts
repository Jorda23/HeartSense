import { URL } from 'url'

export function parseCommonFilters(url: URL) {
  return {
    filter: { value: url.searchParams.get('filter') },
    skip: { value: url.searchParams.get('skip') },
    limit: { value: url.searchParams.get('limit') },
    includes: { value: url.searchParams.get('includes') },
    sort: { value: url.searchParams.get('sort') },
  }
}

export function parseCommonOperation(url: URL) {
  return {
    OperationId: url.searchParams.get('operation_id'),
    OperationName: url.searchParams.get('operation_name'),
  }
}
