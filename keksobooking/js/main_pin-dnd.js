/* global window, document: false */

/**
 * Модуль который отвечает за перетаскивание (Drag and drop) главного пина (метки объявления) по карте
 *
 * https://developer.mozilla.org/ru/docs/Web/Guide/HTML/Drag_and_drop
 * https://learn.javascript.ru/drag-and-drop-objects
 * https://learn.javascript.ru/coordinates
 * https://ru.stackoverflow.com/questions/663759/%D0%9A%D0%B0%D0%BA-%D0%BA%D0%BE%D1%80%D1%80%D0%B5%D0%BA%D1%82%D0%BD%D0%BE-%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B8%D1%82%D1%8C-%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C-dragndrop
 */

/**
 *  ТЗ module5:
 *  В этом задании мы закончим работу с перемещением главного маркера по карте.
 *  Теперь, когда вы знакомы с тем, как работает механизм перетаскивания элементов,
 *  вы можете закончить работу над перемещением маркера .map__pin--main.
 *  Вам нужно описать полный цикл Drag n Drop для маркера, то есть добавить обработчики событий mousedown,
 *  mousemove и mouseup на маркер.
 *  Обработчики mousemove и mouseup должны добавляться только при вызове обработчика mousedown.
 *  Обработчики mousemove и mouseup должны запускать логику изменения положения маркера:
 *  в нём должны вычисляться новые координаты маркера на основании смещения, применяться через стили к элементу
 *  и записываться в поле адреса (с поправкой на то, что в адрес записываются координаты острого конца).
 *  Учтите, что расчёт координат маркера и их запись в поле адреса должна дублироваться и в обработчике mouseup,
 *  потому что в некоторых случаях пользователь может нажать мышь на маркере, но никуда его не переместить.
 *  Ещё один момент касается ограничения перетаскивания: не забудьте сделать так,
 *  чтобы маркер невозможно было переместить за пределы карты (см. пункт 3.4).
 *  Вспомните, что в прошлом задании вы уже добавляли обработчик на событие mouseup,
 *  который переводил страницу в активный режим.
 *  Теперь,  когда у вас есть синхронизация с координатами, вам нужно выбрать стратегию,
 *  вы можете использовать или несколько обработчиков или один обработчик со сложной логикой.
 */

(function () {

  let mapClass = document.querySelector(`.map`);
  let mainPin = document.querySelector(`.map__pin--main`);

  //  Только при вызове обработчика mousedown - обработчики mousemove и mouseup должны добавляться
  mainPin.addEventListener(`mousedown`, function (evt) {
    evt.preventDefault();
    let dragged = false;

    let mapLocation = mapClass.getBoundingClientRect(); // координаты карты относительно окна браузера

    /**
     * Лимиты координат (область карты) за которые нельзя вытащить mainPin
     * у mainPin position: relative
     */
    let limitLocation = {
      top: mapLocation.top,
      right: mapLocation.width - mainPin.offsetWidth,
      bottom: mapLocation.height - mainPin.offsetHeight,
      left: 0
    };

    let startLocation = { // начальные координаты mainPin
      x: evt.clientX,
      y: evt.clientY,
    };

    let onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      let shift = { // смещение относительно стартовых координат
        x: startLocation.x - moveEvt.clientX,
        y: startLocation.y - moveEvt.clientY
      };

      startLocation = { // перезаписываем стартовые координаты
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      let newLocation = { // координаты mainPin относительно родителя (map)
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      //  ограничение движения mainPin по X ( в пределах карты)
      if (newLocation.x < limitLocation.left) {
        newLocation.x = limitLocation.left;
      } else if (newLocation.x > limitLocation.right) {
        newLocation.x = limitLocation.right;
      }

      //  ограничение движения mainPin по Y ( в пределах карты)
      if (newLocation.y < limitLocation.top) {
        newLocation.y = limitLocation.top;
      } else if (newLocation.y > limitLocation.bottom) {
        newLocation.y = limitLocation.bottom;
      }

      relocate();
      function relocate() {
        mainPin.style.left = `${newLocation.x}px`;
        mainPin.style.top = `${newLocation.y}px`;
      }
    };

    let onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      /**
       *  ТЗ module4:
       *  Первое перетаскивание главной метки переводит страницу в активный режим.
       *  Любое перетаскивание состоит из трёх фаз: захвата элемента, его перемещения и отпускания элемента.
       *  На данном этапе нам достаточно описать реакцию на третью фазу: отпускание элемента.
       *  Для этого нужно добавить обработчик события mouseup на элемент .map__pin--main.
       *  Обработчик события mouseup должен вызывать функцию, которая будет отменять изменения DOM-элементов,
       *  описанные в пункте «Неактивное состояние» ТЗ. ->  window.form.setFormFocus(true)
       */
      mainPinMove();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    // Обработчик mousemove должен запускать логику изменения положения главного пина
    document.addEventListener(`mousemove`, onMouseMove);
    // При отпускании кнопки мышки, нужно перестать слушать события `mousemove` и `mouseup`
    document.addEventListener(`mouseup`, onMouseUp);
  });


  // При изменениия или клике или энтере по главному пину
  let mainPinMove = function () {
    window.map.setMapFocus(true);
    window.form.setFormFocus(true);
    window.form.setAddress();
    window.pin.renderPin(window.data.adArray); // рендерим пины на основе массива исходных объявлений
  };

  // Энтер на главном пине
  mainPin.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Enter`) {
      mainPinMove();
    }
  });

})();
