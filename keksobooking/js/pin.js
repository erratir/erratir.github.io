/* global window, document: false */

/**
 *  модуль, который отвечает за создание пина — метки
 на карте
 */

(function () {

  let mapPins = document.querySelector(`.map__pins`);
  let pin = document.querySelector(`#pin`);

  /**
   * Функция принимает объект с параметрами объявления, создает клон метки и возвращает
   * @param {object} element
   * @param {number} index порядковый номер
   * @return {Node}
   */
  let createPinClone = function (element) {
    let pinClone = pin.content.cloneNode(true);
    // pinClone.querySelector(`.map__pin`).style = `left: 400px; top: 400px;`;
    pinClone.querySelector(`.map__pin`).style.left = element.location.x + `px`;
    pinClone.querySelector(`.map__pin`).style.top = element.location.y + `px`;
    pinClone.querySelector(`img`).src = element.author.avatar;
    pinClone.querySelector(`img`).alt = element.offer.title;
    pinClone.querySelector(`.map__pin`).setAttribute(`id`, `${element.id}`);
    return pinClone;
  };

  /**
   * Отрисовка меток объявлений на карте
   * @param {Array} arr - Массив объявлений которые показать на карте
   */
  let renderPin = function (arr) {
    let fragment = document.createDocumentFragment();

    arr.forEach(function (element) {
      fragment.appendChild(createPinClone(element));
    });

    // удалим пины  объявлений (если они есть на карте) // иначе при кликах на главный пин, будут добавлятся новые пины
    while (mapPins.querySelector(`.map__pin[id]`)) {
      mapPins.removeChild(mapPins.querySelector(`.map__pin[id]`));
    }

    mapPins.appendChild(fragment);
  };

  /**
   * Обработчик - клик - на любой из меткок объявлений - открытие popupCard
   * Каждый <button class="map__pin"> содержит в себе <img>. И клик может быть как по <button>, так и по <img>.
   * Поэтому проверяем есть ли у элемента (ИЛИ его родителя) атрибут id
   */
  mapPins.addEventListener(`click`, function (evt) {
    let id;
    if (evt.target.id) {
      id = evt.target.id;
    } else if (evt.target.parentElement.id) {
      id = evt.target.parentElement.id;
    } else {
      return;
    }
    // console.log(`кликнули по метке объявления c id = ${id}`);
    // Удалить предыдущий popup и показать новый
    window.card.closePopupCard();
    window.card.openPopupCard(id);
  });

  window.pin = {
    renderPin,
  };

})();
