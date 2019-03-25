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
        let li = window.utils.makeElement(`li`, `social__comment`);
        let imgAvatar = window.utils.makeElement(`img`, `social__picture`);
        imgAvatar.src = `img/avatar-${window.utils.getRandomInRange(window.data.DataPicture.MIN_AVATAR_NUM, window.data.DataPicture.MAX_AVATAR_NUM)}.svg`;
        let textComment = window.utils.makeElement(`p`, `social__text`);
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
})();
