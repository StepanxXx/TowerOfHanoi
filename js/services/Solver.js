/**
 * Solver - Service Layer
 * Клас для автоматичного розв'язання головоломки "Ханойські вежі"
 * Реалізує рекурсивний алгоритм оптимального розв'язання
 */
export class Solver {
  /**
   * Створює новий екземпляр Solver
   */
  constructor() {
    this.moves = [];
    this.currentMoveIndex = 0;
    this.timer = null;
  }

  /**
   * Генерує послідовність ходів для розв'язання
   * @param {number} n - Кількість дисків
   * @param {number} from - Індекс вежі-джерела
   * @param {number} to - Індекс цільової вежі
   * @param {number} aux - Індекс допоміжної вежі
   * @param {Array<[number, number]>} moves - Масив для збереження ходів
   * @private
   */
  generateSolution(n, from, to, aux, moves) {
    if (n === 1) {
      moves.push([from, to]);
      return;
    }
    this.generateSolution(n - 1, from, aux, to, moves);
    moves.push([from, to]);
    this.generateSolution(n - 1, aux, to, from, moves);
  }

  /**
   * Готує розв'язання для заданої кількості дисків
   * @param {number} numDisks - Кількість дисків
   * @returns {Array<[number, number]>} - Масив ходів [from, to]
   */
  prepareSolution(numDisks) {
    this.moves = [];
    this.currentMoveIndex = 0;
    this.generateSolution(numDisks, 0, 2, 1, this.moves);
    return this.moves;
  }

  /**
   * Отримує наступний хід
   * @returns {{from: number, to: number}|null} - Об'єкт з індексами веж або null
   */
  getNextMove() {
    if (this.currentMoveIndex >= this.moves.length) {
      return null;
    }
    
    const [from, to] = this.moves[this.currentMoveIndex++];
    return { from, to };
  }

  /**
   * Перевіряє, чи є ще ходи
   * @returns {boolean} - true якщо є ще ходи
   */
  hasMoreMoves() {
    return this.currentMoveIndex < this.moves.length;
  }

  /**
   * Запускає автоматичне виконання ходів
   * @param {Function} onMove - Callback для виконання кожного ходу
   * @param {Function} onComplete - Callback при завершенні
   * @param {number} delay - Затримка між ходами в мс
   */
  startAutoPlay(onMove, onComplete, delay = 600) {
    this.timer = setInterval(() => {
      const move = this.getNextMove();
      
      if (!move) {
        this.stop();
        if (onComplete) {
          onComplete();
        }
        return;
      }
      
      if (onMove) {
        onMove(move.from, move.to);
      }
    }, delay);
  }

  /**
   * Зупиняє автоматичне виконання
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.moves = [];
    this.currentMoveIndex = 0;
  }

  /**
   * Перевіряє, чи працює автоплей
   * @returns {boolean} - true якщо автоплей активний
   */
  isRunning() {
    return this.timer !== null;
  }

  /**
   * Отримує загальну кількість ходів у розв'язанні
   * @returns {number} - Кількість ходів
   */
  getTotalMoves() {
    return this.moves.length;
  }
}
