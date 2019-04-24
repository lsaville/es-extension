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

      if (Storage.getColorStore()) { applyColorsFromStorage() }
      if (Storage.getDigStore()) { applyDigsFromStorage() }

      // ====================
      // Listeners
      // ====================

      document.querySelector('#toggle-button').addEventListener('click', function(event) {
        document.querySelector('.es-hl-bar').classList.toggle('es-hl-bar-open')
        document.querySelector('html').classList.toggle('es-hl-html-nudge')
      })

      document.querySelector('#highlight-button').addEventListener('click', function(event) {
        const eventType   = document.querySelector('#event-type-hl-field').value
        const color       = document.querySelector('#color-picker').value
        const colorOption = document.querySelector(`option[value="${color}"`)

        if (eventType === '' || color === '') { return }

        colorOption.disabled = true
        Storage.setColorTarget(eventType, color)
        //update color list
        colorRowsFor(eventType, color)
      })

      document.querySelector('#clear-highlight-button').addEventListener('click', function(event) {
        Storage.getColorStore().forEach(colorTarget => {
          const colorOption = document.querySelector(`option[value="${colorTarget.color}"`)

          colorOption.disabled = false
          //update color list
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
        //update dig list
        labelRowsFor(eventType, splitKeys)
      })

      document.querySelector('#clear-dig-button').addEventListener('click', function(event) {
        Storage.getDigStore().forEach(digTarget => {
          //update dig list
          delabelRowsFor(digTarget.target)
        })

        Storage.destroyDigs()
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
            if (Storage.getColorStore()) { applyColorsFromStorage() }
            if (Storage.getDigStore()) { applyDigsFromStorage() }
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
              <button id="clear-highlight-button" class="es-hl-button">Clear it!</button>
            </div>
            <ul id="highlight-list" class="es-hl-list">
              <li class="es-hl-list-item">
                <div class="es-hl-list-item-inner">
                  <p>AfcWebSubmittedApplicationEvent: lavendar</p>
                  <button class="es-hl-delete">Bye!</button>
                </div>
              </li>
            </ul>
          </section>

          <section id="dig-section">
            <h2 style="color:white;">Dig Data</h2>

            <input type="text" id="event-type-dig-field" placeholder="Event type" class="es-hl-input">
            <input type="text" id="keys-field" placeholder="Comma separated nested keys" class="es-hl-input">

            <button id="dig-button" class="es-hl-button" style="margin-right:1rem;">Dig it!</button>
            <button id="clear-dig-button" class="es-hl-button">Clear dig!</button>
            <ul id="dig-list" class="es-hl-list">
              <li class="es-hl-list-item">
                <div class="es-hl-list-item-inner">
                  <p>AfcWebSubmittedApplicationEvent: lavendar</p>
                  <button class="es-hl-delete">Bye!</button>
                </div>
              </li>
            </ul>
          </section>
        </div>
      `)

      body.append(controls)
    }
    // key/value picking for future functionality
            //<h4 style="color:white;">What I want to see:</h3>
            //<div id="radios" style="display:flex;margin-bottom:1rem;">
            //  <br/>
            //  <div class="es-hl-radio">
            //    <label for="key-only">Key Only</label>
            //    <input type="radio" id="key-only" name="data-dig" value="key-only" checked>
            //  </div>

            //  <div class="es-hl-radio">
            //    <label for="value-only">Value Only</label>
            //    <input type="radio" id="value-only" name="data-dig" value="value-only">
            //  </div>

            //  <div class="es-hl-radio">
            //    <label for="both">Both</label>
            //    <input type="radio" id="both" name="data-dig" value="both">
            //  </div>
            //</div>

    function applyColorsFromStorage() {
      Storage.getColorStore().forEach(colorTarget => {
        const colorOption = document.querySelector(`option[value="${colorTarget.color}"`)

        colorOption.disabled = true
        colorRowsFor(colorTarget.target, colorTarget.color)
      })
    }

    function applyDigsFromStorage() {
      Storage.getDigStore().forEach(digTarget => {
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
