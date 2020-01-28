/* global window, document: false */
(function () {
  window.utils = {

    /**
     *  Функция возвращает массив с уникальными элементами
     * Только в ES6 https://webformyself.com/kak-proizvesti-udalenie-dublej-massiva-v-es6/
     * @param {array} arr
     * @return {any[]}
     */
    returnUniqueArray(arr) {
      return Array.from(new Set(arr));
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
     * Функция создает HTML элемент, по переданным tagName и className
     * @param {string} tagName
     * @param {string} className
     * @return {HTMLElement}
     */
    makeElement(tagName, className) {
      let element = document.createElement(tagName);
      element.classList.add(className);
      return element;
    },

    /**
     * Функуия удаляет переданный ей HTMLElement со страницы.
     * Если передан Event отменяет действие по умолчанию и прекращает его дальнейшее распространение
     * @param {HTMLElement} element
     * @param {Event} evt необязательный
     */
    removeHtmlElement(element, evt) {
      if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }
      element.remove();
    },

    /**
     * Функция случайно перемешивает эл-ы массива
     * https://habr.com/ru/post/358094/
     * @param {array} arr
     * @return {array}
     */
    shuffle(arr) {
      let j; let temp;
      for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
      }
      return arr;
    },

  };
})();
