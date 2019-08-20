
$(document).ready(() => {
    // ====================
    // VUE приложение
    // ====================

    let currentURL = window.location.search;
    let currentIdPage = qs.parse(currentURL, { ignoreQueryPrefix: true });

    if (!currentURL.match(/^\?id=/ig)) {
        window.location.search = '?id=0';
    }

    const currentOriginOrl = window.location.origin;

    const data_json_default = {
        pageTitle: "Таймер",
        heading: "Загрузка...",
        preHeading: "",
        description: "",
        finishDate: "",
        imageSrcBackground: "",
        color_i: 172,
        buttonText: "Пожалуйста подождите",
        buttonHref: "",
    }

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAPq6A0sDX_unr33Qy8aqrAbvo2ErIRHDs",
        authDomain: "timer-ba52d.firebaseapp.com",
        databaseURL: "https://timer-ba52d.firebaseio.com",
        projectId: "timer-ba52d",
        storageBucket: "timer-ba52d.appspot.com",
        messagingSenderId: "448597589119",
        appId: "1:448597589119:web:1bb480c0904707ea"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();


    function isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }

    // VUE app
    var appLanding = new Vue({
        el: '#landing-app',
        data: {
            // Состояния приложения
            stateApp: {
                preLoadingApp: true,
            },

            createTimerShow: false, // состояние редактирования
            weHaveModificateTimer: false, // состояние с новыми данными
            weAlreadyHaveChanges: false, // состояние когда хотя бы раз применяли изменения

            // Классы
            vueAppClass: '',
            vueBackClass: 'hide',
            vueShareClass: '',
            vueCircleClass: '',
            vueButtonClass: '',
            vueClockClass: '',
            vuePreHeadingClass: '',
            vueHeadingClass: '',
            vueDescriptionTextClass: '',
            descriptionPanel: 'hide',
            vueAcceptEditDescription: 'class',

            // Стили
            styleApp: '',

            // Фото
            imageSrcBackground: '',

            stateWasModified: false, // было ло ли изменено состояние

            stateEditPreHeading: false, // изменяется ли под-Заголовок
            stateEditHeading: false, // изменяется ли Заголовок
            stateEditDescriptionText: false, // изменяется ли Описание
            stateEditClock: false, // изменяются ли часы
            stateEditButton: false, // изменяют ли кнопку?

            wallpaperSideBarOpen: false, // Открыт ли сайд бар для фона

            headingMessage: '', // текст заголовка
            lastEditHeadingMessage: '',
            oldHeadingMessage: '', // ячейка для сохранения предыдущего текста
            newHeadingMessage: '', // ячейка для нового текста

            descriptionTextMessage: '', // текст описания
            lastEditDescriptionTextMessage: '', // описание предыдущего сохранения
            oldDescriptionTextMessage: '', // ячейка для сохранения предыдущего описания во время редактирования
            newDescriptionTextMessage: '', // ячейка для нового описания

            preHeadingMessage: '', // текст пред Заголовка
            lastEditPreHeadingMessage: '',
            oldPreHeadingMessage: '', // ячейка для сохранения предыдущего пред Заголовка
            newPreHeadingMessage: '', // ячейка для нового пред Заголовка

            flowerButton: {
                text: 'Подать заявку', // текст описания
                lastEditText: '', // описание предыдущего сохранения
                oldText: '', // ячейка для сохранения предыдущего описания во время редактирования
                newText: '', // ячейка для нового описания
                link: '', // текст описания
                lastEditLink: '', // описание предыдущего сохранения
                oldLink: '', // ячейка для сохранения предыдущего описания во время редактирования
                newLink: '', // ячейка для нового описания
                textInputError: false,
                linkInputError: false,
            },

            // Таймер =================
            finishDate: '', // (year, month, date, hours, minutes, seconds, ms)
            monthName: '',

            interval: "",
            intervalInit: "",
            cl_month: '',
            cl_days: '',
            cl_hours: '',
            cl_minutes: '',
            cl_seconds: '',
            cl_days_title: '',

            clockDateInputError: false,
            clockTimeInputError: false,

            // Выбор цвета =======
            color_i: 0,

            // оповещение публикации
            alertIsOpen: false,
        },
        methods: {
            // запускаем таймер
            startTimer() {
                this.intervalInit = this.clockFunc();
                this.interval = setInterval(() => {
                    this.clockFunc();
                }, 1000);
            },

            // Включаем тему редоктирования
            createTimer() {
                this.createTimerShow = !this.createTimerShow;

                if (this.createTimerShow) {
                    this.vueAppClass = 'modification';
                    this.vueBackClass = 'fade';
                    this.vueShareClass = 'hide';
                    this.vueCircleClass = 'fade';
                    this.vueButtonClass = 'editable'; // "editable edited"
                    this.vueClockClass = 'editable'; // "editable edited"
                    this.vuePreHeadingClass = 'editable'; // "editable edited"
                    this.vueHeadingClass = 'editable'; // "editable edited"
                    this.vueDescriptionTextClass = 'editable';
                    this.descriptionPanel = '';

                    this.lastEditHeadingMessage = this.headingMessage;
                    this.lastEditDescriptionTextMessage = this.descriptionTextMessage;
                    this.lastEditPreHeadingMessage = this.preHeadingMessage;
                    this.flowerButton.lastEditText = this.flowerButton.text;
                    this.flowerButton.lastEditLink = this.flowerButton.link;

                    this.weHaveModificateTimer = false; // Включаем состояние модифицированного приложения

                }
                // Клик по Отмене редактирования
                else {
                    this.vueAppClass = '';
                    this.vueBackClass = '';
                    this.vueShareClass = '';
                    this.vueCircleClass = '';
                    this.vueButtonClass = '';
                    this.vueClockClass = '';
                    this.vuePreHeadingClass = '';
                    this.vueHeadingClass = '';
                    this.vueDescriptionTextClass = '';
                    this.descriptionPanel = 'hide';
                    this.preHeadingMessage = this.lastEditPreHeadingMessage;
                    this.headingMessage = this.lastEditHeadingMessage;
                    this.descriptionTextMessage = this.lastEditDescriptionTextMessage;
                    this.flowerButton.text = this.flowerButton.lastEditText;
                    this.flowerButton.link = this.flowerButton.lastEditLink;
                    this.stateEditClock = false; // off состояние редактирования даты
                    this.stateEditButton = false;
                    this.wallpaperSideBarOpen = false;
                    this.stateWasModified = false; //выключаем состояние "в редактировании"
                    if (this.weAlreadyHaveChanges) {
                        this.weHaveModificateTimer = true; // Включаем состояние модифицированного приложения
                    }
                }
            },

            // Применяем изменения Приложения
            acceptCreateTimer() {
                this.createTimerShow = !this.createTimerShow; // меняем состояния редактирования
                // убиваем классы редактирования
                this.vueAppClass = '';
                this.vueBackClass = '';
                this.vueShareClass = '';
                this.vueCircleClass = '';
                this.vueButtonClass = '';
                this.vueClockClass = '';
                this.vuePreHeadingClass = '';
                this.vueHeadingClass = '';
                this.vueDescriptionTextClass = '';

                this.stateWasModified = false; // Выключаем состояние "в редактировании"
                this.weHaveModificateTimer = true; // Включаем состояние модифицированного приложения
                this.weAlreadyHaveChanges = true;

                this.wallpaperSideBarOpen = false;
            },

            // Изменяем часы (ставим новую дату)
            editClock() {
                if (this.createTimerShow) {
                    this.stateEditClock = true; // включаем состояние редактирования даты
                    this.vueClockClass = 'editable editing';
                }
            },
            cancelEditClock() {
                setTimeout(() => { // таймаут для удаления самого себя
                    this.stateEditClock = false; // off состояние редактирования даты
                    this.vueClockClass = 'editable';
                    this.clockDateInputError = false;
                    this.clockTimeInputError = false;
                }, 100);
            },
            acceptEditClock() {
                let $clockInputDate = this.$refs.elClockInputDate;
                let $clockInputTime = this.$refs.elClockInputTime;

                // Проверка. Ввели-ли мы значения?
                if ($clockInputDate.value == '' && $clockInputTime.value == '') {
                    this.clockDateInputError = true;
                    this.clockTimeInputError = true;
                } else if ($clockInputDate.value == '') {
                    this.clockDateInputError = true;
                    this.clockTimeInputError = false;
                } else if ($clockInputTime.value == '') {
                    this.clockTimeInputError = true;
                    this.clockDateInputError = false;
                } else {
                    this.clockDateInputError = false;
                    this.clockTimeInputError = false;

                    let clockDateImputYear = Number($clockInputDate.value.split('-')[0]);
                    let clockDateImputMouth = Number($clockInputDate.value.split('-')[1]) - 1;
                    let clockDateImputDay = Number($clockInputDate.value.split('-')[2]);
                    let clockDateImputHour = Number($clockInputTime.value.split(':')[0]);
                    let clockDateImputMinutes = Number($clockInputTime.value.split(':')[1]);

                    this.finishDate = new Date(clockDateImputYear, clockDateImputMouth, clockDateImputDay, clockDateImputHour, clockDateImputMinutes, 00);
                    this.createNameOfFinishDate();

                    this.stateWasModified = true;
                    this.vueClockClass = 'editable';
                    // таймаут для удаления самого себя
                    setTimeout(() => { this.stateEditClock = false; }, 100); // off состояние редактирования даты
                }
            },

            /** Flower button */
            // Начинаем редактировать Flower button
            editButton(e) {
                if (this.createTimerShow) {
                    e.preventDefault();
                    this.stateEditButton = true;
                    this.flowerButton.oldText = this.flowerButton.text; // Запоминаем старое название
                    this.flowerButton.text = ''; // и меняем текст в форме на пустой
                }
            },
            cancelEditButton() {
                this.stateEditButton = false;
                this.flowerButton.text = this.flowerButton.oldText;
                this.flowerButton.link = this.flowerButton.oldLink;
            },
            acceptEditButton() {
                // Проверка. Ввели-ли мы значения?
                if (this.$refs.elFlowerTextInput.value == '' && this.$refs.elFlowerLinkInput.value == '') {
                    this.flowerButton.textInputError = true;
                    this.flowerButton.linkInputError = true;
                } else if (this.$refs.elFlowerTextInput.value == '') {
                    this.flowerButton.textInputError = true;
                    this.flowerButton.linkInputError = false;
                } else if (this.$refs.elFlowerLinkInput.value == '') {
                    this.flowerButton.textInputError = false;
                    this.flowerButton.linkInputError = true;
                } else {
                    this.flowerButton.textInputError = false;
                    this.flowerButton.linkInputError = false;

                    this.flowerButton.text = this.$refs.elFlowerTextInput.value;
                    this.flowerButton.link = this.$refs.elFlowerLinkInput.value;
                    this.stateEditButton = false;

                    this.stateWasModified = true;
                    this.vueClockClass = 'editable';
                }
            },

            // Начинаем редактировать под-заголовок
            editPreHeading() {
                if (this.createTimerShow) {
                    this.stateEditPreHeading = true;
                    this.oldPreHeadingMessage = this.preHeadingMessage; // Запоминаем старое название
                    this.preHeadingMessage = ''; // и меняем текст в форме на пустой

                    // ищем вновь созданый инпут и добавляем в него курсор, // таймаут ждёт создание элемента
                    setTimeout(() => {
                        this.$refs.elInputPreHeading.focus();
                        const thisVue = this;
                        this.$refs.elInputPreHeading.oninput = function () {
                            if (thisVue.preHeadingMessage === '') {
                                thisVue.vueAcceptEditDescription = '';
                            } else {
                                thisVue.vueAcceptEditDescription = 'accept';
                            }
                        }
                    }, 100);
                }
            },
            // Сохроняем редактирование
            compleateEditPreHeading() {
                if (this.createTimerShow) {
                    this.stateEditPreHeading = false;
                    this.vueAcceptEditDescription = '';
                    // если форма пустая и не такая же
                    if (this.preHeadingMessage == '') {
                        this.preHeadingMessage = this.oldPreHeadingMessage;
                    }
                    else {
                        this.stateWasModified = true;
                    }
                }
            },

            // Начинаем редактировать заголовок
            editHeading() {
                if (this.createTimerShow) {
                    this.stateEditHeading = true;
                    this.oldHeadingMessage = this.headingMessage; // Запоминаем старое название
                    this.headingMessage = ''; // и меняем текст в форме на пустой

                    // ищем вновь созданый инпут и добавляем в него курсор
                    setTimeout(() => {
                        this.$refs.elInputHeading.focus();
                        const thisVue = this;
                        this.$refs.elInputHeading.oninput = function () {
                            if (thisVue.headingMessage === '') {
                                thisVue.vueAcceptEditDescription = '';
                            } else {
                                thisVue.vueAcceptEditDescription = 'accept';
                            }
                        }
                    }, 100);
                }
            },
            // Сохроняем редактирование
            compleateEditHeading() {
                if (this.createTimerShow) {
                    this.stateEditHeading = false;
                    this.vueAcceptEditDescription = '';

                    // если форма пустая и не такая же
                    if (this.headingMessage == '') {
                        this.headingMessage = this.oldHeadingMessage;
                    }
                    else {
                        this.stateWasModified = true;
                    }
                }
            },

            /** DescriptionText */
            // Начинаем редактировать DescriptionText
            editDescriptionText() {
                if (this.createTimerShow) {
                    this.stateEditDescriptionText = true;
                    this.oldDescriptionTextMessage = this.descriptionTextMessage; // Запоминаем старое название
                    this.descriptionTextMessage = ''; // и меняем текст в форме на пустой

                    // ищем вновь созданый инпут и добавляем в него курсор
                    setTimeout(() => {
                        this.$refs.elInputDescriptionText.focus();
                        const thisVue = this;
                        this.$refs.elInputDescriptionText.oninput = function () {
                            if (thisVue.descriptionTextMessage === '') {
                                thisVue.vueAcceptEditDescription = '';
                            } else {
                                thisVue.vueAcceptEditDescription = 'accept';
                            }
                        }
                    }, 100);
                }
            },
            // Сохроняем редактирование DescriptionText
            compleateEditDescriptionText() {
                if (this.createTimerShow) {
                    this.stateEditDescriptionText = false;
                    this.vueAcceptEditDescription = '';
                    // если форма пустая
                    if (this.descriptionTextMessage == '') {
                        this.descriptionTextMessage = this.oldDescriptionTextMessage;
                    }
                    else {
                        this.stateWasModified = true;
                    }
                }
            },

            // применить редактирование текста по клавише Энтр
            acceptEditText: function (e) {
                // если мы в процесе редактирования и редактируем загаловок и нажали энтер
                if (this.createTimerShow && this.stateEditHeading && e.key == 'Enter') {
                    this.compleateEditHeading();
                }
                if (this.createTimerShow && this.stateEditPreHeading && e.key == 'Enter') {
                    this.compleateEditPreHeading();
                }
                if (this.createTimerShow && this.stateEditDescriptionText && e.key == 'Enter') {
                    this.compleateEditDescriptionText();
                }
            },

            // Скрываем панельку описания на мобиле
            hideDescriptionPanel() {
                if (this.descriptionPanel === 'hide') {
                    this.descriptionPanel = '';
                } else {
                    this.descriptionPanel = 'hide';
                }
            },

            // Clock ================
            clockFunc() {
                // // создаём дату новую
                let nowDate = new Date();
                let result = (this.finishDate - nowDate); // получаем разницу
                this.finishDate instanceof Date && !isNaN(this.finishDate)

                // Если таймер прошёл
                if (result < 0) {
                    this.cl_month = "It's over";
                    this.cl_days = '0';
                    this.cl_hours = '00';
                    this.cl_minutes = '00';
                    this.cl_seconds = '00';
                    this.cl_days_title = 'день';
                } else {
                    let seconds = Math.floor((result / 1000) % 60);
                    let minutes = Math.floor((result / 1000 / 60) % 60);
                    let hours = Math.floor((result / 1000 / 60 / 60) % 24);
                    let days = Math.floor(result / 1000 / 60 / 60 / 24);

                    if (seconds < 10) seconds = '0' + seconds;
                    if (minutes < 10) minutes = '0' + minutes;
                    if (hours < 10) hours = '0' + hours;

                    this.cl_month = this.monthName;
                    this.cl_days = days;
                    this.cl_hours = hours;
                    this.cl_minutes = minutes;
                    this.cl_seconds = seconds;
                    this.cl_days_title = 'дней';

                    if (this.cl_days <= 1) {
                        this.cl_days_title = 'день';
                    }
                }
            },
            createNameOfFinishDate() {
                this.monthName = this.finishDate.toLocaleString('ru-RU', { month: "long", day: 'numeric', hour: 'numeric', minute: 'numeric' });
            },

            // Выбор цвета ==============
            colorPick() {
                this.styleApp = { '--theme-color': this.color_i };
                this.color_i = this.color_i + Math.floor(Math.random() * 17) + 9; // Добавляем рандомный цвет от 9 - 28
                this.stateWasModified = true;
            },

            // Выбор фонового изображения
            wallpaperPick() {
                this.wallpaperSideBarOpen = true;
            },
            wallpaperPickClose() {
                this.wallpaperSideBarOpen = false;
                this.vueBackClass = 'fade';
            },
            changeImageBackground(event) {
                let $input = event.target;
                if ($input.files && $input.files[0]) {
                    let reader = new FileReader();
                    let vm = this;
                    reader.onload = function (e) {
                        vm.imageSrcBackground = e.target.result;
                    }
                    reader.readAsDataURL($input.files[0]);
                    this.vueBackClass = '';
                    this.stateWasModified = true; // Включаем состояние модифицированного приложения
                }
            },
            // смена фото из коллекции
            swapImageBackground(event) {
                let srcOfNewBackground = event.target.parentNode.parentNode.getAttribute('data-wallpaper');
                if (srcOfNewBackground !== '') {
                    this.imageSrcBackground = srcOfNewBackground;
                    this.stateWasModified = true; // Включаем состояние модифицированного приложения
                    this.vueBackClass = '';
                }
            },

            // share
            shareCreateLink() {
                window.addEventListener('load', function () {
                    var e = document.getElementsByClassName('b-landing__share');

                    for (var k = 0; k < e.length; k++) {
                        if (e[k].className.indexOf('') != -1) {
                            if (e[k].getAttribute('data-url') != -1) var u = e[k].getAttribute('data-url');
                            if (e[k].getAttribute('data-title') != -1) var t = e[k].getAttribute('data-title');
                            if (e[k].getAttribute('data-image') != -1) var i = e[k].getAttribute('data-image');
                            if (e[k].getAttribute('data-description') != -1) var d = e[k].getAttribute('data-description');
                            if (e[k].getAttribute('data-path') != -1) var f = e[k].getAttribute('data-path');
                            if (e[k].getAttribute('data-icons-file') != -1) var fn = e[k].getAttribute('data-icons-file');
                            if (!f) {
                                function path(name) {
                                    var sc = document.getElementsByTagName('script'),
                                        sr = new RegExp('^(.*/|)(' + name + ')([#?]|$)');
                                    for (var p = 0, scL = sc.length; p < scL; p++) {
                                        var m = String(sc[p].src)
                                            .match(sr);
                                        if (m) {
                                            if (m[1].match(/^((https?|file)\:\/{2,}|\w:[\/\\])/)) return m[1];
                                            if (m[1].indexOf("/") == 0) return m[1];
                                            b = document.getElementsByTagName('base');
                                            if (b[0] && b[0].href) return b[0].href + m[1];
                                            else return document.location.pathname.match(/(.*[\/\\])/)[0] + m[1];
                                        }
                                    }
                                    return null;
                                }
                                f = path('share42.js');
                            }
                            if (!u) u = location.href;
                            if (!t) t = document.title;
                            if (!fn) fn = 'icons.png';

                            function desc() {
                                var meta = document.getElementsByTagName('meta');
                                for (var m = 0; m < meta.length; m++) {
                                    if (meta[m].name.toLowerCase() == 'description') {
                                        return meta[m].content;
                                    }
                                }
                                return '';
                            }
                            if (!d) d = desc();
                            u = encodeURIComponent(u);
                            t = encodeURIComponent(t);
                            t = t.replace(/\'/g, '%27');
                            i = encodeURIComponent(i);
                            d = encodeURIComponent(d);
                            d = d.replace(/\'/g, '%27');

                            var fbQuery = 'u=' + u;
                            if (i != 'null' && i != '') fbQuery = 's=100&p[url]=' + u + '&p[title]=' + t + '&p[summary]=' + d + '&p[images][0]=' + i;

                            var vkImage = '';
                            if (i != 'null' && i != '') vkImage = '&image=' + i;

                            var s = new Array('"#" data-count="vk" onclick="window.open(\'//vk.com/share.php?url=' + u + '&title=' + t + vkImage + '&description=' + d + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться ВКонтакте"', '"#" data-count="fb" onclick="window.open(\'//www.facebook.com/sharer/sharer.php?u=' + u + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться в Facebook"');

                            var l = '';

                            for (j = 0; j < s.length; j++) {
                                var qq = ['b-icon b-icon--share b-icon--vk icon-vk', 'b-icon b-icon--share icon-fb']
                                l += '<a class="' + qq[j] + '" rel="nofollow" style="display:inline-block;" href=' + s[j] + ' target="_blank"></a>';
                            }

                            e[k].innerHTML = l;
                        }
                    };
                }, false);
            },

            // После публикации страницы и отправки аякса
            createdNewPage(page) {
                this.$refs.alertLink.textContent = `${currentOriginOrl}?id=${page}`;
                this.$refs.alertLink.href = `${currentOriginOrl}?id=${page}`
                this.alertIsOpen = true;
            },

            // Отправляем данные в фаирбэйз
            publishNewTimer() {
                vue_this = this;
                const idPage = (Math.floor(Math.random() * 1000000));
                const dataJSON = {
                    pageTitle: vue_this.headingMessage,
                    preHeading: vue_this.preHeadingMessage,
                    heading: vue_this.headingMessage,
                    description: vue_this.descriptionTextMessage,
                    finishDate: vue_this.finishDate.toString(),
                    imageSrcBackground: vue_this.imageSrcBackground,
                    color_i: vue_this.color_i,
                    buttonText: vue_this.flowerButton.text,
                    buttonHref: vue_this.flowerButton.link,
                };
                database.ref('pages/' + idPage).set(dataJSON)
                    .then(function () {
                        console.log('Synchronization succeeded');
                        vue_this.createdNewPage(idPage);
                    })
                    .catch(function (error) {
                        console.log('Synchronization failed');
                    });

                this.weHaveModificateTimer = false; // Выключаем состояние модифицированного приложения
            },

            // Применяем новые данные к таймеру
            acceptData(data) {
                let newDate = new Date(data.finishDate);

                if (isValidDate(newDate)) {
                    // Если дата верна
                } else {
                    // Если дата НЕ верна
                    newDate = new Date(0);
                }

                // присваеваем переменным значения с сервера
                this.preHeadingMessage = data.preHeading;
                this.headingMessage = data.heading;
                this.descriptionTextMessage = data.description;
                // присваеваем переменным значения для кнопки
                this.flowerButton.text = data.buttonText;
                this.flowerButton.link = data.buttonHref;
                // присваеваем заголовок страницы
                document.title = data.pageTitle
                // присваеваем фон
                this.imageSrcBackground = data.imageSrcBackground;
                // присваеваем цвет
                this.styleApp = { '--theme-color': data.color_i };
                // присваеваем дату
                this.finishDate = newDate;
                // включаем новую дату
                this.createNameOfFinishDate();
            },

            finishPreloadingDone() {
                this.stateApp.preLoadingApp = false;
                this.startTimer();
                this.vueBackClass = '';
            },
            failedLoad() {
                this.headingMessage = '404 :(';
                this.descriptionTextMessage ='Произошла ошибка при попытке загрузить данную страницу, проверьте правильность ссылки и повторите попытку'
            }
        },

        beforeCreate() {
        },

        // Вызывается синхронно сразу после создания экземпляра
        created() {
            const data = data_json_default;
            const _this = this;
            this.acceptData(data);

            // Получаем данные
            database.ref('pages/' + currentIdPage.id).once('value')
                .then(function (e) {
                    _this.acceptData(e.val());
                    // Включаем приложение
                    _this.finishPreloadingDone();
                })
                .catch(function (error) {
                    console.log(error);
                    _this.failedLoad();
                });
        },

        // Вызывается сразу после того как экземпляр был смонтирован
        mounted() {
            // получаем конечную дату (Заголовок Даты)
            // this.createNameOfFinishDate();
            // меняем шейры
            this.shareCreateLink();
            document.addEventListener('keypress', this.acceptEditText);
        }
    })
;
    console.log('%c%s', 'display: block; color: #1d9bff; font: 1.6rem/1.3 Tahoma;', 'Если вы нашли баг, отправьте его описание мне на почту iAmed73@yandex.ru');
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbnRlcm5hbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gVlVFINC/0YDQuNC70L7QttC10L3QuNC1XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgIGxldCBjdXJyZW50SWRQYWdlID0gcXMucGFyc2UoY3VycmVudFVSTCwgeyBpZ25vcmVRdWVyeVByZWZpeDogdHJ1ZSB9KTtcclxuXHJcbiAgICBpZiAoIWN1cnJlbnRVUkwubWF0Y2goL15cXD9pZD0vaWcpKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9MCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VycmVudE9yaWdpbk9ybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcblxyXG4gICAgY29uc3QgZGF0YV9qc29uX2RlZmF1bHQgPSB7XHJcbiAgICAgICAgcGFnZVRpdGxlOiBcItCi0LDQudC80LXRgFwiLFxyXG4gICAgICAgIGhlYWRpbmc6IFwi0JfQsNCz0YDRg9C30LrQsC4uLlwiLFxyXG4gICAgICAgIHByZUhlYWRpbmc6IFwiXCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsXHJcbiAgICAgICAgZmluaXNoRGF0ZTogXCJcIixcclxuICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6IFwiXCIsXHJcbiAgICAgICAgY29sb3JfaTogMTcyLFxyXG4gICAgICAgIGJ1dHRvblRleHQ6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAg0L/QvtC00L7QttC00LjRgtC1XCIsXHJcbiAgICAgICAgYnV0dG9uSHJlZjogXCJcIixcclxuICAgIH1cclxuXHJcbiAgICAvLyBZb3VyIHdlYiBhcHAncyBGaXJlYmFzZSBjb25maWd1cmF0aW9uXHJcbiAgICBjb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcclxuICAgICAgICBhcGlLZXk6IFwiQUl6YVN5QVBxNkEwc0RYX3VucjMzUXk4YXFyQWJ2bzJFcklSSERzXCIsXHJcbiAgICAgICAgYXV0aERvbWFpbjogXCJ0aW1lci1iYTUyZC5maXJlYmFzZWFwcC5jb21cIixcclxuICAgICAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3RpbWVyLWJhNTJkLmZpcmViYXNlaW8uY29tXCIsXHJcbiAgICAgICAgcHJvamVjdElkOiBcInRpbWVyLWJhNTJkXCIsXHJcbiAgICAgICAgc3RvcmFnZUJ1Y2tldDogXCJ0aW1lci1iYTUyZC5hcHBzcG90LmNvbVwiLFxyXG4gICAgICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjQ0ODU5NzU4OTExOVwiLFxyXG4gICAgICAgIGFwcElkOiBcIjE6NDQ4NTk3NTg5MTE5OndlYjoxYmI0ODBjMDkwNDcwN2VhXCJcclxuICAgIH07XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxyXG4gICAgZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XHJcbiAgICBjb25zdCBkYXRhYmFzZSA9IGZpcmViYXNlLmRhdGFiYXNlKCk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGlzVmFsaWREYXRlKGRhdGUpIHtcclxuICAgICAgICByZXR1cm4gZGF0ZSBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFZVRSBhcHBcclxuICAgIHZhciBhcHBMYW5kaW5nID0gbmV3IFZ1ZSh7XHJcbiAgICAgICAgZWw6ICcjbGFuZGluZy1hcHAnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgLy8g0KHQvtGB0YLQvtGP0L3QuNGPINC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgIHN0YXRlQXBwOiB7XHJcbiAgICAgICAgICAgICAgICBwcmVMb2FkaW5nQXBwOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgY3JlYXRlVGltZXJTaG93OiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgd2VIYXZlTW9kaWZpY2F0ZVRpbWVyOiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INGBINC90L7QstGL0LzQuCDQtNCw0L3QvdGL0LzQuFxyXG4gICAgICAgICAgICB3ZUFscmVhZHlIYXZlQ2hhbmdlczogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDQutC+0LPQtNCwINGF0L7RgtGPINCx0Ysg0YDQsNC3INC/0YDQuNC80LXQvdGP0LvQuCDQuNC30LzQtdC90LXQvdC40Y9cclxuXHJcbiAgICAgICAgICAgIC8vINCa0LvQsNGB0YHRi1xyXG4gICAgICAgICAgICB2dWVBcHBDbGFzczogJycsXHJcbiAgICAgICAgICAgIHZ1ZUJhY2tDbGFzczogJ2hpZGUnLFxyXG4gICAgICAgICAgICB2dWVTaGFyZUNsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlQ2lyY2xlQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVCdXR0b25DbGFzczogJycsXHJcbiAgICAgICAgICAgIHZ1ZUNsb2NrQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVQcmVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVEZXNjcmlwdGlvblRleHRDbGFzczogJycsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uUGFuZWw6ICdoaWRlJyxcclxuICAgICAgICAgICAgdnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uOiAnY2xhc3MnLFxyXG5cclxuICAgICAgICAgICAgLy8g0KHRgtC40LvQuFxyXG4gICAgICAgICAgICBzdHlsZUFwcDogJycsXHJcblxyXG4gICAgICAgICAgICAvLyDQpNC+0YLQvlxyXG4gICAgICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6ICcnLFxyXG5cclxuICAgICAgICAgICAgc3RhdGVXYXNNb2RpZmllZDogZmFsc2UsIC8vINCx0YvQu9C+INC70L4g0LvQuCDQuNC30LzQtdC90LXQvdC+INGB0L7RgdGC0L7Rj9C90LjQtVxyXG5cclxuICAgICAgICAgICAgc3RhdGVFZGl0UHJlSGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0L/QvtC0LdCX0LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgICAgICBzdGF0ZUVkaXRIZWFkaW5nOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQl9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICAgICAgc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0OiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQntC/0LjRgdCw0L3QuNC1XHJcbiAgICAgICAgICAgIHN0YXRlRWRpdENsb2NrOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0Y7RgtGB0Y8g0LvQuCDRh9Cw0YHRi1xyXG4gICAgICAgICAgICBzdGF0ZUVkaXRCdXR0b246IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/RjtGCINC70Lgg0LrQvdC+0L/QutGDP1xyXG5cclxuICAgICAgICAgICAgd2FsbHBhcGVyU2lkZUJhck9wZW46IGZhbHNlLCAvLyDQntGC0LrRgNGL0YIg0LvQuCDRgdCw0LnQtCDQsdCw0YAg0LTQu9GPINGE0L7QvdCwXHJcblxyXG4gICAgICAgICAgICBoZWFkaW5nTWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0LfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgICAgIGxhc3RFZGl0SGVhZGluZ01lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgICBvbGRIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDRgtC10LrRgdGC0LBcclxuICAgICAgICAgICAgbmV3SGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDRgtC10LrRgdGC0LBcclxuXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC+0L/QuNGB0LDQvdC40Y9cclxuICAgICAgICAgICAgbGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0L7Qv9C40YHQsNC90LjQtSDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INGB0L7RhdGA0LDQvdC10L3QuNGPXHJcbiAgICAgICAgICAgIG9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L7Qv9C40YHQsNC90LjRjyDQstC+INCy0YDQtdC80Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICBuZXdEZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L7Qv9C40YHQsNC90LjRj1xyXG5cclxuICAgICAgICAgICAgcHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgICAgICBsYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlOiAnJyxcclxuICAgICAgICAgICAgb2xkUHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgICAgIG5ld1ByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcblxyXG4gICAgICAgICAgICBmbG93ZXJCdXR0b246IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6ICfQn9C+0LTQsNGC0Ywg0LfQsNGP0LLQutGDJywgLy8g0YLQtdC60YHRgiDQvtC/0LjRgdCw0L3QuNGPXHJcbiAgICAgICAgICAgICAgICBsYXN0RWRpdFRleHQ6ICcnLCAvLyDQvtC/0LjRgdCw0L3QuNC1INC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YHQvtGF0YDQsNC90LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIG9sZFRleHQ6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L7Qv9C40YHQsNC90LjRjyDQstC+INCy0YDQtdC80Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICAgICAgbmV3VGV4dDogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC+0L/QuNGB0LDQvdC40Y9cclxuICAgICAgICAgICAgICAgIGxpbms6ICcnLCAvLyDRgtC10LrRgdGCINC+0L/QuNGB0LDQvdC40Y9cclxuICAgICAgICAgICAgICAgIGxhc3RFZGl0TGluazogJycsIC8vINC+0L/QuNGB0LDQvdC40LUg0L/RgNC10LTRi9C00YPRidC10LPQviDRgdC+0YXRgNCw0L3QtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgb2xkTGluazogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDQvtC/0LjRgdCw0L3QuNGPINCy0L4g0LLRgNC10LzRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgICAgICBuZXdMaW5rOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L7Qv9C40YHQsNC90LjRj1xyXG4gICAgICAgICAgICAgICAgdGV4dElucHV0RXJyb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGlua0lucHV0RXJyb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0KLQsNC50LzQtdGAID09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGZpbmlzaERhdGU6ICcnLCAvLyAoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcylcclxuICAgICAgICAgICAgbW9udGhOYW1lOiAnJyxcclxuXHJcbiAgICAgICAgICAgIGludGVydmFsOiBcIlwiLFxyXG4gICAgICAgICAgICBpbnRlcnZhbEluaXQ6IFwiXCIsXHJcbiAgICAgICAgICAgIGNsX21vbnRoOiAnJyxcclxuICAgICAgICAgICAgY2xfZGF5czogJycsXHJcbiAgICAgICAgICAgIGNsX2hvdXJzOiAnJyxcclxuICAgICAgICAgICAgY2xfbWludXRlczogJycsXHJcbiAgICAgICAgICAgIGNsX3NlY29uZHM6ICcnLFxyXG4gICAgICAgICAgICBjbF9kYXlzX3RpdGxlOiAnJyxcclxuXHJcbiAgICAgICAgICAgIGNsb2NrRGF0ZUlucHV0RXJyb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICBjbG9ja1RpbWVJbnB1dEVycm9yOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09XHJcbiAgICAgICAgICAgIGNvbG9yX2k6IDAsXHJcblxyXG4gICAgICAgICAgICAvLyDQvtC/0L7QstC10YnQtdC90LjQtSDQv9GD0LHQu9C40LrQsNGG0LjQuFxyXG4gICAgICAgICAgICBhbGVydElzT3BlbjogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgIC8vINC30LDQv9GD0YHQutCw0LXQvCDRgtCw0LnQvNC10YBcclxuICAgICAgICAgICAgc3RhcnRUaW1lcigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxJbml0ID0gdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgtC10LzRgyDRgNC10LTQvtC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIGNyZWF0ZVRpbWVyKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaW1lclNob3cgPSAhdGhpcy5jcmVhdGVUaW1lclNob3c7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICdtb2RpZmljYXRpb24nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnZWRpdGFibGUnOyAvLyBcImVkaXRhYmxlIGVkaXRlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMucHJlSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24ubGFzdEVkaXRUZXh0ID0gdGhpcy5mbG93ZXJCdXR0b24udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5sYXN0RWRpdExpbmsgPSB0aGlzLmZsb3dlckJ1dHRvbi5saW5rO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IGZhbHNlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g0JrQu9C40Log0L/QviDQntGC0LzQtdC90LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDaXJjbGVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZVByZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5sYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5sYXN0RWRpdERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dCA9IHRoaXMuZmxvd2VyQnV0dG9uLmxhc3RFZGl0VGV4dDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5saW5rID0gdGhpcy5mbG93ZXJCdXR0b24ubGFzdEVkaXRMaW5rO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gZmFsc2U7IC8v0LLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSBcItCyINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LhcIlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLndlQWxyZWFkeUhhdmVDaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCf0YDQuNC80LXQvdGP0LXQvCDQuNC30LzQtdC90LXQvdC40Y8g0J/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgYWNjZXB0Q3JlYXRlVGltZXIoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRpbWVyU2hvdyA9ICF0aGlzLmNyZWF0ZVRpbWVyU2hvdzsgLy8g0LzQtdC90Y/QtdC8INGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgICAgICAvLyDRg9Cx0LjQstCw0LXQvCDQutC70LDRgdGB0Ysg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDaXJjbGVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCdXR0b25DbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZVByZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSBmYWxzZTsgLy8g0JLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSBcItCyINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LhcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlQWxyZWFkeUhhdmVDaGFuZ2VzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INGH0LDRgdGLICjRgdGC0LDQstC40Lwg0L3QvtCy0YPRjiDQtNCw0YLRgylcclxuICAgICAgICAgICAgZWRpdENsb2NrKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IHRydWU7IC8vINCy0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUgZWRpdGluZyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNhbmNlbEVkaXRDbG9jaygpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyDRgtCw0LnQvNCw0YPRgiDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyDRgdCw0LzQvtCz0L4g0YHQtdCx0Y9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhY2NlcHRFZGl0Q2xvY2soKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgJGNsb2NrSW5wdXREYXRlID0gdGhpcy4kcmVmcy5lbENsb2NrSW5wdXREYXRlO1xyXG4gICAgICAgICAgICAgICAgbGV0ICRjbG9ja0lucHV0VGltZSA9IHRoaXMuJHJlZnMuZWxDbG9ja0lucHV0VGltZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwLiDQktCy0LXQu9C4LdC70Lgg0LzRiyDQt9C90LDRh9C10L3QuNGPP1xyXG4gICAgICAgICAgICAgICAgaWYgKCRjbG9ja0lucHV0RGF0ZS52YWx1ZSA9PSAnJyAmJiAkY2xvY2tJbnB1dFRpbWUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRjbG9ja0lucHV0RGF0ZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRjbG9ja0lucHV0VGltZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRZZWFyID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRNb3V0aCA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVsxXSkgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dERheSA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVsyXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0SG91ciA9IE51bWJlcigkY2xvY2tJbnB1dFRpbWUudmFsdWUuc3BsaXQoJzonKVswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0TWludXRlcyA9IE51bWJlcigkY2xvY2tJbnB1dFRpbWUudmFsdWUuc3BsaXQoJzonKVsxXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKGNsb2NrRGF0ZUltcHV0WWVhciwgY2xvY2tEYXRlSW1wdXRNb3V0aCwgY2xvY2tEYXRlSW1wdXREYXksIGNsb2NrRGF0ZUltcHV0SG91ciwgY2xvY2tEYXRlSW1wdXRNaW51dGVzLCAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgICAgICAvLyDRgtCw0LnQvNCw0YPRgiDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyDRgdCw0LzQvtCz0L4g0YHQtdCx0Y9cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IGZhbHNlOyB9LCAxMDApOyAvLyBvZmYg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qKiBGbG93ZXIgYnV0dG9uICovXHJcbiAgICAgICAgICAgIC8vINCd0LDRh9C40L3QsNC10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNGC0YwgRmxvd2VyIGJ1dHRvblxyXG4gICAgICAgICAgICBlZGl0QnV0dG9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEJ1dHRvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24ub2xkVGV4dCA9IHRoaXMuZmxvd2VyQnV0dG9uLnRleHQ7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dCA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNhbmNlbEVkaXRCdXR0b24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dCA9IHRoaXMuZmxvd2VyQnV0dG9uLm9sZFRleHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5saW5rID0gdGhpcy5mbG93ZXJCdXR0b24ub2xkTGluaztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWNjZXB0RWRpdEJ1dHRvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAuINCS0LLQtdC70Lgt0LvQuCDQvNGLINC30L3QsNGH0LXQvdC40Y8/XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy4kcmVmcy5lbEZsb3dlclRleHRJbnB1dC52YWx1ZSA9PSAnJyAmJiB0aGlzLiRyZWZzLmVsRmxvd2VyTGlua0lucHV0LnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dElucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmxvd2VyQnV0dG9uLmxpbmtJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy4kcmVmcy5lbEZsb3dlclRleHRJbnB1dC52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmxvd2VyQnV0dG9uLnRleHRJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5saW5rSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiRyZWZzLmVsRmxvd2VyTGlua0lucHV0LnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dElucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5saW5rSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmxvd2VyQnV0dG9uLnRleHRJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24ubGlua0lucHV0RXJyb3IgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dCA9IHRoaXMuJHJlZnMuZWxGbG93ZXJUZXh0SW5wdXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24ubGluayA9IHRoaXMuJHJlZnMuZWxGbG93ZXJMaW5rSW5wdXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRCdXR0b24gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQv9C+0LQt0LfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgICAgIGVkaXRQcmVIZWFkaW5nKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9sZFByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5wcmVIZWFkaW5nTWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgCwgLy8g0YLQsNC50LzQsNGD0YIg0LbQtNGR0YIg0YHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dFByZUhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dFByZUhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLnByZUhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgICAgICBjb21wbGVhdGVFZGl0UHJlSGVhZGluZygpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y8g0Lgg0L3QtSDRgtCw0LrQsNGPINC20LVcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5vbGRQcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQt9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICAgICAgZWRpdEhlYWRpbmcoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2xkSGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgICAgICBjb21wbGVhdGVFZGl0SGVhZGluZygpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0SGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPINC4INC90LUg0YLQsNC60LDRjyDQttC1XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGluZ01lc3NhZ2UgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IHRoaXMub2xkSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qKiBEZXNjcmlwdGlvblRleHQgKi9cclxuICAgICAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCBEZXNjcmlwdGlvblRleHRcclxuICAgICAgICAgICAgZWRpdERlc2NyaXB0aW9uVGV4dCgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgFxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dERlc2NyaXB0aW9uVGV4dC5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUgRGVzY3JpcHRpb25UZXh0XHJcbiAgICAgICAgICAgIGNvbXBsZWF0ZUVkaXREZXNjcmlwdGlvblRleHQoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y9cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMub2xkRGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0L/RgNC40LzQtdC90LjRgtGMINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUg0YLQtdC60YHRgtCwINC/0L4g0LrQu9Cw0LLQuNGI0LUg0K3QvdGC0YBcclxuICAgICAgICAgICAgYWNjZXB0RWRpdFRleHQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDQvNGLINCyINC/0YDQvtGG0LXRgdC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0Lgg0YDQtdC00LDQutGC0LjRgNGD0LXQvCDQt9Cw0LPQsNC70L7QstC+0Log0Lgg0L3QsNC20LDQu9C4INGN0L3RgtC10YBcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdEhlYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdFByZUhlYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCAmJiBlLmtleSA9PSAnRW50ZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGVhdGVFZGl0RGVzY3JpcHRpb25UZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQodC60YDRi9Cy0LDQtdC8INC/0LDQvdC10LvRjNC60YMg0L7Qv9C40YHQsNC90LjRjyDQvdCwINC80L7QsdC40LvQtVxyXG4gICAgICAgICAgICBoaWRlRGVzY3JpcHRpb25QYW5lbCgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPT09ICdoaWRlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnaGlkZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyBDbG9jayA9PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGNsb2NrRnVuYygpIHtcclxuICAgICAgICAgICAgICAgIC8vIC8vINGB0L7Qt9C00LDRkdC8INC00LDRgtGDINC90L7QstGD0Y5cclxuICAgICAgICAgICAgICAgIGxldCBub3dEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5maW5pc2hEYXRlIC0gbm93RGF0ZSk7IC8vINC/0L7Qu9GD0YfQsNC10Lwg0YDQsNC30L3QuNGG0YNcclxuICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoRGF0ZSBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHRoaXMuZmluaXNoRGF0ZSlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQldGB0LvQuCDRgtCw0LnQvNC10YAg0L/RgNC+0YjRkdC7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfbW9udGggPSBcIkl0J3Mgb3ZlclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5cyA9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gJzAwJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX21pbnV0ZXMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfc2Vjb25kcyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ9C00LXQvdGMJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlY29uZHMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwKSAlIDYwKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDAgLyA2MCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhvdXJzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCAvIDYwIC8gNjApICUgMjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXlzID0gTWF0aC5mbG9vcihyZXN1bHQgLyAxMDAwIC8gNjAgLyA2MCAvIDI0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvdXJzIDwgMTApIGhvdXJzID0gJzAnICsgaG91cnM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfbW9udGggPSB0aGlzLm1vbnRoTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSBkYXlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfaG91cnMgPSBob3VycztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX21pbnV0ZXMgPSBtaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfc2Vjb25kcyA9IHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ9C00L3QtdC5JztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xfZGF5cyA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICfQtNC10L3RjCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb250aE5hbWUgPSB0aGlzLmZpbmlzaERhdGUudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtb250aDogXCJsb25nXCIsIGRheTogJ251bWVyaWMnLCBob3VyOiAnbnVtZXJpYycsIG1pbnV0ZTogJ251bWVyaWMnIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0JLRi9Cx0L7RgCDRhtCy0LXRgtCwID09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGNvbG9yUGljaygpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBcHAgPSB7ICctLXRoZW1lLWNvbG9yJzogdGhpcy5jb2xvcl9pIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yX2kgPSB0aGlzLmNvbG9yX2kgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNykgKyA5OyAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0YDQsNC90LTQvtC80L3Ri9C5INGG0LLQtdGCINC+0YIgOSAtIDI4XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0JLRi9Cx0L7RgCDRhNC+0L3QvtCy0L7Qs9C+INC40LfQvtCx0YDQsNC20LXQvdC40Y9cclxuICAgICAgICAgICAgd2FsbHBhcGVyUGljaygpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB3YWxscGFwZXJQaWNrQ2xvc2UoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hhbmdlSW1hZ2VCYWNrZ3JvdW5kKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgJGlucHV0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCRpbnB1dC5maWxlcyAmJiAkaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5pbWFnZVNyY0JhY2tncm91bmQgPSBlLnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKCRpbnB1dC5maWxlc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINGB0LzQtdC90LAg0YTQvtGC0L4g0LjQtyDQutC+0LvQu9C10LrRhtC40LhcclxuICAgICAgICAgICAgc3dhcEltYWdlQmFja2dyb3VuZChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNyY09mTmV3QmFja2dyb3VuZCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXdhbGxwYXBlcicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNyY09mTmV3QmFja2dyb3VuZCAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlU3JjQmFja2dyb3VuZCA9IHNyY09mTmV3QmFja2dyb3VuZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vIHNoYXJlXHJcbiAgICAgICAgICAgIHNoYXJlQ3JlYXRlTGluaygpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYi1sYW5kaW5nX19zaGFyZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGUubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uY2xhc3NOYW1lLmluZGV4T2YoJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJykgIT0gLTEpIHZhciB1ID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSAhPSAtMSkgdmFyIHQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWltYWdlJykgIT0gLTEpIHZhciBpID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpICE9IC0xKSB2YXIgZCA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWRlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpICE9IC0xKSB2YXIgZiA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29ucy1maWxlJykgIT0gLTEpIHZhciBmbiA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWljb25zLWZpbGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhdGgobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzciA9IG5ldyBSZWdFeHAoJ14oLiovfCkoJyArIG5hbWUgKyAnKShbIz9dfCQpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwLCBzY0wgPSBzYy5sZW5ndGg7IHAgPCBzY0w7IHArKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG0gPSBTdHJpbmcoc2NbcF0uc3JjKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXRjaChzcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtWzFdLm1hdGNoKC9eKChodHRwcz98ZmlsZSlcXDpcXC97Mix9fFxcdzpbXFwvXFxcXF0pLykpIHJldHVybiBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtWzFdLmluZGV4T2YoXCIvXCIpID09IDApIHJldHVybiBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmFzZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiWzBdICYmIGJbMF0uaHJlZikgcmV0dXJuIGJbMF0uaHJlZiArIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goLyguKltcXC9cXFxcXSkvKVswXSArIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBwYXRoKCdzaGFyZTQyLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXUpIHUgPSBsb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0KSB0ID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZuKSBmbiA9ICdpY29ucy5wbmcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlc2MoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGEgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWV0YScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgbWV0YS5sZW5ndGg7IG0rKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YVttXS5uYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2Rlc2NyaXB0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFbbV0uY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWQpIGQgPSBkZXNjKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1ID0gZW5jb2RlVVJJQ29tcG9uZW50KHUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IGVuY29kZVVSSUNvbXBvbmVudCh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgPSB0LnJlcGxhY2UoL1xcJy9nLCAnJTI3Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gZW5jb2RlVVJJQ29tcG9uZW50KGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZCA9IGVuY29kZVVSSUNvbXBvbmVudChkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBkLnJlcGxhY2UoL1xcJy9nLCAnJTI3Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZiUXVlcnkgPSAndT0nICsgdTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9ICdudWxsJyAmJiBpICE9ICcnKSBmYlF1ZXJ5ID0gJ3M9MTAwJnBbdXJsXT0nICsgdSArICcmcFt0aXRsZV09JyArIHQgKyAnJnBbc3VtbWFyeV09JyArIGQgKyAnJnBbaW1hZ2VzXVswXT0nICsgaTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmtJbWFnZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT0gJ251bGwnICYmIGkgIT0gJycpIHZrSW1hZ2UgPSAnJmltYWdlPScgKyBpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gbmV3IEFycmF5KCdcIiNcIiBkYXRhLWNvdW50PVwidmtcIiBvbmNsaWNrPVwid2luZG93Lm9wZW4oXFwnLy92ay5jb20vc2hhcmUucGhwP3VybD0nICsgdSArICcmdGl0bGU9JyArIHQgKyB2a0ltYWdlICsgJyZkZXNjcmlwdGlvbj0nICsgZCArICdcXCcsIFxcJ19ibGFua1xcJywgXFwnc2Nyb2xsYmFycz0wLCByZXNpemFibGU9MSwgbWVudWJhcj0wLCBsZWZ0PTEwMCwgdG9wPTEwMCwgd2lkdGg9NTUwLCBoZWlnaHQ9NDQwLCB0b29sYmFyPTAsIHN0YXR1cz0wXFwnKTtyZXR1cm4gZmFsc2VcIiB0aXRsZT1cItCf0L7QtNC10LvQuNGC0YzRgdGPINCS0JrQvtC90YLQsNC60YLQtVwiJywgJ1wiI1wiIGRhdGEtY291bnQ9XCJmYlwiIG9uY2xpY2s9XCJ3aW5kb3cub3BlbihcXCcvL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT0nICsgdSArICdcXCcsIFxcJ19ibGFua1xcJywgXFwnc2Nyb2xsYmFycz0wLCByZXNpemFibGU9MSwgbWVudWJhcj0wLCBsZWZ0PTEwMCwgdG9wPTEwMCwgd2lkdGg9NTUwLCBoZWlnaHQ9NDQwLCB0b29sYmFyPTAsIHN0YXR1cz0wXFwnKTtyZXR1cm4gZmFsc2VcIiB0aXRsZT1cItCf0L7QtNC10LvQuNGC0YzRgdGPINCyIEZhY2Vib29rXCInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHFxID0gWydiLWljb24gYi1pY29uLS1zaGFyZSBiLWljb24tLXZrIGljb24tdmsnLCAnYi1pY29uIGItaWNvbi0tc2hhcmUgaWNvbi1mYiddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbCArPSAnPGEgY2xhc3M9XCInICsgcXFbal0gKyAnXCIgcmVsPVwibm9mb2xsb3dcIiBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrO1wiIGhyZWY9JyArIHNbal0gKyAnIHRhcmdldD1cIl9ibGFua1wiPjwvYT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVba10uaW5uZXJIVE1MID0gbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQn9C+0YHQu9C1INC/0YPQsdC70LjQutCw0YbQuNC4INGB0YLRgNCw0L3QuNGG0Ysg0Lgg0L7RgtC/0YDQsNCy0LrQuCDQsNGP0LrRgdCwXHJcbiAgICAgICAgICAgIGNyZWF0ZWROZXdQYWdlKHBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuYWxlcnRMaW5rLnRleHRDb250ZW50ID0gYCR7Y3VycmVudE9yaWdpbk9ybH0/aWQ9JHtwYWdlfWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay5ocmVmID0gYCR7Y3VycmVudE9yaWdpbk9ybH0/aWQ9JHtwYWdlfWBcclxuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnRJc09wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1INCyINGE0LDQuNGA0LHRjdC50LdcclxuICAgICAgICAgICAgcHVibGlzaE5ld1RpbWVyKCkge1xyXG4gICAgICAgICAgICAgICAgdnVlX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWRQYWdlID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFKU09OID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlSGVhZGluZzogdnVlX3RoaXMucHJlSGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGluZzogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHZ1ZV90aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoRGF0ZTogdnVlX3RoaXMuZmluaXNoRGF0ZS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU3JjQmFja2dyb3VuZDogdnVlX3RoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yX2k6IHZ1ZV90aGlzLmNvbG9yX2ksXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uVGV4dDogdnVlX3RoaXMuZmxvd2VyQnV0dG9uLnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uSHJlZjogdnVlX3RoaXMuZmxvd2VyQnV0dG9uLmxpbmssXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZGF0YWJhc2UucmVmKCdwYWdlcy8nICsgaWRQYWdlKS5zZXQoZGF0YUpTT04pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3luY2hyb25pemF0aW9uIHN1Y2NlZWRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2dWVfdGhpcy5jcmVhdGVkTmV3UGFnZShpZFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3luY2hyb25pemF0aW9uIGZhaWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC90L7QstGL0LUg0LTQsNC90L3Ri9C1INC6INGC0LDQudC80LXRgNGDXHJcbiAgICAgICAgICAgIGFjY2VwdERhdGEoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0RhdGUgPSBuZXcgRGF0ZShkYXRhLmZpbmlzaERhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkRGF0ZShuZXdEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINCV0YHQu9C4INC00LDRgtCwINCy0LXRgNC90LBcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0J3QlSDQstC10YDQvdCwXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0L/QtdGA0LXQvNC10L3QvdGL0Lwg0LfQvdCw0YfQtdC90LjRjyDRgSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IGRhdGEucHJlSGVhZGluZztcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSBkYXRhLmhlYWRpbmc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSBkYXRhLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQv9C10YDQtdC80LXQvdC90YvQvCDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQutC90L7Qv9C60LhcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd2VyQnV0dG9uLnRleHQgPSBkYXRhLmJ1dHRvblRleHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5saW5rID0gZGF0YS5idXR0b25IcmVmO1xyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQt9Cw0LPQvtC70L7QstC+0Log0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBkYXRhLnBhZ2VUaXRsZVxyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhNC+0L1cclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kID0gZGF0YS5pbWFnZVNyY0JhY2tncm91bmQ7XHJcbiAgICAgICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INGG0LLQtdGCXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IGRhdGEuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQtNCw0YLRg1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlID0gbmV3RGF0ZTtcclxuICAgICAgICAgICAgICAgIC8vINCy0LrQu9GO0YfQsNC10Lwg0L3QvtCy0YPRjiDQtNCw0YLRg1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmaW5pc2hQcmVsb2FkaW5nRG9uZSgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVBcHAucHJlTG9hZGluZ0FwcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsZWRMb2FkKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9ICc0MDQgOignO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0n0J/RgNC+0LjQt9C+0YjQu9CwINC+0YjQuNCx0LrQsCDQv9GA0Lgg0L/QvtC/0YvRgtC60LUg0LfQsNCz0YDRg9C30LjRgtGMINC00LDQvdC90YPRjiDRgdGC0YDQsNC90LjRhtGDLCDQv9GA0L7QstC10YDRjNGC0LUg0L/RgNCw0LLQuNC70YzQvdC+0YHRgtGMINGB0YHRi9C70LrQuCDQuCDQv9C+0LLRgtC+0YDQuNGC0LUg0L/QvtC/0YvRgtC60YMnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBiZWZvcmVDcmVhdGUoKSB7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JLRi9C30YvQstCw0LXRgtGB0Y8g0YHQuNC90YXRgNC+0L3QvdC+INGB0YDQsNC30YMg0L/QvtGB0LvQtSDRgdC+0LfQtNCw0L3QuNGPINGN0LrQt9C10LzQv9C70Y/RgNCwXHJcbiAgICAgICAgY3JlYXRlZCgpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGRhdGFfanNvbl9kZWZhdWx0O1xyXG4gICAgICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuYWNjZXB0RGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCf0L7Qu9GD0YfQsNC10Lwg0LTQsNC90L3Ri9C1XHJcbiAgICAgICAgICAgIGRhdGFiYXNlLnJlZigncGFnZXMvJyArIGN1cnJlbnRJZFBhZ2UuaWQpLm9uY2UoJ3ZhbHVlJylcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWNjZXB0RGF0YShlLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDQktC60LvRjtGH0LDQtdC8INC/0YDQuNC70L7QttC10L3QuNC1XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZmluaXNoUHJlbG9hZGluZ0RvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmZhaWxlZExvYWQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQt9GL0LLQsNC10YLRgdGPINGB0YDQsNC30YMg0L/QvtGB0LvQtSDRgtC+0LPQviDQutCw0Log0Y3QutC30LXQvNC/0LvRj9GAINCx0YvQuyDRgdC80L7QvdGC0LjRgNC+0LLQsNC9XHJcbiAgICAgICAgbW91bnRlZCgpIHtcclxuICAgICAgICAgICAgLy8g0L/QvtC70YPRh9Cw0LXQvCDQutC+0L3QtdGH0L3Rg9GOINC00LDRgtGDICjQl9Cw0LPQvtC70L7QstC+0Log0JTQsNGC0YspXHJcbiAgICAgICAgICAgIC8vIHRoaXMuY3JlYXRlTmFtZU9mRmluaXNoRGF0ZSgpO1xyXG4gICAgICAgICAgICAvLyDQvNC10L3Rj9C10Lwg0YjQtdC50YDRi1xyXG4gICAgICAgICAgICB0aGlzLnNoYXJlQ3JlYXRlTGluaygpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIHRoaXMuYWNjZXB0RWRpdFRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbjtcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdkaXNwbGF5OiBibG9jazsgY29sb3I6ICMxZDliZmY7IGZvbnQ6IDEuNnJlbS8xLjMgVGFob21hOycsICfQldGB0LvQuCDQstGLINC90LDRiNC70Lgg0LHQsNCzLCDQvtGC0L/RgNCw0LLRjNGC0LUg0LXQs9C+INC+0L/QuNGB0LDQvdC40LUg0LzQvdC1INC90LAg0L/QvtGH0YLRgyBpQW1lZDczQHlhbmRleC5ydScpO1xufSk7XG4iXSwiZmlsZSI6ImludGVybmFsLmpzIn0=
