/* global window, document: false */

/**
 * Модуль, который создаёт данные
 */

(function () {

  let mapClass = document.querySelector(`.map`);

  window.data = {
    adArray: [],
    dataAd: {
      COUNT: 8,
      AVATAR_NUM_MIN_MAX: [1, 8],
      ADDRESS_LOCATION_X_MIN_MAX: [130, 630],
      ADDRESS_LOCATION_Y_MIN_MAX: [130, 630],
      OFFER_TITLE: [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`],
      OFFER_CURRENCY: `\u20BD`, // `\u20BD` -> ₽  `\u0024` - $
      OFFER_PRICE_MIN_MAX: [1000, 1000000],
      OFFER_TYPE: [`palace`, `flat`, `house`, `bungalo`],
      OFFER_ROOMS_MIN_MAX: [1, 5],
      OFFER_GUESTS_MIN_MAX: [2, 10],
      OFFER_CHECKIN: [`12:00,`, `13:00`, `14:00`],
      OFFER_CHECKOUT: [`12:00,`, `13:00`, `14:00`],
      OFFER_FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
      OFFER_DESCRIPTION: `В ТЗ пустая строка`,
      OFFER_PHOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`],
      // LOCATION_X_MIN_MAX: [130, 630],
      LOCATION_Y_MIN_MAX: [130, 630],
      PIN_WIDTH: 50, // ширина метки объвления (пина)
      PIN_HEIGHT: 70, // высота метки объвления (пина)
    },

    // создадим словарь для перевода | излишне, можно сразу этот объект добавить в window.data.dataAd вместо OFFER_TYPE, но так по ТЗ
    APARTMENT_TYPES: {
      flat: `Квартира`,
      bungalo: `Бунгало`,
      house: `Дом`,
      palace: `Дворец`
    },

  };

  /**
   * Функция генерирует случаюную позициию метки на карте по оси X
   * размеры метки 50*70px, значит острый конец указывает на +25px по X, +70px по Y
   * @return {number}
   */
  let setRandomPinPositionX = function () {
    let mapWidth = window.utils.getElementPosition(mapClass).width; // получим текущую ширину карты
    let maxX = mapWidth - window.data.dataAd.PIN_WIDTH; // вычтим ширину пина, т.к. справа пин не должен вылезти за карту (отсчет от верхнего левого угла)
    return window.utils.getRandomInRange(0, maxX); // получим случайную координату по оси X в пределах карты
  };


  /**
   * Функция-конструктор объекта ad
   */
  let GenerateAd = function () {
    this.author = {avatar: `img/avatars/user0${window.utils.getRandomInRange(1, 8)}.png`};
    this.location = {
      x: setRandomPinPositionX(),
      y: window.utils.getRandomInRange(window.data.dataAd.ADDRESS_LOCATION_Y_MIN_MAX[0], window.data.dataAd.LOCATION_Y_MIN_MAX[1]),
    };
    this.offer = {
      title: window.utils.getRandomElement(window.data.dataAd.OFFER_TITLE),
      // adress: `${window.utils.getRandomInRange(window.data.dataAd.LOCATION_X_MIN_MAX[0], window.data.dataAd.LOCATION_X_MIN_MAX[1])}, ${window.utils.getRandomInRange(window.data.dataAd.LOCATION_Y_MIN_MAX[0], window.data.dataAd.LOCATION_Y_MIN_MAX[1])}`,
      address: `${this.location.x},${this.location.y}`,
      price: window.utils.getRandomInRange(window.data.dataAd.OFFER_PRICE_MIN_MAX[0], window.data.dataAd.OFFER_PRICE_MIN_MAX[1]),
      type: window.utils.getRandomElement(window.data.dataAd.OFFER_TYPE),
      rooms: window.utils.getRandomInRange(window.data.dataAd.OFFER_ROOMS_MIN_MAX[0], window.data.dataAd.OFFER_ROOMS_MIN_MAX[1]),
      guests: window.utils.getRandomInRange(window.data.dataAd.OFFER_GUESTS_MIN_MAX[0], window.data.dataAd.OFFER_GUESTS_MIN_MAX[1]),
      checkin: window.utils.getRandomElement(window.data.dataAd.OFFER_CHECKIN),
      checkout: window.utils.getRandomElement(window.data.dataAd.OFFER_CHECKOUT),
      features: window.utils.shuffleArray(window.data.dataAd.OFFER_FEATURES, window.utils.getRandomInRange(1, window.data.dataAd.OFFER_FEATURES.length)),
      // где:
      // window.utils.getRandomInRange(1, window.data.dataAd.OFFER_FEATURES.length) -> случайное кол-во опций "WiFi, TV, .."
      // shuffleArray(window.data.dataAd.OFFER_FEATURES) -> перемешать массив и создать новый
      description: window.data.dataAd.OFFER_DESCRIPTION,
      photos: window.utils.shuffleArray(window.data.dataAd.OFFER_PHOTOS),
    };
  };

  /**
   * Функция получает данные о объявлениях с сервера.
   * В случае ошибки используются моковые данные (масив объявлений adArray конструируются из dataAd)
   */
  let getAdJson = function () {

    window.backend.getData()
      .then(function (data) {
        if (data) {
          window.data.adArray = data; // В массив adArray записываем полученные данные с сервера (массив объектов объявлений)
        } else {
          // В случае, если getData() вернул null (ответ сервера ==! 200), генерируем массиы объявлений из моковых данных
          for (let i = 0; i < window.data.dataAd.COUNT; i++) {
            window.data.adArray.push(new GenerateAd());
            // console.log(window.data.adArray);
          }
        }
        // каждому объявлению добавим параметр id
        window.data.adArray.forEach((element, index) => {
          element.id = index;
        });

        // todo поскольку запрос к серверу асинхронный отображение объявлений на карте запускать отсюда renderPin(); ?
      });
  };

  getAdJson();
})();
