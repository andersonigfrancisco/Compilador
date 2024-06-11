function expandAST(node) {
  if (Array.isArray(node)) {
    return node.map(expandAST);
  }

  if (node && typeof node === 'object') {
    const expandedNode = { ...node };
    for (const key in expandedNode) {
      if (expandedNode.hasOwnProperty(key)) {
        expandedNode[key] = expandAST(expandedNode[key]);
      }
    }
    return expandedNode;
  }

  return node;
}

module.exports = expandAST; 