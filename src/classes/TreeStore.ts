type TreeItemId = number | string;
export enum TreeItemCategory {
  GROUP = 'Группа',
  ELEMENT = 'Элемент',
}

export interface TreeItem {
  id: TreeItemId
  parent: TreeItemId | null
  label: string
}
export interface TreeItemForAgGrid extends TreeItem {
  path: string[]
  category: TreeItemCategory
}

export class TreeStore {
  private _store: TreeItem[]
  constructor(treeStore: TreeItem[]) {
    this._store = [...treeStore]
  }
  public getAll(): TreeItem[] {
    return this._store
  }
  public getItem(id: TreeItemId): TreeItem | null {
    return this._store.find(item => item.id === id) || null
  }
  public getChildren(id: TreeItemId | undefined): TreeItem[] {
    if (id === undefined) return []
    return this._store.filter(item => item.parent === id)
  }
  public getAllChildren(id: TreeItemId): TreeItem[] {
    const checkChildren = (items: TreeItem[]) => {
      let result = items
      items.forEach(item => {
        result = result.concat(checkChildren(this.getChildren(item.id)))
      })
      return result
    }
    return checkChildren(this.getChildren(id))
  }
  public getAllParents(id: TreeItemId): TreeItem[] {
    const result: TreeItem[] = []
    const addChild = (id: TreeItemId) => {
      const currentItem: TreeItem | null = this.getItem(id)
      if (!currentItem) return
      result.push(currentItem)
      if (currentItem.parent) addChild(currentItem.parent)
    }
    addChild(id)
    return result
  }

  public getArr(): TreeItemForAgGrid[] {
    return this._store.map((item: TreeItem) => {
      return {
        ...item,
        path: this.getAllParents(item.id).map(item => item.label).reverse(),
        category: this.getChildren(item.id).length
          ? TreeItemCategory.GROUP
          : TreeItemCategory.ELEMENT,
      }
    })
  }
  public addItem(item: TreeItem): void {
    this._store.push(item)
  }
  public removeItem(id: TreeItemId): void {
    this._store = this._store.filter(item => item.id !== id)
  }
  public updateItem(item: TreeItem): void {
    const currentItem = this._store.find(i => i.id === item.id)
    if (currentItem) {
      currentItem.parent = item.parent
      currentItem.label = item.label
    }
  }
}
