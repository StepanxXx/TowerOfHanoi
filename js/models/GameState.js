/**
 * GameState - Model Layer
 * Клас для управління станом гри "Ханойські вежі"
 * Відповідає за зберігання та маніпуляцію даними гри
 */
export class GameState {
  /**
   * Створює новий стан гри
   * @param {number} numDisks - Кількість дисків (1-15)
   */
  constructor(numDisks = 4) {
    this.towers = [[], [], []];
    this.numDisks = numDisks;
    this.moveCount = 0;
    this.selectedTowerIndex = null;
    this.autoSolving = false;
  }

  /**
   * Ініціалізує гру з заданою кількістю дисків
   * @param {number} numDisks - Кількість дисків
   */
  init(numDisks) {
    this.numDisks = Math.max(1, Math.min(15, numDisks));
    this.towers = [[], [], []];
    
    // Додаємо диски на першу вежу (від найбільшого до найменшого)
    for (let size = this.numDisks; size >= 1; size--) {
      this.towers[0].push(size);
    }
    
    this.moveCount = 0;
    this.selectedTowerIndex = null;
    this.autoSolving = false;
  }

  /**
   * Повертає оптимальну кількість ходів для розв'язання
   * @returns {number} - Мінімальна кількість ходів (2^n - 1)
   */
  getOptimalMoves() {
    return Math.pow(2, this.numDisks) - 1;
  }

  /**
   * Перевіряє, чи гру завершено (всі диски на третій вежі)
   * @returns {boolean} - true якщо гру завершено
   */
  isGameWon() {
    return this.towers[2].length === this.numDisks;
  }

  /**
   * Отримує верхній диск з вежі
   * @param {number} towerIndex - Індекс вежі (0-2)
   * @returns {number|undefined} - Розмір верхнього диска або undefined
   */
  getTopDisk(towerIndex) {
    const tower = this.towers[towerIndex];
    return tower.length > 0 ? tower[tower.length - 1] : undefined;
  }

  /**
   * Перевіряє, чи можливий хід з однієї вежі на іншу
   * @param {number} sourceIndex - Індекс вежі-джерела
   * @param {number} targetIndex - Індекс цільової вежі
   * @returns {{valid: boolean, error?: string}} - Результат перевірки
   */
  canMove(sourceIndex, targetIndex) {
    const sourceTower = this.towers[sourceIndex];
    const targetTower = this.towers[targetIndex];

    if (!sourceTower || !targetTower) {
      return { valid: false, error: "Невірний індекс вежі." };
    }

    if (sourceTower.length === 0) {
      return { valid: false, error: "На обраній вежі немає дисків." };
    }

    const movingDisk = sourceTower[sourceTower.length - 1];
    const targetTopDisk = targetTower[targetTower.length - 1];

    if (typeof targetTopDisk !== "undefined" && targetTopDisk < movingDisk) {
      return { 
        valid: false, 
        error: "Неможливий хід: більший диск не можна класти на менший." 
      };
    }

    return { valid: true };
  }

  /**
   * Виконує хід з однієї вежі на іншу
   * @param {number} sourceIndex - Індекс вежі-джерела
   * @param {number} targetIndex - Індекс цільової вежі
   * @returns {boolean} - true якщо хід виконано успішно
   */
  performMove(sourceIndex, targetIndex) {
    const validation = this.canMove(sourceIndex, targetIndex);
    if (!validation.valid) {
      return false;
    }

    const disk = this.towers[sourceIndex].pop();
    this.towers[targetIndex].push(disk);
    this.moveCount++;
    
    return true;
  }

  /**
   * Вибирає вежу для ходу
   * @param {number|null} index - Індекс вежі або null для скасування
   */
  selectTower(index) {
    this.selectedTowerIndex = index;
  }

  /**
   * Встановлює режим автоматичного розв'язання
   * @param {boolean} value - true для увімкнення автосолвера
   */
  setAutoSolving(value) {
    this.autoSolving = value;
  }

  /**
   * Отримує стан веж
   * @returns {Array<Array<number>>} - Масив веж з дисками
   */
  getTowers() {
    return this.towers;
  }

  /**
   * Отримує кількість виконаних ходів
   * @returns {number} - Кількість ходів
   */
  getMoveCount() {
    return this.moveCount;
  }

  /**
   * Отримує кількість дисків
   * @returns {number} - Кількість дисків
   */
  getNumDisks() {
    return this.numDisks;
  }

  /**
   * Отримує індекс вибраної вежі
   * @returns {number|null} - Індекс вибраної вежі або null
   */
  getSelectedTowerIndex() {
    return this.selectedTowerIndex;
  }

  /**
   * Перевіряє, чи йде автоматичне розв'язання
   * @returns {boolean} - true якщо автосолвер активний
   */
  isAutoSolving() {
    return this.autoSolving;
  }
}
