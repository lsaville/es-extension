import { dig } from './digger.js'
import * as Storage from './storage.js'

export function main() {
  const onStreamPage = location.href.includes('streams')

  // ====================
  // Main Show
  // ====================

  if (onStreamPage) {
    setTimeout(function() {
      createAndAttachControls()

      if (Storage.getColorStore()) { applyColorsFromStorage({ populateList: true }) }
      if (Storage.getDigStore()) { applyDigsFromStorage({ populateList: true }) }

      // ====================
      // Listeners
      // ====================

      document.querySelector('#toggle-button').addEventListener('click', function(event) {
        document.querySelector('.es-hl-bar').classList.toggle('es-hl-bar-open')
        document.querySelector('html').classList.toggle('es-hl-html-nudge')
      })

      document.querySelector('#highlight-button').addEventListener('click', function(event) {
        const eventTypeField = document.querySelector('#event-type-hl-field')
        const eventType      = eventTypeField.value
        const colorPicker    = document.querySelector('#color-picker')
        const color          = colorPicker.value
        const colorOption    = document.querySelector(`option[value="${color}"`)

        if (eventType === '' || color === '') { return }

        colorOption.disabled = true
        colorPicker.options.selectedIndex = 0
        eventTypeField.value = ''
        Storage.setColorTarget(eventType, color)
        addToHighlightList(eventType, color)
        colorRowsFor(eventType, color)
      })

      document.querySelector('#clear-highlight-button').addEventListener('click', function(event) {
        Storage.getColorStore().forEach(colorTarget => {
          const colorOption = document.querySelector(`option[value="${colorTarget.color}"`)

          colorOption.disabled = false
          emptyColorList()
          decolorRowsFor(colorTarget.target)
        })

        Storage.destroyColors()
      })

      document.querySelector('#dig-button').addEventListener('click', function(event) {
        const eventType = document.querySelector('#event-type-dig-field').value
        const keys      = document.querySelector('#keys-field').value

        if (eventType === '' || keys === '') { return }

        const splitKeys  = keys.split(/,\s?/)

        Storage.setDigTarget(eventType, splitKeys)
        addToDigList(eventType, splitKeys)
        labelRowsFor(eventType, splitKeys)
      })

      document.querySelector('#clear-dig-button').addEventListener('click', function(event) {
        Storage.getDigStore().forEach(digTarget => {
          emptyDigList()
          delabelRowsFor(digTarget.target)
        })

        Storage.destroyDigs()
      })

      document.getElementById('highlight-list').addEventListener('click', function(event) {
        if (event.target.type == 'submit') {
          const type        = event.target.parentElement.dataset.type
          const color       = event.target.parentElement.dataset.color
          const colorOption = document.querySelector(`option[value="${color}"`)

          colorOption.disabled = false
          event.target.parentElement.remove()
          decolorRowsFor(type)
          Storage.destroyColor(type)
        }
      })

      document.getElementById('dig-list').addEventListener('click', function(event) {
        if (event.target.type == 'submit') {
          const type = event.target.parentElement.dataset.type

          event.target.parentElement.remove()
          delabelRowsFor(type)
          Storage.destroyDig(type)
        }
      })

      initObserver()

    }, 2000)

    // ====================
    // Functions
    // ====================
    function initObserver() {
      var targetNode = document.querySelector('main')
      var config = {
        attributes: true,
        childlist: true,
        subtree: true
      }
      var callback = function(mutationsList, observer) {
        initNavListeners()
      }

      var observer = new MutationObserver(callback)
      observer.observe(targetNode, config)
    }

    function initNavListeners() {
      const nativeNavButtons = Array.from(document.querySelectorAll('.page-nav__item.ng-scope')).slice(2,-1)


      nativeNavButtons.forEach(button => {
        button.addEventListener('click', function() {
          setTimeout(() => {
            if (Storage.getColorStore()) { applyColorsFromStorage({ populateList: false }) }
            if (Storage.getDigStore()) { applyDigsFromStorage({ populateList: false }) }
          }, 500)
        })
      })
    }

    function createAndAttachControls() {
      const body     = document.querySelector('body')
      const header   = document.querySelector('.site-header')
      const controls = document.createRange().createContextualFragment(`
        <div class="es-hl-bar">
          <a id="toggle-button" class="es-hl-bar-toggle">
            <span class='es-button-arrow'></span>
          </a>
          <section id="highlight-section">
            <h2 style="color:white;">Highlight</h2>
            <input type="text" id="event-type-hl-field" placeholder="Event type" class="es-hl-input">
            <div>
              <select id="color-picker" class="es-hl-select">
                <option value="">Pick a Color</option>
                <option style="background-color:lavender;" value="lavender">Lavender</option>
                <option style="background-color:aliceblue;" value="aliceblue">Blue</option>
                <option style="background-color:lightgrey;" value="lightgrey">Grey</option>
                <option style="background-color:papayawhip;" value="papayawhip">Papaya Whip</option>
                <option style="background-color:peachpuff;" value="peachpuff">Peach Puff</option>
              </select>
              <button id="highlight-button" class="es-hl-button" style="margin-right:1rem;">Highlight it!</button>
              <button id="clear-highlight-button" class="es-hl-button">Clear All!</button>
            </div>
            <ul id="highlight-list" class="es-hl-list">
            </ul>
          </section>

          <section id="dig-section">
            <h2 style="color:white;">Dig Data</h2>

            <input type="text" id="event-type-dig-field" placeholder="Event type" class="es-hl-input">
            <input type="text" id="keys-field" placeholder="Comma separated nested keys" class="es-hl-input">

            <button id="dig-button" class="es-hl-button" style="margin-right:1rem;">Dig it!</button>
            <button id="clear-dig-button" class="es-hl-button">Clear dig!</button>
            <ul id="dig-list" class="es-hl-list">
            </ul>
          </section>
        </div>
      `)

      body.append(controls)
    }

    function emptyColorList() {
      const colorList = document.getElementById('highlight-list')

      colorList.innerHTML = ''
    }

    function emptyDigList() {
      const colorList = document.getElementById('dig-list')

      colorList.innerHTML = ''
    }

    function addToHighlightList(eventType, color) {
      const colorList = document.getElementById('highlight-list')
      const listItem = document.createRange().createContextualFragment(`
        <li class="es-hl-list-item" data-type="${eventType}" data-color="${color}">
          <div class="es-list-p">${eventType}: ${color}</div>
          <button class="es-hl-delete">Bye!</button>
        </li>
      `)

      colorList.append(listItem)
    }

    function addToDigList(eventType, splitKeys) {
      const digList = document.getElementById('dig-list')
      const listItem = document.createRange().createContextualFragment(`
        <li class="es-hl-list-item" data-type="${eventType}" data-splitKeys="${splitKeys}">
          <div class="es-list-p">${eventType}: ${splitKeys}</div>
          <button class="es-hl-delete">Bye!</button>
        </li>
      `)

      digList.append(listItem)
    }

    function applyColorsFromStorage({ populateList }) {
      Storage.getColorStore().forEach(colorTarget => {
        const colorOption = document.querySelector(`option[value="${colorTarget.color}"`)

        colorOption.disabled = true

        if (populateList === true) {
          addToHighlightList(colorTarget.target, colorTarget.color)
        }
        colorRowsFor(colorTarget.target, colorTarget.color)
      })
    }

    function applyDigsFromStorage({ populateList }) {
      Storage.getDigStore().forEach(digTarget => {
        if (populateList === true) {
          addToDigList(digTarget.target, digTarget.dig)
        }

        labelRowsFor(digTarget.target, digTarget.dig)
      })
    }

    function labelRowsFor(eventType, traversalKeys) {
      const eventCells = Array.from(document.getElementsByTagName('td')).filter(el => el.innerText.includes(eventType))

      eventCells.forEach(cell => {
        const data            = JSON.parse(cell.parentElement.nextElementSibling.querySelector('pre').innerText)
        const result          = dig(data, traversalKeys)
        const replacementText = eventType + Array(24).fill('&nbsp;').join('') + result

        cell.innerHTML = replacementText
      })
    }

    function delabelRowsFor(eventType) {
      let eventCells = Array.from(document.getElementsByTagName('td')).filter(el => el.innerText.includes(eventType))

      eventCells.forEach(cell => {
        cell.innerText = eventType
      })
    }

    function colorRowsFor(eventType, color) {
      let eventCells = Array.from(document.getElementsByTagName('td')).filter(el => el.innerText.includes(eventType))

      eventCells.forEach(cell => {
        cell.parentElement.style = `background-color: ${color}`
      })
    }

    function decolorRowsFor(eventType) {
      let eventCells = Array.from(document.getElementsByTagName('td')).filter(el => el.innerText.includes(eventType))

      eventCells.forEach(cell => {
        cell.parentElement.style = `background-color: transparent`
      })
    }
  }
}
