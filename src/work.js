/**
 * Copied directly from React's internal ReactTypesOfWork module
 */
export const IndeterminateComponent = 0 // Before we know whether it is functional or class
export const FunctionalComponent = 1
export const ClassComponent = 2
export const HostRoot = 3 // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4 // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5
export const HostText = 6
export const CoroutineComponent = 7
export const CoroutineHandlerPhase = 8
export const YieldComponent = 9
export const Fragment = 1
