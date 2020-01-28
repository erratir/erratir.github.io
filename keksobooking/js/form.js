/* global window, document: false */

/**
 *  модуль, который работает с формой объявления
 */

/**
 * !Форма успешно отправляется, только с правильно заполненными полями! (необходимо реализовать туду ниже)
 */

/**
 * todo SRS 1. Заполнение информации
 * 1.2. Заполнение всей информации производится на одной странице без промежуточных переходов.
 * Порядок заполнения информации не важен.1.3. После заполнения всех данных, при нажатии на кнопку «Опубликовать»,
 * все данные из формы, включая изображения, с помощью AJAX-запроса отправляются на сервер
 * https://js.dump.academy/keksobooking методом  POST  с типом  multipart/form-data .
 * 1.4. Страница реагирует на неправильно введённые значения в форму. Если данные,
 * введённые в форму, не соответствуют ограничениям, указанным в разделе, описывающем
 * поля ввода, форму невозможно отправить на сервер. При попытке отправить форму
 * с неправильными данными, отправки не происходит, а неверно заполненные поля подсвечиваются красной рамкой.
 * Способ добавления рамки и её стиль произвольные.
 * 1.5. При успешной отправке формы, страница, не перезагружаясь, переходит в изначальное
 * неактивное состояние: все заполненные поля стираются, метки похожих объявлений
 * и карточка активного объявления удаляются, метка адреса возвращается в исходное
 * положение, значение поля адреса корректируется соответственно положению метки.
 * Показывается сообщение об успешной отправке формы: у блока  .success  нужно убрать класс  hidden .
 * Нажатие на кнопку  Esc  или клик по произвольной области страницы скрывает блок  .success ,
 * добавляя ему класс  hidden .
 * 1.6. Если при отправке данных произошла ошибка запроса, показывается соответствующее сообщение.
 * Стиль и содержимое сообщения произвольные. Должна быть предусмотрена возможность закрыть сообщение
 * или же оно само должно исчезать через некоторое время.
 * 1.7. Нажатие на кнопку  .ad-form__reset  сбрасывает страницу в исходное неактивное
 * состояние без перезагрузки: все заполненные поля стираются, метки похожих объявлений и
 * карточка активного объявления удаляются, метка адреса возвращается в исходное
 * положение, значение поля адреса корректируется соответственно положению метки.
 */

/**
 * todo SRS 2. Ограничения, накладываемые на поля ввода
 * 2.1. Заголовок объявления:
 * Обязательное текстовое поле; Минимальная длина — 30 символов;  Максимальная длина — 100 символов;
 * 2.2. Цена за ночь:
 * Обязательное поле;  Числовое поле; Максимальное значение — 1000000;
 * 2.3. Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»:
 * «Бунгало» — минимальная цена за ночь 0;  «Квартира» — минимальная цена за ночь 1 000;  «Дом» — минимальная цена 5 000;  «Дворец» — минимальная цена 10 000;
 * Вместе с минимальным значением цены нужно изменять и плейсхолдер.
 * Обратите внимание
 * Ограничение минимальной цены заключается именно в изменении минимального значения,
 * которое можно ввести в поле с ценой, изменять само значение поля не нужно,
 * это приведёт к плохому UX. Даже если текущее значение не попадает под новые
 * ограничения не стоит без ведома пользователя изменять значение поля.2.4.
 * Адрес:
 * Ручное редактирование поля запрещено. Значение автоматически выставляется при
 * перемещении метки  .map__pin--main  по карте. Подробности заполнения поля адреса,
 * описаны вместе с поведением метки.
 * 2.5. Поля «Время заезда» и «Время выезда» синхронизированы: при изменении значения
 * одного поля, во втором выделяется соответствующее ему. Например, если время заезда
 * указано «после 14», то время выезда будет равно «до 14» и наоборот.
 * 2.6. Поле «Количество комнат» синхронизировано с полем «Количество мест» таким
 * образом, что при выборе количества комнат вводятся ограничения на допустимые варианты выбора количества гостей:
 * 1 комната — «для 1 гостя»;
 * 2 комнаты — «для 2 гостей» или «для 1 гостя»;
 * 3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»;
 * 100 комнат — «не для гостей»;
 * Допускаются разные способы ограничения допустимых значений поля «Количество мест»:
 * удаление из разметки соответствующих элементов  option , добавление элементам  option
 * состояния  disabled  или другие способы ограничения, например, с помощью метода  setCustomValidity .
 */

(function () {

  let mainPin = document.querySelector(`.map__pin--main`);
  let mapClass = document.querySelector(`.map`);

  let buttonSubmit = document.querySelector(`.ad-form__submit`);
  let successPopupTemplate = document.querySelector(`#success`);
  let main = document.querySelector(`main`);
  let errorPopupTemplate = document.querySelector(`#error`);

  /**
   * Функция активирует\дезактивирует поля формы добавления объявления и саму форму
   * Согласно ТЗ, поля формы должны быть неактивны в исходном состоянии.
   * В разметке проекта поля активны,  * поэтому их нужно отключить,
   * т.е. добавить через DOM-операции или самим полям или fieldset которые их содержат, атрибут disabled.
   * @param {boolean} focus
   */
  let setFormFocus = function (focus) {
    let form = document.querySelector(`.ad-form`);
    if (focus) {
      form.classList.remove(`ad-form--disabled`);
    } else {
      form.classList.add(`ad-form--disabled`);
    }
    form = form.querySelectorAll(`fieldset`); // запишем в переменну массив HTML элементов <fieldset></fieldset>
    form.forEach(function (item) {
      item.disabled = !focus; // каждому элементу установим или удадим атрибут disabled
    });
  };
  setFormFocus(false);

  /**
   *  Функция заполнение поля формы  "Адрес"
   *  _______________________________ ТЗ: _______________________________
   *    Кроме активации формы, перемещение метки приводит к заполнению поля адреса.
   *  В значении поля записаны координаты, на которые метка указывает своим острым концом.
   *  Поэтому в обработчике события mouseup на элементе метки, кроме вызова метода,
   *  переводящего страницу в активное состояние, должен находиться вызов метода,
   *  который устанавливает значения поля ввода  адреса.
   *  Ещё один момент заключается в том, что поле адреса должно быть заполнено всегда,
   *  в том числе сразу после открытия страницы.
   *    Насчёт определения координат метки в этом случае нет никаких инструкций, ведь в неактивном режиме страницы
   *  метка круглая, поэтому мы можем взять за исходное значение поля адреса середину метки.
   *  А при «перетаскивании» значение поля изменится на то, на которое будет указывать острый конец метки.
   *  Для определения смещения координаты относительно левого верхнего угла метки можно использовать любой способ,
   *  в том числе, вычисление размеров метки. Кроме этого, можно хранить размеры метки как константу.
   *  _____________________________________________________________________
   *  Нас интересуют коррдинаты метки в координатах карты (`.map`), поэтому:
   *  По Х: Чтобы отсчет был в координатах карты -> Х метки МИНУС X карты
   *  По y: Чтобы отсчет был в координатах карты -> Y метки МИНУС Y карты
   *  При скролинге Y и карты и метки меняется, но относительные координаты будут верные
   *  -----
   *  Т.к. в css после активации карты в свойстве .map__pin--main::after рисуется псевдоэлемент border-top-width: 22px,
   *  который является хвостиком метки, то чтобы получить точку на которую указывает хвостик,
   *  к конечной  координате Y надо прибавить border-top-width. И вычесть 6px, т.к. псевдоэлемент .map__pin--main::after
   *  сдвигается по оси Y c помощью CSS transform: translate(tx, ty)
   *  Обратится к псевдоэлементу в JS можно только через добавление\удаление классов, поэтому пока возьмем числовое значение 22-6 = 18px;
   *  todo: вынести 18 в константу или найти способ обращаться к псевдоэлементу
   */
  let setAddress = function () {
    let mainPinPosition = window.utils.getElementPosition(mainPin); // Позиция главной метки в координатах окна браузера
    let mainPinX = mainPinPosition.x; // получим текущую координату Х для главной метки
    let mapX = window.utils.getElementPosition(mapClass).x; // получим текущую координату Х для карты
    mainPinX = mainPinX - mapX; // координата Х главной метки в координатах карты
    let mapY = window.utils.getElementPosition(mapClass).y; // получим текущую координату Y для карты
    let mainPinY = mainPinPosition.y - mapY;
    // На данный момент у нас координаты левого верхнего угла метки. Нам нужны координаты, куда указывает острый конец
    mainPinX += mainPinPosition.width / 2;
    mainPinY += mainPinPosition.height + 18;
    // запишем координаты метки в поле формы #address
    document.querySelector(`#address`).value = `x = ${Math.round(mainPinX)}, y = ${Math.round(mainPinY)}`;
  };

  /**
   * Функция отображает окно `.success` в случае успешной загрузки данных формы на сервер
   */
  let showSuccessMessage = function () {
    let cloneSuccessPopupTemplate = successPopupTemplate.content.cloneNode(true);
    let succesPopup = cloneSuccessPopupTemplate.querySelector(`.success`);

    main.appendChild(cloneSuccessPopupTemplate);
    let closeSuccessMessage = function () {
      document.removeEventListener(`keydown`, handleKeyPress);
      succesPopup.removeEventListener(`click`, closeMessageOnOutClick);
      main.removeChild(succesPopup);
    };

    let closeMessageOnOutClick = function (evt) {
      evt.preventDefault();
      if (evt.target === succesPopup) {
        closeSuccessMessage();
      }
    };

    let handleKeyPress = function (evt) {
      evt.preventDefault();
      if (evt.key === `Escape`) {
        closeSuccessMessage();
      }
    };
    document.addEventListener(`keydown`, handleKeyPress);
    succesPopup.addEventListener(`click`, closeMessageOnOutClick);
  };

  /**
   * Функция отображает окно `.error` в случае ошибки загрузки данных формы на сервер
   * @param {string} message
   */
  let showSubmitError = function (message) {
    let cloneErrorTemplate = errorPopupTemplate.content.cloneNode(true);
    let errorBlock = cloneErrorTemplate.querySelector(`.error`);
    let errorMessage = cloneErrorTemplate.querySelector(`.error__message`);
    let errorButton = errorBlock.querySelector(`.error__button`);
    errorMessage.textContent = message;

    main.appendChild(cloneErrorTemplate);

    let handleKeyPressOnError = function (evt) {
      if (evt.key === `Escape`) {
        closeErrorMessage();
      }
    };

    let closeErrorMessageOnOutClick = function (evt) {
      evt.preventDefault();
      if (evt.target === errorBlock) {
        closeErrorMessage();
      }
    };

    let closeErrorMessage = function () {
      document.removeEventListener(`keydown`, handleKeyPressOnError);
      errorBlock.removeEventListener(`click`, closeErrorMessageOnOutClick);
      main.removeChild(errorBlock);
    };

    document.addEventListener(`keydown`, handleKeyPressOnError);
    errorBlock.addEventListener(`click`, closeErrorMessageOnOutClick);
    errorButton.addEventListener(`click`, closeErrorMessage);
  };

  // Обработчик на кнопку "Опубликовать" - отправка данных на сервер
  buttonSubmit.addEventListener(`click`, function (evt) {
    evt.preventDefault();
    let form = document.querySelector(`body > main > section.notice > form`);
    window.backend.postData(`https://js.dump.academy/keksobooking`, new window.FormData(form)
    ).then(function (response) {
      if (response) {
        // здесь обрабатываем json который вернул сервер (response)
        window.console.log(response);
        // todo передать в showSuccessMessage успешный response и отобразить
        showSuccessMessage();
      }
    });
  });

  window.form = {
    setFormFocus,
    setAddress,
    showSubmitError,
  };
})();
