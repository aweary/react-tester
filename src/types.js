// @flow

export type ReactTreeNode =
  | null
  | string
  | {
      nodeType: 'component' | 'host',
      // @TODO Function should be ReactComponent
      type: string | Function,
      // @TODO is there a better way to type dynamic maps in flow?
      props: { [propName: string]: any },
      // @TODO for now this is an object, but hopefully we can import
      // the type from React in the future
      instance: null | Object,
      rendered: ReactTreeNode | Array<ReactTreeNode>,
      // These properties are not returned from React, but are added
      // by traverseTree.
      parent?: ReactTreeNode,
      nextSibling?: ReactTreeNode,
      prevSibling?: ReactTreeNode,
    }

export type SearchPredicate = (type: string | Function, props: Object) => boolean
