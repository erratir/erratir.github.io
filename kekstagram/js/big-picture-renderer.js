/* global window, document: false */
(function () {
  /**
   * 4. Покажите элемент .big-picture, удалив у него класс .hidden и заполните
   * его данными из первого элемента сгенерированного вами массива:
   *  - Адрес изображения url подставьте как src изображения внутри блока.big-picture__img.
   *  - Количество лайков likes подставьте как текстовое содержание элемента .likes-count.
   *  - Количество комментариев comments подставьте как текстовое содержание элемента .comments-count.
   *  - Список комментариев под фотографией: коментарии должны вставляться в блок .social__comments. Разметка каждого
   *  комментария должна выглядеть так:
   *  <li class="social__comment">
   *    <img class="social__picture" src="img/avatar-{{случайное число от 1 до 6}}.svg" alt="Аватар комментатора фотографии" width="35" height="35">
   *    <p class="social__text">{{текст комментария}}</p>
   *  </li>
   *  - Описание фотографии description вставьте строкой в блок .social__caption.
   *
   * @param {object} picture
   */
  window.BigPictureRender = {
    body: document.querySelector(`body`),
    element: document.querySelector(`.big-picture`),
    commentsList: document.querySelector(`.social__comments`),
    loadCommentsButton: document.querySelector(`.comments-loader`),
    commentCount: document.querySelector(`.social__comment-count`),
    renderPreview(picture) {
      this.element.querySelector(`.big-picture__img img`).src = picture.url;
      this.element.querySelector(`.social__header .social__caption`).textContent = picture.description;
      this.element.querySelector(`.likes-count`).textContent = picture.likes;
      this.element.querySelector(`.comments-count`).textContent = picture.commentsCount;
    },
    renderComments(picture) {
      let fragment = document.createDocumentFragment();

      // 2 первых комента прописанны в HTML | Удалим все <li>
      while (this.commentsList.firstChild) {
        this.commentsList.removeChild(this.commentsList.firstChild);
      }

      // генерим комеентарии к большой картинке вместо удаленных | можно как в проекте букинг было копировать
      for (let i = 0; i < picture.commentsCount; i++) {
        let li = window.utils.makeElement(`li`, `social__comment`);
        let imgAvatar = window.utils.makeElement(`img`, `social__picture`);
        let textComment = window.utils.makeElement(`p`, `social__text`);

        /**
         * Если данные получили с сервера, то берем их. (урл аватара и текст коммента)
         * Если же массив pictures формировали сами (в предыдущих заданиях из моковых данных),
         * то его структура несколько отличается. Генерим данные сами.
         * Т.е. добавлением || оставим 2 варианта кода
         */
        imgAvatar.src = (picture.comments[i].avatar) || (`img/avatar-${window.utils.getRandomInRange(window.data.DataPicture.MIN_AVATAR_NUM, window.data.DataPicture.MAX_AVATAR_NUM)}.svg`);
        textComment.textContent = picture.comments[i].message || picture.comments[i];
        li.appendChild(imgAvatar);
        li.appendChild(textComment);
        if (i > 4) { // Оставим только 5 комментов, остальные если их больше спрячем
          li.classList.add(`visually-hidden`);
          this.loadCommentsButton.classList.remove(`visually-hidden`); // покажем кнопку "загрузить еще"
          this.commentCount.classList.remove(`visually-hidden`); // покажем кол-во комментов
        }
        fragment.appendChild(li);
      }
      this.commentsList.appendChild(fragment);
    },
    show(picture) {
      this.renderPreview(picture);
      this.renderComments(picture);
      this.element.classList.remove(`hidden`); // показать элемент БольшаяКартинка
      this.body.classList.add(`modal-open`);
    },
    hide() {
      this.element.classList.add(`hidden`); // скрыть элемент БольшаяКартинка
      this.body.classList.remove(`modal-open`);
    },
    bindEvents() {
      let $this = this;
      if (this.__eventsBinded__) {
        return;
      }
      this.__eventsBinded__ = true;

      // обработчик на кнопку `крестик` / закрыть попап
      this.element.querySelector(`.big-picture__cancel`).addEventListener(`click`, function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $this.hide();
      });

      // обработчик на Esc / закрыть попап
      window.addEventListener(`keydown`, function (evt) {
        if (evt.key === `Escape`) {
          evt.preventDefault();

          $this.hide();
        }
      });

      // Обработчик на кнопку "загрузить еще" для комментариев
      this.loadCommentsButton.addEventListener(`click`, function () {
        let hiddenComments = Array.from($this.commentsList.getElementsByClassName(`visually-hidden`));
        hiddenComments.forEach(function (element) {
          element.classList.remove(`visually-hidden`); // показать скрытые коменты
          $this.loadCommentsButton.classList.add(`visually-hidden`); // скрыть кнопку "загрузить еще"
          $this.commentCount.classList.add(`visually-hidden`); // скрыть счетчик комментариев
        });
      });
    }
  };
})();
