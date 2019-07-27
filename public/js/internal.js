
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
        pageTitle: "Timer",
        heading: "Loading...",
        preHeading: "",
        description: "",
        finishDate: "",
        imageSrcBackground: "",
        color_i: 172,
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
                    this.vueButtonClass = 'fade';
                    this.vueClockClass = 'editable'; // "editable edited"
                    this.vuePreHeadingClass = 'editable'; // "editable edited"
                    this.vueHeadingClass = 'editable'; // "editable edited"
                    this.vueDescriptionTextClass = 'editable';
                    this.descriptionPanel = '';

                    this.lastEditHeadingMessage = this.headingMessage;
                    this.lastEditDescriptionTextMessage = this.descriptionTextMessage;
                    this.lastEditPreHeadingMessage = this.preHeadingMessage;

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
                    this.stateEditClock = false; // off состояние редактирования даты
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

                // Если прелоадинг
                if (this.stateApp.preLoadingApp) {
                    this.monthName = 'Loading';
                // Если таймер прошёл
                } else if (result < 0) {
                    this.cl_month = "It's over";
                    this.cl_days = '0';
                    this.cl_hours = '00';
                    this.cl_minutes = '00';
                    this.cl_seconds = '00';
                    this.cl_days_title = 'day';
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
                    this.cl_days_title = 'days';

                    if (this.cl_days <= 1) {
                        this.cl_days_title = 'day';
                    }
                }
            },
            createNameOfFinishDate() {
                this.monthName = this.finishDate.toLocaleString('ru-RU', { month: "long", day: 'numeric', hour: 'numeric', minute: 'numeric' });
            },

            // Выбор цвета ==============
            colorPick() {
                this.styleApp = { '--theme-color': this.color_i };
                this.color_i = this.color_i + Math.floor(Math.random() * (30 - 4)) + 4; // Добавляем рандомный цвет от 40 - 4
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
                const idPage = (Math.floor(Math.random() * 100000));
                const dataJSON = {
                    pageTitle: vue_this.headingMessage,
                    preHeading: vue_this.preHeadingMessage,
                    heading: vue_this.headingMessage,
                    description: vue_this.descriptionTextMessage,
                    finishDate: vue_this.finishDate.toString(),
                    imageSrcBackground: vue_this.imageSrcBackground,
                    color_i: vue_this.color_i,
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
                this.descriptionTextMessage ='An error occurred while loading the data, check the id and make sure it exists'
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbnRlcm5hbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gVlVFINC/0YDQuNC70L7QttC10L3QuNC1XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgIGxldCBjdXJyZW50SWRQYWdlID0gcXMucGFyc2UoY3VycmVudFVSTCwgeyBpZ25vcmVRdWVyeVByZWZpeDogdHJ1ZSB9KTtcclxuXHJcbiAgICBpZiAoIWN1cnJlbnRVUkwubWF0Y2goL15cXD9pZD0vaWcpKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9MCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VycmVudE9yaWdpbk9ybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcblxyXG4gICAgY29uc3QgZGF0YV9qc29uX2RlZmF1bHQgPSB7XHJcbiAgICAgICAgcGFnZVRpdGxlOiBcIlRpbWVyXCIsXHJcbiAgICAgICAgaGVhZGluZzogXCJMb2FkaW5nLi4uXCIsXHJcbiAgICAgICAgcHJlSGVhZGluZzogXCJcIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgICAgICBmaW5pc2hEYXRlOiBcIlwiLFxyXG4gICAgICAgIGltYWdlU3JjQmFja2dyb3VuZDogXCJcIixcclxuICAgICAgICBjb2xvcl9pOiAxNzIsXHJcbiAgICB9XHJcblxyXG4gICAgLy8gWW91ciB3ZWIgYXBwJ3MgRmlyZWJhc2UgY29uZmlndXJhdGlvblxyXG4gICAgY29uc3QgZmlyZWJhc2VDb25maWcgPSB7XHJcbiAgICAgICAgYXBpS2V5OiBcIkFJemFTeUFQcTZBMHNEWF91bnIzM1F5OGFxckFidm8yRXJJUkhEc1wiLFxyXG4gICAgICAgIGF1dGhEb21haW46IFwidGltZXItYmE1MmQuZmlyZWJhc2VhcHAuY29tXCIsXHJcbiAgICAgICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly90aW1lci1iYTUyZC5maXJlYmFzZWlvLmNvbVwiLFxyXG4gICAgICAgIHByb2plY3RJZDogXCJ0aW1lci1iYTUyZFwiLFxyXG4gICAgICAgIHN0b3JhZ2VCdWNrZXQ6IFwidGltZXItYmE1MmQuYXBwc3BvdC5jb21cIixcclxuICAgICAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCI0NDg1OTc1ODkxMTlcIixcclxuICAgICAgICBhcHBJZDogXCIxOjQ0ODU5NzU4OTExOTp3ZWI6MWJiNDgwYzA5MDQ3MDdlYVwiXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgRmlyZWJhc2VcclxuICAgIGZpcmViYXNlLmluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xyXG4gICAgY29uc3QgZGF0YWJhc2UgPSBmaXJlYmFzZS5kYXRhYmFzZSgpO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBpc1ZhbGlkRGF0ZShkYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBWVUUgYXBwXHJcbiAgICB2YXIgYXBwTGFuZGluZyA9IG5ldyBWdWUoe1xyXG4gICAgICAgIGVsOiAnI2xhbmRpbmctYXBwJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIC8vINCh0L7RgdGC0L7Rj9C90LjRjyDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICBzdGF0ZUFwcDoge1xyXG4gICAgICAgICAgICAgICAgcHJlTG9hZGluZ0FwcDogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNyZWF0ZVRpbWVyU2hvdzogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIHdlSGF2ZU1vZGlmaWNhdGVUaW1lcjogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDRgSDQvdC+0LLRi9C80Lgg0LTQsNC90L3Ri9C80LhcclxuICAgICAgICAgICAgd2VBbHJlYWR5SGF2ZUNoYW5nZXM6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0LrQvtCz0LTQsCDRhdC+0YLRjyDQsdGLINGA0LDQtyDQv9GA0LjQvNC10L3Rj9C70Lgg0LjQt9C80LXQvdC10L3QuNGPXHJcblxyXG4gICAgICAgICAgICAvLyDQmtC70LDRgdGB0YtcclxuICAgICAgICAgICAgdnVlQXBwQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVCYWNrQ2xhc3M6ICdoaWRlJyxcclxuICAgICAgICAgICAgdnVlU2hhcmVDbGFzczogJycsXHJcbiAgICAgICAgICAgIHZ1ZUNpcmNsZUNsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlQnV0dG9uQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVDbG9ja0NsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlUHJlSGVhZGluZ0NsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlSGVhZGluZ0NsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlRGVzY3JpcHRpb25UZXh0Q2xhc3M6ICcnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvblBhbmVsOiAnaGlkZScsXHJcbiAgICAgICAgICAgIHZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbjogJ2NsYXNzJyxcclxuXHJcbiAgICAgICAgICAgIC8vINCh0YLQuNC70LhcclxuICAgICAgICAgICAgc3R5bGVBcHA6ICcnLFxyXG5cclxuICAgICAgICAgICAgLy8g0KTQvtGC0L5cclxuICAgICAgICAgICAgaW1hZ2VTcmNCYWNrZ3JvdW5kOiAnJyxcclxuXHJcbiAgICAgICAgICAgIHN0YXRlV2FzTW9kaWZpZWQ6IGZhbHNlLCAvLyDQsdGL0LvQviDQu9C+INC70Lgg0LjQt9C80LXQvdC10L3QviDRgdC+0YHRgtC+0Y/QvdC40LVcclxuXHJcbiAgICAgICAgICAgIHN0YXRlRWRpdFByZUhlYWRpbmc6IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/QtdGC0YHRjyDQu9C4INC/0L7QtC3Ql9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICAgICAgc3RhdGVFZGl0SGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0JfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgICAgIHN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dDogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0J7Qv9C40YHQsNC90LjQtVxyXG4gICAgICAgICAgICBzdGF0ZUVkaXRDbG9jazogZmFsc2UsIC8vINC40LfQvNC10L3Rj9GO0YLRgdGPINC70Lgg0YfQsNGB0YtcclxuXHJcbiAgICAgICAgICAgIHdhbGxwYXBlclNpZGVCYXJPcGVuOiBmYWxzZSwgLy8g0J7RgtC60YDRi9GCINC70Lgg0YHQsNC50LQg0LHQsNGAINC00LvRjyDRhNC+0L3QsFxyXG5cclxuICAgICAgICAgICAgaGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC30LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgICAgICBsYXN0RWRpdEhlYWRpbmdNZXNzYWdlOiAnJyxcclxuICAgICAgICAgICAgb2xkSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YLQtdC60YHRgtCwXHJcbiAgICAgICAgICAgIG5ld0hlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0YLQtdC60YHRgtCwXHJcblxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQvtC/0LjRgdCw0L3QuNGPXHJcbiAgICAgICAgICAgIGxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINC+0L/QuNGB0LDQvdC40LUg0L/RgNC10LTRi9C00YPRidC10LPQviDRgdC+0YXRgNCw0L3QtdC90LjRj1xyXG4gICAgICAgICAgICBvbGREZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC+0L/QuNGB0LDQvdC40Y8g0LLQviDQstGA0LXQvNGPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgbmV3RGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC+0L/QuNGB0LDQvdC40Y9cclxuXHJcbiAgICAgICAgICAgIHByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICAgICAgbGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZTogJycsXHJcbiAgICAgICAgICAgIG9sZFByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgICAgICBuZXdQcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG5cclxuICAgICAgICAgICAgLy8g0KLQsNC50LzQtdGAID09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGZpbmlzaERhdGU6ICcnLCAvLyAoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcylcclxuICAgICAgICAgICAgbW9udGhOYW1lOiAnJyxcclxuXHJcbiAgICAgICAgICAgIGludGVydmFsOiBcIlwiLFxyXG4gICAgICAgICAgICBpbnRlcnZhbEluaXQ6IFwiXCIsXHJcbiAgICAgICAgICAgIGNsX21vbnRoOiAnJyxcclxuICAgICAgICAgICAgY2xfZGF5czogJycsXHJcbiAgICAgICAgICAgIGNsX2hvdXJzOiAnJyxcclxuICAgICAgICAgICAgY2xfbWludXRlczogJycsXHJcbiAgICAgICAgICAgIGNsX3NlY29uZHM6ICcnLFxyXG4gICAgICAgICAgICBjbF9kYXlzX3RpdGxlOiAnJyxcclxuXHJcbiAgICAgICAgICAgIGNsb2NrRGF0ZUlucHV0RXJyb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICBjbG9ja1RpbWVJbnB1dEVycm9yOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09XHJcbiAgICAgICAgICAgIGNvbG9yX2k6IDAsXHJcblxyXG4gICAgICAgICAgICAvLyDQvtC/0L7QstC10YnQtdC90LjQtSDQv9GD0LHQu9C40LrQsNGG0LjQuFxyXG4gICAgICAgICAgICBhbGVydElzT3BlbjogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgIC8vINC30LDQv9GD0YHQutCw0LXQvCDRgtCw0LnQvNC10YBcclxuICAgICAgICAgICAgc3RhcnRUaW1lcigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxJbml0ID0gdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgtC10LzRgyDRgNC10LTQvtC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIGNyZWF0ZVRpbWVyKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaW1lclNob3cgPSAhdGhpcy5jcmVhdGVUaW1lclNob3c7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICdtb2RpZmljYXRpb24nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMucHJlSGVhZGluZ01lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDQmtC70LjQuiDQv9C+INCe0YLQvNC10L3QtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVCdXR0b25DbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0UHJlSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IHRoaXMubGFzdEVkaXRIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSBmYWxzZTsgLy/QstGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1IFwi0LIg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQuFwiXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMud2VBbHJlYWR5SGF2ZUNoYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC40LfQvNC10L3QtdC90LjRjyDQn9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICBhY2NlcHRDcmVhdGVUaW1lcigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93OyAvLyDQvNC10L3Rj9C10Lwg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgICAgIC8vINGD0LHQuNCy0LDQtdC8INC60LvQsNGB0YHRiyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IGZhbHNlOyAvLyDQktGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1IFwi0LIg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQuFwiXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIHRoaXMud2VBbHJlYWR5SGF2ZUNoYW5nZXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0YfQsNGB0YsgKNGB0YLQsNCy0LjQvCDQvdC+0LLRg9GOINC00LDRgtGDKVxyXG4gICAgICAgICAgICBlZGl0Q2xvY2soKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gdHJ1ZTsgLy8g0LLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSBlZGl0aW5nJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2FuY2VsRWRpdENsb2NrKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vINGC0LDQudC80LDRg9GCINC00LvRjyDRg9C00LDQu9C10L3QuNGPINGB0LDQvNC+0LPQviDRgdC10LHRj1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFjY2VwdEVkaXRDbG9jaygpIHtcclxuICAgICAgICAgICAgICAgIGxldCAkY2xvY2tJbnB1dERhdGUgPSB0aGlzLiRyZWZzLmVsQ2xvY2tJbnB1dERhdGU7XHJcbiAgICAgICAgICAgICAgICBsZXQgJGNsb2NrSW5wdXRUaW1lID0gdGhpcy4kcmVmcy5lbENsb2NrSW5wdXRUaW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAuINCS0LLQtdC70Lgt0LvQuCDQvNGLINC30L3QsNGH0LXQvdC40Y8/XHJcbiAgICAgICAgICAgICAgICBpZiAoJGNsb2NrSW5wdXREYXRlLnZhbHVlID09ICcnICYmICRjbG9ja0lucHV0VGltZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJGNsb2NrSW5wdXREYXRlLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJGNsb2NrSW5wdXRUaW1lLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dFllYXIgPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dE1vdXRoID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzFdKSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0RGF5ID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRIb3VyID0gTnVtYmVyKCRjbG9ja0lucHV0VGltZS52YWx1ZS5zcGxpdCgnOicpWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRNaW51dGVzID0gTnVtYmVyKCRjbG9ja0lucHV0VGltZS52YWx1ZS5zcGxpdCgnOicpWzFdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlID0gbmV3IERhdGUoY2xvY2tEYXRlSW1wdXRZZWFyLCBjbG9ja0RhdGVJbXB1dE1vdXRoLCBjbG9ja0RhdGVJbXB1dERheSwgY2xvY2tEYXRlSW1wdXRIb3VyLCBjbG9ja0RhdGVJbXB1dE1pbnV0ZXMsIDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINGC0LDQudC80LDRg9GCINC00LvRjyDRg9C00LDQu9C10L3QuNGPINGB0LDQvNC+0LPQviDRgdC10LHRj1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IH0sIDEwMCk7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQv9C+0LQt0LfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgICAgIGVkaXRQcmVIZWFkaW5nKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9sZFByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5wcmVIZWFkaW5nTWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgCwgLy8g0YLQsNC50LzQsNGD0YIg0LbQtNGR0YIg0YHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dFByZUhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dFByZUhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLnByZUhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgICAgICBjb21wbGVhdGVFZGl0UHJlSGVhZGluZygpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y8g0Lgg0L3QtSDRgtCw0LrQsNGPINC20LVcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5vbGRQcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQt9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICAgICAgZWRpdEhlYWRpbmcoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2xkSGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgICAgICBjb21wbGVhdGVFZGl0SGVhZGluZygpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0SGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPINC4INC90LUg0YLQsNC60LDRjyDQttC1XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGluZ01lc3NhZ2UgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IHRoaXMub2xkSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCd0LDRh9C40L3QsNC10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNGC0YwgRGVzY3JpcHRpb25UZXh0XHJcbiAgICAgICAgICAgIGVkaXREZXNjcmlwdGlvblRleHQoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbGREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YBcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0RGVzY3JpcHRpb25UZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNWdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1IERlc2NyaXB0aW9uVGV4dFxyXG4gICAgICAgICAgICBjb21wbGVhdGVFZGl0RGVzY3JpcHRpb25UZXh0KCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLm9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINC/0YDQuNC80LXQvdC40YLRjCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1INGC0LXQutGB0YLQsCDQv9C+INC60LvQsNCy0LjRiNC1INCt0L3RgtGAXHJcbiAgICAgICAgICAgIGFjY2VwdEVkaXRUZXh0OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0LzRiyDQsiDQv9GA0L7RhtC10YHQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC4INGA0LXQtNCw0LrRgtC40YDRg9C10Lwg0LfQsNCz0LDQu9C+0LLQvtC6INC4INC90LDQttCw0LvQuCDRjdC90YLQtdGAXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXRIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXRQcmVIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdERlc2NyaXB0aW9uVGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0KHQutGA0YvQstCw0LXQvCDQv9Cw0L3QtdC70YzQutGDINC+0L/QuNGB0LDQvdC40Y8g0L3QsCDQvNC+0LHQuNC70LVcclxuICAgICAgICAgICAgaGlkZURlc2NyaXB0aW9uUGFuZWwoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblBhbmVsID09PSAnaGlkZScpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8gQ2xvY2sgPT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICBjbG9ja0Z1bmMoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAvLyDRgdC+0LfQtNCw0ZHQvCDQtNCw0YLRgyDQvdC+0LLRg9GOXHJcbiAgICAgICAgICAgICAgICBsZXQgbm93RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZmluaXNoRGF0ZSAtIG5vd0RhdGUpOyAvLyDQv9C+0LvRg9GH0LDQtdC8INGA0LDQt9C90LjRhtGDXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaERhdGUgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTih0aGlzLmZpbmlzaERhdGUpXHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/RgNC10LvQvtCw0LTQuNC90LNcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlQXBwLnByZUxvYWRpbmdBcHApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vbnRoTmFtZSA9ICdMb2FkaW5nJztcclxuICAgICAgICAgICAgICAgIC8vINCV0YHQu9C4INGC0LDQudC80LXRgCDQv9GA0L7RiNGR0LtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfbW9udGggPSBcIkl0J3Mgb3ZlclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5cyA9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gJzAwJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX21pbnV0ZXMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfc2Vjb25kcyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ2RheSc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWNvbmRzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwIC8gNjApICUgNjApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBob3VycyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDAgLyA2MCAvIDYwKSAlIDI0KTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF5cyA9IE1hdGguZmxvb3IocmVzdWx0IC8gMTAwMCAvIDYwIC8gNjAgLyAyNCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChob3VycyA8IDEwKSBob3VycyA9ICcwJyArIGhvdXJzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX21vbnRoID0gdGhpcy5tb250aE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzID0gZGF5cztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gaG91cnM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9taW51dGVzID0gbWludXRlcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX3NlY29uZHMgPSBzZWNvbmRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICdkYXlzJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xfZGF5cyA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICdkYXknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlYXRlTmFtZU9mRmluaXNoRGF0ZSgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9udGhOYW1lID0gdGhpcy5maW5pc2hEYXRlLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbW9udGg6IFwibG9uZ1wiLCBkYXk6ICdudW1lcmljJywgaG91cjogJ251bWVyaWMnLCBtaW51dGU6ICdudW1lcmljJyB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICBjb2xvclBpY2soKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IHRoaXMuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvcl9pID0gdGhpcy5jb2xvcl9pICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDMwIC0gNCkpICsgNDsgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGA0LDQvdC00L7QvNC90YvQuSDRhtCy0LXRgiDQvtGCIDQwIC0gNFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YvQsdC+0YAg0YTQvtC90L7QstC+0LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICAgICAgICAgIHdhbGxwYXBlclBpY2soKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgd2FsbHBhcGVyUGlja0Nsb3NlKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZUltYWdlQmFja2dyb3VuZChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0ICRpbnB1dCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgIGlmICgkaW5wdXQuZmlsZXMgJiYgJGlucHV0LmZpbGVzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZtID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW1hZ2VTcmNCYWNrZ3JvdW5kID0gZS50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTCgkaW5wdXQuZmlsZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDRgdC80LXQvdCwINGE0L7RgtC+INC40Lcg0LrQvtC70LvQtdC60YbQuNC4XHJcbiAgICAgICAgICAgIHN3YXBJbWFnZUJhY2tncm91bmQoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzcmNPZk5ld0JhY2tncm91bmQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS13YWxscGFwZXInKTtcclxuICAgICAgICAgICAgICAgIGlmIChzcmNPZk5ld0JhY2tncm91bmQgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNyY0JhY2tncm91bmQgPSBzcmNPZk5ld0JhY2tncm91bmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyBzaGFyZVxyXG4gICAgICAgICAgICBzaGFyZUNyZWF0ZUxpbmsoKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ItbGFuZGluZ19fc2hhcmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBlLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmNsYXNzTmFtZS5pbmRleE9mKCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpICE9IC0xKSB2YXIgdSA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgIT0gLTEpIHZhciB0ID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZScpICE9IC0xKSB2YXIgaSA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWltYWdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSAhPSAtMSkgdmFyIGQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKSAhPSAtMSkgdmFyIGYgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbnMtZmlsZScpICE9IC0xKSB2YXIgZm4gPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29ucy1maWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwYXRoKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3IgPSBuZXcgUmVnRXhwKCdeKC4qL3wpKCcgKyBuYW1lICsgJykoWyM/XXwkKScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMCwgc2NMID0gc2MubGVuZ3RoOyBwIDwgc2NMOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtID0gU3RyaW5nKHNjW3BdLnNyYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWF0Y2goc3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobVsxXS5tYXRjaCgvXigoaHR0cHM/fGZpbGUpXFw6XFwvezIsfXxcXHc6W1xcL1xcXFxdKS8pKSByZXR1cm4gbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobVsxXS5pbmRleE9mKFwiL1wiKSA9PSAwKSByZXR1cm4gbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jhc2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYlswXSAmJiBiWzBdLmhyZWYpIHJldHVybiBiWzBdLmhyZWYgKyBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC8oLipbXFwvXFxcXF0pLylbMF0gKyBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gcGF0aCgnc2hhcmU0Mi5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1KSB1ID0gbG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdCkgdCA9IGRvY3VtZW50LnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikgZm4gPSAnaWNvbnMucG5nJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZXNjKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21ldGEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1ldGEubGVuZ3RoOyBtKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFbbV0ubmFtZS50b0xvd2VyQ2FzZSgpID09ICdkZXNjcmlwdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhW21dLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkKSBkID0gZGVzYygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdSA9IGVuY29kZVVSSUNvbXBvbmVudCh1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBlbmNvZGVVUklDb21wb25lbnQodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ID0gdC5yZXBsYWNlKC9cXCcvZywgJyUyNycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGVuY29kZVVSSUNvbXBvbmVudChpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBlbmNvZGVVUklDb21wb25lbnQoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkID0gZC5yZXBsYWNlKC9cXCcvZywgJyUyNycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmYlF1ZXJ5ID0gJ3U9JyArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgZmJRdWVyeSA9ICdzPTEwMCZwW3VybF09JyArIHUgKyAnJnBbdGl0bGVdPScgKyB0ICsgJyZwW3N1bW1hcnldPScgKyBkICsgJyZwW2ltYWdlc11bMF09JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZrSW1hZ2UgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9ICdudWxsJyAmJiBpICE9ICcnKSB2a0ltYWdlID0gJyZpbWFnZT0nICsgaTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IG5ldyBBcnJheSgnXCIjXCIgZGF0YS1jb3VudD1cInZrXCIgb25jbGljaz1cIndpbmRvdy5vcGVuKFxcJy8vdmsuY29tL3NoYXJlLnBocD91cmw9JyArIHUgKyAnJnRpdGxlPScgKyB0ICsgdmtJbWFnZSArICcmZGVzY3JpcHRpb249JyArIGQgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQktCa0L7QvdGC0LDQutGC0LVcIicsICdcIiNcIiBkYXRhLWNvdW50PVwiZmJcIiBvbmNsaWNrPVwid2luZG93Lm9wZW4oXFwnLy93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9JyArIHUgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQsiBGYWNlYm9va1wiJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxcSA9IFsnYi1pY29uIGItaWNvbi0tc2hhcmUgYi1pY29uLS12ayBpY29uLXZrJywgJ2ItaWNvbiBiLWljb24tLXNoYXJlIGljb24tZmInXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwgKz0gJzxhIGNsYXNzPVwiJyArIHFxW2pdICsgJ1wiIHJlbD1cIm5vZm9sbG93XCIgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jaztcIiBocmVmPScgKyBzW2pdICsgJyB0YXJnZXQ9XCJfYmxhbmtcIj48L2E+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlW2tdLmlubmVySFRNTCA9IGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J/QvtGB0LvQtSDQv9GD0LHQu9C40LrQsNGG0LjQuCDRgdGC0YDQsNC90LjRhtGLINC4INC+0YLQv9GA0LDQstC60Lgg0LDRj9C60YHQsFxyXG4gICAgICAgICAgICBjcmVhdGVkTmV3UGFnZShwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRPcmlnaW5Pcmx9P2lkPSR7cGFnZX1gO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5hbGVydExpbmsuaHJlZiA9IGAke2N1cnJlbnRPcmlnaW5Pcmx9P2lkPSR7cGFnZX1gXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0SXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8INC00LDQvdC90YvQtSDQsiDRhNCw0LjRgNCx0Y3QudC3XHJcbiAgICAgICAgICAgIHB1Ymxpc2hOZXdUaW1lcigpIHtcclxuICAgICAgICAgICAgICAgIHZ1ZV90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkUGFnZSA9IChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFKU09OID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlSGVhZGluZzogdnVlX3RoaXMucHJlSGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGluZzogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHZ1ZV90aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoRGF0ZTogdnVlX3RoaXMuZmluaXNoRGF0ZS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU3JjQmFja2dyb3VuZDogdnVlX3RoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yX2k6IHZ1ZV90aGlzLmNvbG9yX2ksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZGF0YWJhc2UucmVmKCdwYWdlcy8nICsgaWRQYWdlKS5zZXQoZGF0YUpTT04pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3luY2hyb25pemF0aW9uIHN1Y2NlZWRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2dWVfdGhpcy5jcmVhdGVkTmV3UGFnZShpZFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3luY2hyb25pemF0aW9uIGZhaWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC90L7QstGL0LUg0LTQsNC90L3Ri9C1INC6INGC0LDQudC80LXRgNGDXHJcbiAgICAgICAgICAgIGFjY2VwdERhdGEoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0RhdGUgPSBuZXcgRGF0ZShkYXRhLmZpbmlzaERhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkRGF0ZShuZXdEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINCV0YHQu9C4INC00LDRgtCwINCy0LXRgNC90LBcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0J3QlSDQstC10YDQvdCwXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0L/QtdGA0LXQvNC10L3QvdGL0Lwg0LfQvdCw0YfQtdC90LjRjyDRgSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IGRhdGEucHJlSGVhZGluZztcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSBkYXRhLmhlYWRpbmc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSBkYXRhLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQt9Cw0LPQvtC70L7QstC+0Log0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBkYXRhLnBhZ2VUaXRsZVxyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhNC+0L1cclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kID0gZGF0YS5pbWFnZVNyY0JhY2tncm91bmQ7XHJcbiAgICAgICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INGG0LLQtdGCXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IGRhdGEuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQtNCw0YLRg1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlID0gbmV3RGF0ZTtcclxuICAgICAgICAgICAgICAgIC8vINCy0LrQu9GO0YfQsNC10Lwg0L3QvtCy0YPRjiDQtNCw0YLRg1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmaW5pc2hQcmVsb2FkaW5nRG9uZSgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVBcHAucHJlTG9hZGluZ0FwcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsZWRMb2FkKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9ICc0MDQgOignO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0nQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgbG9hZGluZyB0aGUgZGF0YSwgY2hlY2sgdGhlIGlkIGFuZCBtYWtlIHN1cmUgaXQgZXhpc3RzJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYmVmb3JlQ3JlYXRlKCkge1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQt9GL0LLQsNC10YLRgdGPINGB0LjQvdGF0YDQvtC90L3QviDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDRjdC60LfQtdC80L/Qu9GP0YDQsFxyXG4gICAgICAgIGNyZWF0ZWQoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBkYXRhX2pzb25fZGVmYXVsdDtcclxuICAgICAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmFjY2VwdERhdGEoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyDQn9C+0LvRg9GH0LDQtdC8INC00LDQvdC90YvQtVxyXG4gICAgICAgICAgICBkYXRhYmFzZS5yZWYoJ3BhZ2VzLycgKyBjdXJyZW50SWRQYWdlLmlkKS5vbmNlKCd2YWx1ZScpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFjY2VwdERhdGEoZS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDQv9GA0LjQu9C+0LbQtdC90LjQtVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmZpbmlzaFByZWxvYWRpbmdEb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5mYWlsZWRMb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQktGL0LfRi9Cy0LDQtdGC0YHRjyDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YLQvtCz0L4g0LrQsNC6INGN0LrQt9C10LzQv9C70Y/RgCDQsdGL0Lsg0YHQvNC+0L3RgtC40YDQvtCy0LDQvVxyXG4gICAgICAgIG1vdW50ZWQoKSB7XHJcbiAgICAgICAgICAgIC8vINC/0L7Qu9GD0YfQsNC10Lwg0LrQvtC90LXRh9C90YPRjiDQtNCw0YLRgyAo0JfQsNCz0L7Qu9C+0LLQvtC6INCU0LDRgtGLKVxyXG4gICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuICAgICAgICAgICAgLy8g0LzQtdC90Y/QtdC8INGI0LXQudGA0YtcclxuICAgICAgICAgICAgdGhpcy5zaGFyZUNyZWF0ZUxpbmsoKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCB0aGlzLmFjY2VwdEVkaXRUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG47XG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnZGlzcGxheTogYmxvY2s7IGNvbG9yOiAjMWQ5YmZmOyBmb250OiAxLjZyZW0vMS4zIFRhaG9tYTsnLCAn0JXRgdC70Lgg0LLRiyDQvdCw0YjQu9C4INCx0LDQsywg0L7RgtC/0YDQsNCy0YzRgtC1INC10LPQviDQvtC/0LjRgdCw0L3QuNC1INC80L3QtSDQvdCwINC/0L7Rh9GC0YMgaUFtZWQ3M0B5YW5kZXgucnUnKTtcbn0pO1xuIl0sImZpbGUiOiJpbnRlcm5hbC5qcyJ9
