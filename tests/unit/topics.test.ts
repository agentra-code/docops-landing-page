import { describe, expect, test } from 'vitest'
import { TOPIC_GROUPS, TOPIC_IDS, TOPIC_META, topicsByGroup } from '@/content/topics'

describe('topicsByGroup', () => {
  test('lists every topic once, groups in TOPIC_GROUPS order', () => {
    const groups = topicsByGroup()
    const order = groups.map((g) => TOPIC_GROUPS.indexOf(g.group))
    expect(order).toEqual([...order].sort((a, b) => a - b))
    expect(groups.flatMap((g) => g.ids).sort()).toEqual([...TOPIC_IDS].sort())
    for (const g of groups) for (const id of g.ids) expect(TOPIC_META[id].group).toBe(g.group)
  })

  test('exclude drops the page and never leaves an empty group', () => {
    const groups = topicsByGroup('ai-for-universities')
    expect(groups.flatMap((g) => g.ids)).not.toContain('ai-for-universities')
    expect(groups.every((g) => g.ids.length > 0)).toBe(true)
  })

  test('every group has at least one topic page', () => {
    expect(topicsByGroup().map((g) => g.group)).toEqual([...TOPIC_GROUPS])
  })
})
