import TreeModel from 'tree-model';

interface Tree<T> {
  id: number;
  parent?: T;
  children?: T[];
}

export function transformDateString<T>(treeModel: T): T {
  let tree: TreeModel.Node<T>;
  try {
    tree = newTree<T>(treeModel);
  } catch (e) {
    console.debug('catched, invalid data in transformDateString', treeModel);
    return treeModel;
  }
  tree.walk(null, (node) => {
    if (node.model.createdAt && node.model.updatedAt) {
      node.model.createdAt = new Date(node.model.createdAt);
      node.model.updatedAt = new Date(node.model.updatedAt);
    }
  });
  return tree.model;
}

export function replaceChild<T extends Tree<T>>(
  treeModel: T,
  replaceObj: T,
): T {
  const tree = newTree<T>(treeModel);
  const nodeToReplace = tree.first((node) => node.model.id === replaceObj.id);
  if (nodeToReplace) {
    const indexToReplace = nodeToReplace.getIndex();
    const parentNode = nodeToReplace.parent;
    nodeToReplace.drop();
    parentNode.addChildAtIndex(newTree<T>(replaceObj), indexToReplace);
  }
  return tree.model;
}

export function addChild<T extends Tree<T>>(treeModel: T, objToAdd: any): T {
  const tree = newTree<T>(treeModel);
  if (!tree.first((node) => node.model.id === objToAdd.id)) {
    tree
      .first((node) => node.model.id === objToAdd.parent.id)
      .addChild(newTree<T>(objToAdd));
  }
  return tree.model;
}

export function removeChild<T extends Tree<T>>(treeModel: T, id: number): T {
  const tree = newTree<T>(treeModel);
  const nodeToDrop = tree.first((node) => node.model.id === id);
  if (nodeToDrop) {
    nodeToDrop.drop();
  }
  return tree.model;
}

export function newTree<T>(treeModel: T): TreeModel.Node<T> {
  return new TreeModel().parse(treeModel);
}
