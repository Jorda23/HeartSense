export class EditorView {
  constructor({ state, parent }: { state: any; parent: any }) {
    this.state = state
    this.parent = parent
  }

  static updateListener = {
    of: jest.fn(() => []),
  }

  setState = jest.fn()
  destroy = jest.fn()
  dispatch = jest.fn()
  state = {
    doc: {
      toString: jest.fn(() => ''),
    },
    selection: null,
    update: jest.fn(({ changes, annotations }) => ({
      changes,
      annotations,
    })),
  }
}

export const EditorState = {
  create: jest.fn(({ doc, extensions }) => ({
    doc: {
      toString: jest.fn(() => doc),
    },
    extensions,
    selection: null,
    update: jest.fn(({ changes, annotations }) => ({
      changes,
      annotations,
    })),
  })),
}

export const python = jest.fn(() => [])
