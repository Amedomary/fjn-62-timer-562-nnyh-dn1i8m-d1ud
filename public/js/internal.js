
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
        finishDate: "0",
        imageSrcBackground: "0",
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

    // VUE app
    var appLanding = new Vue({
        el: '#landing-app',
        data: {
            createTimerShow: false, // состояние редактирования
            weHaveModificateTimer: false, // состояние с новыми данными
            weAlreadyHaveChanges: false, // состояние когда хотя бы раз применяли изменения

            // Классы
            vueAppClass: '',
            vueBackClass: '',
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
            // Включаем тему редоктирования
            createTimer: function () {
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
            acceptCreateTimer: function () {
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
            editClock: function () {
                if (this.createTimerShow) {
                    this.stateEditClock = true; // включаем состояние редактирования даты
                    this.vueClockClass = 'editable editing';
                }
            },
            cancelEditClock: function () {
                setTimeout(() => { // таймаут для удаления самого себя
                    this.stateEditClock = false; // off состояние редактирования даты
                    this.vueClockClass = 'editable';
                    this.clockDateInputError = false;
                    this.clockTimeInputError = false;
                }, 100);
            },
            acceptEditClock: function () {
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
            editPreHeading: function () {
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
            compleateEditPreHeading: function () {
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
            editHeading: function () {
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
            compleateEditHeading: function () {
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
            editDescriptionText: function () {
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
            compleateEditDescriptionText: function () {
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
            hideDescriptionPanel: function () {
                if (this.descriptionPanel === 'hide') {
                    this.descriptionPanel = '';
                } else {
                    this.descriptionPanel = 'hide';
                }
            },

            // Clock ================
            clockFunc: function () {
                // // создаём дату новую
                var nowDate = new Date();
                var result = (this.finishDate - nowDate); // получаем разницу

                // Если таймер прошёл
                if (result < 0) {
                    this.cl_month = "It's over";
                    this.cl_days = '0';
                    this.cl_hours = '00';
                    this.cl_minutes = '00';
                    this.cl_seconds = '00';
                    this.cl_days_title = 'day';
                } else {
                    var seconds = Math.floor((result / 1000) % 60);
                    var minutes = Math.floor((result / 1000 / 60) % 60);
                    var hours = Math.floor((result / 1000 / 60 / 60) % 24);
                    var days = Math.floor(result / 1000 / 60 / 60 / 24);

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
            createNameOfFinishDate: function () {
                this.monthName = this.finishDate.toLocaleString('ru-RU', { month: "long", day: 'numeric', hour: 'numeric', minute: 'numeric' });
            },

            // Выбор цвета ==============
            colorPick: function () {
                this.styleApp = { '--theme-color': this.color_i };
                this.color_i = this.color_i + Math.floor(Math.random() * (30 - 4)) + 4; // Добавляем рандомный цвет от 40 - 4
                this.stateWasModified = true;
            },

            // Выбор фонового изображения
            wallpaperPick: function () {
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
            shareCreateLink: function () {
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

            // Отправляем данные в фб
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
                this.finishDate = new Date(data.finishDate);
            }
        },

        beforeCreate() {
        },

        // Вызывается синхронно сразу после создания экземпляра
        created() {
            const data = data_json_default;
            const this_vue = this;
            this.acceptData(data);

            // Получаем данные
            database.ref('pages/' + currentIdPage.id).once('value')
                .then(function (e) {
                    console.log(e.val());
                    console.log('Complite');
                    console.log(currentIdPage.id);
                    this_vue.acceptData(e.val());
                })
                .catch(function (error) {
                    console.log(error);
                    console.log('failed');
                });
        },

        // Вызывается сразу после того как экземпляр был смонтирован
        mounted() {
            // получаем конечную дату (Заголовок Даты)
            this.createNameOfFinishDate();
            // запускаем таймер
            this.intervalInit = this.clockFunc();
            this.interval = setInterval(() => {
                this.clockFunc();
            }, 1000);
            // меняем шейры
            this.shareCreateLink();
            document.addEventListener('keypress', this.acceptEditText);
        }
    })
;
    console.log('%c%s', 'display: block; color: #1d9bff; font: 1.6rem/1.3 Tahoma;', 'Если вы нашли баг, отправьте его описание мне на почту iAmed73@yandex.ru');
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbnRlcm5hbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gVlVFINC/0YDQuNC70L7QttC10L3QuNC1XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgIGxldCBjdXJyZW50SWRQYWdlID0gcXMucGFyc2UoY3VycmVudFVSTCwgeyBpZ25vcmVRdWVyeVByZWZpeDogdHJ1ZSB9KTtcclxuXHJcbiAgICBpZiAoIWN1cnJlbnRVUkwubWF0Y2goL15cXD9pZD0vaWcpKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9MCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VycmVudE9yaWdpbk9ybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcblxyXG4gICAgY29uc3QgZGF0YV9qc29uX2RlZmF1bHQgPSB7XHJcbiAgICAgICAgcGFnZVRpdGxlOiBcIlRpbWVyXCIsXHJcbiAgICAgICAgaGVhZGluZzogXCJMb2FkaW5nLi4uXCIsXHJcbiAgICAgICAgcHJlSGVhZGluZzogXCJcIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgICAgICBmaW5pc2hEYXRlOiBcIjBcIixcclxuICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6IFwiMFwiLFxyXG4gICAgICAgIGNvbG9yX2k6IDE3MixcclxuICAgIH1cclxuXHJcbiAgICAvLyBZb3VyIHdlYiBhcHAncyBGaXJlYmFzZSBjb25maWd1cmF0aW9uXHJcbiAgICBjb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcclxuICAgICAgICBhcGlLZXk6IFwiQUl6YVN5QVBxNkEwc0RYX3VucjMzUXk4YXFyQWJ2bzJFcklSSERzXCIsXHJcbiAgICAgICAgYXV0aERvbWFpbjogXCJ0aW1lci1iYTUyZC5maXJlYmFzZWFwcC5jb21cIixcclxuICAgICAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3RpbWVyLWJhNTJkLmZpcmViYXNlaW8uY29tXCIsXHJcbiAgICAgICAgcHJvamVjdElkOiBcInRpbWVyLWJhNTJkXCIsXHJcbiAgICAgICAgc3RvcmFnZUJ1Y2tldDogXCJ0aW1lci1iYTUyZC5hcHBzcG90LmNvbVwiLFxyXG4gICAgICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjQ0ODU5NzU4OTExOVwiLFxyXG4gICAgICAgIGFwcElkOiBcIjE6NDQ4NTk3NTg5MTE5OndlYjoxYmI0ODBjMDkwNDcwN2VhXCJcclxuICAgIH07XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxyXG4gICAgZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XHJcbiAgICBjb25zdCBkYXRhYmFzZSA9IGZpcmViYXNlLmRhdGFiYXNlKCk7XHJcblxyXG4gICAgLy8gVlVFIGFwcFxyXG4gICAgdmFyIGFwcExhbmRpbmcgPSBuZXcgVnVlKHtcclxuICAgICAgICBlbDogJyNsYW5kaW5nLWFwcCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBjcmVhdGVUaW1lclNob3c6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICB3ZUhhdmVNb2RpZmljYXRlVGltZXI6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0YEg0L3QvtCy0YvQvNC4INC00LDQvdC90YvQvNC4XHJcbiAgICAgICAgICAgIHdlQWxyZWFkeUhhdmVDaGFuZ2VzOiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INC60L7Qs9C00LAg0YXQvtGC0Y8g0LHRiyDRgNCw0Lcg0L/RgNC40LzQtdC90Y/Qu9C4INC40LfQvNC10L3QtdC90LjRj1xyXG5cclxuICAgICAgICAgICAgLy8g0JrQu9Cw0YHRgdGLXHJcbiAgICAgICAgICAgIHZ1ZUFwcENsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlQmFja0NsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlU2hhcmVDbGFzczogJycsXHJcbiAgICAgICAgICAgIHZ1ZUNpcmNsZUNsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlQnV0dG9uQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVDbG9ja0NsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlUHJlSGVhZGluZ0NsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlSGVhZGluZ0NsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlRGVzY3JpcHRpb25UZXh0Q2xhc3M6ICcnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvblBhbmVsOiAnaGlkZScsXHJcbiAgICAgICAgICAgIHZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbjogJ2NsYXNzJyxcclxuXHJcbiAgICAgICAgICAgIC8vINCh0YLQuNC70LhcclxuICAgICAgICAgICAgc3R5bGVBcHA6ICcnLFxyXG5cclxuICAgICAgICAgICAgLy8g0KTQvtGC0L5cclxuICAgICAgICAgICAgaW1hZ2VTcmNCYWNrZ3JvdW5kOiAnJyxcclxuXHJcbiAgICAgICAgICAgIHN0YXRlV2FzTW9kaWZpZWQ6IGZhbHNlLCAvLyDQsdGL0LvQviDQu9C+INC70Lgg0LjQt9C80LXQvdC10L3QviDRgdC+0YHRgtC+0Y/QvdC40LVcclxuXHJcbiAgICAgICAgICAgIHN0YXRlRWRpdFByZUhlYWRpbmc6IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/QtdGC0YHRjyDQu9C4INC/0L7QtC3Ql9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICAgICAgc3RhdGVFZGl0SGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0JfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgICAgIHN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dDogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0J7Qv9C40YHQsNC90LjQtVxyXG4gICAgICAgICAgICBzdGF0ZUVkaXRDbG9jazogZmFsc2UsIC8vINC40LfQvNC10L3Rj9GO0YLRgdGPINC70Lgg0YfQsNGB0YtcclxuXHJcbiAgICAgICAgICAgIHdhbGxwYXBlclNpZGVCYXJPcGVuOiBmYWxzZSwgLy8g0J7RgtC60YDRi9GCINC70Lgg0YHQsNC50LQg0LHQsNGAINC00LvRjyDRhNC+0L3QsFxyXG5cclxuICAgICAgICAgICAgaGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC30LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgICAgICBsYXN0RWRpdEhlYWRpbmdNZXNzYWdlOiAnJyxcclxuICAgICAgICAgICAgb2xkSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YLQtdC60YHRgtCwXHJcbiAgICAgICAgICAgIG5ld0hlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0YLQtdC60YHRgtCwXHJcblxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQvtC/0LjRgdCw0L3QuNGPXHJcbiAgICAgICAgICAgIGxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINC+0L/QuNGB0LDQvdC40LUg0L/RgNC10LTRi9C00YPRidC10LPQviDRgdC+0YXRgNCw0L3QtdC90LjRj1xyXG4gICAgICAgICAgICBvbGREZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC+0L/QuNGB0LDQvdC40Y8g0LLQviDQstGA0LXQvNGPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgbmV3RGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC+0L/QuNGB0LDQvdC40Y9cclxuXHJcbiAgICAgICAgICAgIHByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICAgICAgbGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZTogJycsXHJcbiAgICAgICAgICAgIG9sZFByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgICAgICBuZXdQcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vINCi0LDQudC80LXRgCA9PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICBmaW5pc2hEYXRlOiAnJywgLy8gKHllYXIsIG1vbnRoLCBkYXRlLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbXMpXHJcbiAgICAgICAgICAgIG1vbnRoTmFtZTogJycsXHJcblxyXG4gICAgICAgICAgICBpbnRlcnZhbDogXCJcIixcclxuICAgICAgICAgICAgaW50ZXJ2YWxJbml0OiBcIlwiLFxyXG4gICAgICAgICAgICBjbF9tb250aDogJycsXHJcbiAgICAgICAgICAgIGNsX2RheXM6ICcnLFxyXG4gICAgICAgICAgICBjbF9ob3VyczogJycsXHJcbiAgICAgICAgICAgIGNsX21pbnV0ZXM6ICcnLFxyXG4gICAgICAgICAgICBjbF9zZWNvbmRzOiAnJyxcclxuICAgICAgICAgICAgY2xfZGF5c190aXRsZTogJycsXHJcblxyXG4gICAgICAgICAgICBjbG9ja0RhdGVJbnB1dEVycm9yOiBmYWxzZSxcclxuICAgICAgICAgICAgY2xvY2tUaW1lSW5wdXRFcnJvcjogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAvLyDQktGL0LHQvtGAINGG0LLQtdGC0LAgPT09PT09PVxyXG4gICAgICAgICAgICBjb2xvcl9pOiAwLFxyXG5cclxuICAgICAgICAgICAgLy8g0L7Qv9C+0LLQtdGJ0LXQvdC40LUg0L/Rg9Cx0LvQuNC60LDRhtC40LhcclxuICAgICAgICAgICAgYWxlcnRJc09wZW46IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWV0aG9kczoge1xyXG4gICAgICAgICAgICAvLyDQktC60LvRjtGH0LDQtdC8INGC0LXQvNGDINGA0LXQtNC+0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgY3JlYXRlVGltZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQXBwQ2xhc3MgPSAnbW9kaWZpY2F0aW9uJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnaGlkZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDaXJjbGVDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZVByZUhlYWRpbmdDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdEhlYWRpbmdNZXNzYWdlID0gdGhpcy5oZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RFZGl0UHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLnByZUhlYWRpbmdNZXNzYWdlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IGZhbHNlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g0JrQu9C40Log0L/QviDQntGC0LzQtdC90LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDaXJjbGVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZVByZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5sYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5sYXN0RWRpdERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IGZhbHNlOyAvLyBvZmYg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gZmFsc2U7IC8v0LLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSBcItCyINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LhcIlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLndlQWxyZWFkeUhhdmVDaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCf0YDQuNC80LXQvdGP0LXQvCDQuNC30LzQtdC90LXQvdC40Y8g0J/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgYWNjZXB0Q3JlYXRlVGltZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93OyAvLyDQvNC10L3Rj9C10Lwg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgICAgIC8vINGD0LHQuNCy0LDQtdC8INC60LvQsNGB0YHRiyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IGZhbHNlOyAvLyDQktGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1IFwi0LIg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQuFwiXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIHRoaXMud2VBbHJlYWR5SGF2ZUNoYW5nZXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0YfQsNGB0YsgKNGB0YLQsNCy0LjQvCDQvdC+0LLRg9GOINC00LDRgtGDKVxyXG4gICAgICAgICAgICBlZGl0Q2xvY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSB0cnVlOyAvLyDQstC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlIGVkaXRpbmcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYW5jZWxFZGl0Q2xvY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyDRgtCw0LnQvNCw0YPRgiDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyDRgdCw0LzQvtCz0L4g0YHQtdCx0Y9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhY2NlcHRFZGl0Q2xvY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCAkY2xvY2tJbnB1dERhdGUgPSB0aGlzLiRyZWZzLmVsQ2xvY2tJbnB1dERhdGU7XHJcbiAgICAgICAgICAgICAgICBsZXQgJGNsb2NrSW5wdXRUaW1lID0gdGhpcy4kcmVmcy5lbENsb2NrSW5wdXRUaW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAuINCS0LLQtdC70Lgt0LvQuCDQvNGLINC30L3QsNGH0LXQvdC40Y8/XHJcbiAgICAgICAgICAgICAgICBpZiAoJGNsb2NrSW5wdXREYXRlLnZhbHVlID09ICcnICYmICRjbG9ja0lucHV0VGltZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJGNsb2NrSW5wdXREYXRlLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJGNsb2NrSW5wdXRUaW1lLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dFllYXIgPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dE1vdXRoID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzFdKSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0RGF5ID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRIb3VyID0gTnVtYmVyKCRjbG9ja0lucHV0VGltZS52YWx1ZS5zcGxpdCgnOicpWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRNaW51dGVzID0gTnVtYmVyKCRjbG9ja0lucHV0VGltZS52YWx1ZS5zcGxpdCgnOicpWzFdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlID0gbmV3IERhdGUoY2xvY2tEYXRlSW1wdXRZZWFyLCBjbG9ja0RhdGVJbXB1dE1vdXRoLCBjbG9ja0RhdGVJbXB1dERheSwgY2xvY2tEYXRlSW1wdXRIb3VyLCBjbG9ja0RhdGVJbXB1dE1pbnV0ZXMsIDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINGC0LDQudC80LDRg9GCINC00LvRjyDRg9C00LDQu9C10L3QuNGPINGB0LDQvNC+0LPQviDRgdC10LHRj1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IH0sIDEwMCk7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQv9C+0LQt0LfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgICAgIGVkaXRQcmVIZWFkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2xkUHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLnByZUhlYWRpbmdNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGALCAvLyDRgtCw0LnQvNCw0YPRgiDQttC00ZHRgiDRgdC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LBcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0UHJlSGVhZGluZy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0UHJlSGVhZGluZy5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUucHJlSGVhZGluZ01lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1XHJcbiAgICAgICAgICAgIGNvbXBsZWF0ZUVkaXRQcmVIZWFkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPINC4INC90LUg0YLQsNC60LDRjyDQttC1XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMub2xkUHJlSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCd0LDRh9C40L3QsNC10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Ywg0LfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgICAgIGVkaXRIZWFkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2xkSGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgICAgICBjb21wbGVhdGVFZGl0SGVhZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y8g0Lgg0L3QtSDRgtCw0LrQsNGPINC20LVcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkaW5nTWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gdGhpcy5vbGRIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCBEZXNjcmlwdGlvblRleHRcclxuICAgICAgICAgICAgZWRpdERlc2NyaXB0aW9uVGV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2xkRGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dERlc2NyaXB0aW9uVGV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0RGVzY3JpcHRpb25UZXh0Lm9uaW5wdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Z1ZS5kZXNjcmlwdGlvblRleHRNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtSBEZXNjcmlwdGlvblRleHRcclxuICAgICAgICAgICAgY29tcGxlYXRlRWRpdERlc2NyaXB0aW9uVGV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLm9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINC/0YDQuNC80LXQvdC40YLRjCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1INGC0LXQutGB0YLQsCDQv9C+INC60LvQsNCy0LjRiNC1INCt0L3RgtGAXHJcbiAgICAgICAgICAgIGFjY2VwdEVkaXRUZXh0OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0LzRiyDQsiDQv9GA0L7RhtC10YHQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC4INGA0LXQtNCw0LrRgtC40YDRg9C10Lwg0LfQsNCz0LDQu9C+0LLQvtC6INC4INC90LDQttCw0LvQuCDRjdC90YLQtdGAXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXRIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXRQcmVIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdERlc2NyaXB0aW9uVGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0KHQutGA0YvQstCw0LXQvCDQv9Cw0L3QtdC70YzQutGDINC+0L/QuNGB0LDQvdC40Y8g0L3QsCDQvNC+0LHQuNC70LVcclxuICAgICAgICAgICAgaGlkZURlc2NyaXB0aW9uUGFuZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPT09ICdoaWRlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnaGlkZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyBDbG9jayA9PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGNsb2NrRnVuYzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gLy8g0YHQvtC30LTQsNGR0Lwg0LTQsNGC0YMg0L3QvtCy0YPRjlxyXG4gICAgICAgICAgICAgICAgdmFyIG5vd0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICh0aGlzLmZpbmlzaERhdGUgLSBub3dEYXRlKTsgLy8g0L/QvtC70YPRh9Cw0LXQvCDRgNCw0LfQvdC40YbRg1xyXG5cclxuICAgICAgICAgICAgICAgIC8vINCV0YHQu9C4INGC0LDQudC80LXRgCDQv9GA0L7RiNGR0LtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9tb250aCA9IFwiSXQncyBvdmVyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzID0gJzAnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfaG91cnMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfbWludXRlcyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9zZWNvbmRzID0gJzAwJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXNfdGl0bGUgPSAnZGF5JztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwKSAlIDYwKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWludXRlcyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDAgLyA2MCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCAvIDYwIC8gNjApICUgMjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXlzID0gTWF0aC5mbG9vcihyZXN1bHQgLyAxMDAwIC8gNjAgLyA2MCAvIDI0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvdXJzIDwgMTApIGhvdXJzID0gJzAnICsgaG91cnM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfbW9udGggPSB0aGlzLm1vbnRoTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSBkYXlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfaG91cnMgPSBob3VycztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX21pbnV0ZXMgPSBtaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfc2Vjb25kcyA9IHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ2RheXMnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbF9kYXlzIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ2RheSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGVOYW1lT2ZGaW5pc2hEYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoTmFtZSA9IHRoaXMuZmluaXNoRGF0ZS50b0xvY2FsZVN0cmluZygncnUtUlUnLCB7IG1vbnRoOiBcImxvbmdcIiwgZGF5OiAnbnVtZXJpYycsIGhvdXI6ICdudW1lcmljJywgbWludXRlOiAnbnVtZXJpYycgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQktGL0LHQvtGAINGG0LLQtdGC0LAgPT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgY29sb3JQaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IHRoaXMuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvcl9pID0gdGhpcy5jb2xvcl9pICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDMwIC0gNCkpICsgNDsgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGA0LDQvdC00L7QvNC90YvQuSDRhtCy0LXRgiDQvtGCIDQwIC0gNFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YvQsdC+0YAg0YTQvtC90L7QstC+0LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICAgICAgICAgIHdhbGxwYXBlclBpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB3YWxscGFwZXJQaWNrQ2xvc2UoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hhbmdlSW1hZ2VCYWNrZ3JvdW5kKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgJGlucHV0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCRpbnB1dC5maWxlcyAmJiAkaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5pbWFnZVNyY0JhY2tncm91bmQgPSBlLnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKCRpbnB1dC5maWxlc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINGB0LzQtdC90LAg0YTQvtGC0L4g0LjQtyDQutC+0LvQu9C10LrRhtC40LhcclxuICAgICAgICAgICAgc3dhcEltYWdlQmFja2dyb3VuZChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNyY09mTmV3QmFja2dyb3VuZCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXdhbGxwYXBlcicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNyY09mTmV3QmFja2dyb3VuZCAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlU3JjQmFja2dyb3VuZCA9IHNyY09mTmV3QmFja2dyb3VuZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vIHNoYXJlXHJcbiAgICAgICAgICAgIHNoYXJlQ3JlYXRlTGluazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiLWxhbmRpbmdfX3NoYXJlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgZS5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5jbGFzc05hbWUuaW5kZXhPZignJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKSAhPSAtMSkgdmFyIHUgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpICE9IC0xKSB2YXIgdCA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2UnKSAhPSAtMSkgdmFyIGkgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWRlc2NyaXB0aW9uJykgIT0gLTEpIHZhciBkID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJykgIT0gLTEpIHZhciBmID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWljb25zLWZpbGUnKSAhPSAtMSkgdmFyIGZuID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbnMtZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcGF0aChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzYyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyID0gbmV3IFJlZ0V4cCgnXiguKi98KSgnICsgbmFtZSArICcpKFsjP118JCknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IDAsIHNjTCA9IHNjLmxlbmd0aDsgcCA8IHNjTDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IFN0cmluZyhzY1twXS5zcmMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hdGNoKHNyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1bMV0ubWF0Y2goL14oKGh0dHBzP3xmaWxlKVxcOlxcL3syLH18XFx3OltcXC9cXFxcXSkvKSkgcmV0dXJuIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1bMV0uaW5kZXhPZihcIi9cIikgPT0gMCkgcmV0dXJuIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdiYXNlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJbMF0gJiYgYlswXS5ocmVmKSByZXR1cm4gYlswXS5ocmVmICsgbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvKC4qW1xcL1xcXFxdKS8pWzBdICsgbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHBhdGgoJ3NoYXJlNDIuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdSkgdSA9IGxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXQpIHQgPSBkb2N1bWVudC50aXRsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZm4pIGZuID0gJ2ljb25zLnBuZyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZGVzYygpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWV0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtZXRhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBtZXRhLmxlbmd0aDsgbSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXRhW21dLm5hbWUudG9Mb3dlckNhc2UoKSA9PSAnZGVzY3JpcHRpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YVttXS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZCkgZCA9IGRlc2MoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBlbmNvZGVVUklDb21wb25lbnQodSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHQucmVwbGFjZSgvXFwnL2csICclMjcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBlbmNvZGVVUklDb21wb25lbnQoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkID0gZW5jb2RlVVJJQ29tcG9uZW50KGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZCA9IGQucmVwbGFjZSgvXFwnL2csICclMjcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmJRdWVyeSA9ICd1PScgKyB1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT0gJ251bGwnICYmIGkgIT0gJycpIGZiUXVlcnkgPSAncz0xMDAmcFt1cmxdPScgKyB1ICsgJyZwW3RpdGxlXT0nICsgdCArICcmcFtzdW1tYXJ5XT0nICsgZCArICcmcFtpbWFnZXNdWzBdPScgKyBpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2a0ltYWdlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgdmtJbWFnZSA9ICcmaW1hZ2U9JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBuZXcgQXJyYXkoJ1wiI1wiIGRhdGEtY291bnQ9XCJ2a1wiIG9uY2xpY2s9XCJ3aW5kb3cub3BlbihcXCcvL3ZrLmNvbS9zaGFyZS5waHA/dXJsPScgKyB1ICsgJyZ0aXRsZT0nICsgdCArIHZrSW1hZ2UgKyAnJmRlc2NyaXB0aW9uPScgKyBkICsgJ1xcJywgXFwnX2JsYW5rXFwnLCBcXCdzY3JvbGxiYXJzPTAsIHJlc2l6YWJsZT0xLCBtZW51YmFyPTAsIGxlZnQ9MTAwLCB0b3A9MTAwLCB3aWR0aD01NTAsIGhlaWdodD00NDAsIHRvb2xiYXI9MCwgc3RhdHVzPTBcXCcpO3JldHVybiBmYWxzZVwiIHRpdGxlPVwi0J/QvtC00LXQu9C40YLRjNGB0Y8g0JLQmtC+0L3RgtCw0LrRgtC1XCInLCAnXCIjXCIgZGF0YS1jb3VudD1cImZiXCIgb25jbGljaz1cIndpbmRvdy5vcGVuKFxcJy8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScgKyB1ICsgJ1xcJywgXFwnX2JsYW5rXFwnLCBcXCdzY3JvbGxiYXJzPTAsIHJlc2l6YWJsZT0xLCBtZW51YmFyPTAsIGxlZnQ9MTAwLCB0b3A9MTAwLCB3aWR0aD01NTAsIGhlaWdodD00NDAsIHRvb2xiYXI9MCwgc3RhdHVzPTBcXCcpO3JldHVybiBmYWxzZVwiIHRpdGxlPVwi0J/QvtC00LXQu9C40YLRjNGB0Y8g0LIgRmFjZWJvb2tcIicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXEgPSBbJ2ItaWNvbiBiLWljb24tLXNoYXJlIGItaWNvbi0tdmsgaWNvbi12aycsICdiLWljb24gYi1pY29uLS1zaGFyZSBpY29uLWZiJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsICs9ICc8YSBjbGFzcz1cIicgKyBxcVtqXSArICdcIiByZWw9XCJub2ZvbGxvd1wiIHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7XCIgaHJlZj0nICsgc1tqXSArICcgdGFyZ2V0PVwiX2JsYW5rXCI+PC9hPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZVtrXS5pbm5lckhUTUwgPSBsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCf0L7RgdC70LUg0L/Rg9Cx0LvQuNC60LDRhtC40Lgg0YHRgtGA0LDQvdC40YbRiyDQuCDQvtGC0L/RgNCw0LLQutC4INCw0Y/QutGB0LBcclxuICAgICAgICAgICAgY3JlYXRlZE5ld1BhZ2UocGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5hbGVydExpbmsudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50T3JpZ2luT3JsfT9pZD0ke3BhZ2V9YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuYWxlcnRMaW5rLmhyZWYgPSBgJHtjdXJyZW50T3JpZ2luT3JsfT9pZD0ke3BhZ2V9YFxyXG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydElzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LUg0LIg0YTQsVxyXG4gICAgICAgICAgICBwdWJsaXNoTmV3VGltZXIoKSB7XHJcbiAgICAgICAgICAgICAgICB2dWVfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZFBhZ2UgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhSlNPTiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlVGl0bGU6IHZ1ZV90aGlzLmhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZUhlYWRpbmc6IHZ1ZV90aGlzLnByZUhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRpbmc6IHZ1ZV90aGlzLmhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB2dWVfdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmlzaERhdGU6IHZ1ZV90aGlzLmZpbmlzaERhdGUudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6IHZ1ZV90aGlzLmltYWdlU3JjQmFja2dyb3VuZCxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcl9pOiB2dWVfdGhpcy5jb2xvcl9pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGRhdGFiYXNlLnJlZigncGFnZXMvJyArIGlkUGFnZSkuc2V0KGRhdGFKU09OKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N5bmNocm9uaXphdGlvbiBzdWNjZWVkZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdnVlX3RoaXMuY3JlYXRlZE5ld1BhZ2UoaWRQYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N5bmNocm9uaXphdGlvbiBmYWlsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IGZhbHNlOyAvLyDQktGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCf0YDQuNC80LXQvdGP0LXQvCDQvdC+0LLRi9C1INC00LDQvdC90YvQtSDQuiDRgtCw0LnQvNC10YDRg1xyXG4gICAgICAgICAgICBhY2NlcHREYXRhKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0L/QtdGA0LXQvNC10L3QvdGL0Lwg0LfQvdCw0YfQtdC90LjRjyDRgSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IGRhdGEucHJlSGVhZGluZztcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSBkYXRhLmhlYWRpbmc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSBkYXRhLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQt9Cw0LPQvtC70L7QstC+0Log0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBkYXRhLnBhZ2VUaXRsZVxyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhNC+0L1cclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kID0gZGF0YS5pbWFnZVNyY0JhY2tncm91bmQ7XHJcbiAgICAgICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INGG0LLQtdGCXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IGRhdGEuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQtNCw0YLRg1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlID0gbmV3IERhdGUoZGF0YS5maW5pc2hEYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJlZm9yZUNyZWF0ZSgpIHtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQktGL0LfRi9Cy0LDQtdGC0YHRjyDRgdC40L3RhdGA0L7QvdC90L4g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0Y3QutC30LXQvNC/0LvRj9GA0LBcclxuICAgICAgICBjcmVhdGVkKCkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZGF0YV9qc29uX2RlZmF1bHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfdnVlID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5hY2NlcHREYXRhKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8g0J/QvtC70YPRh9Cw0LXQvCDQtNCw0L3QvdGL0LVcclxuICAgICAgICAgICAgZGF0YWJhc2UucmVmKCdwYWdlcy8nICsgY3VycmVudElkUGFnZS5pZCkub25jZSgndmFsdWUnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29tcGxpdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50SWRQYWdlLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzX3Z1ZS5hY2NlcHREYXRhKGUudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZhaWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JLRi9C30YvQstCw0LXRgtGB0Y8g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGC0L7Qs9C+INC60LDQuiDRjdC60LfQtdC80L/Qu9GP0YAg0LHRi9C7INGB0LzQvtC90YLQuNGA0L7QstCw0L1cclxuICAgICAgICBtb3VudGVkKCkge1xyXG4gICAgICAgICAgICAvLyDQv9C+0LvRg9GH0LDQtdC8INC60L7QvdC10YfQvdGD0Y4g0LTQsNGC0YMgKNCX0LDQs9C+0LvQvtCy0L7QuiDQlNCw0YLRiylcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcbiAgICAgICAgICAgIC8vINC30LDQv9GD0YHQutCw0LXQvCDRgtCw0LnQvNC10YBcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbEluaXQgPSB0aGlzLmNsb2NrRnVuYygpO1xyXG4gICAgICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIC8vINC80LXQvdGP0LXQvCDRiNC10LnRgNGLXHJcbiAgICAgICAgICAgIHRoaXMuc2hhcmVDcmVhdGVMaW5rKCk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgdGhpcy5hY2NlcHRFZGl0VGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuO1xuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2Rpc3BsYXk6IGJsb2NrOyBjb2xvcjogIzFkOWJmZjsgZm9udDogMS42cmVtLzEuMyBUYWhvbWE7JywgJ9CV0YHQu9C4INCy0Ysg0L3QsNGI0LvQuCDQsdCw0LMsINC+0YLQv9GA0LDQstGM0YLQtSDQtdCz0L4g0L7Qv9C40YHQsNC90LjQtSDQvNC90LUg0L3QsCDQv9C+0YfRgtGDIGlBbWVkNzNAeWFuZGV4LnJ1Jyk7XG59KTtcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==
