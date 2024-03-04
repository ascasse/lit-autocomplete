import { LitElement, css, html } from 'lit';
import { countries } from './countries';

export class ExprEditor extends LitElement {
  static get properties() {
    return {
      expression: { expression: String, position: Number },
      data: { type: [] },
    };
  }

  constructor() {
    super();
    this.data = countries;
    this.expression = { expression: '', position: 0 };
  }

  render() {
    const currentWord =
      this.expression.expression.length > 0
        ? this.getCurrentWord(this.expression)
        : '';

    const found =
      currentWord.length > 0 ? this.getMatchingEntries(currentWord) : [];

    return html`
      <div class="autocomplete" style="width:300px;">
        <input
          id="exprInput"
          type="text"
          name="exprInput"
          .value=${this.expression.expression}
          placeholder="expression"
          @input=${this.handleInput}
        />
        <div id="autocomplete-list" class="autocomplete-items">
          ${found.map(
            item => html` <div @click=${this.handleSelection}>
              ${item}<input type="hidden" value="${item}" />
            </div>`
          )}
        </div>
      </div>
    `;
  }

  handleInput(e) {
    this.expression = {
      expression: e.target.value,
      position: e.target.selectionStart,
    };
  }

  handleSelection(e) {
    const selection = e.target.getElementsByTagName('input')[0].value;
    const currentWord = this.getCurrentWord(this.expression);
    this.expression = {
      expression: this.expression.expression.replace(currentWord, selection),
      position: this.expression.position,
    };
  }

  getMatchingEntries(currentWord) {
    return this.data.filter(
      entry =>
        entry.slice(0, currentWord.length).toUpperCase() ===
          currentWord.toUpperCase() && entry.length !== currentWord.length
    );
  }

  getCurrentWord(input) {
    const { expression, position } = input;

    let wordStart = position;
    while (wordStart > 0 && /\S/.test(expression[wordStart - 1])) {
      wordStart--;
    }

    let wordEnd = position;
    while (wordEnd < expression.length && /\S/.test(expression[wordEnd])) {
      wordEnd++;
    }
    const currentWord = expression.substring(wordStart, wordEnd);
    // console.log('Word at cursor position:', currentWord);
    return currentWord;
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
