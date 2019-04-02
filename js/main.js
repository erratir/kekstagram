/* global window: false */
/* Основной код программы */
(function () {
  /**
   * Запускаем загрузку данных с сервера. Если удачно, то генерируем 25 картинок на основе данных сервера.
   * Если нет, выводим сообщение об ошибке и генерируем 25 картинок на основе моковых данных (как было изначально)
   */
  window.backend.load(function (response) {
    window.data.ServerData = response;
    window.renderPictures(response);
  }, function (message) {
    window.console.log(message); // todo написать обработчик ошибок
    window.renderPictures();
  });

  let pictureUploader = new window.PictureUploader();
  pictureUploader.bindEvents();
  window.BigPictureRender.bindEvents();
})();
