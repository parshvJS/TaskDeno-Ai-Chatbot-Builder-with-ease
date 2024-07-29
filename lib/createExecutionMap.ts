export function createExecutionMap(nodes, edges) {
  const executionMap = [];
  const visited = new Set();
  const nodeMap = new Map();

  // Create a map of node connections
  edges.forEach(edge => {
    if (!nodeMap.has(edge.source)) {
      nodeMap.set(edge.source, []);
    }
    nodeMap.get(edge.source).push(edge.target);
  });

  let currentNodeId = edges[0].source;
  
  while (true) {
    if (visited.has(currentNodeId)) {
      executionMap.push(currentNodeId);
      break;
    }
    if (!nodeMap.has(currentNodeId) || nodeMap.get(currentNodeId).length === 0) {
      executionMap.push(currentNodeId);
      break;
    }
    visited.add(currentNodeId);
    executionMap.push(currentNodeId);
    const nextNodeId = nodeMap.get(currentNodeId).shift(); // Get the next node and remove it from the list
    currentNodeId = nextNodeId;

    // Remove the node if there are no more connections
    if (nodeMap.get(currentNodeId) && nodeMap.get(currentNodeId).length === 0) {
      nodeMap.delete(currentNodeId);
    }
  }

  return executionMap;
}



export function clearNode(node:object) {
  const nodeData = node.data;
  console.log(nodeData,"is cleared node")
  if ('message' in nodeData) {
    return {
      id:node.id,
      message: nodeData.message,
      user: nodeData.user,
      flaged:false
    }
  }
  else {
    return {
      id:node.id,
      ai: nodeData.ai,
      user: nodeData.user,
      flaged:false
    }
  }
}


export function checkNodeData(nodes) {
  let emptyCount = 0;
  const totalNodes = nodes.length;

  nodes.forEach(node => {
    const { data } = node;
    if (isNodeEmpty(data)) {
      emptyCount++;
    }
  });

  let message = '';
  if (emptyCount / totalNodes > 0.4) {
    message = 'Your chatbot layout is very empty, please fill this first';
    return { message, status: false };
  } else if (emptyCount / totalNodes > 0.2) {
    message = 'Your chatbot layout is a bit empty, you should complete it for more efficiency';
    return { message, status: false };
  } else if (emptyCount > 0) {
    message = 'Some nodes are empty, fill that for better chatbot efficiency';
    return { message, status: true };
  } else {
    message = 'All data is filled';
    return { message, status: true };
  }
}

function isNodeEmpty(data) {
  if (data.hasOwnProperty('message') && data.hasOwnProperty('user')) {
    const { message, user } = data;
    if (message.type && user.type) {
      if ((message.content === '' && message.variable === '') ||
          user.type === '' && user.variable === '') {
        return true;
      }
    } else {
      return true;
    }
  } else if (data.hasOwnProperty('ai') && data.hasOwnProperty('user')) {
    const { ai, user } = data;
    if (ai.type && user.type) {
      if (user.type === '' && user.variable === '') {
        return true;
      }
    } else {
      return true;
    }
  }
  return false;
}

