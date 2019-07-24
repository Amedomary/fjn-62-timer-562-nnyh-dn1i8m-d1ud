
$(document).ready(() => {
    // ====================
    // VUE приложение
    // ====================

    let currentURL = window.location.search;
    let currentIdPage = qs.parse(currentURL, { ignoreQueryPrefix: true });

    if (!currentURL.match(/^\?id=/ig)) {
        window.location.search = '?id=';
    }

    const currentOriginOrl = window.location.origin;

    const data_json_default = {
        pageTitle: "Timer",
        preHeading: "тест",
        heading: "Loading...",
        description: "тест",
        imageSrcBackground: "0",
        color_i: 172,
        finishDate: "0"
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbnRlcm5hbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gVlVFINC/0YDQuNC70L7QttC10L3QuNC1XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgIGxldCBjdXJyZW50SWRQYWdlID0gcXMucGFyc2UoY3VycmVudFVSTCwgeyBpZ25vcmVRdWVyeVByZWZpeDogdHJ1ZSB9KTtcclxuXHJcbiAgICBpZiAoIWN1cnJlbnRVUkwubWF0Y2goL15cXD9pZD0vaWcpKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyZW50T3JpZ2luT3JsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuXHJcbiAgICBjb25zdCBkYXRhX2pzb25fZGVmYXVsdCA9IHtcclxuICAgICAgICBwYWdlVGl0bGU6IFwiVGltZXJcIixcclxuICAgICAgICBwcmVIZWFkaW5nOiBcItGC0LXRgdGCXCIsXHJcbiAgICAgICAgaGVhZGluZzogXCJMb2FkaW5nLi4uXCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwi0YLQtdGB0YJcIixcclxuICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6IFwiMFwiLFxyXG4gICAgICAgIGNvbG9yX2k6IDE3MixcclxuICAgICAgICBmaW5pc2hEYXRlOiBcIjBcIlxyXG4gICAgfVxyXG5cclxuICAgIC8vIFlvdXIgd2ViIGFwcCdzIEZpcmViYXNlIGNvbmZpZ3VyYXRpb25cclxuICAgIGNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgICAgIGFwaUtleTogXCJBSXphU3lBUHE2QTBzRFhfdW5yMzNReThhcXJBYnZvMkVySVJIRHNcIixcclxuICAgICAgICBhdXRoRG9tYWluOiBcInRpbWVyLWJhNTJkLmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vdGltZXItYmE1MmQuZmlyZWJhc2Vpby5jb21cIixcclxuICAgICAgICBwcm9qZWN0SWQ6IFwidGltZXItYmE1MmRcIixcclxuICAgICAgICBzdG9yYWdlQnVja2V0OiBcInRpbWVyLWJhNTJkLmFwcHNwb3QuY29tXCIsXHJcbiAgICAgICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNDQ4NTk3NTg5MTE5XCIsXHJcbiAgICAgICAgYXBwSWQ6IFwiMTo0NDg1OTc1ODkxMTk6d2ViOjFiYjQ4MGMwOTA0NzA3ZWFcIlxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEZpcmViYXNlXHJcbiAgICBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcclxuICAgIGNvbnN0IGRhdGFiYXNlID0gZmlyZWJhc2UuZGF0YWJhc2UoKTtcclxuXHJcbiAgICAvLyBWVUUgYXBwXHJcbiAgICB2YXIgYXBwTGFuZGluZyA9IG5ldyBWdWUoe1xyXG4gICAgICAgIGVsOiAnI2xhbmRpbmctYXBwJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGNyZWF0ZVRpbWVyU2hvdzogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIHdlSGF2ZU1vZGlmaWNhdGVUaW1lcjogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDRgSDQvdC+0LLRi9C80Lgg0LTQsNC90L3Ri9C80LhcclxuICAgICAgICAgICAgd2VBbHJlYWR5SGF2ZUNoYW5nZXM6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0LrQvtCz0LTQsCDRhdC+0YLRjyDQsdGLINGA0LDQtyDQv9GA0LjQvNC10L3Rj9C70Lgg0LjQt9C80LXQvdC10L3QuNGPXHJcblxyXG4gICAgICAgICAgICAvLyDQmtC70LDRgdGB0YtcclxuICAgICAgICAgICAgdnVlQXBwQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVCYWNrQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVTaGFyZUNsYXNzOiAnJyxcclxuICAgICAgICAgICAgdnVlQ2lyY2xlQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVCdXR0b25DbGFzczogJycsXHJcbiAgICAgICAgICAgIHZ1ZUNsb2NrQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVQcmVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICB2dWVEZXNjcmlwdGlvblRleHRDbGFzczogJycsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uUGFuZWw6ICdoaWRlJyxcclxuICAgICAgICAgICAgdnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uOiAnY2xhc3MnLFxyXG5cclxuICAgICAgICAgICAgLy8g0KHRgtC40LvQuFxyXG4gICAgICAgICAgICBzdHlsZUFwcDogJycsXHJcblxyXG4gICAgICAgICAgICAvLyDQpNC+0YLQvlxyXG4gICAgICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6ICcnLFxyXG5cclxuICAgICAgICAgICAgc3RhdGVXYXNNb2RpZmllZDogZmFsc2UsIC8vINCx0YvQu9C+INC70L4g0LvQuCDQuNC30LzQtdC90LXQvdC+INGB0L7RgdGC0L7Rj9C90LjQtVxyXG5cclxuICAgICAgICAgICAgc3RhdGVFZGl0UHJlSGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0L/QvtC0LdCX0LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgICAgICBzdGF0ZUVkaXRIZWFkaW5nOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQl9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICAgICAgc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0OiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQntC/0LjRgdCw0L3QuNC1XHJcbiAgICAgICAgICAgIHN0YXRlRWRpdENsb2NrOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0Y7RgtGB0Y8g0LvQuCDRh9Cw0YHRi1xyXG5cclxuICAgICAgICAgICAgd2FsbHBhcGVyU2lkZUJhck9wZW46IGZhbHNlLCAvLyDQntGC0LrRgNGL0YIg0LvQuCDRgdCw0LnQtCDQsdCw0YAg0LTQu9GPINGE0L7QvdCwXHJcblxyXG4gICAgICAgICAgICBoZWFkaW5nTWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0LfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgICAgIGxhc3RFZGl0SGVhZGluZ01lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgICBvbGRIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDRgtC10LrRgdGC0LBcclxuICAgICAgICAgICAgbmV3SGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDRgtC10LrRgdGC0LBcclxuXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC+0L/QuNGB0LDQvdC40Y9cclxuICAgICAgICAgICAgbGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0L7Qv9C40YHQsNC90LjQtSDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INGB0L7RhdGA0LDQvdC10L3QuNGPXHJcbiAgICAgICAgICAgIG9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L7Qv9C40YHQsNC90LjRjyDQstC+INCy0YDQtdC80Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICBuZXdEZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L7Qv9C40YHQsNC90LjRj1xyXG5cclxuICAgICAgICAgICAgcHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgICAgICBsYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlOiAnJyxcclxuICAgICAgICAgICAgb2xkUHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgICAgIG5ld1ByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcblxyXG5cclxuICAgICAgICAgICAgLy8g0KLQsNC50LzQtdGAID09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGZpbmlzaERhdGU6ICcnLCAvLyAoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcylcclxuICAgICAgICAgICAgbW9udGhOYW1lOiAnJyxcclxuXHJcbiAgICAgICAgICAgIGludGVydmFsOiBcIlwiLFxyXG4gICAgICAgICAgICBpbnRlcnZhbEluaXQ6IFwiXCIsXHJcbiAgICAgICAgICAgIGNsX21vbnRoOiAnJyxcclxuICAgICAgICAgICAgY2xfZGF5czogJycsXHJcbiAgICAgICAgICAgIGNsX2hvdXJzOiAnJyxcclxuICAgICAgICAgICAgY2xfbWludXRlczogJycsXHJcbiAgICAgICAgICAgIGNsX3NlY29uZHM6ICcnLFxyXG4gICAgICAgICAgICBjbF9kYXlzX3RpdGxlOiAnJyxcclxuXHJcbiAgICAgICAgICAgIGNsb2NrRGF0ZUlucHV0RXJyb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICBjbG9ja1RpbWVJbnB1dEVycm9yOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09XHJcbiAgICAgICAgICAgIGNvbG9yX2k6IDAsXHJcblxyXG4gICAgICAgICAgICAvLyDQvtC/0L7QstC10YnQtdC90LjQtSDQv9GD0LHQu9C40LrQsNGG0LjQuFxyXG4gICAgICAgICAgICBhbGVydElzT3BlbjogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgIC8vINCS0LrQu9GO0YfQsNC10Lwg0YLQtdC80YMg0YDQtdC00L7QutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICBjcmVhdGVUaW1lcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaW1lclNob3cgPSAhdGhpcy5jcmVhdGVUaW1lclNob3c7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICdtb2RpZmljYXRpb24nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMucHJlSGVhZGluZ01lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDQmtC70LjQuiDQv9C+INCe0YLQvNC10L3QtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVCdXR0b25DbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0UHJlSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IHRoaXMubGFzdEVkaXRIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSBmYWxzZTsgLy/QstGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1IFwi0LIg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQuFwiXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMud2VBbHJlYWR5SGF2ZUNoYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC40LfQvNC10L3QtdC90LjRjyDQn9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICBhY2NlcHRDcmVhdGVUaW1lcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaW1lclNob3cgPSAhdGhpcy5jcmVhdGVUaW1lclNob3c7IC8vINC80LXQvdGP0LXQvCDRgdC+0YHRgtC+0Y/QvdC40Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICAgICAgLy8g0YPQsdC40LLQsNC10Lwg0LrQu9Cw0YHRgdGLINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQXBwQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gZmFsc2U7IC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUgXCLQsiDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC4XCJcclxuICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZUFscmVhZHlIYXZlQ2hhbmdlcyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDRh9Cw0YHRiyAo0YHRgtCw0LLQuNC8INC90L7QstGD0Y4g0LTQsNGC0YMpXHJcbiAgICAgICAgICAgIGVkaXRDbG9jazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IHRydWU7IC8vINCy0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUgZWRpdGluZyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNhbmNlbEVkaXRDbG9jazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vINGC0LDQudC80LDRg9GCINC00LvRjyDRg9C00LDQu9C10L3QuNGPINGB0LDQvNC+0LPQviDRgdC10LHRj1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFjY2VwdEVkaXRDbG9jazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0ICRjbG9ja0lucHV0RGF0ZSA9IHRoaXMuJHJlZnMuZWxDbG9ja0lucHV0RGF0ZTtcclxuICAgICAgICAgICAgICAgIGxldCAkY2xvY2tJbnB1dFRpbWUgPSB0aGlzLiRyZWZzLmVsQ2xvY2tJbnB1dFRpbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsC4g0JLQstC10LvQuC3Qu9C4INC80Ysg0LfQvdCw0YfQtdC90LjRjz9cclxuICAgICAgICAgICAgICAgIGlmICgkY2xvY2tJbnB1dERhdGUudmFsdWUgPT0gJycgJiYgJGNsb2NrSW5wdXRUaW1lLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkY2xvY2tJbnB1dERhdGUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkY2xvY2tJbnB1dFRpbWUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0WWVhciA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0TW91dGggPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMV0pIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXREYXkgPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dEhvdXIgPSBOdW1iZXIoJGNsb2NrSW5wdXRUaW1lLnZhbHVlLnNwbGl0KCc6JylbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dE1pbnV0ZXMgPSBOdW1iZXIoJGNsb2NrSW5wdXRUaW1lLnZhbHVlLnNwbGl0KCc6JylbMV0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaERhdGUgPSBuZXcgRGF0ZShjbG9ja0RhdGVJbXB1dFllYXIsIGNsb2NrRGF0ZUltcHV0TW91dGgsIGNsb2NrRGF0ZUltcHV0RGF5LCBjbG9ja0RhdGVJbXB1dEhvdXIsIGNsb2NrRGF0ZUltcHV0TWludXRlcywgMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmFtZU9mRmluaXNoRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0YLQsNC50LzQsNGD0YIg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8g0YHQsNC80L7Qs9C+INGB0LXQsdGPXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgfSwgMTAwKTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMINC/0L7QtC3Qt9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICAgICAgZWRpdFByZUhlYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbGRQcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMucHJlSGVhZGluZ01lc3NhZ2U7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YAsIC8vINGC0LDQudC80LDRg9GCINC20LTRkdGCINGB0L7Qt9C00LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsFxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRQcmVIZWFkaW5nLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNWdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRQcmVIZWFkaW5nLm9uaW5wdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Z1ZS5wcmVIZWFkaW5nTWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LVcclxuICAgICAgICAgICAgY29tcGxlYXRlRWRpdFByZUhlYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y8g0Lgg0L3QtSDRgtCw0LrQsNGPINC20LVcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5vbGRQcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQt9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICAgICAgZWRpdEhlYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0SGVhZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbGRIZWFkaW5nTWVzc2FnZSA9IHRoaXMuaGVhZGluZ01lc3NhZ2U7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YBcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0SGVhZGluZy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0SGVhZGluZy5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUuaGVhZGluZ01lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1XHJcbiAgICAgICAgICAgIGNvbXBsZWF0ZUVkaXRIZWFkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDRhNC+0YDQvNCwINC/0YPRgdGC0LDRjyDQuCDQvdC1INGC0LDQutCw0Y8g0LbQtVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWRpbmdNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSB0aGlzLm9sZEhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMIERlc2NyaXB0aW9uVGV4dFxyXG4gICAgICAgICAgICBlZGl0RGVzY3JpcHRpb25UZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbGREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YBcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0RGVzY3JpcHRpb25UZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNWdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1IERlc2NyaXB0aW9uVGV4dFxyXG4gICAgICAgICAgICBjb21wbGVhdGVFZGl0RGVzY3JpcHRpb25UZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y9cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMub2xkRGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0L/RgNC40LzQtdC90LjRgtGMINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUg0YLQtdC60YHRgtCwINC/0L4g0LrQu9Cw0LLQuNGI0LUg0K3QvdGC0YBcclxuICAgICAgICAgICAgYWNjZXB0RWRpdFRleHQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDQvNGLINCyINC/0YDQvtGG0LXRgdC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0Lgg0YDQtdC00LDQutGC0LjRgNGD0LXQvCDQt9Cw0LPQsNC70L7QstC+0Log0Lgg0L3QsNC20LDQu9C4INGN0L3RgtC10YBcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdEhlYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdFByZUhlYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCAmJiBlLmtleSA9PSAnRW50ZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGVhdGVFZGl0RGVzY3JpcHRpb25UZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQodC60YDRi9Cy0LDQtdC8INC/0LDQvdC10LvRjNC60YMg0L7Qv9C40YHQsNC90LjRjyDQvdCwINC80L7QsdC40LvQtVxyXG4gICAgICAgICAgICBoaWRlRGVzY3JpcHRpb25QYW5lbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9PT0gJ2hpZGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vIENsb2NrID09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgY2xvY2tGdW5jOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAvLyDRgdC+0LfQtNCw0ZHQvCDQtNCw0YLRgyDQvdC+0LLRg9GOXHJcbiAgICAgICAgICAgICAgICB2YXIgbm93RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gKHRoaXMuZmluaXNoRGF0ZSAtIG5vd0RhdGUpOyAvLyDQv9C+0LvRg9GH0LDQtdC8INGA0LDQt9C90LjRhtGDXHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YLQsNC50LzQtdGAINC/0YDQvtGI0ZHQu1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX21vbnRoID0gXCJJdCdzIG92ZXJcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSAnMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9ob3VycyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9taW51dGVzID0gJzAwJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX3NlY29uZHMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICdkYXknO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDApICUgNjApO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtaW51dGVzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCAvIDYwKSAlIDYwKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwIC8gNjAgLyA2MCkgJSAyNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRheXMgPSBNYXRoLmZsb29yKHJlc3VsdCAvIDEwMDAgLyA2MCAvIDYwIC8gMjQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSBtaW51dGVzID0gJzAnICsgbWludXRlcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaG91cnMgPCAxMCkgaG91cnMgPSAnMCcgKyBob3VycztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9tb250aCA9IHRoaXMubW9udGhOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5cyA9IGRheXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9ob3VycyA9IGhvdXJzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfbWludXRlcyA9IG1pbnV0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9zZWNvbmRzID0gc2Vjb25kcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXNfdGl0bGUgPSAnZGF5cyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsX2RheXMgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXNfdGl0bGUgPSAnZGF5JztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNyZWF0ZU5hbWVPZkZpbmlzaERhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9udGhOYW1lID0gdGhpcy5maW5pc2hEYXRlLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbW9udGg6IFwibG9uZ1wiLCBkYXk6ICdudW1lcmljJywgaG91cjogJ251bWVyaWMnLCBtaW51dGU6ICdudW1lcmljJyB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICBjb2xvclBpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBcHAgPSB7ICctLXRoZW1lLWNvbG9yJzogdGhpcy5jb2xvcl9pIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yX2kgPSB0aGlzLmNvbG9yX2kgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMzAgLSA0KSkgKyA0OyAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0YDQsNC90LTQvtC80L3Ri9C5INGG0LLQtdGCINC+0YIgNDAgLSA0XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0JLRi9Cx0L7RgCDRhNC+0L3QvtCy0L7Qs9C+INC40LfQvtCx0YDQsNC20LXQvdC40Y9cclxuICAgICAgICAgICAgd2FsbHBhcGVyUGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHdhbGxwYXBlclBpY2tDbG9zZSgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGFuZ2VJbWFnZUJhY2tncm91bmQoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCAkaW5wdXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGlucHV0LmZpbGVzICYmICRpbnB1dC5maWxlc1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmltYWdlU3JjQmFja2dyb3VuZCA9IGUudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoJGlucHV0LmZpbGVzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8g0YHQvNC10L3QsCDRhNC+0YLQviDQuNC3INC60L7Qu9C70LXQutGG0LjQuFxyXG4gICAgICAgICAgICBzd2FwSW1hZ2VCYWNrZ3JvdW5kKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3JjT2ZOZXdCYWNrZ3JvdW5kID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2FsbHBhcGVyJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3JjT2ZOZXdCYWNrZ3JvdW5kICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kID0gc3JjT2ZOZXdCYWNrZ3JvdW5kO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8gc2hhcmVcclxuICAgICAgICAgICAgc2hhcmVDcmVhdGVMaW5rOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ItbGFuZGluZ19fc2hhcmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBlLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmNsYXNzTmFtZS5pbmRleE9mKCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpICE9IC0xKSB2YXIgdSA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgIT0gLTEpIHZhciB0ID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZScpICE9IC0xKSB2YXIgaSA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWltYWdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSAhPSAtMSkgdmFyIGQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKSAhPSAtMSkgdmFyIGYgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbnMtZmlsZScpICE9IC0xKSB2YXIgZm4gPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29ucy1maWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwYXRoKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3IgPSBuZXcgUmVnRXhwKCdeKC4qL3wpKCcgKyBuYW1lICsgJykoWyM/XXwkKScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMCwgc2NMID0gc2MubGVuZ3RoOyBwIDwgc2NMOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtID0gU3RyaW5nKHNjW3BdLnNyYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWF0Y2goc3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobVsxXS5tYXRjaCgvXigoaHR0cHM/fGZpbGUpXFw6XFwvezIsfXxcXHc6W1xcL1xcXFxdKS8pKSByZXR1cm4gbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobVsxXS5pbmRleE9mKFwiL1wiKSA9PSAwKSByZXR1cm4gbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jhc2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYlswXSAmJiBiWzBdLmhyZWYpIHJldHVybiBiWzBdLmhyZWYgKyBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC8oLipbXFwvXFxcXF0pLylbMF0gKyBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gcGF0aCgnc2hhcmU0Mi5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1KSB1ID0gbG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdCkgdCA9IGRvY3VtZW50LnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikgZm4gPSAnaWNvbnMucG5nJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZXNjKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21ldGEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1ldGEubGVuZ3RoOyBtKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFbbV0ubmFtZS50b0xvd2VyQ2FzZSgpID09ICdkZXNjcmlwdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhW21dLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkKSBkID0gZGVzYygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdSA9IGVuY29kZVVSSUNvbXBvbmVudCh1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBlbmNvZGVVUklDb21wb25lbnQodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ID0gdC5yZXBsYWNlKC9cXCcvZywgJyUyNycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGVuY29kZVVSSUNvbXBvbmVudChpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBlbmNvZGVVUklDb21wb25lbnQoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkID0gZC5yZXBsYWNlKC9cXCcvZywgJyUyNycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmYlF1ZXJ5ID0gJ3U9JyArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgZmJRdWVyeSA9ICdzPTEwMCZwW3VybF09JyArIHUgKyAnJnBbdGl0bGVdPScgKyB0ICsgJyZwW3N1bW1hcnldPScgKyBkICsgJyZwW2ltYWdlc11bMF09JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZrSW1hZ2UgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9ICdudWxsJyAmJiBpICE9ICcnKSB2a0ltYWdlID0gJyZpbWFnZT0nICsgaTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IG5ldyBBcnJheSgnXCIjXCIgZGF0YS1jb3VudD1cInZrXCIgb25jbGljaz1cIndpbmRvdy5vcGVuKFxcJy8vdmsuY29tL3NoYXJlLnBocD91cmw9JyArIHUgKyAnJnRpdGxlPScgKyB0ICsgdmtJbWFnZSArICcmZGVzY3JpcHRpb249JyArIGQgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQktCa0L7QvdGC0LDQutGC0LVcIicsICdcIiNcIiBkYXRhLWNvdW50PVwiZmJcIiBvbmNsaWNrPVwid2luZG93Lm9wZW4oXFwnLy93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9JyArIHUgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQsiBGYWNlYm9va1wiJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxcSA9IFsnYi1pY29uIGItaWNvbi0tc2hhcmUgYi1pY29uLS12ayBpY29uLXZrJywgJ2ItaWNvbiBiLWljb24tLXNoYXJlIGljb24tZmInXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwgKz0gJzxhIGNsYXNzPVwiJyArIHFxW2pdICsgJ1wiIHJlbD1cIm5vZm9sbG93XCIgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jaztcIiBocmVmPScgKyBzW2pdICsgJyB0YXJnZXQ9XCJfYmxhbmtcIj48L2E+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlW2tdLmlubmVySFRNTCA9IGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J/QvtGB0LvQtSDQv9GD0LHQu9C40LrQsNGG0LjQuCDRgdGC0YDQsNC90LjRhtGLINC4INC+0YLQv9GA0LDQstC60Lgg0LDRj9C60YHQsFxyXG4gICAgICAgICAgICBjcmVhdGVkTmV3UGFnZShwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRPcmlnaW5Pcmx9P2lkPSR7cGFnZX1gO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5hbGVydExpbmsuaHJlZiA9IGAke2N1cnJlbnRPcmlnaW5Pcmx9P2lkPSR7cGFnZX1gXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0SXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8INC00LDQvdC90YvQtSDQsiDRhNCxXHJcbiAgICAgICAgICAgIHB1Ymxpc2hOZXdUaW1lcigpIHtcclxuICAgICAgICAgICAgICAgIHZ1ZV90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkUGFnZSA9IChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFKU09OID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlSGVhZGluZzogdnVlX3RoaXMucHJlSGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGluZzogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHZ1ZV90aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoRGF0ZTogdnVlX3RoaXMuZmluaXNoRGF0ZS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU3JjQmFja2dyb3VuZDogdnVlX3RoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yX2k6IHZ1ZV90aGlzLmNvbG9yX2ksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZGF0YWJhc2UucmVmKCdwYWdlcy8nICsgaWRQYWdlKS5zZXQoZGF0YUpTT04pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3luY2hyb25pemF0aW9uIHN1Y2NlZWRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2dWVfdGhpcy5jcmVhdGVkTmV3UGFnZShpZFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3luY2hyb25pemF0aW9uIGZhaWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC90L7QstGL0LUg0LTQsNC90L3Ri9C1INC6INGC0LDQudC80LXRgNGDXHJcbiAgICAgICAgICAgIGFjY2VwdERhdGEoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQv9C10YDQtdC80LXQvdC90YvQvCDQt9C90LDRh9C10L3QuNGPINGBINGB0LXRgNCy0LXRgNCwXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gZGF0YS5wcmVIZWFkaW5nO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IGRhdGEuaGVhZGluZztcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IGRhdGEuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC30LDQs9C+0LvQvtCy0L7QuiDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IGRhdGEucGFnZVRpdGxlXHJcbiAgICAgICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INGE0L7QvVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNyY0JhY2tncm91bmQgPSBkYXRhLmltYWdlU3JjQmFja2dyb3VuZDtcclxuICAgICAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0YbQstC10YJcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBcHAgPSB7ICctLXRoZW1lLWNvbG9yJzogZGF0YS5jb2xvcl9pIH07XHJcbiAgICAgICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC00LDRgtGDXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaERhdGUgPSBuZXcgRGF0ZShkYXRhLmZpbmlzaERhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYmVmb3JlQ3JlYXRlKCkge1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQt9GL0LLQsNC10YLRgdGPINGB0LjQvdGF0YDQvtC90L3QviDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDRjdC60LfQtdC80L/Qu9GP0YDQsFxyXG4gICAgICAgIGNyZWF0ZWQoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBkYXRhX2pzb25fZGVmYXVsdDtcclxuICAgICAgICAgICAgY29uc3QgdGhpc192dWUgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmFjY2VwdERhdGEoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyDQn9C+0LvRg9GH0LDQtdC8INC00LDQvdC90YvQtVxyXG4gICAgICAgICAgICBkYXRhYmFzZS5yZWYoJ3BhZ2VzLycgKyBjdXJyZW50SWRQYWdlLmlkKS5vbmNlKCd2YWx1ZScpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb21wbGl0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRJZFBhZ2UuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNfdnVlLmFjY2VwdERhdGEoZS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmFpbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQktGL0LfRi9Cy0LDQtdGC0YHRjyDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YLQvtCz0L4g0LrQsNC6INGN0LrQt9C10LzQv9C70Y/RgCDQsdGL0Lsg0YHQvNC+0L3RgtC40YDQvtCy0LDQvVxyXG4gICAgICAgIG1vdW50ZWQoKSB7XHJcbiAgICAgICAgICAgIC8vINC/0L7Qu9GD0YfQsNC10Lwg0LrQvtC90LXRh9C90YPRjiDQtNCw0YLRgyAo0JfQsNCz0L7Qu9C+0LLQvtC6INCU0LDRgtGLKVxyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuICAgICAgICAgICAgLy8g0LfQsNC/0YPRgdC60LDQtdC8INGC0LDQudC80LXRgFxyXG4gICAgICAgICAgICB0aGlzLmludGVydmFsSW5pdCA9IHRoaXMuY2xvY2tGdW5jKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRnVuYygpO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgLy8g0LzQtdC90Y/QtdC8INGI0LXQudGA0YtcclxuICAgICAgICAgICAgdGhpcy5zaGFyZUNyZWF0ZUxpbmsoKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCB0aGlzLmFjY2VwdEVkaXRUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG47XG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnZGlzcGxheTogYmxvY2s7IGNvbG9yOiAjMWQ5YmZmOyBmb250OiAxLjZyZW0vMS4zIFRhaG9tYTsnLCAn0JXRgdC70Lgg0LLRiyDQvdCw0YjQu9C4INCx0LDQsywg0L7RgtC/0YDQsNCy0YzRgtC1INC10LPQviDQvtC/0LjRgdCw0L3QuNC1INC80L3QtSDQvdCwINC/0L7Rh9GC0YMgaUFtZWQ3M0B5YW5kZXgucnUnKTtcbn0pO1xuIl0sImZpbGUiOiJpbnRlcm5hbC5qcyJ9
