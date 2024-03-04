import { LitElement, css, html } from 'lit';
import { countries } from './countries';

export class ExprEditor extends LitElement {
  static get properties() {
    return {
      data: { type: [] },
    };
  }

  constructor() {
    super();
    this.data = countries;
  }

  render() {
    return html`
      <div class="autocomplete" style="width:300px;">
        <input
          id="exprInput"
          type="text"
          name="myCountry"
          placeholder="Country"
          @input=${this._onInput}
        />
        <div id="autocomplete-list" class="autocomplete-items"></div>
      </div>
    `;
  }

  _onInput(e) {
    const val = this.value;

    this.closeAllLists();
    const inputElement = this.shadowRoot.getElementById('exprInput');

    const arr = this.data;
    const txt = inputElement.value;
    const list = this.shadowRoot.getElementById('autocomplete-list');
    const cursorPosition = inputElement.selectionStart;

    const currentWord = this.getCurrentWord(txt, cursorPosition);
    const found = this.getMatchingEntries(currentWord);
    found.forEach((item) => {
      let b = document.createElement('div');
      b.innerHTML = `<strong>${item.slice(0, currentWord.length)}</strong>${item.slice(currentWord.length)}<input type='hidden' value='${item}'>`
      b.addEventListener('click', function () {
        const selected = this.getElementsByTagName('input')[0].value;
        inputElement.value = String(inputElement.value).replace(currentWord, selected)
        const list = this.parentElement;
        while (list.firstChild) {
          list.removeChild(list.firstChild);
        }
      });
      list.appendChild(b)
    })
  }

  getMatchingEntries(currentWord) {
    return this.data.filter(entry => entry.slice(0, currentWord.length).toUpperCase() == currentWord.toUpperCase());
  }

  getCurrentWord(inputValue, cursorPosition) {
    // Find the start and end indices of the word containing the cursor
    let wordStart = cursorPosition;
    while (wordStart > 0 && /\S/.test(inputValue[wordStart - 1])) {
      wordStart--;
    }

    let wordEnd = cursorPosition;
    while (wordEnd < inputValue.length && /\S/.test(inputValue[wordEnd])) {
      wordEnd++;
    }
    const currentWord = inputValue.substring(wordStart, wordEnd);
    console.log('Word at cursor position:', currentWord);
    return currentWord;
  }

  closeAllLists(element) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    const list = this.shadowRoot.getElementById('autocomplete-list');
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  static get styles() {
    return css`
      :host {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }

      .autocomplete {
        position: relative;
        display: inline-block;
      }

      input {
        border: 1px solid transparent;
        background-color: #f1f1f1;
        padding: 10px;
        font-size: 16px;
      }

      input[type='text'] {
        background-color: #f1f1f1;
        width: 100%;
      }

      .autocomplete-items {
        position: absolute;
        border: 1px solid #d4d4d4;
        border-bottom: none;
        border-top: none;
        z-index: 99;
        /*position the autocomplete items to be the same width as the container:*/
        top: 100%;
        left: 0;
        right: 0;
      }

      .autocomplete-items div {
        padding: 10px;
        cursor: pointer;
        background-color: #fff;
        border-bottom: 1px solid #d4d4d4;
      }

      /*when hovering an item:*/
      .autocomplete-items div:hover {
        background-color: #e9e9e9;
      }

      /*when navigating through the items using the arrow keys:*/
      .autocomplete-active {
        background-color: DodgerBlue !important;
        color: #ffffff;
      }
    `;
  }
}

customElements.define('expr-editor', ExprEditor);
