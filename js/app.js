/**
 * Tower of Hanoi - Application Entry Point
 * Головний файл ініціалізації додатку "Ханойські вежі"
 * 
 * Архітектура додатку:
 * - Model (GameState) - управління станом гри
 * - View (GameView) - відображення та маніпуляція DOM
 * - Controller (GameController) - логіка гри та обробка подій
 * - Service (Solver) - алгоритм автоматичного розв'язання
 */
import { GameController } from './controllers/GameController.js';

/**
 * Ініціалізує додаток після завантаження DOM
 */
document.addEventListener("DOMContentLoaded", function () {
  const game = new GameController();
  game.init();
});
