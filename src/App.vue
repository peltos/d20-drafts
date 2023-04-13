<script setup lang="ts">
import { ref, reactive } from "vue";
import * as vNG from "v-network-graph";
import { supabase } from './supabase'
import {
  ForceLayout,
} from "v-network-graph/lib/force-layout"

const selectedNodes = ref()
let fables = ref()
let currentFable = ref()
let currentFableNodes = ref({})
let currentFableEdges = ref({})
let buttons = ref({})
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

getButtons()
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

  let reactionIds = []
  for (let index = 0; index < currentFable.value.plotpoints.length; index++) {
    const plotpoint = currentFable.value.plotpoints[index];
    for (let i = 0; i < 5; i++) {
      if (plotpoint[`reaction${i}`]) reactionIds.push(`id.eq.${plotpoint[`reaction${i}`]}`)
    }
  }

  const reactionIdsString = JSON.stringify(reactionIds);
  await getReactions(reactionIdsString.substring(1).substring(0, reactionIdsString.length - 2).replace(/"+/g, ''));

  for (let index = 0; index < currentFable.value.plotpoints.length; index++) {
    const plotpoint = currentFable.value.plotpoints[index]
    for (let i = 0; i < 5; i++) {
      if (plotpoint[`reaction${i}`]) addReactionToEdge(plotpoint[`reaction${i}`], plotpoint.id);
    }
  }

});

function addReactionToEdge(reaction, plotpointId) {
  if (reaction.success_plotpoint) currentFableEdges.value[`edge${edgeCount}`] = { source: `node${plotpointId}`, target: `node${reaction.success_plotpoint}`, stroke: 'green', buttonState: reaction.button }, edgeCount++
  if (reaction.fail_plotpoint) currentFableEdges.value[`edge${edgeCount}`] = { source: `node${plotpointId}`, target: `node${reaction.fail_plotpoint}`, stroke: 'red', buttonState: reaction.button }, edgeCount++
  if (reaction.death_plotpoint) currentFableEdges.value[`edge${edgeCount}`] = { source: `node${plotpointId}`, target: `node${reaction.death_plotpoint}`, stroke: 'black', buttonState: reaction.button }, edgeCount++

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
          for (let i = 0; i < 5; i++) {
            if (reaction.id === plotpoint[`reaction${i}`]) return plotpoint[`reaction${i}`] = reaction
          }
        })
      })
    }
  } catch (error) {
    console.error(error);
  }
}


async function getButtons() {
  try {
    let { data, error, status } = await supabase
      .from('button')
      .select(`*`)

    if (error && status !== 406) throw error

    if (data) {
      buttons.value = data
    }
  } catch (error) {
    console.error(error);
  }
}

const nodeSize = 40

const configs = vNG.defineConfigs({
  node: {
    selectable: true,
    normal: { radius: nodeSize / 2, color: currentFableNodes => currentFableNodes.color },
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
  },
  view: {
    layoutHandler: new ForceLayout({
      positionFixedByDrag: false,
      // * The following are the default parameters for the simulation.
      // * You can customize it by uncommenting below.
      createSimulation: (d3, nodes, edges) => {
        const forceLink = d3.forceLink(edges).id(d => d.id)
        return d3
          .forceSimulation(nodes)
          .force("charge", d3.forceManyBody())
          .force("collide", d3.forceCollide(50).strength(0.2))
          .force("center", d3.forceCenter().strength(0.02))
          .alphaMin(0.001)
      }
    }),
  },
})

function searchPlotpoint(node) {
  let selectedPlotpoint = {}
  if (currentFable.value && node) {
    currentFable.value.plotpoints.forEach(plotpoint => {
      if (plotpoint.id === node.id) selectedPlotpoint = plotpoint;
    });
    return selectedPlotpoint
  }
  else {
    return node;
  }
}

const color = {
  Primary: "#5865f2",
  Secondary: "#4f545c",
  Success: "#3ba55c",
  Danger: "#ed4245",
} as Record<string, string>

const eventHandlers: vNG.EventHandlers = {
  // wildcard: capture all events
  "node:click": (type, event) => {
    console.log(type, event);
  },
}

</script>

<template>
  <v-app id="inspire">
    <v-app-bar class="px-3" color="white" flat density="compact">
      <v-spacer></v-spacer>

      <v-tabs centered color="grey-darken-2">
        <v-tab :key="'create'">
          Create
        </v-tab>
        <v-tab :key="'list'">
          Fables List
        </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main v-if="currentFable" class="bg-grey-lighten-3 my-4 px-4">
      <v-expansion-panels class="mb-4">
        <v-expansion-panel title="Settings">
          <v-expansion-panel-text class="pt-4">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Name" v-model="currentFable.name"></v-text-field>
                <v-text-field label="Description" v-model="currentFable.description"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="HP" v-model="currentFable.defaultHp"></v-text-field>
                <v-text-field label="Time Interval (Minutes)" v-model="currentFable.defaultTimeInterval"></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-row>
        <v-col cols="12" md="6">
          <v-sheet rounded="lg" min-height="70vh" height="100%" :elevations="6">
            <v-network-graph v-model:selected-nodes="selectedNodes" :nodes="currentFableNodes" :edges="currentFableEdges"
              :layouts="layouts" :configs="configs" :layers="layers" :event-handlers="eventHandlers">

              <template #edge-overlay="{ edge, scale, pointAtLength }">
                <!-- source side -->
                <g class="edge-icon">
                  <pre>{{ pointAtLength(40 * scale).x }}</pre>
                  <!-- pointAtLength():Calculate the coordinates advanced the specified length from the source side. -->
                  <circle :cx="pointAtLength(10.0 * scale).x" :cy="pointAtLength(10.0 * scale).y" :r="10 * scale"
                    :fill="color[edge.buttonState]" />
                  <circle :cx="pointAtLength(25.0 * scale).x" :cy="pointAtLength(25.0 * scale).y" :r="4 * scale"
                    :fill="edge.stroke" />
                  <circle :cx="pointAtLength(28.5 * scale).x" :cy="pointAtLength(28.5 * scale).y" :r="3.5 * scale"
                    :fill="edge.stroke" />
                  <circle :cx="pointAtLength(32.0 * scale).x" :cy="pointAtLength(32.0 * scale).y" :r="3 * scale"
                    :fill="edge.stroke" />
                  <circle :cx="pointAtLength(35.0 * scale).x" :cy="pointAtLength(35.0 * scale).y" :r="2.5 * scale"
                    :fill="edge.stroke" />
                  <circle :cx="pointAtLength(37.0 * scale).x" :cy="pointAtLength(37.0 * scale).y" :r="2 * scale"
                    :fill="edge.stroke" />
                  <circle :cx="pointAtLength(39.0 * scale).x" :cy="pointAtLength(39.0 * scale).y" :r="1.5 * scale"
                    :fill="edge.stroke" />
                  <circle :cx="pointAtLength(40.0 * scale).x" :cy="pointAtLength(40.0 * scale).y" :r="1 * scale"
                    :fill="edge.stroke" />

                  <text v-bind="pointAtLength(40 * scale)" font-family="Material Icons" text-anchor="middle"
                    dominant-baseline="central" :font-size="16 * scale"> </text>
                </g>
              </template>

            </v-network-graph>
          </v-sheet>
        </v-col>

        <v-col cols="12" md="6">
          <v-sheet min-height="70vh" rounded="lg" :elevations="32" class="mx-auto h-100 pa-4">
            <template v-if="currentFableNodes[selectedNodes]">
              <figure class="plotpoint-edit-figure">
                <img :src="searchPlotpoint(currentFableNodes[selectedNodes]).imageUrl">
              </figure>
              <v-textarea label="Content" maxlength="1800"
                v-model="searchPlotpoint(currentFableNodes[selectedNodes]).content"></v-textarea>

              <i v-if="!searchPlotpoint(currentFableNodes[selectedNodes])[`reaction1`]">This is the end of the fable.
                Fill in a reaction to continue the fable</i>
              <v-expansion-panels class="mb-4">
                <template v-for="index in 5">
                  <v-expansion-panel :key="index"
                    v-if="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`] || searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index - 1}`] || index === 1">
                    <v-expansion-panel-title
                      :data-button="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`] ? searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].button : ''">
                      <v-row no-gutters>
                        <v-col cols="3" class="d-flex justify-start">
                          <strong>Reaction {{ index }}</strong>
                        </v-col>
                        <template v-if="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`]">
                          <v-col v-if="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].label"
                            cols="6" class="text--secondary text-center">
                            {{ searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].label }}
                          </v-col>
                          <v-col v-if="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].id" cols="3"
                            class="text--secondary text-right">
                            <font-awesome-icon icon="fa-solid fa-check" />: {{
                              searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].success_plotpoint }}
                            <template
                              v-if="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].fail_plotpoint">
                              <font-awesome-icon icon="fa-solid fa-xmark" />: {{
                                searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].fail_plotpoint }}
                            </template>
                            <template
                              v-if="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].death_plotpoint">
                              <font-awesome-icon icon="fa-solid fa-skull" />: {{
                                searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].death_plotpoint }}
                            </template>
                          </v-col>
                        </template>
                      </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="pt-4">
                      <template v-if="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`]">
                        <v-row>
                          <v-col cols="12" sm="8">
                            <v-text-field label="Description"
                              v-model="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].label"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-select label="Plotpoints" :items="Object.values(currentFableNodes)" item-title="name"
                              item-value="id"
                              v-model="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].id"></v-select>
                          </v-col>
                        </v-row>

                        <pre>{{ buttons }}</pre>
                        <v-select label="Plotpoints" :items="buttons" item-title="buttonType" item-value="buttonType"
                          v-model="searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`].button">
                        </v-select>
                      </template>
                      <template v-else>
                        <v-row>
                          <v-col cols="12" sm="8">
                            <v-text-field label="Description"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-select label="Plotpoints" :items="Object.values(currentFableNodes)" item-title="name"
                              item-value="id"></v-select>
                          </v-col>
                        </v-row>
                      </template>
                      <pre>{{ searchPlotpoint(currentFableNodes[selectedNodes])[`reaction${index}`] }}</pre>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </template>
              </v-expansion-panels>
            </template>
            <template v-else>
              <div class="h-100 w-100 d-flex justify-center align-center">
                <h2> Please select a node to edit your fable </h2>
              </div>
            </template>
          </v-sheet>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
  <pre>{{ currentFable }}</pre>
</template>

<style lang="scss">
:root {
  --color-button-primary: #5865f2;
  --color-button-secondary: #4f545c;
  --color-button-success: #3ba55c;
  --color-button-danger: #ed4245;
}

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

img {
  max-width: 100%;
}

.plotpoint-edit-figure {
  height: 200px;
  background-color: #eeeeee;
  border-radius: 12px;
  margin-bottom: 12px;
  position: relative;

  img {
    height: 100%;
    width: 100%;
    object-fit:scale-down
  }

  @media only screen and (min-width: 960px) {
    height: 300px;
  }
}

.svg-inline--fa {
  padding-left: 12px;
}

.v-expansion-panel-title {

  &[data-button="Primary"] {
    background-color: var(--color-button-primary);
    color: white;
  }

  &[data-button="Secondary"] {
    background-color: var(--color-button-secondary);
    color: white;
  }

  &[data-button="Success"] {
    background-color: var(--color-button-success);
    color: white;
  }

  &[data-button="Danger"] {
    background-color: var(--color-button-danger);
    color: white;
  }
}</style>