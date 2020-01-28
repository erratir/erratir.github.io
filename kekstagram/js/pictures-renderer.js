/* global window, document: false */
(function () {
  let picturesList = document.querySelector(`.pictures`);
  let pictureTemplate = document.querySelector(`#picture`).content;
  let pictures = [];

  /**
   * Объект описывающий фильтры для изображений от других пользователей
   * @type {object}
   * Популярные — фотографии в изначальном порядке. -> Хотя я бы сделал по кол-ву лайков, но SRS 5.1.
   * Новые — 10 случайных, не повторяющихся фотографий.
   * Обсуждаемые — фотографии, отсортированные в порядке убывания количества комментариев
   */
  let imgFilters = {
    element: document.querySelector(`.img-filters`),
    buttonPopular: document.querySelector(`#filter-popular`),
    buttonNew: document.querySelector(`#filter-new`),
    buttonDiscussed: document.querySelector(`#filter-discussed`),
    showFilters() {
      this.element.classList.remove(`img-filters--inactive`);
    },
    hideFilters() {
      this.element.classList.add(`img-filters--inactive`);
    },
    sortImg(evt) {
      let sortArray = [...pictures]; // просто коппировать массив через `=` нельзя

      // удалим класс `.img-filters__button--active` у кнопки активной на данный момент
      this.element.querySelector(`.img-filters__button--active`).classList.remove(`img-filters__button--active`);

      if (evt.target.id === `filter-new`) { // 10 случайных, не повторяющихся фотографий
        sortArray = window.utils.shuffle(sortArray); // случайно перемешаем массив
        sortArray = sortArray.slice(0, 10); // возьмем 10 элемментов
      } else if (evt.target.id === `filter-discussed`) { // обсуждаемые — фотографии, отсортированные в порядке убывания количества комментариев
        sortArray = sortArray.sort(function (a, b) {
          return parseInt(b.commentsCount, 10) - parseInt(a.commentsCount, 10);
        });
      }

      // удалим все ранее сгенерированные картики
      while (picturesList.querySelector(`.picture`)) {
        picturesList.removeChild(picturesList.querySelector(`.picture`));
      }

      renderPictures(sortArray); // и отрисуем

      evt.target.classList.add(`img-filters__button--active`);
    },
    bindEvents() {
      if (this.__eventsBinded__) {
        return;
      }
      this.__eventsBinded__ = true;
      let $this = this;
      // обработчик на кнопки `популярные`, `новые`, `обсуждаемые` / с устранением дребезга - debounce
      this.element.addEventListener(`click`, function (evt) {
        window.debounce(function () {
          $this.sortImg(evt);
        }, 300);
      });
    },
  };

  /**
   * Функция генерирует массив случайных комментариев
   * @param {number} commentsCount
   * @return {Array}
   */
  function generateRandomComments(commentsCount) {
    let arrayResult = [];
    for (let i = 0; i < commentsCount; i++) {
      arrayResult.push(window.utils.getRandomElement(window.data.DataPicture.FOTO_COMMENTS));
    }
    return arrayResult;
  }

  /**
   * Функция-конструктор объекта Picture
   * @param {number} i
   * @constructor
   */
  function Picture(i) {
    this.id = i;
    this.url = `photos/${i + 1}.jpg`; // фотки начинаются с 1.jpg все массивы с нуля
    this.likes = window.utils.getRandomInRange(window.data.DataPicture.MIN_LIKES, window.data.DataPicture.MAX_LIKES); // cлучайное число от 15 до 200
    this.commentsCount = window.utils.getRandomInRange(window.data.DataPicture.MIN_COMMENTS, window.data.DataPicture.MAX_COMMENTS);
    this.comments = generateRandomComments(this.commentsCount);
    this.description = window.utils.getRandomElement(window.data.DataPicture.FOTO_DESCRIPTION);
  }

  /**
   * 2.  На основе данных, созданных в предыдущем пункте и шаблона #picture создайте DOM-элементы, соответствующие
   * фотографиям и заполните их данными из массива:
   *    Адрес изображения url подставьте как src изображения.
   *    Количество лайков likes подставьте как текстовое содержание элемента .picture__likes.
   *    Количество комментариев comments подставьте как текстовое содержание элемента .picture__comments.
   * @param {object} pic
   * @param {number} pic.id
   * @param {string} pic.url
   * @param {string} pic.likes
   * @param {string} pic.commentsCount
   * @return {Node}
   */
  function createCloneTemplate(pic) {
    let clonePictureTemplate = pictureTemplate.cloneNode(true);
    clonePictureTemplate.querySelector(`.picture__img`).src = pic.url;
    clonePictureTemplate.querySelector(`.picture__img`).dataset.id = pic.id.toString();
    clonePictureTemplate.querySelector(`.picture__likes`).textContent = pic.likes;
    clonePictureTemplate.querySelector(`.picture__comments`).textContent = pic.commentsCount;
    return clonePictureTemplate;
  }

  /**
   * Функция создает массив картинок
   * Если функцию вызвали с параметром, значит данные с сервера получены. Генерируем картинки на основе этих данных.
   * Иначе генерируем картинке на основе моковых данных
   * **
   * JSON массив data, передаваемый сервером отличается по структуре от того, что формировали на предыдущих занятиях.
   * Чтобы не переписывать код, просто с помощью map(),
   * добавим в каждый объект используемые в коде параметры id и comentsCount
   * @param {array} data - массив объектов в фомате JSON /не обязательный/
   */
  window.createPicturesArray = function (data) {

    if (data) {
      pictures = data.map(function (element, index) {
        element.id = index;
        element.commentsCount = element.comments.length;
        return element;
      });
    } else {
      for (let i = 0; i < window.data.DataPicture.COUNT; i++) {
        pictures.push(new Picture(i)); // Добавляем в массив вновь сгенерированную картинку
      }
    }
    renderPictures();
  };

  /**
   * Ф-я отриовывает сгенерированные DOM-элементы в блок .pictures. Для вставки элементов используйтся DocumentFragment.
   * @param {array} arr - массив объектов
   */
  let renderPictures = function (arr) {
    if (!arr) { // если вызвали функцию без параметров, то отображаем массив картинок в исходном варианте
      arr = pictures;
    }
    let fragment = document.createDocumentFragment(); // создаем фрагмент документа, который хранится в памяти

    arr.forEach(function (element) {
      fragment.appendChild(createCloneTemplate(element));
    });

    picturesList.appendChild(fragment); // Присоединяем фрагмент к основному дереву. В основном дереве фрагмент буден заменён собственными дочерними элементами.
    imgFilters.showFilters();
    imgFilters.bindEvents();
  };

  /**
   * Показ изображения в полноэкранном режиме
   * @param {Event} evt
   */
  let pictureClickHandler = function (evt) {
    let target = evt.target;

    if (target.className === `picture__img`) { // если кликнули по картинке, то рендерем BigPicture с таким ID

      window.BigPictureRender.show(pictures[target.dataset.id]);

    } else if (target.className === `picture__comments`) { // todo когда будем обрабатывать коменты

    } else if (target.className === `picture__likes`) { // todo когда будем обрабатывать лайки
    }

  };
  let pictureEnterPressHandler = function (evt) {
    if (evt.key === `Enter`) {
      let target = evt.target;

      if (target.firstElementChild && target.firstElementChild.className === `picture__img`) {
        // если кликнули по <a> ребенок которой - наша картинка, то рендерем BigPicture с таким ID
        window.BigPictureRender.show(pictures[target.firstElementChild.dataset.id]);
      }
    }
  };
  picturesList.addEventListener(`click`, pictureClickHandler);
  picturesList.addEventListener(`keydown`, pictureEnterPressHandler);
})();
