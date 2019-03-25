/* global window: false */
/* Основной код программы */
(function () {
  window.renderPictures();
  let pictureUploader = new window.PictureUploader();
  pictureUploader.bindEvents();
  window.BigPictureRender.bindEvents();
})();
