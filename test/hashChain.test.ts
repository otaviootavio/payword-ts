import {
  getHashChainArrayByMessage,
  getHashChainItemByMessage,
  hash
} from '../src/index'

describe('Test hash', () => {
  it('hash Jonh correctly', () => {
    const result = hash('John')
    expect(result).toBe(
      'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da'
    )
  })
})

describe('Test hash with invalid inputs', () => {
  it('should throw an error for an empty string', () => {
    expect(() => hash('')).toThrow('MessageInput cannot be an empty string.')
  })

  it('should throw an error for non-string inputs', () => {
    // @ts-expect-error Testing invalid input
    expect(() => hash(123)).toThrow('Expected string, received number')
  })
})

describe('Test hashchain', () => {
  it('Hashchain item of lenght 0', () => {
    const result = getHashChainItemByMessage('John', 0)
    expect(result).toBe('John')
  })

  it('Hashchain item of lenght 1', () => {
    const result = getHashChainItemByMessage('John', 1)
    expect(result).toBe(
      'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da'
    )
  })

  it('Hashchain array of lenght 0', () => {
    const result = getHashChainArrayByMessage('John', 0)
    expect(result).toStrictEqual(['John'])
  })

  it('Hashchain of lenght 1', () => {
    const result = getHashChainArrayByMessage('John', 1)
    expect(result).toStrictEqual([
      'John',
      'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da'
    ])
  })
})

describe('Test receive and send hashchain', () => {
  it('Should create the hashchain from h0, send the hN and validate hJ', () => {
    // User create hash and send to vendor
    // h('secret') -> h(h('secret')) -> ... -> h(h... Nx ...h('secret'))
    // h0 -> h1 -> ... -> hN
    // The h0 is the secret
    const h0 = 'secret'
    const n = 10
    const hn = getHashChainItemByMessage(h0, n)

    // User produce the hJ (J < N)
    // So that we have h0 -> ... -> hj -> ... -> hn
    const j = 2
    const hj = getHashChainItemByMessage(h0, j)

    // Vendor receive J, hJ and has stored the N, hN
    // This will be used to assert the hJ validity
    expect(getHashChainItemByMessage(hj, n - j)).toBe(hn)
  })
})

describe('Test getHashChainItemByMessage with invalid inputs', () => {
  it('should throw an error for negative length', () => {
    expect(() => getHashChainItemByMessage('John', -1)).toThrow(
      'Length cannot be negative.'
    )
  })

  it('should throw an error for an empty messageInput', () => {
    expect(() => getHashChainItemByMessage('', 1)).toThrow(
      'MessageInput cannot be an empty string.'
    )
  })

  it('should throw an error for non-string messageInput', () => {
    // @ts-expect-error Testing invalid input
    expect(() => getHashChainItemByMessage(123, 1)).toThrow(
      'Expected string, received number'
    )
  })
})

describe('Test getHashChainArrayByMessage with invalid inputs', () => {
  it('should throw an error for negative length', () => {
    expect(() => getHashChainArrayByMessage('John', -1)).toThrow(
      'Length cannot be negative.'
    )
  })

  it('should throw an error for an empty messageInput', () => {
    expect(() => getHashChainArrayByMessage('', 0)).toThrow(
      'MessageInput cannot be an empty string.'
    )
  })

  it('should throw an error for non-string messageInput', () => {
    // @ts-expect-error Testing invalid input
    expect(() => getHashChainArrayByMessage(123, 0)).toThrow(
      'Expected string, received number'
    )
  })
})
