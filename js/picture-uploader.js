/* global window, document: false */

/**
 * --------------------------------------------- module4-task1 ---------------------------------------------
 */
(function () {
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
    this.effectLevelDepth = this.element.querySelector(`.effect-level__depth`);
    this.effectLevel = this.element.querySelector(`.effect-level__value`);
    this.effectsList = this.element.querySelector(`.effects__list`);

    this.buttonScaleSmaller = this.element.querySelector(`.scale__control--smaller`);
    this.buttonScaleBigger = this.element.querySelector(`.scale__control--bigger`);
    this.scaleControlInput = this.element.querySelector(`.scale__control--value`);
    this.hashtagsInput = this.element.querySelector(`.text__hashtags`);
    this.pictureDescription = this.element.querySelector(`.text__description`);
    this.EFFECT_DEFAULT_LEVEL_VALUE = 20; // значение по умолчанию - уровень эффекта
    this.effectLevelValue = this.EFFECT_DEFAULT_LEVEL_VALUE; // значение по умолчанию - уровень эффекта
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
    this.slider.classList.add(`hidden`); // скрыть слайдер при первоначальной загрузке
  };

  /**
   * Скрыть редактор загружаемых изображений
   */
  PictureUploader.prototype.hide = function () {
    this.uploadOverlay.classList.add(`hidden`);
    this.inputFile.value = ``;
    this.picture.src = `img/upload-default-image.jpg`; // вернем картинку по умаолчанию
    this.picture.removeAttribute(`class`); // сбросим примененные ранее эфекты
    this.scaleControlInput.setAttribute(`value`, `100%`); // сбросить значение масштаба в инпут
    this.picture.removeAttribute(`style`); // сбросить применный  ранее масштаб
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
    this.bindResizeEvents();
    this.validateForm();
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

    /**
     * Закрываем попап. Если фокус находится в поле ввода хэш-тега (или в поле ввода комментария),
     * нажатие на Esc не должно приводить к закрытию формы редактирования изображения.
     */
    window.addEventListener(`keydown`, function (evt) {
      if (evt.key === `Escape` &&
        $this.hashtagsInput !== document.activeElement &&
        $this.pictureDescription !== document.activeElement) {
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
    this.effectLevel.setAttribute(`value`, `${this.EFFECT_DEFAULT_LEVEL_VALUE}`); // при переключении эффекта сбросить значение в соответсвующем инпуте
    this.picture.removeAttribute(`style`); // при переключении эффекта сбросить CSS фильтры у картинки
    this.effectLevelPin.removeAttribute(`style`); // при переключении эффекта сбросить CSS фильтры у пина слайдера
    this.effectLevelDepth.removeAttribute(`style`); // при переключении эффекта сбросить CSS фильтры у полоски заполнения слайдера
    this.scaleControlInput.setAttribute(`value`, `100%`); // при переключении эффекта сбросить значение масштаба в инпут

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
  PictureUploader.prototype.setEffectLevel = function () {
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

    //  Только при вызове обработчика mousedown - обработчики mousemove и mouseup должны добавляться
    this.effectLevelPin.addEventListener(`mousedown`, function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      let dragged = false;

      let sliderLeftCoordX = $this.effectLevelLine.getBoundingClientRect().left;
      let sliderWidth = $this.effectLevelLine.getBoundingClientRect().width;

      let onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        dragged = true;

        // текущая координата X мышки (пина при перетаскивании) относительно левой кординаты X полоски слайдера
        let newCoordX = moveEvt.clientX - sliderLeftCoordX;

        // Процентное соотношение положения мышки по X (пина при перетаскивании) относительно общей ширины слайдера
        $this.effectLevelValue = Math.round(100 * newCoordX / sliderWidth);

        if ($this.effectLevelValue < 0) {
          $this.effectLevelValue = 0;
        } else if ($this.effectLevelValue > 100) {
          $this.effectLevelValue = 100;
        }
        $this.effectLevelPin.style.left = `${$this.effectLevelValue}%`; // сместить ползунок на текущие расчетные координаты
        $this.effectLevelDepth.style.width = `${$this.effectLevelValue}%`; // установить ширину полоски заполнения слайдера
      };

      let onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener(`mousemove`, onMouseMove);
        document.removeEventListener(`mouseup`, onMouseUp);

        if (dragged) {
          $this.setEffectLevel();
        }
      };

      // Обработчик mousemove должен запускать логику изменения положения пина
      document.addEventListener(`mousemove`, onMouseMove);
      // При отпускании ползунка, записываем значение уровня насыщенности в соответствующий input
      document.addEventListener(`mouseup`, onMouseUp);

    });

    // При клике по предпросмотру эффекта, применяем к картинке соответствующий
    this.effectsList.addEventListener(`click`, function () {
      $this.setEffect();
    });
  };

  /**
   * Изменяет размер загружаемого изображения
   * @param {HTMLElement} button
   */
  PictureUploader.prototype.resize = function (button) {
    let Scale = {
      STEP: 25,
      MIN: 25,
      MAX: 100,
    };

    this.scaleControlInput = this.element.querySelector(`.scale__control--value`);
    this.scaleControlValue = parseInt(this.scaleControlInput.getAttribute(`value`), 10);

    if (button === this.buttonScaleSmaller && this.scaleControlValue > Scale.MIN) {
      this.scaleControlValue -= Scale.STEP;
    } else if (button === this.buttonScaleBigger && this.scaleControlValue < Scale.MAX) {
      this.scaleControlValue += Scale.STEP;
    }

    this.scaleControlInput.setAttribute(`value`, `${this.scaleControlValue}`);
    this.picture.style.transform = `scale(${this.scaleControlValue / 100})`;

  };

  /**
   * Обработчики событий для кнопок изменения размера изображения
   */
  PictureUploader.prototype.bindResizeEvents = function () {
    let $this = this;
    this.buttonScaleSmaller.addEventListener(`click`, function () {
      $this.resize($this.buttonScaleSmaller);
    });
    this.buttonScaleBigger.addEventListener(`click`, function () {
      $this.resize($this.buttonScaleBigger);
    });
  };

  /**
   * ----------- module4-task2:  Валидация полей формы попапа `img-upload` / хэш-теги  -----------------
   */
  PictureUploader.prototype.validateForm = function () {
    let $this = this;

    this.customValidation = function (evt) {
      evt.target.setCustomValidity(``);
      let str = evt.target.value;
      str = str.toLowerCase(); // SRS теги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом.
      let arr = str.split(` `);

      if (window.utils.returnUniqueArray(arr).length === arr.length) { // проверка массива на уникальность и сравнение длинны с исходным массивом
        if (arr.length > 5) {
          evt.target.setCustomValidity(`Нельзя указать больше пяти хэш-тегов`);
        } else {
          arr.forEach(function (element) {

            if (element.length >= 20) {
              evt.target.setCustomValidity(`Хеш-тег должен быть короче 20 символов`);

            } else if (element.indexOf(`#`) !== 0) {
              evt.target.setCustomValidity(`Хеш-тег должен начинаться с символа #`);

            } else if (element.length < 2) {
              evt.target.setCustomValidity(`Хеш-тег не может состоять только из одной решётки`);

            }
          });
        }
      } else {
        evt.target.setCustomValidity(`Один и тот же хэш-тег не может быть использован дважды`);
      }
    };

    $this.hashtagsInput.addEventListener(`input`, this.customValidation);

  };

  window.PictureUploader = PictureUploader;
})();

