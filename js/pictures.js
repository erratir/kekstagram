/* global window, document: false */
let DataPicture = {
  COUNT: 25,
  MIN_LIKES: 15,
  MAX_LIKES: 200,
  MIN_COMMENTS: 0,
  MAX_COMMENTS: 5,
  FOTO_COMMENTS: [`That's great!`, `Cool photo!`, `great shot`, `Great photo, bravo!`, `I am mesmerized by this photo..`, `Awesome Image`, `Epic photo`, `That pic is wonderful!`, `Want more such photo!`, `Nice one!`],
  FOTO_DESCRIPTION: [`Testing a new camera`, `Please rate the photo`, `in holiday`, `enjoy =)`, `Treasure the moments, for the immortal gods have given you the Greatest Gift of All, and it will be a sweet, sad memory till your dying day`, `caught a good shot`],
  MIN_AVATAR_NUM: 1,
  MAX_AVATAR_NUM: 6,
};

let picturesList = document.querySelector(`.pictures`);
let pictureTemplate = document.querySelector(`#picture`).content;
let bigPicture = document.querySelector(`.big-picture`);
let commentsList = bigPicture.querySelector(`.social__comments`);
let pictures = [];

/**
 * Функция-конструктор объекта Picture
 * @param {number} i
 * @constructor
 */
function Picture(i) {
  this.url = `photos/${i}.jpg`;
  // cлучайное число от 15 до 200
  this.likes = getRandomInRange(DataPicture.MIN_LIKES, DataPicture.MAX_LIKES);
  this.commentsCount = getRandomInRange(DataPicture.MIN_COMMENTS, DataPicture.MAX_COMMENTS);
  this.comments = generateRandomComments(this.commentsCount);
  this.description = getRandomElement(DataPicture.FOTO_DESCRIPTION);
}

/**
 * Функция возвращает случайное целое число между min и max, включая min, max как возможные значения
 * https://learn.javascript.ru/task/random-int-min-max
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function getRandomInRange(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

/**
 * Функция, возвращает случайный элемемент массива
 * https://learn.javascript.ru/array
 * @param {array} array
 * @return {*}
 */
function getRandomElement(array) {
  let randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * Функция генерирует массив случайных комментариев
 * @param {number} commentsCount
 * @return {Array}
 */
function generateRandomComments(commentsCount) {
  let arrayResult = [];
  for (let i = 0; i < commentsCount; i++) {
    arrayResult.push(getRandomElement(DataPicture.FOTO_COMMENTS));
  }
  return arrayResult;
}

/**
 * 2.  На основе данных, созданных в предыдущем пункте и шаблона #picture создайте DOM-элементы, соответствующие
 * фотографиям и заполните их данными из массива:
 *    Адрес изображения url подставьте как src изображения.
 *    Количество лайков likes подставьте как текстовое содержание элемента .picture__likes.
 *    Количество комментариев comments подставьте как текстовое содержание элемента .picture__comments.
 * @param {object} pic
 * @param {string} pic.url
 * @param {string} pic.likes
 * @param {string} pic.commentsCount
 * @return {Node}
 */
function createCloneTemplate(pic) {
  let clonePictureTemplate = pictureTemplate.cloneNode(true);
  clonePictureTemplate.querySelector(`.picture__img`).src = pic.url;
  clonePictureTemplate.querySelector(`.picture__likes`).textContent = pic.likes;
  clonePictureTemplate.querySelector(`.picture__comments`).textContent = pic.commentsCount;
  return clonePictureTemplate;
}

/**
 * 3. Отрисуйте сгенерированные DOM-элементы в блок .pictures. Для вставки элементов используйте DocumentFragment.
 */
function renderPicture() {
  let fragment = document.createDocumentFragment(); // создаем фрагмент документа, который хранится в памяти

  //  добавляем детей в фрагмент документа
  for (let i = 0; i < DataPicture.COUNT; i++) {
    fragment.appendChild(createCloneTemplate(pictures[i]));
  }
  // picturesList.appendChild(document.createTextNode(`test text TEST`));
  picturesList.appendChild(fragment); // Присоединяем фрагмент к основному дереву. В основном дереве фрагмент буден заменён собственными дочерними элементами.

}

/**
 * Функция создает HTML элемент, по переданным tagName и className
 * @param {string} tagName
 * @param {string} className
 * @return {HTMLElement}
 */
let makeElement = function (tagName, className) {
  let element = document.createElement(tagName);
  element.classList.add(className);
  return element;
};

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
function renderBigPicture(picture) {
  let fragment = document.createDocumentFragment();
  bigPicture.classList.remove(`hidden`);
  bigPicture.querySelector(`.big-picture__img img`).src = picture.url;
  bigPicture.querySelector(`.social__header .social__caption`).textContent = picture.description;
  bigPicture.querySelector(`.likes-count`).textContent = picture.likes;
  bigPicture.querySelector(`.comments-count`).textContent = picture.commentsCount;

  // 2 первых комента прописанны в HTML | Удалим все <li>
  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }

  // генерим комеентарии к большой картинке вместо удаленных | можно как в проекте букинг было копировать
  for (let i = 0; i < picture.commentsCount; i++) {
    let li = makeElement(`li`, `social__comment`);
    let imgAvatar = makeElement(`img`, `social__picture`);
    imgAvatar.src = `img/avatar-${getRandomInRange(DataPicture.MIN_AVATAR_NUM, DataPicture.MAX_AVATAR_NUM)}.svg`;
    let textComment = makeElement(`p`, `social__text`);
    textComment.textContent = picture.comments[i];
    li.appendChild(imgAvatar);
    li.appendChild(textComment);
    fragment.appendChild(li);
  }
  commentsList.appendChild(fragment);
  hideElement();
}

/**
 * 5.  Спрячьте блоки счётчика комментариев .social__comment-count и загрузки
 новых комментариев .comments-loader, добавив им класс .visually-
 hidden.
 */
function hideElement() {
  bigPicture.querySelector(`.social__comment-count`).classList.add(`visually-hidden`);
  bigPicture.querySelector(`.comments-loader`).classList.add(`visually-hidden`);
}

/**
 * --------------------------------------------- module4-task1 ---------------------------------------------
 */

/**
 *  Класс описывает редактор загружаемых изображений
 *  */
let PictureUploader = function PictureUploader() {
  this.element = document.querySelector(`.img-upload`);
  this.uploadOverlay = this.element.querySelector(`.img-upload__overlay`);
  this.uploadOverlayHideButton = this.element.querySelector(`.img-upload__cancel`);
  this.inputFile = this.element.querySelector(`#upload-file`);
  this.picture = this.element.querySelector(`.img-upload__preview img`);

};

/**
 * Показать редактора загружаемых изображений
 */
PictureUploader.prototype.show = function () {
  this.uploadOverlay.classList.remove(`hidden`);
};

/**
 * Скрыть редактор загружаемых изображений
 */
PictureUploader.prototype.hide = function () {
  this.uploadOverlay.classList.add(`hidden`);
  this.inputFile.value = ``;
};

/**
 * Загружает изображение из файла в виде base64
 * @param {File} file файл с изображением
 * @param {Function} cb callback(err, base64image)
 */
PictureUploader.prototype.loadImage = function (file, cb) {
  if (file.type.indexOf(`image/`) !== 0) {
    cb(new Error(`FILE_NOT_IMAGE`));
    return;
  }

  cb(null, window.URL.createObjectURL(file));
};

/**
 * Объявляем функции обработчиков событий
 */
PictureUploader.prototype.bindEvents = function () {
  if (this.__eventsBinded__) {
    return;
  }
  this.__eventsBinded__ = true;

  this.bindPopupEvents();
};

/**
 * Обработчики событий Popup окна
 */
PictureUploader.prototype.bindPopupEvents = function () {
  let $this = this;
  // Открываем попап
  this.inputFile.addEventListener(`change`, function (evt) {
    evt.preventDefault();
    if ($this.inputFile.files.length > 0) {
      $this.loadImage($this.inputFile.files[0], function (err, imgURL) {
        if (err) {
          // TODO: show error
          return;
        }
        $this.picture.src = imgURL;
        $this.show();
      });
    }
  });

  // Закрываем попап
  this.uploadOverlayHideButton.addEventListener(`click`, function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    $this.hide();
  });

  // Закрываем попап
  window.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      $this.hide();
    }
  });
};

/*
 * Основной код программы
 */
for (let i = 1; i <= DataPicture.COUNT; i++) {
  pictures.push(new Picture(i));
}
renderPicture();
// renderBigPicture(pictures[0]);
let pictureUploader = new PictureUploader();
pictureUploader.bindEvents();
