type TreeItemId = number | string;

export interface TreeItem {
  id: TreeItemId
  parent: TreeItemId | null
  label: string
}
export interface TreeItemForAgGrid extends TreeItem {
  path: string[]
}

export class TreeStore {
  private _store: TreeItem[]
  private _tree = []
  private _buildTree() {

    const nodes = new Map();
    const roots = [];

    // Создаем узлы
    for (const item of this._store) {
      nodes.set(item.id, { ...item, children: [] });
    }

    // Формируем дерево
    for (const item of this._store) {
      const node = nodes.get(item.id);

      if (item.parent == null) {
        // Корневой элемент
        roots.push(node);
      } else {
        // Добавляем в родителя
        const parent = nodes.get(item.parent);
        if (parent) {
          parent.children.push(node);
        } else {
          // Опционально: можно игнорировать или создавать "пустого" родителя
          // roots.push(node); // если нужно выбрасывать в корень при отсутствии родителя
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

  public getArr() {
    return this._store.map((item: TreeItem) => {
      return {
        ...item,
        path: this.getAllParents(item.id).map(item => item.label).reverse(),
      }
    }) satisfies (TreeItem & { path: string[] })[]
  }
  public addItem(item: TreeItem) {}
  public removeItem(id: TreeItemId) {}
  public updateItem(item: TreeItem) {}
}
