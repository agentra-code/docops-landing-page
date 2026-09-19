import { describe, expect, test } from 'vitest'
import { codename, productName, releaseLabel, versionLabel } from '@/lib/releases/codename'

describe('codename', () => {
  test('1.x is Uranus', () => {
    expect(codename('1.0.3')).toBe('Uranus')
    expect(codename('1.12.0')).toBe('Uranus')
    expect(productName('1.0.3')).toBe('DocOps Uranus')
    expect(versionLabel('1.0.3')).toBe('Uranus 1.0.3')
    expect(releaseLabel('1.0.3')).toBe('DocOps Uranus 1.0.3')
  })

  test('unnamed majors fall back to the plain product name', () => {
    expect(codename('2.0.0')).toBeUndefined()
    expect(productName('2.0.0')).toBe('DocOps')
    expect(versionLabel('2.0.0')).toBe('v2.0.0')
    expect(releaseLabel('2.0.0')).toBe('DocOps 2.0.0')
    expect(codename('')).toBeUndefined()
  })
})
