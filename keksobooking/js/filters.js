/* global document, window: false */

/**
 *  Модуль отвечаюию за фильтрацию объявлений на карте
 */

/**
 * module7: Доработайте модуль, отрисовывающий пины, таким образом, чтобы отрисованные на карте метки
 * можно было фильтровать с помощью фильтров, расположенных в блоке .map__filters.
 * После фильтрации должны показываться те метки из набора данных, которые подходят под выбранные фильтры.
 * Метки, отрисованные до этого нужно убрать.
 * Все выбранные фильтры применяются вместе: один фильтр не отменяет другие, выбранные до него.
 * Например, после выбора типа жилья можно указать диапазон стоимости и дополнения и в этом случае,
 * на карте должны показываться только те метки, которые подходят под все условия.
 * Как в изначальном состоянии, так и при изменении фильтра, на карте должно
 * показываться не более пяти меток, независимо от выбранного фильтра.
 */

(function () {

  const PRICE = {
    LOW: 10000,
    HIGH: 50000,
  };

  let mapFilters = document.querySelector(`.map__filters`);

  /**
   * Функция фильтрует массив объявлений в соответсвии с заданными пользователем фильтрами
   * @return {Array} arrFiltered - Отфильтрованный массив объявлений
   */
  let adFilter = function () {
    let housingTypeFilter = mapFilters.querySelector(`#housing-type`).value;
    let housingPriseFilter = mapFilters.querySelector(`#housing-price`).value;
    let housingRoomsFilter = mapFilters.querySelector(`#housing-rooms`).value;
    let housingGuestsFilter = mapFilters.querySelector(`#housing-guests`).value;
    let housingFeaturesFilter = mapFilters.querySelector(`#housing-features`).querySelectorAll(`input:checked`); // все чекнутые элементы

    return window.data.adArray.filter(function (item) {

      // изначально считаем текущие объявление подходящим под фильтры
      let isValid = true;

      // Фильтр цены типа жилья
      if (housingTypeFilter !== `any`) {
        if (housingTypeFilter !== item.offer.type) { // если тип жилья не совпадает с фильтром, выйдем из анонимной ф-ии со значением false
          return false;
        }
      }

      // Фильтр цены кол-ва комнат
      if (housingRoomsFilter !== `any`) {
        isValid = (Number(housingRoomsFilter) === item.offer.rooms);
        if (Number(housingRoomsFilter) !== item.offer.rooms) { // если кол-во комнат не совпадает с фильтром
          return false;
        }
      }

      // Фильтр цены кол-ва гостей
      if (housingGuestsFilter !== `any`) {
        isValid = (Number(housingGuestsFilter) === item.offer.guests);
        if (Number(housingGuestsFilter) !== item.offer.guests) { // если кол-во гостей не совпадает с фильтром
          return false;
        }
      }

      // Фильтр цены объявления
      switch (housingPriseFilter) {
        case `middle`: // if (housingPriseFilter === `middle`) // Если выбран фильтр middle (10000 - 50000)
          isValid = (item.offer.price < PRICE.LOW && item.offer.price < PRICE.HIGH); // true если цена совпадает с фильтром
          break;
        case `low`: // Если выбран фильтр low (до 10000)
          isValid = (item.offer.price < PRICE.LOW);
          break;
        case `high`: // Если выбран фильтр high (от 50000)
          isValid = (item.offer.price > PRICE.HIGH);
          break;
        default: break; // По умолчанию, если фильтр = `any` ничего не проверяем
      }

      // Фильтр дополнительных опций объявления
      if (housingFeaturesFilter.length !== 0) { // если есть чекнутые опции (housingFeaturesFilter - NodeList)
        let featureArray = []; // массив чекнутых опцмий
        housingFeaturesFilter.forEach((element) => featureArray.push(element.value));
        if (!window.utils.comparingElementsOfArrays(item.offer.features, featureArray)) { // если всех чекнутых опции нет в массиве доп.опций объявления
          return false;
        }

      }

      return isValid;

    });

    /**
     * Test
     * console.log(arr); // Вывести исходный массив объявлений
     * console.log(arrFiltered); // Вывести отфильтрованный массив
     */
  };

  let renderFilteredPin = function () {
    window.card.closePopupCard();
    // console.log(adFilter());
    // перерисовываем пины объявлений (с устранением дребезга)
    window.debounce(function () {
      window.pin.renderPin(adFilter());
    }, 500);
  };

  // Обработчик на изменение состояний фильтров карты
  mapFilters.addEventListener(`change`, renderFilteredPin);

})();
