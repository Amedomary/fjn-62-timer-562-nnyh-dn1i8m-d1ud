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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXJ0aWFscy9sYW5kaW5nX3Z1ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4vLyBWVUUg0L/RgNC40LvQvtC20LXQvdC40LVcclxuLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxubGV0IGN1cnJlbnRJZFBhZ2UgPSBxcy5wYXJzZShjdXJyZW50VVJMLCB7IGlnbm9yZVF1ZXJ5UHJlZml4OiB0cnVlIH0pO1xyXG5cclxuaWYgKCFjdXJyZW50VVJMLm1hdGNoKC9eXFw/aWQ9L2lnKSkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9MCc7XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRPcmlnaW5PcmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG5cclxuY29uc3QgZGF0YV9qc29uX2RlZmF1bHQgPSB7XHJcbiAgICBwYWdlVGl0bGU6IFwiVGltZXJcIixcclxuICAgIGhlYWRpbmc6IFwiTG9hZGluZy4uLlwiLFxyXG4gICAgcHJlSGVhZGluZzogXCJcIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIlwiLFxyXG4gICAgZmluaXNoRGF0ZTogXCIwXCIsXHJcbiAgICBpbWFnZVNyY0JhY2tncm91bmQ6IFwiMFwiLFxyXG4gICAgY29sb3JfaTogMTcyLFxyXG59XHJcblxyXG4vLyBZb3VyIHdlYiBhcHAncyBGaXJlYmFzZSBjb25maWd1cmF0aW9uXHJcbmNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgYXBpS2V5OiBcIkFJemFTeUFQcTZBMHNEWF91bnIzM1F5OGFxckFidm8yRXJJUkhEc1wiLFxyXG4gICAgYXV0aERvbWFpbjogXCJ0aW1lci1iYTUyZC5maXJlYmFzZWFwcC5jb21cIixcclxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vdGltZXItYmE1MmQuZmlyZWJhc2Vpby5jb21cIixcclxuICAgIHByb2plY3RJZDogXCJ0aW1lci1iYTUyZFwiLFxyXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJ0aW1lci1iYTUyZC5hcHBzcG90LmNvbVwiLFxyXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNDQ4NTk3NTg5MTE5XCIsXHJcbiAgICBhcHBJZDogXCIxOjQ0ODU5NzU4OTExOTp3ZWI6MWJiNDgwYzA5MDQ3MDdlYVwiXHJcbn07XHJcblxyXG4vLyBJbml0aWFsaXplIEZpcmViYXNlXHJcbmZpcmViYXNlLmluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xyXG5jb25zdCBkYXRhYmFzZSA9IGZpcmViYXNlLmRhdGFiYXNlKCk7XHJcblxyXG4vLyBWVUUgYXBwXHJcbnZhciBhcHBMYW5kaW5nID0gbmV3IFZ1ZSh7XHJcbiAgICBlbDogJyNsYW5kaW5nLWFwcCcsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgY3JlYXRlVGltZXJTaG93OiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICB3ZUhhdmVNb2RpZmljYXRlVGltZXI6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0YEg0L3QvtCy0YvQvNC4INC00LDQvdC90YvQvNC4XHJcbiAgICAgICAgd2VBbHJlYWR5SGF2ZUNoYW5nZXM6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0LrQvtCz0LTQsCDRhdC+0YLRjyDQsdGLINGA0LDQtyDQv9GA0LjQvNC10L3Rj9C70Lgg0LjQt9C80LXQvdC10L3QuNGPXHJcblxyXG4gICAgICAgIC8vINCa0LvQsNGB0YHRi1xyXG4gICAgICAgIHZ1ZUFwcENsYXNzOiAnJyxcclxuICAgICAgICB2dWVCYWNrQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZVNoYXJlQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUNpcmNsZUNsYXNzOiAnJyxcclxuICAgICAgICB2dWVCdXR0b25DbGFzczogJycsXHJcbiAgICAgICAgdnVlQ2xvY2tDbGFzczogJycsXHJcbiAgICAgICAgdnVlUHJlSGVhZGluZ0NsYXNzOiAnJyxcclxuICAgICAgICB2dWVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzOiAnJyxcclxuICAgICAgICBkZXNjcmlwdGlvblBhbmVsOiAnaGlkZScsXHJcbiAgICAgICAgdnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uOiAnY2xhc3MnLFxyXG5cclxuICAgICAgICAvLyDQodGC0LjQu9C4XHJcbiAgICAgICAgc3R5bGVBcHA6ICcnLFxyXG5cclxuICAgICAgICAvLyDQpNC+0YLQvlxyXG4gICAgICAgIGltYWdlU3JjQmFja2dyb3VuZDogJycsXHJcblxyXG4gICAgICAgIHN0YXRlV2FzTW9kaWZpZWQ6IGZhbHNlLCAvLyDQsdGL0LvQviDQu9C+INC70Lgg0LjQt9C80LXQvdC10L3QviDRgdC+0YHRgtC+0Y/QvdC40LVcclxuXHJcbiAgICAgICAgc3RhdGVFZGl0UHJlSGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0L/QvtC0LdCX0LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIHN0YXRlRWRpdEhlYWRpbmc6IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/QtdGC0YHRjyDQu9C4INCX0LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIHN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dDogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0J7Qv9C40YHQsNC90LjQtVxyXG4gICAgICAgIHN0YXRlRWRpdENsb2NrOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0Y7RgtGB0Y8g0LvQuCDRh9Cw0YHRi1xyXG5cclxuICAgICAgICB3YWxscGFwZXJTaWRlQmFyT3BlbjogZmFsc2UsIC8vINCe0YLQutGA0YvRgiDQu9C4INGB0LDQudC0INCx0LDRgCDQtNC70Y8g0YTQvtC90LBcclxuXHJcbiAgICAgICAgaGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC30LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgIGxhc3RFZGl0SGVhZGluZ01lc3NhZ2U6ICcnLFxyXG4gICAgICAgIG9sZEhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INGC0LXQutGB0YLQsFxyXG4gICAgICAgIG5ld0hlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0YLQtdC60YHRgtCwXHJcblxyXG4gICAgICAgIGRlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC+0L/QuNGB0LDQvdC40Y9cclxuICAgICAgICBsYXN0RWRpdERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDQvtC/0LjRgdCw0L3QuNC1INC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YHQvtGF0YDQsNC90LXQvdC40Y9cclxuICAgICAgICBvbGREZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC+0L/QuNGB0LDQvdC40Y8g0LLQviDQstGA0LXQvNGPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICBuZXdEZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L7Qv9C40YHQsNC90LjRj1xyXG5cclxuICAgICAgICBwcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgbGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZTogJycsXHJcbiAgICAgICAgb2xkUHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgbmV3UHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuXHJcblxyXG4gICAgICAgIC8vINCi0LDQudC80LXRgCA9PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGZpbmlzaERhdGU6ICcnLCAvLyAoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcylcclxuICAgICAgICBtb250aE5hbWU6ICcnLFxyXG5cclxuICAgICAgICBpbnRlcnZhbDogXCJcIixcclxuICAgICAgICBpbnRlcnZhbEluaXQ6IFwiXCIsXHJcbiAgICAgICAgY2xfbW9udGg6ICcnLFxyXG4gICAgICAgIGNsX2RheXM6ICcnLFxyXG4gICAgICAgIGNsX2hvdXJzOiAnJyxcclxuICAgICAgICBjbF9taW51dGVzOiAnJyxcclxuICAgICAgICBjbF9zZWNvbmRzOiAnJyxcclxuICAgICAgICBjbF9kYXlzX3RpdGxlOiAnJyxcclxuXHJcbiAgICAgICAgY2xvY2tEYXRlSW5wdXRFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgY2xvY2tUaW1lSW5wdXRFcnJvcjogZmFsc2UsXHJcblxyXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09XHJcbiAgICAgICAgY29sb3JfaTogMCxcclxuXHJcbiAgICAgICAgLy8g0L7Qv9C+0LLQtdGJ0LXQvdC40LUg0L/Rg9Cx0LvQuNC60LDRhtC40LhcclxuICAgICAgICBhbGVydElzT3BlbjogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICAgIC8vINCS0LrQu9GO0YfQsNC10Lwg0YLQtdC80YMg0YDQtdC00L7QutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgIGNyZWF0ZVRpbWVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJ21vZGlmaWNhdGlvbic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnZWRpdGFibGUnOyAvLyBcImVkaXRhYmxlIGVkaXRlZFwiXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdEhlYWRpbmdNZXNzYWdlID0gdGhpcy5oZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5wcmVIZWFkaW5nTWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IGZhbHNlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vINCa0LvQuNC6INC/0L4g0J7RgtC80LXQvdC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMubGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSBmYWxzZTsgLy/QstGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1IFwi0LIg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQuFwiXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53ZUFscmVhZHlIYXZlQ2hhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC40LfQvNC10L3QtdC90LjRjyDQn9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgIGFjY2VwdENyZWF0ZVRpbWVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93OyAvLyDQvNC10L3Rj9C10Lwg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgLy8g0YPQsdC40LLQsNC10Lwg0LrQu9Cw0YHRgdGLINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVDaXJjbGVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZVByZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJyc7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSBmYWxzZTsgLy8g0JLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSBcItCyINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LhcIlxyXG4gICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgdGhpcy53ZUFscmVhZHlIYXZlQ2hhbmdlcyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDRh9Cw0YHRiyAo0YHRgtCw0LLQuNC8INC90L7QstGD0Y4g0LTQsNGC0YMpXHJcbiAgICAgICAgZWRpdENsb2NrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IHRydWU7IC8vINCy0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSBlZGl0aW5nJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FuY2VsRWRpdENsb2NrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyDRgtCw0LnQvNCw0YPRgiDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyDRgdCw0LzQvtCz0L4g0YHQtdCx0Y9cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFjY2VwdEVkaXRDbG9jazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgJGNsb2NrSW5wdXREYXRlID0gdGhpcy4kcmVmcy5lbENsb2NrSW5wdXREYXRlO1xyXG4gICAgICAgICAgICBsZXQgJGNsb2NrSW5wdXRUaW1lID0gdGhpcy4kcmVmcy5lbENsb2NrSW5wdXRUaW1lO1xyXG5cclxuICAgICAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsC4g0JLQstC10LvQuC3Qu9C4INC80Ysg0LfQvdCw0YfQtdC90LjRjz9cclxuICAgICAgICAgICAgaWYgKCRjbG9ja0lucHV0RGF0ZS52YWx1ZSA9PSAnJyAmJiAkY2xvY2tJbnB1dFRpbWUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRjbG9ja0lucHV0RGF0ZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRjbG9ja0lucHV0VGltZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRZZWFyID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzBdKTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dE1vdXRoID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzFdKSAtIDE7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXREYXkgPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMl0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0SG91ciA9IE51bWJlcigkY2xvY2tJbnB1dFRpbWUudmFsdWUuc3BsaXQoJzonKVswXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRNaW51dGVzID0gTnVtYmVyKCRjbG9ja0lucHV0VGltZS52YWx1ZS5zcGxpdCgnOicpWzFdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaERhdGUgPSBuZXcgRGF0ZShjbG9ja0RhdGVJbXB1dFllYXIsIGNsb2NrRGF0ZUltcHV0TW91dGgsIGNsb2NrRGF0ZUltcHV0RGF5LCBjbG9ja0RhdGVJbXB1dEhvdXIsIGNsb2NrRGF0ZUltcHV0TWludXRlcywgMDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgICAgICAvLyDRgtCw0LnQvNCw0YPRgiDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyDRgdCw0LzQvtCz0L4g0YHQtdCx0Y9cclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IH0sIDEwMCk7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQv9C+0LQt0LfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgZWRpdFByZUhlYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRQcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMucHJlSGVhZGluZ01lc3NhZ2U7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGALCAvLyDRgtCw0LnQvNCw0YPRgiDQttC00ZHRgiDRgdC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LBcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dFByZUhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRQcmVIZWFkaW5nLm9uaW5wdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLnByZUhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgIGNvbXBsZWF0ZUVkaXRQcmVIZWFkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y8g0Lgg0L3QtSDRgtCw0LrQsNGPINC20LVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZUhlYWRpbmdNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMub2xkUHJlSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQt9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICBlZGl0SGVhZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0SGVhZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9sZEhlYWRpbmdNZXNzYWdlID0gdGhpcy5oZWFkaW5nTWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YBcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRIZWFkaW5nLm9uaW5wdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgIGNvbXBsZWF0ZUVkaXRIZWFkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPINC4INC90LUg0YLQsNC60LDRjyDQttC1XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkaW5nTWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSB0aGlzLm9sZEhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCd0LDRh9C40L3QsNC10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNGC0YwgRGVzY3JpcHRpb25UZXh0XHJcbiAgICAgICAgZWRpdERlc2NyaXB0aW9uVGV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2xkRGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgFxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0RGVzY3JpcHRpb25UZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0RGVzY3JpcHRpb25UZXh0Lm9uaW5wdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1IERlc2NyaXB0aW9uVGV4dFxyXG4gICAgICAgIGNvbXBsZWF0ZUVkaXREZXNjcmlwdGlvblRleHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5vbGREZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINC/0YDQuNC80LXQvdC40YLRjCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1INGC0LXQutGB0YLQsCDQv9C+INC60LvQsNCy0LjRiNC1INCt0L3RgtGAXHJcbiAgICAgICAgYWNjZXB0RWRpdFRleHQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIC8vINC10YHQu9C4INC80Ysg0LIg0L/RgNC+0YbQtdGB0LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQuCDRgNC10LTQsNC60YLQuNGA0YPQtdC8INC30LDQs9Cw0LvQvtCy0L7QuiDQuCDQvdCw0LbQsNC70Lgg0Y3QvdGC0LXRgFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdEhlYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdFByZUhlYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wbGVhdGVFZGl0RGVzY3JpcHRpb25UZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQodC60YDRi9Cy0LDQtdC8INC/0LDQvdC10LvRjNC60YMg0L7Qv9C40YHQsNC90LjRjyDQvdCwINC80L7QsdC40LvQtVxyXG4gICAgICAgIGhpZGVEZXNjcmlwdGlvblBhbmVsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPT09ICdoaWRlJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJyc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnaGlkZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDbG9jayA9PT09PT09PT09PT09PT09XHJcbiAgICAgICAgY2xvY2tGdW5jOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIC8vINGB0L7Qt9C00LDRkdC8INC00LDRgtGDINC90L7QstGD0Y5cclxuICAgICAgICAgICAgdmFyIG5vd0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gKHRoaXMuZmluaXNoRGF0ZSAtIG5vd0RhdGUpOyAvLyDQv9C+0LvRg9GH0LDQtdC8INGA0LDQt9C90LjRhtGDXHJcblxyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgtCw0LnQvNC10YAg0L/RgNC+0YjRkdC7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX21vbnRoID0gXCJJdCdzIG92ZXJcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5cyA9ICcwJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfaG91cnMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9taW51dGVzID0gJzAwJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfc2Vjb25kcyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXNfdGl0bGUgPSAnZGF5JztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWludXRlcyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDAgLyA2MCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwIC8gNjAgLyA2MCkgJSAyNCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF5cyA9IE1hdGguZmxvb3IocmVzdWx0IC8gMTAwMCAvIDYwIC8gNjAgLyAyNCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSBtaW51dGVzID0gJzAnICsgbWludXRlcztcclxuICAgICAgICAgICAgICAgIGlmIChob3VycyA8IDEwKSBob3VycyA9ICcwJyArIGhvdXJzO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbW9udGggPSB0aGlzLm1vbnRoTmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5cyA9IGRheXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gaG91cnM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX21pbnV0ZXMgPSBtaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9zZWNvbmRzID0gc2Vjb25kcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICdkYXlzJztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbF9kYXlzIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXNfdGl0bGUgPSAnZGF5JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3JlYXRlTmFtZU9mRmluaXNoRGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vbnRoTmFtZSA9IHRoaXMuZmluaXNoRGF0ZS50b0xvY2FsZVN0cmluZygncnUtUlUnLCB7IG1vbnRoOiBcImxvbmdcIiwgZGF5OiAnbnVtZXJpYycsIGhvdXI6ICdudW1lcmljJywgbWludXRlOiAnbnVtZXJpYycgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JLRi9Cx0L7RgCDRhtCy0LXRgtCwID09PT09PT09PT09PT09XHJcbiAgICAgICAgY29sb3JQaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGVBcHAgPSB7ICctLXRoZW1lLWNvbG9yJzogdGhpcy5jb2xvcl9pIH07XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JfaSA9IHRoaXMuY29sb3JfaSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgzMCAtIDQpKSArIDQ7IC8vINCU0L7QsdCw0LLQu9GP0LXQvCDRgNCw0L3QtNC+0LzQvdGL0Lkg0YbQstC10YIg0L7RgiA0MCAtIDRcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQktGL0LHQvtGAINGE0L7QvdC+0LLQvtCz0L4g0LjQt9C+0LHRgNCw0LbQtdC90LjRj1xyXG4gICAgICAgIHdhbGxwYXBlclBpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB3YWxscGFwZXJQaWNrQ2xvc2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFuZ2VJbWFnZUJhY2tncm91bmQoZXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0ICRpbnB1dCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dC5maWxlcyAmJiAkaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZtID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmltYWdlU3JjQmFja2dyb3VuZCA9IGUudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKCRpbnB1dC5maWxlc1swXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDRgdC80LXQvdCwINGE0L7RgtC+INC40Lcg0LrQvtC70LvQtdC60YbQuNC4XHJcbiAgICAgICAgc3dhcEltYWdlQmFja2dyb3VuZChldmVudCkge1xyXG4gICAgICAgICAgICBsZXQgc3JjT2ZOZXdCYWNrZ3JvdW5kID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2FsbHBhcGVyJyk7XHJcbiAgICAgICAgICAgIGlmIChzcmNPZk5ld0JhY2tncm91bmQgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlU3JjQmFja2dyb3VuZCA9IHNyY09mTmV3QmFja2dyb3VuZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBzaGFyZVxyXG4gICAgICAgIHNoYXJlQ3JlYXRlTGluazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYi1sYW5kaW5nX19zaGFyZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgZS5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmNsYXNzTmFtZS5pbmRleE9mKCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJykgIT0gLTEpIHZhciB1ID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpICE9IC0xKSB2YXIgdCA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZScpICE9IC0xKSB2YXIgaSA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWltYWdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpICE9IC0xKSB2YXIgZCA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWRlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJykgIT0gLTEpIHZhciBmID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbnMtZmlsZScpICE9IC0xKSB2YXIgZm4gPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29ucy1maWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcGF0aChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzciA9IG5ldyBSZWdFeHAoJ14oLiovfCkoJyArIG5hbWUgKyAnKShbIz9dfCQpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IDAsIHNjTCA9IHNjLmxlbmd0aDsgcCA8IHNjTDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtID0gU3RyaW5nKHNjW3BdLnNyYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXRjaChzcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobVsxXS5tYXRjaCgvXigoaHR0cHM/fGZpbGUpXFw6XFwvezIsfXxcXHc6W1xcL1xcXFxdKS8pKSByZXR1cm4gbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtWzFdLmluZGV4T2YoXCIvXCIpID09IDApIHJldHVybiBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdiYXNlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYlswXSAmJiBiWzBdLmhyZWYpIHJldHVybiBiWzBdLmhyZWYgKyBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goLyguKltcXC9cXFxcXSkvKVswXSArIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gcGF0aCgnc2hhcmU0Mi5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdSkgdSA9IGxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdCkgdCA9IGRvY3VtZW50LnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZuKSBmbiA9ICdpY29ucy5wbmcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZGVzYygpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21ldGEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgbWV0YS5sZW5ndGg7IG0rKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXRhW21dLm5hbWUudG9Mb3dlckNhc2UoKSA9PSAnZGVzY3JpcHRpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhW21dLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZCkgZCA9IGRlc2MoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9IGVuY29kZVVSSUNvbXBvbmVudCh1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IGVuY29kZVVSSUNvbXBvbmVudCh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHQucmVwbGFjZSgvXFwnL2csICclMjcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGVuY29kZVVSSUNvbXBvbmVudChpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZCA9IGVuY29kZVVSSUNvbXBvbmVudChkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZCA9IGQucmVwbGFjZSgvXFwnL2csICclMjcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmYlF1ZXJ5ID0gJ3U9JyArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9ICdudWxsJyAmJiBpICE9ICcnKSBmYlF1ZXJ5ID0gJ3M9MTAwJnBbdXJsXT0nICsgdSArICcmcFt0aXRsZV09JyArIHQgKyAnJnBbc3VtbWFyeV09JyArIGQgKyAnJnBbaW1hZ2VzXVswXT0nICsgaTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2a0ltYWdlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9ICdudWxsJyAmJiBpICE9ICcnKSB2a0ltYWdlID0gJyZpbWFnZT0nICsgaTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gbmV3IEFycmF5KCdcIiNcIiBkYXRhLWNvdW50PVwidmtcIiBvbmNsaWNrPVwid2luZG93Lm9wZW4oXFwnLy92ay5jb20vc2hhcmUucGhwP3VybD0nICsgdSArICcmdGl0bGU9JyArIHQgKyB2a0ltYWdlICsgJyZkZXNjcmlwdGlvbj0nICsgZCArICdcXCcsIFxcJ19ibGFua1xcJywgXFwnc2Nyb2xsYmFycz0wLCByZXNpemFibGU9MSwgbWVudWJhcj0wLCBsZWZ0PTEwMCwgdG9wPTEwMCwgd2lkdGg9NTUwLCBoZWlnaHQ9NDQwLCB0b29sYmFyPTAsIHN0YXR1cz0wXFwnKTtyZXR1cm4gZmFsc2VcIiB0aXRsZT1cItCf0L7QtNC10LvQuNGC0YzRgdGPINCS0JrQvtC90YLQsNC60YLQtVwiJywgJ1wiI1wiIGRhdGEtY291bnQ9XCJmYlwiIG9uY2xpY2s9XCJ3aW5kb3cub3BlbihcXCcvL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT0nICsgdSArICdcXCcsIFxcJ19ibGFua1xcJywgXFwnc2Nyb2xsYmFycz0wLCByZXNpemFibGU9MSwgbWVudWJhcj0wLCBsZWZ0PTEwMCwgdG9wPTEwMCwgd2lkdGg9NTUwLCBoZWlnaHQ9NDQwLCB0b29sYmFyPTAsIHN0YXR1cz0wXFwnKTtyZXR1cm4gZmFsc2VcIiB0aXRsZT1cItCf0L7QtNC10LvQuNGC0YzRgdGPINCyIEZhY2Vib29rXCInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHFxID0gWydiLWljb24gYi1pY29uLS1zaGFyZSBiLWljb24tLXZrIGljb24tdmsnLCAnYi1pY29uIGItaWNvbi0tc2hhcmUgaWNvbi1mYiddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsICs9ICc8YSBjbGFzcz1cIicgKyBxcVtqXSArICdcIiByZWw9XCJub2ZvbGxvd1wiIHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7XCIgaHJlZj0nICsgc1tqXSArICcgdGFyZ2V0PVwiX2JsYW5rXCI+PC9hPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVba10uaW5uZXJIVE1MID0gbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J/QvtGB0LvQtSDQv9GD0LHQu9C40LrQsNGG0LjQuCDRgdGC0YDQsNC90LjRhtGLINC4INC+0YLQv9GA0LDQstC60Lgg0LDRj9C60YHQsFxyXG4gICAgICAgIGNyZWF0ZWROZXdQYWdlKHBhZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy4kcmVmcy5hbGVydExpbmsudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50T3JpZ2luT3JsfT9pZD0ke3BhZ2V9YDtcclxuICAgICAgICAgICAgdGhpcy4kcmVmcy5hbGVydExpbmsuaHJlZiA9IGAke2N1cnJlbnRPcmlnaW5Pcmx9P2lkPSR7cGFnZX1gXHJcbiAgICAgICAgICAgIHRoaXMuYWxlcnRJc09wZW4gPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8INC00LDQvdC90YvQtSDQsiDRhNCxXHJcbiAgICAgICAgcHVibGlzaE5ld1RpbWVyKCkge1xyXG4gICAgICAgICAgICB2dWVfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkUGFnZSA9IChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YUpTT04gPSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlVGl0bGU6IHZ1ZV90aGlzLmhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgcHJlSGVhZGluZzogdnVlX3RoaXMucHJlSGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiB2dWVfdGhpcy5oZWFkaW5nTWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB2dWVfdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZmluaXNoRGF0ZTogdnVlX3RoaXMuZmluaXNoRGF0ZS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2VTcmNCYWNrZ3JvdW5kOiB2dWVfdGhpcy5pbWFnZVNyY0JhY2tncm91bmQsXHJcbiAgICAgICAgICAgICAgICBjb2xvcl9pOiB2dWVfdGhpcy5jb2xvcl9pLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkYXRhYmFzZS5yZWYoJ3BhZ2VzLycgKyBpZFBhZ2UpLnNldChkYXRhSlNPTilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3luY2hyb25pemF0aW9uIHN1Y2NlZWRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZ1ZV90aGlzLmNyZWF0ZWROZXdQYWdlKGlkUGFnZSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTeW5jaHJvbml6YXRpb24gZmFpbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCf0YDQuNC80LXQvdGP0LXQvCDQvdC+0LLRi9C1INC00LDQvdC90YvQtSDQuiDRgtCw0LnQvNC10YDRg1xyXG4gICAgICAgIGFjY2VwdERhdGEoZGF0YSkge1xyXG4gICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC/0LXRgNC10LzQtdC90L3Ri9C8INC30L3QsNGH0LXQvdC40Y8g0YEg0YHQtdGA0LLQtdGA0LBcclxuICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IGRhdGEucHJlSGVhZGluZztcclxuICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IGRhdGEuaGVhZGluZztcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gZGF0YS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQt9Cw0LPQvtC70L7QstC+0Log0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IGRhdGEucGFnZVRpdGxlXHJcbiAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0YTQvtC9XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kID0gZGF0YS5pbWFnZVNyY0JhY2tncm91bmQ7XHJcbiAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0YbQstC10YJcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFwcCA9IHsgJy0tdGhlbWUtY29sb3InOiBkYXRhLmNvbG9yX2kgfTtcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDQtNCw0YLRg1xyXG4gICAgICAgICAgICB0aGlzLmZpbmlzaERhdGUgPSBuZXcgRGF0ZShkYXRhLmZpbmlzaERhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmVmb3JlQ3JlYXRlKCkge1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyDQktGL0LfRi9Cy0LDQtdGC0YHRjyDRgdC40L3RhdGA0L7QvdC90L4g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0Y3QutC30LXQvNC/0LvRj9GA0LBcclxuICAgIGNyZWF0ZWQoKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGRhdGFfanNvbl9kZWZhdWx0O1xyXG4gICAgICAgIGNvbnN0IHRoaXNfdnVlID0gdGhpcztcclxuICAgICAgICB0aGlzLmFjY2VwdERhdGEoZGF0YSk7XHJcblxyXG4gICAgICAgIC8vINCf0L7Qu9GD0YfQsNC10Lwg0LTQsNC90L3Ri9C1XHJcbiAgICAgICAgZGF0YWJhc2UucmVmKCdwYWdlcy8nICsgY3VycmVudElkUGFnZS5pZCkub25jZSgndmFsdWUnKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29tcGxpdGUnKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRJZFBhZ2UuaWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpc192dWUuYWNjZXB0RGF0YShlLnZhbCgpKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZhaWxlZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g0JLRi9C30YvQstCw0LXRgtGB0Y8g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGC0L7Qs9C+INC60LDQuiDRjdC60LfQtdC80L/Qu9GP0YAg0LHRi9C7INGB0LzQvtC90YLQuNGA0L7QstCw0L1cclxuICAgIG1vdW50ZWQoKSB7XHJcbiAgICAgICAgLy8g0L/QvtC70YPRh9Cw0LXQvCDQutC+0L3QtdGH0L3Rg9GOINC00LDRgtGDICjQl9Cw0LPQvtC70L7QstC+0Log0JTQsNGC0YspXHJcbiAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcbiAgICAgICAgLy8g0LfQsNC/0YPRgdC60LDQtdC8INGC0LDQudC80LXRgFxyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxJbml0ID0gdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb2NrRnVuYygpO1xyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIC8vINC80LXQvdGP0LXQvCDRiNC10LnRgNGLXHJcbiAgICAgICAgdGhpcy5zaGFyZUNyZWF0ZUxpbmsoKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIHRoaXMuYWNjZXB0RWRpdFRleHQpO1xyXG4gICAgfVxyXG59KVxyXG4iXSwiZmlsZSI6InBhcnRpYWxzL2xhbmRpbmdfdnVlLmpzIn0=
