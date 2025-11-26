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
  private _map: Map<TreeItemId, TreeItem>
  private _children: Map<TreeItemId, TreeItem[]>
  constructor(treeStore: TreeItem[]) {
    this._map = new Map()
    this._children = new Map()

    for (const item of treeStore) {
      this._map.set(item.id, item)
      if (item.parent !== null) {
        if (!this._children.has(item.parent)) {
          this._children.set(item.parent, [])
        }
        this._children.get(item.parent)!.push(item)
      }
    }
  }
  private _buildChildren() {
    this._children.clear()
    for (const item of this._map.values()) {
      if (item.parent !== null) {
        if (!this._children.has(item.parent)) {
          this._children.set(item.parent, [])
        }
        this._children.get(item.parent)!.push(item)
      }
    }
  }
  public getAll(): TreeItem[] {
    return [...this._map.values()]
  }
  public getItem(id: TreeItemId): TreeItem | null {
    return this._map.get(id) || null
  }
  public getChildren(id: TreeItemId): TreeItem[] {
    return this._children.get(id) || []
  }
  public getAllChildren(id: TreeItemId): TreeItem[] {
    const result: TreeItem[] = []
    const arr: TreeItem[] = this.getChildren(id)
    while (arr.length) {
      const item = arr.shift()
      if (item) {
        result.push(item)
        arr.push(...this.getChildren(item.id))
      }
    }
    return result
  }
  public getAllParents(id: TreeItemId): TreeItem[] {
    const result: TreeItem[] = []
    let currentItem = this.getItem(id)
    while (currentItem) {
      result.push(currentItem)
      if (currentItem.parent === null) break
      currentItem = this.getItem(currentItem.parent)
    }
    return result
  }

  public getAgGridFormat(): TreeItemForAgGrid[] {
    return this.getAll().map((item: TreeItem) => {
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
    this._map.set(item.id, item)
    this._buildChildren()
  }
  public removeItem(id: TreeItemId): void {
    this._map.delete(id)
    this._buildChildren()
  }
  public updateItem(item: TreeItem): void {
    this._map.set(item.id, item)
    this._buildChildren()
  }
}
