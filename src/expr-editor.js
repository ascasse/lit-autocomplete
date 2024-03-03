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

    /*for each item in the array...*/
    for (let i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].slice(0, txt.length).toUpperCase() == txt.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        let b = document.createElement('DIV');
        /*make the matching letters bold:*/
        b.innerHTML = '<strong>' + arr[i].slice(0, txt.length) + '</strong>';
        b.innerHTML += arr[i].slice(txt.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        // b.addEventListener('click', this.handleClick);
        b.addEventListener('click', function () {
          inputElement.value = this.getElementsByTagName('input')[0].value;
          const list = this.parentElement;
          while (list.firstChild) {
            list.removeChild(list.firstChild);
          }
        });
        list.appendChild(b);
      }
    }
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
