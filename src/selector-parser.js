// @flow
import { createParser } from 'scalpel'
import {
  traverseTree,
  reduceTree,
  hasClass,
  isString,
  isHostOrComposite,
  getTypeName,
} from './utilities'
import prettyFormat from 'pretty-format'
import NodeArray from './NodeArray'
import _ from 'lodash'

import type { ReactTreeNode } from './types'
import type { SelectorTokenType, CombinatorTokenType } from 'scalpel/dist/types'

type TokenList = Array<SelectorTokenType | CombinatorTokenType>

// Combinators that allow you to chance selectors
const CHILD = 'childCombinator'
const ADJACENT_SIBLING = 'adjacentSiblingCombinator'
const GENERAL_SIBLING = 'generalSiblingCombinator'
const DESCENDANT = 'descendantCombinator'

// Selectors for targeting elements
const SELECTOR = 'selector'
const TYPE_SELECTOR = 'typeSelector'
const CLASS_SELECTOR = 'classSelector'
const ID_SELECTOR = 'idSelector'
const ATTRIBUTE_PRESENCE = 'attributePresenceSelector'
const ATTRIBUTE_VALUE = 'attributeValueSelector'
// @TODOD we dont support these, throw if they are used
const PSEUDO_CLASS = 'pseudoClassSelector'
const PSEUDO_ELEMENT = 'pseudoElementSelector'

// psuedo class types
const PSUEDO_CLASS_NOT = 'not'

// Our parser instance that will be reused
const parser = createParser()

function createSelectorPredicate(selectors: SelectorTokenType) {
  return (node: ReactTreeNode) =>
    isHostOrComposite(node) &&
    selectors.body.every(token => nodeMatchesToken(node, token))
}

function nodeMatchesToken(node: ReactTreeNode, token) {
  if (node === null || isString(node)) return false
  switch (token.type) {
    /**
     * Simple type matching
     * @example 'div' matches <div />
     */
    case TYPE_SELECTOR:
      return getTypeName(node.type) === token.name
    /**
     * Match against the className prop
     * @example '.active' matches <div className='active' />
     */
    case CLASS_SELECTOR:
      return hasClass(token.name, node.props)
    /**
     * Match against the `id` prop
     * @example '#nav' matches <ul id="nav" />
     */
    case ID_SELECTOR:
      return node.props.id === token.name
    /**
     * Matches if an attribute is present, regardless
     * of its value
     * @example '[disabled]' matches <a disabled />
     */
    case ATTRIBUTE_PRESENCE:
      return node.props.hasOwnProperty(token.name)
    /**
     * Matches if an attribute is present with the
     * provided value
     * @example '[data-foo=foo]' matches <div data-foo="foo" />
     */
    case ATTRIBUTE_VALUE:
      return node.props[token.name] === token.value
    case PSEUDO_CLASS:
      /**
           * Currently there is limited support for psuedo-class selectors.
           * The only supported option is :not, and the selector in :not
           * must be a simple selector, meaning there are no combinators.
           * @TODO move this into another function
           */
      if (token.name !== PSUEDO_CLASS_NOT) {
        // @TODO use invariant
        throw new Error(`${token.type} '${token.name}' is not supported.`)
      }
      if (token.parameters.length > 1) {
        throw new Error(`Complex selectors are not supported with :`)
      }
      // Build a predicate for the :not parameter
      const selector = token.parameters[0]
      const parsedSelector = parser.parse(selector)[0]
      const predicate = createSelectorPredicate(parsedSelector)
      return !predicate(node)
    case PSEUDO_ELEMENT:
      throw new Error(`${token.type} '${token.name}' is not supported.`)
    default:
      console.log(`Unknown selector: ${token.type}`)
      return false
  }
}

export default function matchSelectorAgainstTree(
  selectors: string,
  tree: ReactTreeNode | Array<ReactTreeNode>
) {
  /**
   * There are two types of tokens in a CSS selector:
   * 
   * 1. Selector tokens. These target nodes directly, like
   *    type or attribute selectors. These are easy to apply
   *    because we can travserse the tree and return only
   *    the nodes that match the predicate.
   * 
   * 2. Combinator tokens. These tokens chain together
   *    selector nodes. For example > for children, or +
   *    for adjecent siblings. These are harder to match
   *    as we have to track where in the tree we are
   *    to determine if a selector node applies or not.
   */
  const tokens: TokenList = safelyGenerateTokens(selectors)
  // Tracks the index of the current pointer
  let pointer = 0
  // The last token matched
  let prev = null
  // The token currently being matched
  let token = null
  let matched = new NodeArray()
  while (pointer < tokens.length) {
    token = tokens[pointer]
    prev = token
    // Selector tokens should be matched against the tree directly
    if (token.type === SELECTOR) {
      reduceTree(
        tree,
        matched,
        createSelectorPredicate(((token: any): SelectorTokenType))
      )
    } else {
      // Combinator tokens dictate the "direction" we should
      // parse from the previously matched tokens. We can assume
      // There always all previously matched tokens since selectors
      // cannot start with combinators.
      const type = token.type
      // We assume the next token is a selector, so move the
      // pointer forward and build the predicate.
      token = tokens[++pointer]
      const predicate = createSelectorPredicate(
        ((token: any): SelectorTokenType)
      )
      switch (type) {
        /**
         * Determining the adjecent sibling is the most straight-
         * forward combinator, since our traverseTree method
         * has populated a pointer to nextSibling. All we have
         * to do is check if node.nextSibling matches the
         * next token (which must be a selector).
         */
        case ADJACENT_SIBLING: {
          // NodeArray.reduce will default to reducing into
          // a new NodeArray instance
          matched = matched.reduce((acc, node) => {
            if (isHostOrComposite(node) && predicate(node.nextSibling)) {
              return node.nextSibling
            }
          })
          break
        }
        /**
           * For general siblings we need to check every sibling,
           * previous and next, against the next predicate.
           */
        case GENERAL_SIBLING: {
          const nextMatched = new NodeArray()
          matched.forEach(node => {
            let next = node
            while (next) {
              if (predicate(next)) {
                /**
                   * Sometimes a selector might match the
                   * same node mulitple times. For example, imagine
                   * you have:
                   * 
                   *   - img
                   *   - div
                   *   - img
                   *   - div
                   *   - div
                   *  
                   *  With the selector img ~ div. It would match
                   *  all three divs for the first img, and then
                   *  just the last two for the second img. This
                   *  check ensures that we don't duplicate our
                   *  matches in that case.
                   */
                if (next && !nextMatched.contains(next)) {
                  nextMatched.push(next)
                }
              }
              // $FlowFixMe nextSibling will always exist at this point
              next = next.nextSibling
            }
          })
          matched = nextMatched
          break
        }
        case CHILD: {
          const nextMatched = new NodeArray()
          matched.forEach(node => {
            // $FlowFixMe node.rendered should always exist right?
            node.rendered.forEach(child => {
              if (predicate(child)) {
                nextMatched.push(child)
              }
            })
          })
          matched = nextMatched
          break
        }
        case DESCENDANT: {
          const nextMatched = new NodeArray()
          matched.forEach(node => reduceTree(node, nextMatched, predicate))
          matched = nextMatched
          break
        }
      }
    }
    pointer++
  }
  return matched
}

function safelyGenerateTokens(selector) {
  try {
    return parser.parse(selector)
  } catch (err) {
    throw new Error(`${selector} is not a valid CSS selector`)
  }
}
