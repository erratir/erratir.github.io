/* global window, document: false */

/**
 * Модуль позволяет загружать аватарку и фотографии объявления
 */

/**
 * SRS: Доработайте форму подачи объявления так, чтобы в неё можно было загружать вашу аватарку и фотографии объявления.
 * Аватарка пользователя должна загружаться через поле загрузки файлов в блоке .ad-form__field
 * и показываться в блоке .ad-form-header__preview.
 * Фотографии жилья должны загружаться через поле загрузки файлов в блоке .ad-form__upload
 * и показываться в блоках .ad-form__photo. По желанию, вы можете сделать так,
 * чтобы фотографии жилья можно было сортировать с помощью перетаскивания (drag n drop API).
 */

(function () {

  /**
   * Загрузка автара
   */
  let uploadAvatar = document.querySelector(`.ad-form-header__input`);
  let previewAvatar = document.querySelector(`.ad-form-header__preview img`);

  uploadAvatar.addEventListener(`change`, function (evt) {
    evt.preventDefault();
    if (uploadAvatar.files.length > 0) {
      let file = uploadAvatar.files[0];
      if (!file.type.match(/image.*/)) {
        // cb(new Error(`FILE_NOT_IMAGE`));
        return;
      }
      previewAvatar.src = window.URL.createObjectURL(file);
    }
  });

  /**
   * Загрузка фотографий объявления
   * todo Огранитчить кол-во загружаемых изображений?
   */
  let photoUpload = document.querySelector(`.ad-form__upload input[type="file"]`);
  let photoContainer = document.querySelector(`.ad-form__photo-container`);

  photoUpload.addEventListener(`change`, function (evt) {
    evt.preventDefault();
    let fileList = evt.target.files;
    if (fileList.length > 0) {

      Array.from(fileList).forEach(function (file) {
        if (!file.type.match(/image.*/)) {
          // cb(new Error(`FILE_NOT_IMAGE`));
          return;
        }

        let div = document.createElement(`div`);
        div.classList.add(`ad-form__photo`);
        let img = document.createElement(`img`);
        img.src = window.URL.createObjectURL(file);
        img.classList.add(`ad-form__photo--element`);

        div.appendChild(img);
        photoContainer.appendChild(div);
      });
    }
  });
})();
