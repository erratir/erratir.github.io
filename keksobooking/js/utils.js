/* global window: false */

/**
 * Модуль со вспомогательными функциями
 */

(function () {
  window.utils = {

    /**
     * Функция, возвращает случайный элемемент массива
     * https://learn.javascript.ru/array
     * @param {array} array
     * @return {*}
     */
    getRandomElement(array) {
      let randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    },

    /**
     * Функция возвращает случайное целое число между min и max, включая min, max как возможные значения
     * https://learn.javascript.ru/task/random-int-min-max
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    getRandomInRange(min, max) {
      let rand = min + Math.random() * (max + 1 - min);
      rand = Math.floor(rand);
      return rand;
    },

    /**
     * Функция возвращает массив со случайно перемешанными элементами
     * Если передать в функцию newLength, то после сортировки исходный массив будет обрезан до newLength
     * https://habr.com/ru/post/358094/
     * @param {array} arr
     * @param {number} [newLength]  -  [Не обязательный]
     * @return {array}
     */
    shuffleArray(arr, newLength) {
      let j;
      let temp;
      for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
      }
      if (newLength) {
        arr = arr.slice(0, newLength + 1);
      }
      return arr;
    },

    /**
     * Функция возвращает текущие координаты и размеры HTML элемента относительно окна браузера
     * Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
     * @param {object} element
     * @return {ClientRect | DOMRect}
     */
    getElementPosition(element) {
      return element.getBoundingClientRect();
    },

    /**
     * Функция проверяет содержится ли в массиве arr1 ХОТЯБЫ ОДИН элемент массива arr2
     * Возвращает true в случае успеха
     * @param {Array} arr1 - Массив в котором ищем элементы массива arr2
     * @param {Array} arr2 - Массив элементы которого ищем в массиве arr1
     * @return {boolean}
     */
    comparingSomeElementsOfArrays(arr1, arr2) {
      return arr2.some((element) => arr1.includes(element));
    },

    /**
     * Функция проверяет содержится ли в массиве arr1 ВСЕ элементы массива arr2
     * Возвращает true в случае успеха
     * @param {Array} arr1 - Массив в котором ищем элементы массива arr2
     * @param {Array} arr2 - Массив элементы которого ищем в массиве arr1
     * @return {boolean}
     */
    comparingElementsOfArrays(arr1, arr2) {
      return arr2.every((element) => arr1.includes(element));
    }

  };
})();
