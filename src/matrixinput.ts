import { Matrix2x2 } from './eigen';
import { evaluate } from './parser';

type OnChangeCallback = (matrix: Matrix2x2) => void;

export class MatrixInput {

  private onChange: OnChangeCallback;
  private container: HTMLDivElement;
  private parent: HTMLElement
  private u00: HTMLInputElement
  private u01: HTMLInputElement
  private u10: HTMLInputElement
  private u11: HTMLInputElement

  constructor(p: HTMLElement, callback: OnChangeCallback) {
    this.onChange = callback;
    this.parent = p;
    this.container = document.createElement('div');
    this.container.innerHTML = `
    <table>
    <thead>
    </thead>
    <tbody>
        <tr>
            <td><input class="u00"/></td>
            <td><input class="u01"/></td>
        </tr>
        <tr>
            <td><input class="u10"/></td>
            <td><input class="u11"/></td>
        </tr>
    </tbody>
    </table>
    `;

    this.u00 = this.container.querySelector('.u00');
    this.u01 = this.container.querySelector('.u01');
    this.u10 = this.container.querySelector('.u10');
    this.u11 = this.container.querySelector('.u11');

    [this.u00, this.u01, this.u10, this.u11].forEach(input => {
      input.addEventListener('change', this.onInputChange); // TODO: cleanup
    });

    this.parent.appendChild(this.container);
  }

  setMatrix(matrix: [[string, string], [string, string]]) {
    this.u00.value = matrix[0][0];
    this.u01.value = matrix[0][1];
    this.u10.value = matrix[1][0];
    this.u11.value = matrix[1][1];
  }

  getMatrix(): Matrix2x2 | null {
    const matrix = [
      [evaluate(this.u00.value), evaluate(this.u01.value)],
      [evaluate(this.u10.value), evaluate(this.u11.value)]
    ];

    if (matrix.flat().find(item => item === null) === null)
      return null;

    return matrix as Matrix2x2;
  }

  private onInputChange = () => {
    this.onChange(this.getMatrix());
  }
}