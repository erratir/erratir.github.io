/* global window, document: false */
(function () {

  let mapClass = document.querySelector(`.map`);

  /**
 * Функция переключает карту из неактивного состояния в активное и  наоборот
 * @param {boolean} focus
 */
  let setMapFocus = function (focus) {
    if (focus) {
      mapClass.classList.remove(`map--faded`);
    } else {
      mapClass.classList.add(`map--faded`);
    }
  };

  window.map = {
    setMapFocus,
  };


})();
