<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import * as vNG from "v-network-graph";
import { supabase } from './supabase'

const selectedNodes = ref()
let fables = ref()
let currentFable = ref()
let currentFableNodes = ref({})
let currentFableEdges = ref({})
let edgeCount = 1

const layouts: any = reactive({
  nodes: {},
})
const layers = {
  // {layername}: {position}
  badge: "nodes",
}

async function getFables() {
  try {
    let { data, error, status } = await supabase
      .from('fable')
      .select(`*`)

    if (error && status !== 406) throw error

    if (data) {
      fables.value = data;
    }
  } catch (error) {
    console.error(error);
  }
}

getFables().then(async () => {
  for (let index = 0; index < fables.value.length; index++) {
    await getPlotpoints(fables.value[index])

  }
  currentFable.value = fables.value[0];
  for (let index = 0; index < currentFable.value.plotpoints.length; index++) {
    const plotpoint = currentFable.value.plotpoints[index];
    if (index === 0) currentFableNodes.value[`node${plotpoint.id}`] = { name: index + 1, id: plotpoint.id, color: "black", hover: "grey" }
    else currentFableNodes.value[`node${plotpoint.id}`] = { name: index + 1, id: plotpoint.id, color: "green", hover: "lightgreen" }
  }
  console.log(currentFableNodes.value);

  let reactionIds = []
  for (let index = 0; index < currentFable.value.plotpoints.length; index++) {
    const plotpoint = currentFable.value.plotpoints[index];
    if (plotpoint.reaction1) reactionIds.push(`id.eq.${plotpoint.reaction1}`)
    if (plotpoint.reaction2) reactionIds.push(`id.eq.${plotpoint.reaction2}`)
    if (plotpoint.reaction3) reactionIds.push(`id.eq.${plotpoint.reaction3}`)
    if (plotpoint.reaction4) reactionIds.push(`id.eq.${plotpoint.reaction4}`)
    if (plotpoint.reaction5) reactionIds.push(`id.eq.${plotpoint.reaction5}`)
  }
  const reactionIdsString = JSON.stringify(reactionIds);
  await getReactions(reactionIdsString.substring(1).substring(0, reactionIdsString.length - 2).replace(/"+/g, ''));

  for (let index = 0; index < currentFable.value.plotpoints.length; index++) {
    const plotpoint = currentFable.value.plotpoints[index]
    if (plotpoint.reaction1) addReactionToEdge(plotpoint.reaction1, plotpoint.id);
    if (plotpoint.reaction2) addReactionToEdge(plotpoint.reaction2, plotpoint.id);
    if (plotpoint.reaction3) addReactionToEdge(plotpoint.reaction3, plotpoint.id);
    if (plotpoint.reaction4) addReactionToEdge(plotpoint.reaction4, plotpoint.id);
    if (plotpoint.reaction5) addReactionToEdge(plotpoint.reaction5, plotpoint.id);
  }

});

function addReactionToEdge(reaction, plotpointId) {
  if (reaction.success_plotpoint) currentFableEdges.value[`edge${edgeCount}`] = { source: `node${plotpointId}`, target: `node${reaction.success_plotpoint}`, sourceState: "success" }, edgeCount++
  if (reaction.fail_plotpoint) currentFableEdges.value[`edge${edgeCount}`] = { source: `node${plotpointId}`, target: `node${reaction.fail_plotpoint}`, sourceState: "fail" }, edgeCount++
  if (reaction.death_plotpoint) currentFableEdges.value[`edge${edgeCount}`] = { source: `node${plotpointId}`, target: `node${reaction.death_plotpoint}`, sourceState: "death" }, edgeCount++
}

async function getPlotpoints(fable: any) {
  try {
    let { data, error, status } = await supabase
      .from('plotpoint')
      .select(`*`)
      .eq('fableId', fable.id)

    if (error && status !== 406) throw error

    if (data) {
      fable.plotpoints = data
      fable.plotpoints.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1)
    }
  } catch (error) {
    console.error(error);
  }
}

async function getReactions(filter: any) {
  try {
    let { data, error, status } = await supabase
      .from('reaction')
      .select(`*`)
      .or(filter)

    if (error && status !== 406) throw error

    if (data) {
      currentFable.value.plotpoints.forEach((plotpoint) => {
        data.forEach((reaction) => {
          if (reaction.id === plotpoint.reaction1) return plotpoint.reaction1 = reaction
          if (reaction.id === plotpoint.reaction2) return plotpoint.reaction2 = reaction
          if (reaction.id === plotpoint.reaction3) return plotpoint.reaction3 = reaction
          if (reaction.id === plotpoint.reaction4) return plotpoint.reaction4 = reaction
          if (reaction.id === plotpoint.reaction5) return plotpoint.reaction5 = reaction
        })
      })
    }
  } catch (error) {
    console.error(error);
  }
}


// dagre: Directed graph layout for JavaScript
// https://github.com/dagrejs/dagre
//@ts-ignore
import dagre from "dagre/dist/dagre.min.js"

const nodeSize = 40

const configs = vNG.defineConfigs({
  node: {
    
    selectable: true,
    normal: {  radius: nodeSize / 2, color: currentFableNodes => currentFableNodes.color },
    hover: { radius: nodeSize / 2, color: currentFableNodes => currentFableNodes.hover },
    label: { direction: "center", color: "#fff" },
    focusring: {
      color: "green",
    },
  },
  edge: {
    type: "curve",
    gap: 40,
    normal: {
      color: "#aaa",
      width: 3,
    },
    margin: 4,
    marker: {
      target: {
        type: "arrow",
        width: 4,
        height: 4,
      }
    },
    selfLoop: {
      radius: 20,
      offset: 9,
      angle: 180,
      isClockwise: true,
    },
  }
})

const graph = ref<vNG.VNetworkGraphInstance>()
// onMounted(() => layout("LR"))

// function layout(direction: "TB" | "LR") {
//   if (Object.keys(currentFableNodes).length <= 1 || Object.keys(currentFableEdges).length == 0) {
//     return
//   }

//   // convert graph
//   // ref: https://github.com/dagrejs/dagre/wiki
//   const g = new dagre.graphlib.Graph()
//   // Set an object for the graph label
//   g.setGraph({
//     rankdir: direction,
//     nodesep: nodeSize * 2,
//     edgesep: nodeSize,
//     ranksep: nodeSize * 2,
//   })
//   // Default to assigning a new object as a label for each new edge.
//   g.setDefaultEdgeLabel(() => ({}))

//   // Add nodes to the graph. The first argument is the node id. The second is
//   // metadata about the node. In this case we're going to add labels to each of
//   // our nodes.
//   Object.entries(currentFableNodes).forEach(([nodeId, node]) => {
//     g.setNode(nodeId, { label: node.name, width: nodeSize, height: nodeSize })
//   })

//   // Add edges to the graph.
//   Object.values(currentFableEdges).forEach(edge => {
//     g.setEdge(edge.source, edge.target)
//   })

//   dagre.layout(g)

//   const box: Record<string, number | undefined> = {}
//   g.nodes().forEach((nodeId: string) => {
//     // update node position
//     const x = g.node(nodeId).x
//     const y = g.node(nodeId).y
//     layouts.nodes[nodeId] = { x, y }

//     // calculate bounding box size
//     box.top = box.top ? Math.min(box.top, y) : y
//     box.bottom = box.bottom ? Math.max(box.bottom, y) : y
//     box.left = box.left ? Math.min(box.left, x) : x
//     box.right = box.right ? Math.max(box.right, x) : x
//   })

//   const graphMargin = nodeSize * 2
//   const viewBox = {
//     top: (box.top ?? 0) - graphMargin,
//     bottom: (box.bottom ?? 0) + graphMargin,
//     left: (box.left ?? 0) - graphMargin,
//     right: (box.right ?? 0) + graphMargin,
//   }
//   graph.value?.setViewBox(viewBox)
// }

function searchPlotpoint(node) {
  console.log(node);
  let selectedPlotpoint = {}
  if(currentFable.value && node) {
    currentFable.value.plotpoints.forEach(plotpoint => {
      console.log(plotpoint, node);
      
      if(plotpoint.id === node.id ) selectedPlotpoint = plotpoint;
    });
    return selectedPlotpoint
  }
  else {
    return node;
  }
  
}
const color = {
  success: "#008000",
  fail: "#ff0000",
  death: "#000",
} as Record<string, string>

</script>

<template>
  <div id="main">
    <v-network-graph v-model:selected-nodes="selectedNodes" :nodes="currentFableNodes" :edges="currentFableEdges"
      :layouts="layouts" :configs="configs" :layers="layers">

      <template #edge-overlay="{ edge, scale, pointAtLength }">
        <!-- source side -->
        <g class="edge-icon">
          <!-- pointAtLength():Calculate the coordinates advanced
                the specified length from the source side. -->
          <circle :cx="pointAtLength(20 * scale).x" :cy="pointAtLength(20 * scale).y" :r="5 * scale" stroke="#000"
            :stroke-width="1 * scale" :fill="color[edge.sourceState]" />
          <text v-bind="pointAtLength(40 * scale)" font-family="Material Icons" text-anchor="middle"
            dominant-baseline="central" :font-size="16 * scale"> </text>
        </g>
      </template>

    </v-network-graph>
    <div class="wrapper">

      <pre>
{{ searchPlotpoint(currentFableNodes[selectedNodes]) }}
      </pre>
    </div>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#app {
  width: 100%;
  height: 100%;
}

#main {
  display: grid;
  grid-template-columns: 50% 50%;
  width: 100%;
  height: 100%;

  >* {
    width: 100%;
    height: 100%;
  }
}

.v-network-graph {
  border: 1px solid grey;
}

.wrapper {
  overflow-x: auto;
}
</style>