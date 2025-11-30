/**
 * GameController - Controller Layer
 * Клас для управління логікою гри та взаємодією користувача
 * Координує взаємодію між Model (GameState), View (GameView) та Services (Solver)
 */
import { GameState } from '../models/GameState.js';
import { GameView } from '../views/GameView.js';
import { Solver } from '../services/Solver.js';

export class GameController {
  /**
   * Створює новий контролер гри
   */
  constructor() {
    this.state = new GameState();
    this.view = new GameView();
    this.solver = new Solver();
  }

  /**
   * Ініціалізує контролер та прив'язує обробники подій
   */
  init() {
    this.bindEvents();
    this.initGame();
  }

  /**
   * Прив'язує обробники подій до елементів UI
   * @private
   */
  bindEvents() {
    // Клік по вежах
    this.view.getTowerElements().forEach((towerEl, index) => {
      towerEl.addEventListener("click", () => this.handleTowerClick(index));
    });

    // Кнопка перезапуску
    this.view.getResetButton().addEventListener("click", () => {
      this.initGame();
    });

    // Зміна кількості дисків
    this.view.getDiskCountInput().addEventListener("change", () => {
      this.initGame();
    });

    // Кнопка автосолвера
    this.view.getSolveButton().addEventListener("click", () => {
      if (this.state.isAutoSolving()) {
        this.stopAutoSolve(true);
      } else {
        this.startAutoSolve();
      }
    });
  }

  /**
   * Ініціалізує нову гру
   */
  initGame() {
    // Зупиняємо автосолвер якщо він працює
    this.solver.stop();
    this.state.setAutoSolving(false);
    this.view.updateUIForSolver(false);

    // Отримуємо кількість дисків з поля введення
    const numDisks = this.view.getDiskCountValue();
    this.view.setDiskCountValue(numDisks);

    // Ініціалізуємо стан гри
    this.state.init(numDisks);

    // Оновлюємо UI
    this.updateDisplay();
    this.view.setMessage(
      "Перенесіть всі диски з першої вежі на третю. Спочатку клікніть по вежі-джерелу, потім по цільовій вежі."
    );
  }

  /**
   * Оновлює відображення стану гри
   * @private
   */
  updateDisplay() {
    this.view.updateMoves(this.state.getMoveCount());
    this.view.updateOptimalMoves(this.state.getOptimalMoves());
    this.view.render(this.state.getTowers(), this.state.getSelectedTowerIndex());
  }

  /**
   * Перевіряє та відображає повідомлення про перемогу
   * @private
   */
  checkWin() {
    if (this.state.isGameWon()) {
      const moveCount = this.state.getMoveCount();
      const optimal = this.state.getOptimalMoves();
      this.view.setMessage(
        `Гру завершено за ${moveCount} ходів! Мінімально можливий результат: ${optimal}.`,
        "win"
      );
    }
  }

  /**
   * Виконує хід з однієї вежі на іншу
   * @param {number} sourceIndex - Індекс вежі-джерела
   * @param {number} targetIndex - Індекс цільової вежі
   * @param {Object} options - Опції ходу
   * @param {boolean} options.fromSolver - Чи хід від автосолвера
   * @param {boolean} options.skipCheckWin - Чи пропустити перевірку перемоги
   * @param {boolean} options.skipMessage - Чи пропустити очищення повідомлення
   * @returns {boolean} - true якщо хід виконано успішно
   * @private
   */
  performMove(sourceIndex, targetIndex, options = {}) {
    const { fromSolver = false, skipCheckWin = false, skipMessage = false } = options;

    // Перевіряємо можливість ходу
    const validation = this.state.canMove(sourceIndex, targetIndex);
    
    if (!validation.valid) {
      if (!fromSolver) {
        this.view.setMessage(validation.error, "error");
      }
      return false;
    }

    // Виконуємо хід
    this.state.performMove(sourceIndex, targetIndex);
    this.updateDisplay();

    if (!skipMessage) {
      this.view.setMessage("");
    }
    
    if (!skipCheckWin) {
      this.checkWin();
    }

    return true;
  }

  /**
   * Обробляє клік по вежі
   * @param {number} index - Індекс вежі (0-2)
   * @private
   */
  handleTowerClick(index) {
    // Під час автосолвера ігноруємо кліки
    if (this.state.isAutoSolving()) {
      return;
    }

    const selectedIndex = this.state.getSelectedTowerIndex();
    const towers = this.state.getTowers();

    // Якщо жодна вежа не вибрана - вибираємо поточну
    if (selectedIndex === null) {
      if (towers[index].length === 0) {
        this.view.setMessage(
          "На цій вежі поки немає дисків. Оберіть вежу, де є диски.",
          "error"
        );
        return;
      }
      
      this.state.selectTower(index);
      this.view.setMessage(
        `Обрана вежа №${index + 1}. Тепер оберіть вежу, куди перемістити верхній диск.`
      );
      this.view.render(towers, index);
      return;
    }

    // Якщо клікнули на ту саму вежу - скасовуємо вибір
    if (selectedIndex === index) {
      this.state.selectTower(null);
      this.view.setMessage("Вибір вежі скасовано.");
      this.view.render(towers, null);
      return;
    }

    // Виконуємо хід
    const moved = this.performMove(selectedIndex, index);
    this.state.selectTower(null);

    if (!moved) {
      this.view.render(towers, null);
    }
  }

  /**
   * Запускає автоматичне розв'язання
   * @private
   */
  startAutoSolve() {
    // Спочатку ініціалізуємо гру з початкової позиції
    this.initGame();

    // Готуємо розв'язання
    this.solver.prepareSolution(this.state.getNumDisks());

    if (this.solver.getTotalMoves() === 0) {
      return;
    }

    // Оновлюємо UI
    this.state.setAutoSolving(true);
    this.view.updateUIForSolver(true);
    this.view.setMessage("Автосолвер демонструє оптимальне рішення…");

    // Запускаємо автоплей
    this.solver.startAutoPlay(
      // onMove callback
      (from, to) => {
        this.performMove(from, to, {
          fromSolver: true,
          skipCheckWin: true,
          skipMessage: true
        });
      },
      // onComplete callback
      () => {
        this.state.setAutoSolving(false);
        this.view.updateUIForSolver(false);
        this.checkWin();
        
        const moveCount = this.state.getMoveCount();
        const optimal = this.state.getOptimalMoves();
        this.view.setMessage(
          `Автосолвер завершив оптимальне рішення за ${moveCount} ходів із мінімально можливих ${optimal}.`,
          "win"
        );
      }
    );
  }

  /**
   * Зупиняє автоматичне розв'язання
   * @param {boolean} manual - Чи зупинено користувачем
   * @private
   */
  stopAutoSolve(manual = false) {
    this.solver.stop();
    this.state.setAutoSolving(false);
    this.view.updateUIForSolver(false);

    if (manual) {
      this.view.setMessage("Автосолвер зупинено. Ви можете продовжити гру вручну.");
    }
  }
}
