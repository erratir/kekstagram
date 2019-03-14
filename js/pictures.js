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
let pictures = [];

/**
 * Функция-конструктор объекта Picture
 * @param {number} i
 * @constructor
 */
function Picture(i) {
  this.id = i - 1;
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
 * 3. Отрисуйте сгенерированные DOM-элементы в блок .pictures. Для вставки элементов используйте DocumentFragment.
 */
function renderPicture() {
  let fragment = document.createDocumentFragment(); // создаем фрагмент документа, который хранится в памяти

  //  добавляем детей в фрагмент документа
  for (let i = 0; i < DataPicture.COUNT; i++) {
    fragment.appendChild(createCloneTemplate(pictures[i]));
  }
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
 * Объект - попап с большой картинкой, коментами, лайками и т.д.
 * @type {{}}
 */
let BigPictureRender = {
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
  element: document.querySelector(`.big-picture`),

  renderPreview(picture) {
    this.element.querySelector(`.big-picture__img img`).src = picture.url;
    this.element.querySelector(`.social__header .social__caption`).textContent = picture.description;
    this.element.querySelector(`.likes-count`).textContent = picture.likes;
    this.element.querySelector(`.comments-count`).textContent = picture.commentsCount;

    /**
     * 5.  Спрячьте блоки счётчика комментариев .social__comment-count и загрузки
     новых комментариев .comments-loader, добавив им класс .visually-
     hidden.
     */
    this.element.querySelector(`.social__comment-count`).classList.add(`visually-hidden`);
    this.element.querySelector(`.comments-loader`).classList.add(`visually-hidden`);
  },

  renderComments(picture) {
    let fragment = document.createDocumentFragment();
    let commentsList = this.element.querySelector(`.social__comments`);
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
  },

  show(picture) {
    this.renderPreview(picture);
    this.renderComments(picture);
    this.element.classList.remove(`hidden`);
  },

  hide() {
    this.element.classList.add(`hidden`);
  },
  bindEvents() {
    let $this = this;
    if (this.__eventsBinded__) {
      return;
    }
    this.__eventsBinded__ = true;

    this.element.querySelector(`.big-picture__cancel`).addEventListener(`click`, function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      $this.hide();
    });

    window.addEventListener(`keydown`, function (evt) {
      if (evt.key === `Escape`) {
        evt.preventDefault();

        $this.hide();
      }
    });
  }
};

/**
 * --------------------------------------------- module4-task1 ---------------------------------------------
 */

/**
 *  Класс конструктор описывает редактор загружаемых изображений
 *  */
let PictureUploader = function () {
  this.element = document.querySelector(`.img-upload`);
  this.uploadOverlay = this.element.querySelector(`.img-upload__overlay`);
  this.uploadOverlayHideButton = this.element.querySelector(`.img-upload__cancel`);
  this.inputFile = this.element.querySelector(`#upload-file`);
  this.picture = this.element.querySelector(`.img-upload__preview img`);

  this.slider = this.element.querySelector(`.img-upload__effect-level`);
  this.effectLevelPin = this.element.querySelector(`.effect-level__pin`);
  this.effectLevelLine = this.element.querySelector(`.effect-level__line`);
  this.effectLevel = this.element.querySelector(`.effect-level__value`);
  this.effectsList = this.element.querySelector(`.effects__list`);

};

/**
 * Объект описывает применяемые CSS фильтры
 * @type {{chrome: {CSS_NAME: string, MIN_VALUE: number, MAX_VALUE: number, UNIT: string}, sepia: {CSS_NAME: string, MIN_VALUE: number, MAX_VALUE: number, UNIT: string}, marvin: {CSS_NAME: string, MIN_VALUE: number, MAX_VALUE: number, UNIT: string}, phobos: {CSS_NAME: string, MIN_VALUE: number, MAX_VALUE: number, UNIT: string}, heat: {CSS_NAME: string, MIN_VALUE: number, MAX_VALUE: number, UNIT: string}}}
 */
PictureUploader.prototype.cssFilter = {
  chrome: {
    CSS_NAME: `grayscale`,
    MIN_VALUE: 0,
    MAX_VALUE: 1,
    UNIT: ``,
  },
  sepia: {
    CSS_NAME: `sepia`,
    MIN_VALUE: 0,
    MAX_VALUE: 1,
    UNIT: ``,
  },
  marvin: {
    CSS_NAME: `invert`,
    MIN_VALUE: 0,
    MAX_VALUE: 100,
    UNIT: `%`,
  },
  phobos: {
    CSS_NAME: `blur`,
    MIN_VALUE: 0,
    MAX_VALUE: 3,
    UNIT: `px`,
  },
  heat: {
    CSS_NAME: `brightness`,
    MIN_VALUE: 0,
    MAX_VALUE: 3,
    UNIT: ``,
  }
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
  this.picture.src = `img/upload-default-image.jpg`; // вернем картинку по умаолчанию
  this.picture.removeAttribute(`class`); // сбросим примененные ранее эфекты
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
  this.bindEffectEvents();
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

/**
 * Функция isCheck возвращает чекнутый радиобаттон (type="radio")
 * @param {string} name
 * @return {Element}
 */
PictureUploader.prototype.isCheck = function (name) {
  return this.uploadOverlay.querySelector(`input[name="${name}"]:checked`);
};

/**
 * Устанавливает выбранный эффект для загружаемого изображения (присваивая соответсвующий класс)
 */
PictureUploader.prototype.setEffect = function () {
  this.effect = this.isCheck(`effect`);
  this.picture.className = `effects__preview--${this.effect.value}`;
  this.effectLevel.setAttribute(`value`, `20`); // при переключении эффекта сбросить значение в соответсвующем инпуте
  this.picture.removeAttribute(`style`); // при переключении эффекта сбросить CSS фильтры у картинки
  // ТЗ: При выборе эффекта «Оригинал» слайдер скрывается.
  if (this.effect.value === `none`) {
    this.slider.classList.add(`hidden`);
  } else {
    this.slider.classList.remove(`hidden`);
  }
};

/**
 * Вычисляет уровень эффекта, в зависимости от положения ползунка на линии
 * И изменяет его значение по умолчанию (name="effect-level" value="20")
 */
PictureUploader.prototype.effectLevelCalculate = function () {
  let maxValue = this.effectLevelLine.offsetWidth;
  let value = this.effectLevelPin.offsetLeft; // возвращает смещение в пикселях верхнего левого угла текущего элемента от родительского HTMLElement.offsetParent узла
  this.effectLevelValue = Math.round(100 * value / maxValue);
  this.effectLevel.setAttribute(`value`, `${this.effectLevelValue}`);
  // Нужно получить выражение вида: this.picture.style.filter = `grayscale(0.4)`
  if (this.effect.value !== `none`) { // effect-none
    let cssFilterName = this.cssFilter[`${this.effect.value}`].CSS_NAME;
    // this.effectLevelValue - у нас в процентах. Соответсыенно чтобы получить заданное значение фильтра: МаксЗначение фильтра * x% / 100
    let cssFilterValue = this.cssFilter[`${this.effect.value}`].MAX_VALUE * this.effectLevelValue / 100;
    let cssUnit = this.cssFilter[`${this.effect.value}`].UNIT;
    this.picture.style.filter = `${cssFilterName}(${cssFilterValue}${cssUnit})`;
  }

};

/**
 * Обработчики событий кнопок применения эффектов
 */
PictureUploader.prototype.bindEffectEvents = function () {
  let $this = this;
  // При отпускании ползунка, записываем значение уровня насыщенности в соответствующий input
  this.effectLevelPin.addEventListener(`mouseup`, function (evt) {
    evt.preventDefault();
    $this.effectLevelCalculate();
  });

  // При клике по предпросмотру эффекта, применяем к картинке соответствующий
  this.effectsList.addEventListener(`click`, function () {
    $this.setEffect();
  });
};

/*
 * Основной код программы
 */
(function () {
  for (let i = 1; i <= DataPicture.COUNT; i++) {
    pictures.push(new Picture(i));
  }
  renderPicture();
  let pictureUploader = new PictureUploader();
  pictureUploader.bindEvents();
  BigPictureRender.bindEvents();


  /**
   *  Показ изображения в полноэкранном режиме
   */

  let pictureClickHandler = function (evt) {
    let target = evt.target;

    if (target.className === `picture__img`) { // если кликнули по картинке, то рендерем BigPicture с таким ID

      BigPictureRender.show(pictures[target.dataset.id]);

    } else if (target.className === `picture__comments`) { // todo когда будем обрабатывать коменты

    } else if (target.className === `picture__likes`) { // todo когда будем обрабатывать лайки
    }

  };
  let pictureEnterPressHandler = function (evt) {
    if (evt.key === `Enter`) {
      let target = evt.target;

      if (target.firstElementChild && target.firstElementChild.className === `picture__img`) {
        // если кликнули по <a> ребенок которой - наша картинка, то рендерем BigPicture с таким ID
        BigPictureRender.show(pictures[target.firstElementChild.dataset.id]);
      }
    }
  };
  picturesList.addEventListener(`click`, pictureClickHandler);
  picturesList.addEventListener(`keydown`, pictureEnterPressHandler);

})();
