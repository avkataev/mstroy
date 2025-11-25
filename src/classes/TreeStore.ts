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
  private _tree = []
  private _buildTree() {

    const nodes = new Map();
    const roots = [];

    for (const item of this._store) {
      nodes.set(item.id, { ...item, children: [] });
    }
    for (const item of this._store) {
      const node = nodes.get(item.id);

      if (item.parent == null) {
        roots.push(node);
      } else {
        const parent = nodes.get(item.parent);
        if (parent) {
          parent.children.push(node);
        }
      }
    }

    this._tree = roots
  }
  constructor(private treeStore: TreeItem[]) {
    this._store = [...treeStore]
    this._buildTree()
  }
  public getAll(): TreeItem[] {
    return this._store
  }
  public getTree(): TreeItem[] {
    return this._tree
  }
  public getItem(id: TreeItemId): TreeItem | null {
    return this._store.find(item => item.id === id) || null
  }
  public getChildren(id: TreeItemId | undefined): TreeItem[] {
    if (id === undefined) return []
    return this._store.filter(item => item.parent === id)
  }
  public getAllChildren(id: TreeItemId): TreeItem[] {
    return this._store.filter(item => item.parent === id)
  }
  public getAllParents(id: TreeItemId) {
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
  public addItem(item: TreeItem) {}
  public removeItem(id: TreeItemId) {}
  public updateItem(item: TreeItem) {}
}
