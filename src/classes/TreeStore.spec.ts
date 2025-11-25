import { describe, it, expect, beforeEach } from 'vitest'
import { type TreeItem, TreeStore } from '@/classes/TreeStore.ts'

const items: TreeItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' }
]

describe('TreeStore', () => {
  let treeStore: TreeStore
  beforeEach(() => {
    treeStore = new TreeStore(items)
  })
  it('getAll() возвращает изначальный массив', () => {
    expect(treeStore.getAll()).toEqual(items)
  })
  it('getItem() получение элемента по id', () => {
    expect(treeStore.getItem(4)).toEqual({ id: 4, parent: '91064cee', label: 'Айтем 4' })
  })
  it('getChildren() получение дочерних элементов', () => {
    expect(treeStore.getChildren(4)).toEqual([
      { id: 7, parent: 4, label: 'Айтем 7' },
      { id: 8, parent: 4, label: 'Айтем 8' }
    ])
  })
  it('getAllChildren() получение всех дочерних элементов', () => {
  })
  it('getAllParents() получение всех родителей начиная с самого элемента', () => {
    const result = [
      { id: 7, parent: 4, label: 'Айтем 7' },
      { id: 4, parent: '91064cee', label: 'Айтем 4' },
      { id: '91064cee', parent: 1, label: 'Айтем 2' },
      { id: 1, parent: null, label: 'Айтем 1' },
    ]
    expect(treeStore.getAllParents(7)).toEqual(result)
  })
  it('addItem() добавить элемент', () => {
    const item: TreeItem = { id: 9, parent: 4, label: 'Айтем 9' }
    const result = [...items, item]
    treeStore.addItem(item)
    expect(treeStore.getAll()).toEqual(result)
  })
  it('removeItem() удалить элемент', () => {
    const result = items.filter(item => item.id !== 5)
    treeStore.removeItem(5)
    expect(treeStore.getAll()).toEqual(result)
  })
  it('updateItem() обновить элемент', () => {
  })
})
