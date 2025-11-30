/**
 * GameView - View Layer
 * Клас для відображення гри та маніпуляції DOM
 * Відповідає за рендеринг та візуальне представлення стану гри
 */
export class GameView {
  /**
   * Створює новий екземпляр View
   */
  constructor() {
    this.towerElements = Array.from(document.querySelectorAll(".tower"));
    this.diskCountInput = document.getElementById("diskCount");
    this.resetBtn = document.getElementById("resetBtn");
    this.solveBtn = document.getElementById("solveBtn");
    this.movesEl = document.getElementById("moves");
    this.optimalEl = document.getElementById("optimal");
    this.messageEl = document.getElementById("message");
  }

  /**
   * Відображає повідомлення користувачу
   * @param {string} text - Текст повідомлення
   * @param {"normal"|"win"|"error"} type - Тип повідомлення
   */
  setMessage(text, type = "normal") {
    this.messageEl.textContent = text || "";
    this.messageEl.classList.remove("message-win", "message-error");

    if (type === "win") {
      this.messageEl.classList.add("message-win");
    } else if (type === "error") {
      this.messageEl.classList.add("message-error");
    }
  }

  /**
   * Оновлює відображення кількості ходів
   * @param {number} moves - Кількість ходів
   */
  updateMoves(moves) {
    this.movesEl.textContent = moves;
  }

  /**
   * Оновлює відображення оптимальної кількості ходів
   * @param {number} optimal - Оптимальна кількість ходів
   */
  updateOptimalMoves(optimal) {
    this.optimalEl.textContent = optimal;
  }

  /**
   * Оновлює UI для режиму автосолвера
   * @param {boolean} isRunning - Чи працює автосолвер
   */
  updateUIForSolver(isRunning) {
    if (isRunning) {
      this.solveBtn.textContent = "■ Зупинити автосолвер";
      this.diskCountInput.disabled = true;
      this.resetBtn.disabled = true;
    } else {
      this.solveBtn.textContent = "▶ Автосолвер (оптимальне рішення)";
      this.diskCountInput.disabled = false;
      this.resetBtn.disabled = false;
    }
  }

  /**
   * Рендерить поточний стан гри
   * @param {Array<Array<number>>} towers - Масив веж з дисками
   * @param {number|null} selectedTowerIndex - Індекс вибраної вежі
   */
  render(towers, selectedTowerIndex) {
    this.towerElements.forEach((towerEl, index) => {
      const stackEl = towerEl.querySelector(".tower-disks");
      stackEl.innerHTML = "";

      towers[index].forEach((size) => {
        const diskEl = document.createElement("div");
        diskEl.className = "disk";
        diskEl.style.width = 60 + size * 18 + "px";

        const label = document.createElement("span");
        label.textContent = size;
        diskEl.appendChild(label);

        stackEl.appendChild(diskEl);
      });

      towerEl.classList.toggle(
        "tower-selected",
        selectedTowerIndex === index
      );
    });
  }

  /**
   * Отримує значення кількості дисків з поля введення
   * @returns {number} - Кількість дисків
   */
  getDiskCountValue() {
    let value = parseInt(this.diskCountInput.value, 10);
    if (isNaN(value)) {
      value = 3;
    }
    return Math.max(1, Math.min(15, value));
  }

  /**
   * Встановлює значення кількості дисків
   * @param {number} value - Кількість дисків
   */
  setDiskCountValue(value) {
    this.diskCountInput.value = value;
  }

  /**
   * Отримує елементи веж
   * @returns {Array<HTMLElement>} - Масив DOM елементів веж
   */
  getTowerElements() {
    return this.towerElements;
  }

  /**
   * Отримує кнопку перезапуску
   * @returns {HTMLElement} - DOM елемент кнопки
   */
  getResetButton() {
    return this.resetBtn;
  }

  /**
   * Отримує кнопку автосолвера
   * @returns {HTMLElement} - DOM елемент кнопки
   */
  getSolveButton() {
    return this.solveBtn;
  }

  /**
   * Отримує поле введення кількості дисків
   * @returns {HTMLElement} - DOM елемент поля введення
   */
  getDiskCountInput() {
    return this.diskCountInput;
  }
}
