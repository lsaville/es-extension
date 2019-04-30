const store      = 'eventStoreHighlighter'
const colorStore = 'eventStoreHighlighterColorStore'
const digStore   = 'eventStoreHighlighterDigStore'

export function setColorTarget(target, color) {
  let data
  if (localStorage.getItem(colorStore)) {
    const storedData = JSON.parse(localStorage.getItem(colorStore))
    data = [{color, target}, ...storedData]
  } else {
    data = [{color, target}]
  }
  localStorage.setItem(colorStore, JSON.stringify(data))
}

export function getColorStore() {
  if (localStorage.getItem(colorStore)) {
    return JSON.parse(localStorage.getItem(colorStore))
  }
}

export function destroyColors() {
  if (localStorage.getItem(colorStore)) {
    localStorage.removeItem(colorStore)
  }
}

export function destroyColor(type) {
  const colorTargets    = getColorStore()
  const colorsMinusType = colorTargets.filter(colorTarget => {
    return colorTarget.target != type
  })

  if (colorsMinusType.length == 0) {
    localStorage.removeItem(colorStore)
  } else {
    localStorage.setItem(colorStore, JSON.stringify(colorsMinusType))
  }
}

export function setDigTarget(target, dig) {
  let data
  if (localStorage.getItem(digStore)) {
    const storedData = JSON.parse(localStorage.getItem(digStore))
    data = [{dig, target}, ...storedData]
  } else {
    data = [{dig, target}]
  }
  localStorage.setItem(digStore, JSON.stringify(data))
}

export function getDigStore() {
  if (localStorage.getItem(digStore)) {
    return JSON.parse(localStorage.getItem(digStore))
  }
}

export function destroyDigs() {
  if (localStorage.getItem(digStore)) {
    localStorage.removeItem(digStore)
  }
}
