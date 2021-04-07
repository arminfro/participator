import { SetStateAction, useCallback, useState, Dispatch } from 'react';
import TreeNode from 'rc-tree/lib/Tree';

interface UseTree {
  tree: TreeNode;
  setTree: Dispatch<SetStateAction<TreeNode>>;
  scrollToKey: (key: number) => void;
}

export default function useTree(): UseTree {
  const [tree, setTree] = useState<TreeNode>();

  const scrollToKey = useCallback(
    (key: number) => {
      if (tree) {
        tree.scrollTo({
          key,
          align: 'bottom',
        });
      }
    },
    [tree],
  );

  return { tree, setTree, scrollToKey };
}
