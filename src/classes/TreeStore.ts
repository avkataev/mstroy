type TreeItemId = number | string;

export interface TreeItem {
  id: TreeItemId
  parent: TreeItemId | null
  label: string
}

export class TreeStore {
  constructor(private treeStore: TreeItem[]) {
    this.store = treeStore
  }
  private store: TreeItem[] = []
  public getAll() {}
  public getItem(id: TreeItemId) {}
  public getAllChildren(id: TreeItemId) {}
  public getAllParents(id: TreeItemId) {}
  public addItem(item: TreeItem) {}
  public removeItem(id: TreeItemId) {}
  public updateItem(item: TreeItem) {}
}
