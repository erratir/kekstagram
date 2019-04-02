/* global window, document: false */
(function () {
  let picturesList = document.querySelector(`.pictures`);
  let pictureTemplate = document.querySelector(`#picture`).content;
  let pictures = [];

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
   * Ф-я отриовывает сгенерированные DOM-элементы в блок .pictures. Для вставки элементов используйтся DocumentFragment.
   * Если функцию вызвали с параметром, значит данные с сервера получены. Генерируем картинки на основе этих данных.
   * Иначе генерируем картинке на основе моковых данных
   * **
   * JSON массив data, передаваемый сервером отличается по структуре от того, что формировали на предыдущих занятиях.
   * Чтобы не переписывать код, просто с помощью map(),
   * добавим в каждый объект используемые в коде параметры id и comentsCount
   * @param {JSON} data не обязательный
   */
  window.renderPictures = function (data) {
    let fragment = document.createDocumentFragment(); // создаем фрагмент документа, который хранится в памяти

    if (data) {
      pictures = data.map(function (element, index) {
        element.id = index;
        element.commentsCount = element.comments.length;
        fragment.appendChild(createCloneTemplate(element)); //  добавляем детей в фрагмент документа
        return element;
      });
    } else {
      for (let i = 0; i < window.data.DataPicture.COUNT; i++) {
        pictures.push(new Picture(i)); // Добавляем в массив вновь сгенерированную картинку
        fragment.appendChild(createCloneTemplate(pictures[i])); //  добавляем детей в фрагмент документа
      }
    }
    picturesList.appendChild(fragment); // Присоединяем фрагмент к основному дереву. В основном дереве фрагмент буден заменён собственными дочерними элементами.
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
