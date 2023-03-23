function consoleNextMessage({fableId, id, currentPlotpoint, msg, hp, roll, plotpoint, damage }) {
  console.log('   ')
  console.log('\u001b[44m Active Fable: \u001b[0m \u001b[34m '+ fableId + " (Active ID: " + id + ') \u001b[0m \u001b[44m Current Plotpoint: \u001b[0m \u001b[34m ' + currentPlotpoint + " \u001b[0m")
  if(hp) console.log('   HP \u001b[34m' + hp + '\u001b[0m')
  if(roll) {
    let rollColor = 34
    if(roll === 1) rollColor = 31; // crit fail
    if(roll === 20) rollColor = 32; // crit succes
    console.log('   Rolled: \u001b[1;'+rollColor+'m'+roll+'\u001b[0m')
  }
  if(damage) {
    console.log('   ')
    let damageColor = 34
    if(hp - damage < 0) damageColor = 31; // crit fail
    console.log('   Damage taken: \u001b[1;31m'+damage+'\u001b[0m')
    console.log('   Remaining HP: \u001b[1;'+damageColor+'m'+(hp - damage)+'\u001b[0m')
  }
  console.log('   ')
  console.log('   '+ msg)
  if(plotpoint) console.log('   Next plotpoint: \u001b[1;34m'+plotpoint+'\u001b[0m')
}

function consoleStartMessage({fableId, id, currentPlotpoint, msg, hp }) {
  console.log('   ')
  console.log('\u001b[42m Start Fable: \u001b[0m \u001b[32m '+ fableId+ " (Active ID: " + id + ') \u001b[0m \u001b[42m Current Plotpoint: \u001b[0m \u001b[32m ' + currentPlotpoint + " \u001b[0m")
  console.log('   Inputted HP \u001b[34m' + hp + '\u001b[0m')
  console.log('   '+ msg)
}

function consoleEndMessage({fableId, id, currentPlotpoint, msg, hp }) {
  console.log('   ')
  console.log('\u001b[41m End Fable: \u001b[0m \u001b[31m '+ fableId + " (Active ID: " + id + ') \u001b[0m \u001b[41m Current Plotpoint: \u001b[0m \u001b[31m ' + currentPlotpoint + " \u001b[0m")
  if(hp) console.log('   Remaining HP \u001b[34m' + hp + '\u001b[0m')
  console.log('   '+ msg)
}


module.exports = {
  consoleNextMessage,
  consoleStartMessage,
  consoleEndMessage
};
