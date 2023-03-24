import { reactive } from "vue"

const nodes: any = {
  node1: { name: "1" },
  node2: { name: "2" },
  node3: { name: "3" },
  node4: { name: "4" },
  node5: { name: "5" },
  node6: { name: "6" },
  node7: { name: "7" },
  node8: { name: "1" },
  node9: { name: "2" },
  node10: { name: "3" },
  node11: { name: "4" },
  node12: { name: "5" },
  node13: { name: "6" },
  node14: { name: "7" },
}

const edges: any = {
  edge1: { source: "node1", target: "node2" },
  edge2: { source: "node2", target: "node3" },
  edge3: { source: "node3", target: "node4" },
  edge4: { source: "node3", target: "node2" },
  edge5: { source: "node3", target: "node5" },
  edge6: { source: "node2", target: "node6" },
  edge7: { source: "node6", target: "node7" },
}

const layouts: any = reactive({
  nodes: {},
})

export default {
  nodes,
  edges,
  layouts,
}