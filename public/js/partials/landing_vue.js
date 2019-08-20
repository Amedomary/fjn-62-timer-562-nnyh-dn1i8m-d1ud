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
            // const idPage = (Math.floor(Math.random() * 1000000));
            const idPage = 0;
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
                console.log(e.val());

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXJ0aWFscy9sYW5kaW5nX3Z1ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4vLyBWVUUg0L/RgNC40LvQvtC20LXQvdC40LVcclxuLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxubGV0IGN1cnJlbnRJZFBhZ2UgPSBxcy5wYXJzZShjdXJyZW50VVJMLCB7IGlnbm9yZVF1ZXJ5UHJlZml4OiB0cnVlIH0pO1xyXG5cclxuaWYgKCFjdXJyZW50VVJMLm1hdGNoKC9eXFw/aWQ9L2lnKSkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9MCc7XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRPcmlnaW5PcmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG5cclxuY29uc3QgZGF0YV9qc29uX2RlZmF1bHQgPSB7XHJcbiAgICBwYWdlVGl0bGU6IFwi0KLQsNC50LzQtdGAXCIsXHJcbiAgICBoZWFkaW5nOiBcItCX0LDQs9GA0YPQt9C60LAuLi5cIixcclxuICAgIHByZUhlYWRpbmc6IFwiXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgIGZpbmlzaERhdGU6IFwiXCIsXHJcbiAgICBpbWFnZVNyY0JhY2tncm91bmQ6IFwiXCIsXHJcbiAgICBjb2xvcl9pOiAxNzIsXHJcbiAgICBidXR0b25UZXh0OiBcItCf0L7QttCw0LvRg9C50YHRgtCwINC/0L7QtNC+0LbQtNC40YLQtVwiLFxyXG4gICAgYnV0dG9uSHJlZjogXCJcIixcclxufVxyXG5cclxuLy8gWW91ciB3ZWIgYXBwJ3MgRmlyZWJhc2UgY29uZmlndXJhdGlvblxyXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcclxuICAgIGFwaUtleTogXCJBSXphU3lBUHE2QTBzRFhfdW5yMzNReThhcXJBYnZvMkVySVJIRHNcIixcclxuICAgIGF1dGhEb21haW46IFwidGltZXItYmE1MmQuZmlyZWJhc2VhcHAuY29tXCIsXHJcbiAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3RpbWVyLWJhNTJkLmZpcmViYXNlaW8uY29tXCIsXHJcbiAgICBwcm9qZWN0SWQ6IFwidGltZXItYmE1MmRcIixcclxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwidGltZXItYmE1MmQuYXBwc3BvdC5jb21cIixcclxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjQ0ODU5NzU4OTExOVwiLFxyXG4gICAgYXBwSWQ6IFwiMTo0NDg1OTc1ODkxMTk6d2ViOjFiYjQ4MGMwOTA0NzA3ZWFcIlxyXG59O1xyXG5cclxuLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxyXG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcclxuY29uc3QgZGF0YWJhc2UgPSBmaXJlYmFzZS5kYXRhYmFzZSgpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGlzVmFsaWREYXRlKGRhdGUpIHtcclxuICAgIHJldHVybiBkYXRlIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4oZGF0ZSk7XHJcbn1cclxuXHJcbi8vIFZVRSBhcHBcclxudmFyIGFwcExhbmRpbmcgPSBuZXcgVnVlKHtcclxuICAgIGVsOiAnI2xhbmRpbmctYXBwJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICAvLyDQodC+0YHRgtC+0Y/QvdC40Y8g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICBzdGF0ZUFwcDoge1xyXG4gICAgICAgICAgICBwcmVMb2FkaW5nQXBwOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNyZWF0ZVRpbWVyU2hvdzogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgd2VIYXZlTW9kaWZpY2F0ZVRpbWVyOiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INGBINC90L7QstGL0LzQuCDQtNCw0L3QvdGL0LzQuFxyXG4gICAgICAgIHdlQWxyZWFkeUhhdmVDaGFuZ2VzOiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INC60L7Qs9C00LAg0YXQvtGC0Y8g0LHRiyDRgNCw0Lcg0L/RgNC40LzQtdC90Y/Qu9C4INC40LfQvNC10L3QtdC90LjRj1xyXG5cclxuICAgICAgICAvLyDQmtC70LDRgdGB0YtcclxuICAgICAgICB2dWVBcHBDbGFzczogJycsXHJcbiAgICAgICAgdnVlQmFja0NsYXNzOiAnaGlkZScsXHJcbiAgICAgICAgdnVlU2hhcmVDbGFzczogJycsXHJcbiAgICAgICAgdnVlQ2lyY2xlQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUJ1dHRvbkNsYXNzOiAnJyxcclxuICAgICAgICB2dWVDbG9ja0NsYXNzOiAnJyxcclxuICAgICAgICB2dWVQcmVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUhlYWRpbmdDbGFzczogJycsXHJcbiAgICAgICAgdnVlRGVzY3JpcHRpb25UZXh0Q2xhc3M6ICcnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uUGFuZWw6ICdoaWRlJyxcclxuICAgICAgICB2dWVBY2NlcHRFZGl0RGVzY3JpcHRpb246ICdjbGFzcycsXHJcblxyXG4gICAgICAgIC8vINCh0YLQuNC70LhcclxuICAgICAgICBzdHlsZUFwcDogJycsXHJcblxyXG4gICAgICAgIC8vINCk0L7RgtC+XHJcbiAgICAgICAgaW1hZ2VTcmNCYWNrZ3JvdW5kOiAnJyxcclxuXHJcbiAgICAgICAgc3RhdGVXYXNNb2RpZmllZDogZmFsc2UsIC8vINCx0YvQu9C+INC70L4g0LvQuCDQuNC30LzQtdC90LXQvdC+INGB0L7RgdGC0L7Rj9C90LjQtVxyXG5cclxuICAgICAgICBzdGF0ZUVkaXRQcmVIZWFkaW5nOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQv9C+0LQt0JfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgc3RhdGVFZGl0SGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0JfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0OiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQntC/0LjRgdCw0L3QuNC1XHJcbiAgICAgICAgc3RhdGVFZGl0Q2xvY2s6IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/RjtGC0YHRjyDQu9C4INGH0LDRgdGLXHJcbiAgICAgICAgc3RhdGVFZGl0QnV0dG9uOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0Y7RgiDQu9C4INC60L3QvtC/0LrRgz9cclxuXHJcbiAgICAgICAgd2FsbHBhcGVyU2lkZUJhck9wZW46IGZhbHNlLCAvLyDQntGC0LrRgNGL0YIg0LvQuCDRgdCw0LnQtCDQsdCw0YAg0LTQu9GPINGE0L7QvdCwXHJcblxyXG4gICAgICAgIGhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQt9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICBsYXN0RWRpdEhlYWRpbmdNZXNzYWdlOiAnJyxcclxuICAgICAgICBvbGRIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDRgtC10LrRgdGC0LBcclxuICAgICAgICBuZXdIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INGC0LXQutGB0YLQsFxyXG5cclxuICAgICAgICBkZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQvtC/0LjRgdCw0L3QuNGPXHJcbiAgICAgICAgbGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0L7Qv9C40YHQsNC90LjQtSDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INGB0L7RhdGA0LDQvdC10L3QuNGPXHJcbiAgICAgICAgb2xkRGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDQvtC/0LjRgdCw0L3QuNGPINCy0L4g0LLRgNC10LzRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgbmV3RGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC+0L/QuNGB0LDQvdC40Y9cclxuXHJcbiAgICAgICAgcHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgIGxhc3RFZGl0UHJlSGVhZGluZ01lc3NhZ2U6ICcnLFxyXG4gICAgICAgIG9sZFByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgIG5ld1ByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcblxyXG4gICAgICAgIGZsb3dlckJ1dHRvbjoge1xyXG4gICAgICAgICAgICB0ZXh0OiAn0J/QvtC00LDRgtGMINC30LDRj9Cy0LrRgycsIC8vINGC0LXQutGB0YIg0L7Qv9C40YHQsNC90LjRj1xyXG4gICAgICAgICAgICBsYXN0RWRpdFRleHQ6ICcnLCAvLyDQvtC/0LjRgdCw0L3QuNC1INC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YHQvtGF0YDQsNC90LXQvdC40Y9cclxuICAgICAgICAgICAgb2xkVGV4dDogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDQvtC/0LjRgdCw0L3QuNGPINCy0L4g0LLRgNC10LzRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIG5ld1RleHQ6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDQvtC/0LjRgdCw0L3QuNGPXHJcbiAgICAgICAgICAgIGxpbms6ICcnLCAvLyDRgtC10LrRgdGCINC+0L/QuNGB0LDQvdC40Y9cclxuICAgICAgICAgICAgbGFzdEVkaXRMaW5rOiAnJywgLy8g0L7Qv9C40YHQsNC90LjQtSDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INGB0L7RhdGA0LDQvdC10L3QuNGPXHJcbiAgICAgICAgICAgIG9sZExpbms6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L7Qv9C40YHQsNC90LjRjyDQstC+INCy0YDQtdC80Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICBuZXdMaW5rOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L7Qv9C40YHQsNC90LjRj1xyXG4gICAgICAgICAgICB0ZXh0SW5wdXRFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxpbmtJbnB1dEVycm9yOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQotCw0LnQvNC10YAgPT09PT09PT09PT09PT09PT1cclxuICAgICAgICBmaW5pc2hEYXRlOiAnJywgLy8gKHllYXIsIG1vbnRoLCBkYXRlLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbXMpXHJcbiAgICAgICAgbW9udGhOYW1lOiAnJyxcclxuXHJcbiAgICAgICAgaW50ZXJ2YWw6IFwiXCIsXHJcbiAgICAgICAgaW50ZXJ2YWxJbml0OiBcIlwiLFxyXG4gICAgICAgIGNsX21vbnRoOiAnJyxcclxuICAgICAgICBjbF9kYXlzOiAnJyxcclxuICAgICAgICBjbF9ob3VyczogJycsXHJcbiAgICAgICAgY2xfbWludXRlczogJycsXHJcbiAgICAgICAgY2xfc2Vjb25kczogJycsXHJcbiAgICAgICAgY2xfZGF5c190aXRsZTogJycsXHJcblxyXG4gICAgICAgIGNsb2NrRGF0ZUlucHV0RXJyb3I6IGZhbHNlLFxyXG4gICAgICAgIGNsb2NrVGltZUlucHV0RXJyb3I6IGZhbHNlLFxyXG5cclxuICAgICAgICAvLyDQktGL0LHQvtGAINGG0LLQtdGC0LAgPT09PT09PVxyXG4gICAgICAgIGNvbG9yX2k6IDAsXHJcblxyXG4gICAgICAgIC8vINC+0L/QvtCy0LXRidC10L3QuNC1INC/0YPQsdC70LjQutCw0YbQuNC4XHJcbiAgICAgICAgYWxlcnRJc09wZW46IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAvLyDQt9Cw0L/Rg9GB0LrQsNC10Lwg0YLQsNC50LzQtdGAXHJcbiAgICAgICAgc3RhcnRUaW1lcigpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbEluaXQgPSB0aGlzLmNsb2NrRnVuYygpO1xyXG4gICAgICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgtC10LzRgyDRgNC10LTQvtC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgY3JlYXRlVGltZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJ21vZGlmaWNhdGlvbic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnZWRpdGFibGUnOyAvLyBcImVkaXRhYmxlIGVkaXRlZFwiXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdEhlYWRpbmdNZXNzYWdlID0gdGhpcy5oZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5wcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd2VyQnV0dG9uLmxhc3RFZGl0VGV4dCA9IHRoaXMuZmxvd2VyQnV0dG9uLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5sYXN0RWRpdExpbmsgPSB0aGlzLmZsb3dlckJ1dHRvbi5saW5rO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g0JrQu9C40Log0L/QviDQntGC0LzQtdC90LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQXBwQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnaGlkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5sYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IHRoaXMubGFzdEVkaXRIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dCA9IHRoaXMuZmxvd2VyQnV0dG9uLmxhc3RFZGl0VGV4dDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd2VyQnV0dG9uLmxpbmsgPSB0aGlzLmZsb3dlckJ1dHRvbi5sYXN0RWRpdExpbms7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IGZhbHNlOyAvL9Cy0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUgXCLQsiDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC4XCJcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLndlQWxyZWFkeUhhdmVDaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQn9GA0LjQvNC10L3Rj9C10Lwg0LjQt9C80LXQvdC10L3QuNGPINCf0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgYWNjZXB0Q3JlYXRlVGltZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93OyAvLyDQvNC10L3Rj9C10Lwg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgLy8g0YPQsdC40LLQsNC10Lwg0LrQu9Cw0YHRgdGLINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVDaXJjbGVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZVByZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJyc7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSBmYWxzZTsgLy8g0JLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSBcItCyINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LhcIlxyXG4gICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgdGhpcy53ZUFscmVhZHlIYXZlQ2hhbmdlcyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDRh9Cw0YHRiyAo0YHRgtCw0LLQuNC8INC90L7QstGD0Y4g0LTQsNGC0YMpXHJcbiAgICAgICAgZWRpdENsb2NrKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSB0cnVlOyAvLyDQstC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUgZWRpdGluZyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbmNlbEVkaXRDbG9jaygpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vINGC0LDQudC80LDRg9GCINC00LvRjyDRg9C00LDQu9C10L3QuNGPINGB0LDQvNC+0LPQviDRgdC10LHRj1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IGZhbHNlOyAvLyBvZmYg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWNjZXB0RWRpdENsb2NrKCkge1xyXG4gICAgICAgICAgICBsZXQgJGNsb2NrSW5wdXREYXRlID0gdGhpcy4kcmVmcy5lbENsb2NrSW5wdXREYXRlO1xyXG4gICAgICAgICAgICBsZXQgJGNsb2NrSW5wdXRUaW1lID0gdGhpcy4kcmVmcy5lbENsb2NrSW5wdXRUaW1lO1xyXG5cclxuICAgICAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsC4g0JLQstC10LvQuC3Qu9C4INC80Ysg0LfQvdCw0YfQtdC90LjRjz9cclxuICAgICAgICAgICAgaWYgKCRjbG9ja0lucHV0RGF0ZS52YWx1ZSA9PSAnJyAmJiAkY2xvY2tJbnB1dFRpbWUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRjbG9ja0lucHV0RGF0ZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRjbG9ja0lucHV0VGltZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRZZWFyID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzBdKTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dE1vdXRoID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzFdKSAtIDE7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXREYXkgPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMl0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0SG91ciA9IE51bWJlcigkY2xvY2tJbnB1dFRpbWUudmFsdWUuc3BsaXQoJzonKVswXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRNaW51dGVzID0gTnVtYmVyKCRjbG9ja0lucHV0VGltZS52YWx1ZS5zcGxpdCgnOicpWzFdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaERhdGUgPSBuZXcgRGF0ZShjbG9ja0RhdGVJbXB1dFllYXIsIGNsb2NrRGF0ZUltcHV0TW91dGgsIGNsb2NrRGF0ZUltcHV0RGF5LCBjbG9ja0RhdGVJbXB1dEhvdXIsIGNsb2NrRGF0ZUltcHV0TWludXRlcywgMDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgICAgICAvLyDRgtCw0LnQvNCw0YPRgiDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyDRgdCw0LzQvtCz0L4g0YHQtdCx0Y9cclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IH0sIDEwMCk7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEZsb3dlciBidXR0b24gKi9cclxuICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMIEZsb3dlciBidXR0b25cclxuICAgICAgICBlZGl0QnV0dG9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEJ1dHRvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5vbGRUZXh0ID0gdGhpcy5mbG93ZXJCdXR0b24udGV4dDsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd2VyQnV0dG9uLnRleHQgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5jZWxFZGl0QnV0dG9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi50ZXh0ID0gdGhpcy5mbG93ZXJCdXR0b24ub2xkVGV4dDtcclxuICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24ubGluayA9IHRoaXMuZmxvd2VyQnV0dG9uLm9sZExpbms7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhY2NlcHRFZGl0QnV0dG9uKCkge1xyXG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwLiDQktCy0LXQu9C4LdC70Lgg0LzRiyDQt9C90LDRh9C10L3QuNGPP1xyXG4gICAgICAgICAgICBpZiAodGhpcy4kcmVmcy5lbEZsb3dlclRleHRJbnB1dC52YWx1ZSA9PSAnJyAmJiB0aGlzLiRyZWZzLmVsRmxvd2VyTGlua0lucHV0LnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi50ZXh0SW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5saW5rSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy4kcmVmcy5lbEZsb3dlclRleHRJbnB1dC52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dElucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24ubGlua0lucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiRyZWZzLmVsRmxvd2VyTGlua0lucHV0LnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi50ZXh0SW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24ubGlua0lucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dElucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd2VyQnV0dG9uLmxpbmtJbnB1dEVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dCA9IHRoaXMuJHJlZnMuZWxGbG93ZXJUZXh0SW5wdXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dlckJ1dHRvbi5saW5rID0gdGhpcy4kcmVmcy5lbEZsb3dlckxpbmtJbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0QnV0dG9uID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMINC/0L7QtC3Qt9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICBlZGl0UHJlSGVhZGluZygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRQcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMucHJlSGVhZGluZ01lc3NhZ2U7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGALCAvLyDRgtCw0LnQvNCw0YPRgiDQttC00ZHRgiDRgdC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LBcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dFByZUhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRQcmVIZWFkaW5nLm9uaW5wdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLnByZUhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgIGNvbXBsZWF0ZUVkaXRQcmVIZWFkaW5nKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPINC4INC90LUg0YLQsNC60LDRjyDQttC1XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLm9sZFByZUhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCd0LDRh9C40L3QsNC10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Ywg0LfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgZWRpdEhlYWRpbmcoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2xkSGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgFxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0SGVhZGluZy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNWdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUuaGVhZGluZ01lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1XHJcbiAgICAgICAgY29tcGxlYXRlRWRpdEhlYWRpbmcoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPINC4INC90LUg0YLQsNC60LDRjyDQttC1XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkaW5nTWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSB0aGlzLm9sZEhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBEZXNjcmlwdGlvblRleHQgKi9cclxuICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMIERlc2NyaXB0aW9uVGV4dFxyXG4gICAgICAgIGVkaXREZXNjcmlwdGlvblRleHQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUgRGVzY3JpcHRpb25UZXh0XHJcbiAgICAgICAgY29tcGxlYXRlRWRpdERlc2NyaXB0aW9uVGV4dCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5vbGREZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINC/0YDQuNC80LXQvdC40YLRjCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1INGC0LXQutGB0YLQsCDQv9C+INC60LvQsNCy0LjRiNC1INCt0L3RgtGAXHJcbiAgICAgICAgYWNjZXB0RWRpdFRleHQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIC8vINC10YHQu9C4INC80Ysg0LIg0L/RgNC+0YbQtdGB0LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQuCDRgNC10LTQsNC60YLQuNGA0YPQtdC8INC30LDQs9Cw0LvQvtCy0L7QuiDQuCDQvdCw0LbQsNC70Lgg0Y3QvdGC0LXRgFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdEhlYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdFByZUhlYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wbGVhdGVFZGl0RGVzY3JpcHRpb25UZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQodC60YDRi9Cy0LDQtdC8INC/0LDQvdC10LvRjNC60YMg0L7Qv9C40YHQsNC90LjRjyDQvdCwINC80L7QsdC40LvQtVxyXG4gICAgICAgIGhpZGVEZXNjcmlwdGlvblBhbmVsKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblBhbmVsID09PSAnaGlkZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2xvY2sgPT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGNsb2NrRnVuYygpIHtcclxuICAgICAgICAgICAgLy8gLy8g0YHQvtC30LTQsNGR0Lwg0LTQsNGC0YMg0L3QvtCy0YPRjlxyXG4gICAgICAgICAgICBsZXQgbm93RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5maW5pc2hEYXRlIC0gbm93RGF0ZSk7IC8vINC/0L7Qu9GD0YfQsNC10Lwg0YDQsNC30L3QuNGG0YNcclxuICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4odGhpcy5maW5pc2hEYXRlKVxyXG5cclxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YLQsNC50LzQtdGAINC/0YDQvtGI0ZHQu1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9tb250aCA9IFwiSXQncyBvdmVyXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSAnMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gJzAwJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbWludXRlcyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX3NlY29uZHMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ9C00LXQvdGMJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWNvbmRzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDAgLyA2MCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaG91cnMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwIC8gNjAgLyA2MCkgJSAyNCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF5cyA9IE1hdGguZmxvb3IocmVzdWx0IC8gMTAwMCAvIDYwIC8gNjAgLyAyNCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSBtaW51dGVzID0gJzAnICsgbWludXRlcztcclxuICAgICAgICAgICAgICAgIGlmIChob3VycyA8IDEwKSBob3VycyA9ICcwJyArIGhvdXJzO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbW9udGggPSB0aGlzLm1vbnRoTmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5cyA9IGRheXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gaG91cnM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX21pbnV0ZXMgPSBtaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9zZWNvbmRzID0gc2Vjb25kcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICfQtNC90LXQuSc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xfZGF5cyA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ9C00LXQvdGMJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3JlYXRlTmFtZU9mRmluaXNoRGF0ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb250aE5hbWUgPSB0aGlzLmZpbmlzaERhdGUudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtb250aDogXCJsb25nXCIsIGRheTogJ251bWVyaWMnLCBob3VyOiAnbnVtZXJpYycsIG1pbnV0ZTogJ251bWVyaWMnIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09PT09PT09PVxyXG4gICAgICAgIGNvbG9yUGljaygpIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFwcCA9IHsgJy0tdGhlbWUtY29sb3InOiB0aGlzLmNvbG9yX2kgfTtcclxuICAgICAgICAgICAgdGhpcy5jb2xvcl9pID0gdGhpcy5jb2xvcl9pICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTcpICsgOTsgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGA0LDQvdC00L7QvNC90YvQuSDRhtCy0LXRgiDQvtGCIDkgLSAyOFxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YTQvtC90L7QstC+0LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICAgICAgd2FsbHBhcGVyUGljaygpIHtcclxuICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB3YWxscGFwZXJQaWNrQ2xvc2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFuZ2VJbWFnZUJhY2tncm91bmQoZXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0ICRpbnB1dCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dC5maWxlcyAmJiAkaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZtID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmltYWdlU3JjQmFja2dyb3VuZCA9IGUudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKCRpbnB1dC5maWxlc1swXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDRgdC80LXQvdCwINGE0L7RgtC+INC40Lcg0LrQvtC70LvQtdC60YbQuNC4XHJcbiAgICAgICAgc3dhcEltYWdlQmFja2dyb3VuZChldmVudCkge1xyXG4gICAgICAgICAgICBsZXQgc3JjT2ZOZXdCYWNrZ3JvdW5kID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2FsbHBhcGVyJyk7XHJcbiAgICAgICAgICAgIGlmIChzcmNPZk5ld0JhY2tncm91bmQgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlU3JjQmFja2dyb3VuZCA9IHNyY09mTmV3QmFja2dyb3VuZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBzaGFyZVxyXG4gICAgICAgIHNoYXJlQ3JlYXRlTGluaygpIHtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ItbGFuZGluZ19fc2hhcmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGUubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5jbGFzc05hbWUuaW5kZXhPZignJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpICE9IC0xKSB2YXIgdSA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSAhPSAtMSkgdmFyIHQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2UnKSAhPSAtMSkgdmFyIGkgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSAhPSAtMSkgdmFyIGQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpICE9IC0xKSB2YXIgZiA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWljb25zLWZpbGUnKSAhPSAtMSkgdmFyIGZuID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbnMtZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhdGgobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzYyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3IgPSBuZXcgUmVnRXhwKCdeKC4qL3wpKCcgKyBuYW1lICsgJykoWyM/XXwkKScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwLCBzY0wgPSBzYy5sZW5ndGg7IHAgPCBzY0w7IHArKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IFN0cmluZyhzY1twXS5zcmMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWF0Y2goc3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1bMV0ubWF0Y2goL14oKGh0dHBzP3xmaWxlKVxcOlxcL3syLH18XFx3OltcXC9cXFxcXSkvKSkgcmV0dXJuIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobVsxXS5pbmRleE9mKFwiL1wiKSA9PSAwKSByZXR1cm4gbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmFzZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJbMF0gJiYgYlswXS5ocmVmKSByZXR1cm4gYlswXS5ocmVmICsgbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC8oLipbXFwvXFxcXF0pLylbMF0gKyBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHBhdGgoJ3NoYXJlNDIuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXUpIHUgPSBsb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXQpIHQgPSBkb2N1bWVudC50aXRsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikgZm4gPSAnaWNvbnMucG5nJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlc2MoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWV0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtZXRhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1ldGEubGVuZ3RoOyBtKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YVttXS5uYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2Rlc2NyaXB0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YVttXS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWQpIGQgPSBkZXNjKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBlbmNvZGVVUklDb21wb25lbnQodSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBlbmNvZGVVUklDb21wb25lbnQodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSB0LnJlcGxhY2UoL1xcJy9nLCAnJTI3Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBlbmNvZGVVUklDb21wb25lbnQoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBlbmNvZGVVUklDb21wb25lbnQoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBkLnJlcGxhY2UoL1xcJy9nLCAnJTI3Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmJRdWVyeSA9ICd1PScgKyB1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgZmJRdWVyeSA9ICdzPTEwMCZwW3VybF09JyArIHUgKyAnJnBbdGl0bGVdPScgKyB0ICsgJyZwW3N1bW1hcnldPScgKyBkICsgJyZwW2ltYWdlc11bMF09JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmtJbWFnZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgdmtJbWFnZSA9ICcmaW1hZ2U9JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IG5ldyBBcnJheSgnXCIjXCIgZGF0YS1jb3VudD1cInZrXCIgb25jbGljaz1cIndpbmRvdy5vcGVuKFxcJy8vdmsuY29tL3NoYXJlLnBocD91cmw9JyArIHUgKyAnJnRpdGxlPScgKyB0ICsgdmtJbWFnZSArICcmZGVzY3JpcHRpb249JyArIGQgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQktCa0L7QvdGC0LDQutGC0LVcIicsICdcIiNcIiBkYXRhLWNvdW50PVwiZmJcIiBvbmNsaWNrPVwid2luZG93Lm9wZW4oXFwnLy93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9JyArIHUgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQsiBGYWNlYm9va1wiJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxcSA9IFsnYi1pY29uIGItaWNvbi0tc2hhcmUgYi1pY29uLS12ayBpY29uLXZrJywgJ2ItaWNvbiBiLWljb24tLXNoYXJlIGljb24tZmInXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCArPSAnPGEgY2xhc3M9XCInICsgcXFbal0gKyAnXCIgcmVsPVwibm9mb2xsb3dcIiBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrO1wiIGhyZWY9JyArIHNbal0gKyAnIHRhcmdldD1cIl9ibGFua1wiPjwvYT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlW2tdLmlubmVySFRNTCA9IGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCf0L7RgdC70LUg0L/Rg9Cx0LvQuNC60LDRhtC40Lgg0YHRgtGA0LDQvdC40YbRiyDQuCDQvtGC0L/RgNCw0LLQutC4INCw0Y/QutGB0LBcclxuICAgICAgICBjcmVhdGVkTmV3UGFnZShwYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJHJlZnMuYWxlcnRMaW5rLnRleHRDb250ZW50ID0gYCR7Y3VycmVudE9yaWdpbk9ybH0/aWQ9JHtwYWdlfWA7XHJcbiAgICAgICAgICAgIHRoaXMuJHJlZnMuYWxlcnRMaW5rLmhyZWYgPSBgJHtjdXJyZW50T3JpZ2luT3JsfT9pZD0ke3BhZ2V9YFxyXG4gICAgICAgICAgICB0aGlzLmFsZXJ0SXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LUg0LIg0YTQsNC40YDQsdGN0LnQt1xyXG4gICAgICAgIHB1Ymxpc2hOZXdUaW1lcigpIHtcclxuICAgICAgICAgICAgdnVlX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBpZFBhZ2UgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkpO1xyXG4gICAgICAgICAgICBjb25zdCBpZFBhZ2UgPSAwO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhSlNPTiA9IHtcclxuICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBwcmVIZWFkaW5nOiB2dWVfdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGhlYWRpbmc6IHZ1ZV90aGlzLmhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHZ1ZV90aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBmaW5pc2hEYXRlOiB2dWVfdGhpcy5maW5pc2hEYXRlLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6IHZ1ZV90aGlzLmltYWdlU3JjQmFja2dyb3VuZCxcclxuICAgICAgICAgICAgICAgIGNvbG9yX2k6IHZ1ZV90aGlzLmNvbG9yX2ksXHJcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiB2dWVfdGhpcy5mbG93ZXJCdXR0b24udGV4dCxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkhyZWY6IHZ1ZV90aGlzLmZsb3dlckJ1dHRvbi5saW5rLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkYXRhYmFzZS5yZWYoJ3BhZ2VzLycgKyBpZFBhZ2UpLnNldChkYXRhSlNPTilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3luY2hyb25pemF0aW9uIHN1Y2NlZWRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZ1ZV90aGlzLmNyZWF0ZWROZXdQYWdlKGlkUGFnZSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTeW5jaHJvbml6YXRpb24gZmFpbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCf0YDQuNC80LXQvdGP0LXQvCDQvdC+0LLRi9C1INC00LDQvdC90YvQtSDQuiDRgtCw0LnQvNC10YDRg1xyXG4gICAgICAgIGFjY2VwdERhdGEoZGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgbmV3RGF0ZSA9IG5ldyBEYXRlKGRhdGEuZmluaXNoRGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNWYWxpZERhdGUobmV3RGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vINCV0YHQu9C4INC00LDRgtCwINCy0LXRgNC90LBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vINCV0YHQu9C4INC00LDRgtCwINCd0JUg0LLQtdGA0L3QsFxyXG4gICAgICAgICAgICAgICAgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC/0LXRgNC10LzQtdC90L3Ri9C8INC30L3QsNGH0LXQvdC40Y8g0YEg0YHQtdGA0LLQtdGA0LBcclxuICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IGRhdGEucHJlSGVhZGluZztcclxuICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IGRhdGEuaGVhZGluZztcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gZGF0YS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQv9C10YDQtdC80LXQvdC90YvQvCDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQutC90L7Qv9C60LhcclxuICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24udGV4dCA9IGRhdGEuYnV0dG9uVGV4dDtcclxuICAgICAgICAgICAgdGhpcy5mbG93ZXJCdXR0b24ubGluayA9IGRhdGEuYnV0dG9uSHJlZjtcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQt9Cw0LPQvtC70L7QstC+0Log0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IGRhdGEucGFnZVRpdGxlXHJcbiAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0YTQvtC9XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kID0gZGF0YS5pbWFnZVNyY0JhY2tncm91bmQ7XHJcbiAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0YbQstC10YJcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFwcCA9IHsgJy0tdGhlbWUtY29sb3InOiBkYXRhLmNvbG9yX2kgfTtcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQtNCw0YLRg1xyXG4gICAgICAgICAgICB0aGlzLmZpbmlzaERhdGUgPSBuZXdEYXRlO1xyXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INC90L7QstGD0Y4g0LTQsNGC0YNcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZmluaXNoUHJlbG9hZGluZ0RvbmUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVBcHAucHJlTG9hZGluZ0FwcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZXIoKTtcclxuICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWxlZExvYWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSAnNDA0IDooJztcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0n0J/RgNC+0LjQt9C+0YjQu9CwINC+0YjQuNCx0LrQsCDQv9GA0Lgg0L/QvtC/0YvRgtC60LUg0LfQsNCz0YDRg9C30LjRgtGMINC00LDQvdC90YPRjiDRgdGC0YDQsNC90LjRhtGDLCDQv9GA0L7QstC10YDRjNGC0LUg0L/RgNCw0LLQuNC70YzQvdC+0YHRgtGMINGB0YHRi9C70LrQuCDQuCDQv9C+0LLRgtC+0YDQuNGC0LUg0L/QvtC/0YvRgtC60YMnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBiZWZvcmVDcmVhdGUoKSB7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vINCS0YvQt9GL0LLQsNC10YLRgdGPINGB0LjQvdGF0YDQvtC90L3QviDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDRjdC60LfQtdC80L/Qu9GP0YDQsFxyXG4gICAgY3JlYXRlZCgpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gZGF0YV9qc29uX2RlZmF1bHQ7XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYWNjZXB0RGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgLy8g0J/QvtC70YPRh9Cw0LXQvCDQtNCw0L3QvdGL0LVcclxuICAgICAgICBkYXRhYmFzZS5yZWYoJ3BhZ2VzLycgKyBjdXJyZW50SWRQYWdlLmlkKS5vbmNlKCd2YWx1ZScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnZhbCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5hY2NlcHREYXRhKGUudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDQv9GA0LjQu9C+0LbQtdC90LjQtVxyXG4gICAgICAgICAgICAgICAgX3RoaXMuZmluaXNoUHJlbG9hZGluZ0RvbmUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZmFpbGVkTG9hZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g0JLRi9C30YvQstCw0LXRgtGB0Y8g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGC0L7Qs9C+INC60LDQuiDRjdC60LfQtdC80L/Qu9GP0YAg0LHRi9C7INGB0LzQvtC90YLQuNGA0L7QstCw0L1cclxuICAgIG1vdW50ZWQoKSB7XHJcbiAgICAgICAgLy8g0L/QvtC70YPRh9Cw0LXQvCDQutC+0L3QtdGH0L3Rg9GOINC00LDRgtGDICjQl9Cw0LPQvtC70L7QstC+0Log0JTQsNGC0YspXHJcbiAgICAgICAgLy8gdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcbiAgICAgICAgLy8g0LzQtdC90Y/QtdC8INGI0LXQudGA0YtcclxuICAgICAgICB0aGlzLnNoYXJlQ3JlYXRlTGluaygpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgdGhpcy5hY2NlcHRFZGl0VGV4dCk7XHJcbiAgICB9XHJcbn0pXHJcbiJdLCJmaWxlIjoicGFydGlhbHMvbGFuZGluZ192dWUuanMifQ==
