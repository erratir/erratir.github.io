/* global window, document: false */

/**
 * модуль, который отвечает за создание и показ карточки объявлений
 */

/**
 * _______________________________ ТЗ: ______________________________
 * Просмотр подробной информации о похожих объявлениях.
 * После перевода страницы в активный режим, нужно отрисовать на карте похожие объявления.
 * Позже, в разделе про сеть, перевод в активный режим будет запускать загрузку объявлений,
 * но пока что можно показать объявления сразу.
 * Нажатие на метку похожего объявления на карте, приводит к показу карточки с подробной информацией об этом объявлении.
 * Получается, что для меток должны быть созданы обработчики событий, которые вызывают показ карточки с соответствующими данными.
 * Использовать ли делегирование.
 * При решении этой задачи помните о том, что при клике на метку, нужно будет передавать
 * в метод отрисовки карточки объект с данными, описывающими объявление.
 * Если использовать для этой задачи делегирование, то нахождение этого объекта будет нетривиальным,
 * потому что у вас будет использоваться один обработчик, у которого есть информация только о том, на каком DOM-элементе
 * произошёл клик. Таким образом, если вы используете делегирование для решения этой задачи,
 * вам нужно будет каким-то образом связать DOM-объекты с JS-объектами, которые их описывают.
 * _____________________________________________________________________
 * Добавим каждой метке ID, для этого дополним ф-ю createPinClone(i):
 * pinClone.querySelector(`.map__pin`).setAttribute(`id`, `${i}`);
 * И используем делегирование, добавиви обработчик на родительский див, и проверяем в обработчике ID у элемента
 */

(function () {

  let mapClass = document.querySelector(`.map`);
  let popupCard = document.querySelector(`#card`);

  /**
   * Генеририрует карточку объявления в соответствии с шаблоном
   * На основе первого по порядку элемента из сгенерированного массива
   * и шаблона .map__card создайте DOM-элемент объявления, заполните его
   * данными из объекта и вставьте полученный DOM-элемент
   * в блок .map перед блоком .map__filters-container:
   * @param {number} i
   */
  let openPopupCard = function (i) {
    let fragment = document.createDocumentFragment();
    let cloneMapCard = popupCard.content.cloneNode(true);
    cloneMapCard.firstElementChild.src = window.data.adArray[i].author.avatar;
    cloneMapCard.querySelector(`.popup__title`).textContent = window.data.adArray[i].offer.title;
    cloneMapCard.querySelector(`.popup__text--address`).textContent = window.data.adArray[i].offer.address;
    cloneMapCard.querySelector(`.popup__text--price`).textContent = `${window.data.adArray[i].offer.price} ${window.data.dataAd.OFFER_CURRENCY}/ночь`;
    cloneMapCard.querySelector(`.popup__type`).textContent = window.data.APARTMENT_TYPES[window.data.adArray[i].offer.type]; // window.data.APARTMENT_TYPES возьмет русский вариант слова
    cloneMapCard.querySelector(`.popup__text--capacity`).textContent = `${window.data.adArray[i].offer.rooms} комнат(ы) для ${window.data.adArray[i].offer.guests} гостей`; // todo - обработка окончаний - 1 комнат(ы) для 3 гостей
    cloneMapCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${window.data.adArray[i].offer.checkin}, выезд ${window.data.adArray[i].offer.checkout}`;

    /**
     * Опции | В список .popup__features выведите все доступные удобства (опции)  в объявлении
     * получим коллекцию объектов, т.е. все теги <li> в <ul class="popup__features"> | <li class="popup__feature popup__feature--wifi"></li>
     */
    let nodeList = cloneMapCard.querySelector(`.popup__features`).querySelectorAll(`.popup__feature`);
    let liClassName;
    let liClassNameEnd; // Все что в имени класса после `popup__feature popup__feature--`, например `WiFi`
    // пройдемся по всем объектам масива (коллекции <li>)
    nodeList.forEach(function (item) {
      liClassName = item.className;
      liClassNameEnd = liClassName.substr(31);
      // Если в объявлении window.data.adArray[i], в массиве features нет текущей опции (WiFi и т.д), то удалим <li>
      if (!(window.data.adArray[i].offer.features.some((elem) => elem === liClassNameEnd))) {
        item.remove();
      }
    });

    // Описание | В блок .popup__description выведите описание объекта
    cloneMapCard.querySelector(`.popup__description`).textContent = `${window.data.adArray[i].offer.description}`;

    /**
     * Фото | В блок .popup__photos выведите все фотографии из списка offer.photos.
     * Каждая из строк массива photos должна записываться как src соответствующего изображения.
     * @type {Element}
     */
    let divFotoColection = cloneMapCard.querySelector(`.popup__photos`);
    window.data.adArray[i].offer.photos.forEach(function (item, j) {
      if (j > 0) { // если фотка не одна (а в html шаблоне, только один тег <img>), добавим еще один тег <img>
        divFotoColection.appendChild(divFotoColection.querySelector(`img`).cloneNode(true));
      }
      divFotoColection.querySelector(`img`).src = item;
    });

    /**
     *   Автар | Замените src у аватарки пользователя — изображения,
     *   которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
     */
    cloneMapCard.querySelector(`.popup__avatar`).src = window.data.adArray[i].author.avatar;

    // отрисовка клона фрагмента
    fragment.appendChild(cloneMapCard);
    mapClass.appendChild(fragment);

    // добавляем обработчики на закрытие окна popup
    mapClass.querySelector(`.popup__close`).addEventListener(`click`, closePopupCard); // клик по крестику попапа
    document.addEventListener(`keydown`, popupEscPressHandler); // Esc
  };

  /**
   * Функция закрывает всплывающее окно с карточкой объявления, если оно открыто
   * И удаляет обработчик на Esc
   */
  let closePopupCard = function () {
    if (mapClass.querySelector(`.popup`)) {
      mapClass.querySelector(`.popup`).remove();
      document.removeEventListener(`keydown`, popupEscPressHandler);
    }
  };

  /**
   * Обработчик - Esc - при открытом окне popupCard - закрыть
   * Вызывается в функции открытия окна - openPopupCard(i)
   * @param {Event} evt
   */
  let popupEscPressHandler = function (evt) {
    if (evt.key === `Escape`) {
      closePopupCard();
    }
  };

  window.card = {
    openPopupCard,
    closePopupCard,
  };

})();
