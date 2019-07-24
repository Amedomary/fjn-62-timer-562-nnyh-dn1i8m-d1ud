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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXJ0aWFscy9sYW5kaW5nX3Z1ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4vLyBWVUUg0L/RgNC40LvQvtC20LXQvdC40LVcclxuLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxubGV0IGN1cnJlbnRJZFBhZ2UgPSBxcy5wYXJzZShjdXJyZW50VVJMLCB7IGlnbm9yZVF1ZXJ5UHJlZml4OiB0cnVlIH0pO1xyXG5cclxuaWYgKCFjdXJyZW50VVJMLm1hdGNoKC9eXFw/aWQ9L2lnKSkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9JztcclxufVxyXG5cclxuY29uc3QgY3VycmVudE9yaWdpbk9ybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcblxyXG5jb25zdCBkYXRhX2pzb25fZGVmYXVsdCA9IHtcclxuICAgIHBhZ2VUaXRsZTogXCJUaW1lclwiLFxyXG4gICAgcHJlSGVhZGluZzogXCLRgtC10YHRglwiLFxyXG4gICAgaGVhZGluZzogXCJMb2FkaW5nLi4uXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCLRgtC10YHRglwiLFxyXG4gICAgaW1hZ2VTcmNCYWNrZ3JvdW5kOiBcIjBcIixcclxuICAgIGNvbG9yX2k6IDE3MixcclxuICAgIGZpbmlzaERhdGU6IFwiMFwiXHJcbn1cclxuXHJcbi8vIFlvdXIgd2ViIGFwcCdzIEZpcmViYXNlIGNvbmZpZ3VyYXRpb25cclxuY29uc3QgZmlyZWJhc2VDb25maWcgPSB7XHJcbiAgICBhcGlLZXk6IFwiQUl6YVN5QVBxNkEwc0RYX3VucjMzUXk4YXFyQWJ2bzJFcklSSERzXCIsXHJcbiAgICBhdXRoRG9tYWluOiBcInRpbWVyLWJhNTJkLmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly90aW1lci1iYTUyZC5maXJlYmFzZWlvLmNvbVwiLFxyXG4gICAgcHJvamVjdElkOiBcInRpbWVyLWJhNTJkXCIsXHJcbiAgICBzdG9yYWdlQnVja2V0OiBcInRpbWVyLWJhNTJkLmFwcHNwb3QuY29tXCIsXHJcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCI0NDg1OTc1ODkxMTlcIixcclxuICAgIGFwcElkOiBcIjE6NDQ4NTk3NTg5MTE5OndlYjoxYmI0ODBjMDkwNDcwN2VhXCJcclxufTtcclxuXHJcbi8vIEluaXRpYWxpemUgRmlyZWJhc2VcclxuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XHJcbmNvbnN0IGRhdGFiYXNlID0gZmlyZWJhc2UuZGF0YWJhc2UoKTtcclxuXHJcbi8vIFZVRSBhcHBcclxudmFyIGFwcExhbmRpbmcgPSBuZXcgVnVlKHtcclxuICAgIGVsOiAnI2xhbmRpbmctYXBwJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBjcmVhdGVUaW1lclNob3c6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgIHdlSGF2ZU1vZGlmaWNhdGVUaW1lcjogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDRgSDQvdC+0LLRi9C80Lgg0LTQsNC90L3Ri9C80LhcclxuICAgICAgICB3ZUFscmVhZHlIYXZlQ2hhbmdlczogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDQutC+0LPQtNCwINGF0L7RgtGPINCx0Ysg0YDQsNC3INC/0YDQuNC80LXQvdGP0LvQuCDQuNC30LzQtdC90LXQvdC40Y9cclxuXHJcbiAgICAgICAgLy8g0JrQu9Cw0YHRgdGLXHJcbiAgICAgICAgdnVlQXBwQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUJhY2tDbGFzczogJycsXHJcbiAgICAgICAgdnVlU2hhcmVDbGFzczogJycsXHJcbiAgICAgICAgdnVlQ2lyY2xlQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUJ1dHRvbkNsYXNzOiAnJyxcclxuICAgICAgICB2dWVDbG9ja0NsYXNzOiAnJyxcclxuICAgICAgICB2dWVQcmVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUhlYWRpbmdDbGFzczogJycsXHJcbiAgICAgICAgdnVlRGVzY3JpcHRpb25UZXh0Q2xhc3M6ICcnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uUGFuZWw6ICdoaWRlJyxcclxuICAgICAgICB2dWVBY2NlcHRFZGl0RGVzY3JpcHRpb246ICdjbGFzcycsXHJcblxyXG4gICAgICAgIC8vINCh0YLQuNC70LhcclxuICAgICAgICBzdHlsZUFwcDogJycsXHJcblxyXG4gICAgICAgIC8vINCk0L7RgtC+XHJcbiAgICAgICAgaW1hZ2VTcmNCYWNrZ3JvdW5kOiAnJyxcclxuXHJcbiAgICAgICAgc3RhdGVXYXNNb2RpZmllZDogZmFsc2UsIC8vINCx0YvQu9C+INC70L4g0LvQuCDQuNC30LzQtdC90LXQvdC+INGB0L7RgdGC0L7Rj9C90LjQtVxyXG5cclxuICAgICAgICBzdGF0ZUVkaXRQcmVIZWFkaW5nOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQv9C+0LQt0JfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgc3RhdGVFZGl0SGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0JfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0OiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQntC/0LjRgdCw0L3QuNC1XHJcbiAgICAgICAgc3RhdGVFZGl0Q2xvY2s6IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/RjtGC0YHRjyDQu9C4INGH0LDRgdGLXHJcblxyXG4gICAgICAgIHdhbGxwYXBlclNpZGVCYXJPcGVuOiBmYWxzZSwgLy8g0J7RgtC60YDRi9GCINC70Lgg0YHQsNC50LQg0LHQsNGAINC00LvRjyDRhNC+0L3QsFxyXG5cclxuICAgICAgICBoZWFkaW5nTWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0LfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgbGFzdEVkaXRIZWFkaW5nTWVzc2FnZTogJycsXHJcbiAgICAgICAgb2xkSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YLQtdC60YHRgtCwXHJcbiAgICAgICAgbmV3SGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDRgtC10LrRgdGC0LBcclxuXHJcbiAgICAgICAgZGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0L7Qv9C40YHQsNC90LjRj1xyXG4gICAgICAgIGxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINC+0L/QuNGB0LDQvdC40LUg0L/RgNC10LTRi9C00YPRidC10LPQviDRgdC+0YXRgNCw0L3QtdC90LjRj1xyXG4gICAgICAgIG9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L7Qv9C40YHQsNC90LjRjyDQstC+INCy0YDQtdC80Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgIG5ld0Rlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDQvtC/0LjRgdCw0L3QuNGPXHJcblxyXG4gICAgICAgIHByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICBsYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlOiAnJyxcclxuICAgICAgICBvbGRQcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICBuZXdQcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG5cclxuXHJcbiAgICAgICAgLy8g0KLQsNC50LzQtdGAID09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgZmluaXNoRGF0ZTogJycsIC8vICh5ZWFyLCBtb250aCwgZGF0ZSwgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMsIG1zKVxyXG4gICAgICAgIG1vbnRoTmFtZTogJycsXHJcblxyXG4gICAgICAgIGludGVydmFsOiBcIlwiLFxyXG4gICAgICAgIGludGVydmFsSW5pdDogXCJcIixcclxuICAgICAgICBjbF9tb250aDogJycsXHJcbiAgICAgICAgY2xfZGF5czogJycsXHJcbiAgICAgICAgY2xfaG91cnM6ICcnLFxyXG4gICAgICAgIGNsX21pbnV0ZXM6ICcnLFxyXG4gICAgICAgIGNsX3NlY29uZHM6ICcnLFxyXG4gICAgICAgIGNsX2RheXNfdGl0bGU6ICcnLFxyXG5cclxuICAgICAgICBjbG9ja0RhdGVJbnB1dEVycm9yOiBmYWxzZSxcclxuICAgICAgICBjbG9ja1RpbWVJbnB1dEVycm9yOiBmYWxzZSxcclxuXHJcbiAgICAgICAgLy8g0JLRi9Cx0L7RgCDRhtCy0LXRgtCwID09PT09PT1cclxuICAgICAgICBjb2xvcl9pOiAwLFxyXG5cclxuICAgICAgICAvLyDQvtC/0L7QstC10YnQtdC90LjQtSDQv9GD0LHQu9C40LrQsNGG0LjQuFxyXG4gICAgICAgIGFsZXJ0SXNPcGVuOiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgtC10LzRgyDRgNC10LTQvtC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgY3JlYXRlVGltZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaW1lclNob3cgPSAhdGhpcy5jcmVhdGVUaW1lclNob3c7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQXBwQ2xhc3MgPSAnbW9kaWZpY2F0aW9uJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDaXJjbGVDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUnOyAvLyBcImVkaXRhYmxlIGVkaXRlZFwiXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZVByZUhlYWRpbmdDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdERlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RFZGl0UHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLnByZUhlYWRpbmdNZXNzYWdlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gZmFsc2U7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g0JrQu9C40Log0L/QviDQntGC0LzQtdC90LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQXBwQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnaGlkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5sYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IHRoaXMubGFzdEVkaXRIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IGZhbHNlOyAvLyBvZmYg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IGZhbHNlOyAvL9Cy0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUgXCLQsiDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC4XCJcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLndlQWxyZWFkeUhhdmVDaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQn9GA0LjQvNC10L3Rj9C10Lwg0LjQt9C80LXQvdC10L3QuNGPINCf0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgYWNjZXB0Q3JlYXRlVGltZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaW1lclNob3cgPSAhdGhpcy5jcmVhdGVUaW1lclNob3c7IC8vINC80LXQvdGP0LXQvCDRgdC+0YHRgtC+0Y/QvdC40Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICAvLyDRg9Cx0LjQstCw0LXQvCDQutC70LDRgdGB0Ysg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnJztcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IGZhbHNlOyAvLyDQktGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1IFwi0LIg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQuFwiXHJcbiAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB0aGlzLndlQWxyZWFkeUhhdmVDaGFuZ2VzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INGH0LDRgdGLICjRgdGC0LDQstC40Lwg0L3QvtCy0YPRjiDQtNCw0YLRgylcclxuICAgICAgICBlZGl0Q2xvY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gdHJ1ZTsgLy8g0LLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlIGVkaXRpbmcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5jZWxFZGl0Q2xvY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vINGC0LDQudC80LDRg9GCINC00LvRjyDRg9C00LDQu9C10L3QuNGPINGB0LDQvNC+0LPQviDRgdC10LHRj1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IGZhbHNlOyAvLyBvZmYg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWNjZXB0RWRpdENsb2NrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCAkY2xvY2tJbnB1dERhdGUgPSB0aGlzLiRyZWZzLmVsQ2xvY2tJbnB1dERhdGU7XHJcbiAgICAgICAgICAgIGxldCAkY2xvY2tJbnB1dFRpbWUgPSB0aGlzLiRyZWZzLmVsQ2xvY2tJbnB1dFRpbWU7XHJcblxyXG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwLiDQktCy0LXQu9C4LdC70Lgg0LzRiyDQt9C90LDRh9C10L3QuNGPP1xyXG4gICAgICAgICAgICBpZiAoJGNsb2NrSW5wdXREYXRlLnZhbHVlID09ICcnICYmICRjbG9ja0lucHV0VGltZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGNsb2NrSW5wdXREYXRlLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGNsb2NrSW5wdXRUaW1lLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dFllYXIgPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMF0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0TW91dGggPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMV0pIC0gMTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dERheSA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVsyXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRIb3VyID0gTnVtYmVyKCRjbG9ja0lucHV0VGltZS52YWx1ZS5zcGxpdCgnOicpWzBdKTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dE1pbnV0ZXMgPSBOdW1iZXIoJGNsb2NrSW5wdXRUaW1lLnZhbHVlLnNwbGl0KCc6JylbMV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKGNsb2NrRGF0ZUltcHV0WWVhciwgY2xvY2tEYXRlSW1wdXRNb3V0aCwgY2xvY2tEYXRlSW1wdXREYXksIGNsb2NrRGF0ZUltcHV0SG91ciwgY2xvY2tEYXRlSW1wdXRNaW51dGVzLCAwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgIC8vINGC0LDQudC80LDRg9GCINC00LvRjyDRg9C00LDQu9C10L3QuNGPINGB0LDQvNC+0LPQviDRgdC10LHRj1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgfSwgMTAwKTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMINC/0L7QtC3Qt9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICBlZGl0UHJlSGVhZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9sZFByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5wcmVIZWFkaW5nTWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YAsIC8vINGC0LDQudC80LDRg9GCINC20LTRkdGCINGB0L7Qt9C00LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsFxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0UHJlSGVhZGluZy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNWdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dFByZUhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUucHJlSGVhZGluZ01lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1XHJcbiAgICAgICAgY29tcGxlYXRlRWRpdFByZUhlYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDRhNC+0YDQvNCwINC/0YPRgdGC0LDRjyDQuCDQvdC1INGC0LDQutCw0Y8g0LbQtVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5vbGRQcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMINC30LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIGVkaXRIZWFkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2xkSGVhZGluZ01lc3NhZ2UgPSB0aGlzLmhlYWRpbmdNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgFxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0SGVhZGluZy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNWdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUuaGVhZGluZ01lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1XHJcbiAgICAgICAgY29tcGxlYXRlRWRpdEhlYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y8g0Lgg0L3QtSDRgtCw0LrQsNGPINC20LVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWRpbmdNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IHRoaXMub2xkSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCBEZXNjcmlwdGlvblRleHRcclxuICAgICAgICBlZGl0RGVzY3JpcHRpb25UZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUgRGVzY3JpcHRpb25UZXh0XHJcbiAgICAgICAgY29tcGxlYXRlRWRpdERlc2NyaXB0aW9uVGV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y9cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLm9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0L/RgNC40LzQtdC90LjRgtGMINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUg0YLQtdC60YHRgtCwINC/0L4g0LrQu9Cw0LLQuNGI0LUg0K3QvdGC0YBcclxuICAgICAgICBhY2NlcHRFZGl0VGV4dDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgLy8g0LXRgdC70Lgg0LzRiyDQsiDQv9GA0L7RhtC10YHQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC4INGA0LXQtNCw0LrRgtC40YDRg9C10Lwg0LfQsNCz0LDQu9C+0LLQvtC6INC4INC90LDQttCw0LvQuCDRjdC90YLQtdGAXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wbGVhdGVFZGl0SGVhZGluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wbGVhdGVFZGl0UHJlSGVhZGluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdyAmJiB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCAmJiBlLmtleSA9PSAnRW50ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXREZXNjcmlwdGlvblRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCh0LrRgNGL0LLQsNC10Lwg0L/QsNC90LXQu9GM0LrRgyDQvtC/0LjRgdCw0L3QuNGPINC90LAg0LzQvtCx0LjQu9C1XHJcbiAgICAgICAgaGlkZURlc2NyaXB0aW9uUGFuZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9PT0gJ2hpZGUnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICdoaWRlJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIENsb2NrID09PT09PT09PT09PT09PT1cclxuICAgICAgICBjbG9ja0Z1bmM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gLy8g0YHQvtC30LTQsNGR0Lwg0LTQsNGC0YMg0L3QvtCy0YPRjlxyXG4gICAgICAgICAgICB2YXIgbm93RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAodGhpcy5maW5pc2hEYXRlIC0gbm93RGF0ZSk7IC8vINC/0L7Qu9GD0YfQsNC10Lwg0YDQsNC30L3QuNGG0YNcclxuXHJcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGC0LDQudC80LXRgCDQv9GA0L7RiNGR0LtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbW9udGggPSBcIkl0J3Mgb3ZlclwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzID0gJzAnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9ob3VycyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX21pbnV0ZXMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9zZWNvbmRzID0gJzAwJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICdkYXknO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwKSAlIDYwKTtcclxuICAgICAgICAgICAgICAgIHZhciBtaW51dGVzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCAvIDYwKSAlIDYwKTtcclxuICAgICAgICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDAgLyA2MCAvIDYwKSAlIDI0KTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXlzID0gTWF0aC5mbG9vcihyZXN1bHQgLyAxMDAwIC8gNjAgLyA2MCAvIDI0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcclxuICAgICAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhvdXJzIDwgMTApIGhvdXJzID0gJzAnICsgaG91cnM7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9tb250aCA9IHRoaXMubW9udGhOYW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzID0gZGF5cztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfaG91cnMgPSBob3VycztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbWludXRlcyA9IG1pbnV0ZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX3NlY29uZHMgPSBzZWNvbmRzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ2RheXMnO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsX2RheXMgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICdkYXknO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjcmVhdGVOYW1lT2ZGaW5pc2hEYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9udGhOYW1lID0gdGhpcy5maW5pc2hEYXRlLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbW9udGg6IFwibG9uZ1wiLCBkYXk6ICdudW1lcmljJywgaG91cjogJ251bWVyaWMnLCBtaW51dGU6ICdudW1lcmljJyB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQktGL0LHQvtGAINGG0LLQtdGC0LAgPT09PT09PT09PT09PT1cclxuICAgICAgICBjb2xvclBpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFwcCA9IHsgJy0tdGhlbWUtY29sb3InOiB0aGlzLmNvbG9yX2kgfTtcclxuICAgICAgICAgICAgdGhpcy5jb2xvcl9pID0gdGhpcy5jb2xvcl9pICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDMwIC0gNCkpICsgNDsgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGA0LDQvdC00L7QvNC90YvQuSDRhtCy0LXRgiDQvtGCIDQwIC0gNFxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YTQvtC90L7QstC+0LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICAgICAgd2FsbHBhcGVyUGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdhbGxwYXBlclBpY2tDbG9zZSgpIHtcclxuICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZUltYWdlQmFja2dyb3VuZChldmVudCkge1xyXG4gICAgICAgICAgICBsZXQgJGlucHV0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0LmZpbGVzICYmICRpbnB1dC5maWxlc1swXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaW1hZ2VTcmNCYWNrZ3JvdW5kID0gZS50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoJGlucHV0LmZpbGVzWzBdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vINGB0LzQtdC90LAg0YTQvtGC0L4g0LjQtyDQutC+0LvQu9C10LrRhtC40LhcclxuICAgICAgICBzd2FwSW1hZ2VCYWNrZ3JvdW5kKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBzcmNPZk5ld0JhY2tncm91bmQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS13YWxscGFwZXInKTtcclxuICAgICAgICAgICAgaWYgKHNyY09mTmV3QmFja2dyb3VuZCAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VTcmNCYWNrZ3JvdW5kID0gc3JjT2ZOZXdCYWNrZ3JvdW5kO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIHNoYXJlXHJcbiAgICAgICAgc2hhcmVDcmVhdGVMaW5rOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiLWxhbmRpbmdfX3NoYXJlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBlLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uY2xhc3NOYW1lLmluZGV4T2YoJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKSAhPSAtMSkgdmFyIHUgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgIT0gLTEpIHZhciB0ID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWltYWdlJykgIT0gLTEpIHZhciBpID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWRlc2NyaXB0aW9uJykgIT0gLTEpIHZhciBkID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKSAhPSAtMSkgdmFyIGYgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29ucy1maWxlJykgIT0gLTEpIHZhciBmbiA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWljb25zLWZpbGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwYXRoKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyID0gbmV3IFJlZ0V4cCgnXiguKi98KSgnICsgbmFtZSArICcpKFsjP118JCknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMCwgc2NMID0gc2MubGVuZ3RoOyBwIDwgc2NMOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG0gPSBTdHJpbmcoc2NbcF0uc3JjKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hdGNoKHNyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtWzFdLm1hdGNoKC9eKChodHRwcz98ZmlsZSlcXDpcXC97Mix9fFxcdzpbXFwvXFxcXF0pLykpIHJldHVybiBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1bMV0uaW5kZXhPZihcIi9cIikgPT0gMCkgcmV0dXJuIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jhc2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiWzBdICYmIGJbMF0uaHJlZikgcmV0dXJuIGJbMF0uaHJlZiArIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvKC4qW1xcL1xcXFxdKS8pWzBdICsgbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBwYXRoKCdzaGFyZTQyLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1KSB1ID0gbG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0KSB0ID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZm4pIGZuID0gJ2ljb25zLnBuZyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZXNjKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGEgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWV0YScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBtZXRhLmxlbmd0aDsgbSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFbbV0ubmFtZS50b0xvd2VyQ2FzZSgpID09ICdkZXNjcmlwdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFbbV0uY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkKSBkID0gZGVzYygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gZW5jb2RlVVJJQ29tcG9uZW50KHUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gdC5yZXBsYWNlKC9cXCcvZywgJyUyNycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gZW5jb2RlVVJJQ29tcG9uZW50KGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gZW5jb2RlVVJJQ29tcG9uZW50KGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gZC5yZXBsYWNlKC9cXCcvZywgJyUyNycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZiUXVlcnkgPSAndT0nICsgdTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT0gJ251bGwnICYmIGkgIT0gJycpIGZiUXVlcnkgPSAncz0xMDAmcFt1cmxdPScgKyB1ICsgJyZwW3RpdGxlXT0nICsgdCArICcmcFtzdW1tYXJ5XT0nICsgZCArICcmcFtpbWFnZXNdWzBdPScgKyBpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZrSW1hZ2UgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT0gJ251bGwnICYmIGkgIT0gJycpIHZrSW1hZ2UgPSAnJmltYWdlPScgKyBpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBuZXcgQXJyYXkoJ1wiI1wiIGRhdGEtY291bnQ9XCJ2a1wiIG9uY2xpY2s9XCJ3aW5kb3cub3BlbihcXCcvL3ZrLmNvbS9zaGFyZS5waHA/dXJsPScgKyB1ICsgJyZ0aXRsZT0nICsgdCArIHZrSW1hZ2UgKyAnJmRlc2NyaXB0aW9uPScgKyBkICsgJ1xcJywgXFwnX2JsYW5rXFwnLCBcXCdzY3JvbGxiYXJzPTAsIHJlc2l6YWJsZT0xLCBtZW51YmFyPTAsIGxlZnQ9MTAwLCB0b3A9MTAwLCB3aWR0aD01NTAsIGhlaWdodD00NDAsIHRvb2xiYXI9MCwgc3RhdHVzPTBcXCcpO3JldHVybiBmYWxzZVwiIHRpdGxlPVwi0J/QvtC00LXQu9C40YLRjNGB0Y8g0JLQmtC+0L3RgtCw0LrRgtC1XCInLCAnXCIjXCIgZGF0YS1jb3VudD1cImZiXCIgb25jbGljaz1cIndpbmRvdy5vcGVuKFxcJy8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScgKyB1ICsgJ1xcJywgXFwnX2JsYW5rXFwnLCBcXCdzY3JvbGxiYXJzPTAsIHJlc2l6YWJsZT0xLCBtZW51YmFyPTAsIGxlZnQ9MTAwLCB0b3A9MTAwLCB3aWR0aD01NTAsIGhlaWdodD00NDAsIHRvb2xiYXI9MCwgc3RhdHVzPTBcXCcpO3JldHVybiBmYWxzZVwiIHRpdGxlPVwi0J/QvtC00LXQu9C40YLRjNGB0Y8g0LIgRmFjZWJvb2tcIicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXEgPSBbJ2ItaWNvbiBiLWljb24tLXNoYXJlIGItaWNvbi0tdmsgaWNvbi12aycsICdiLWljb24gYi1pY29uLS1zaGFyZSBpY29uLWZiJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwgKz0gJzxhIGNsYXNzPVwiJyArIHFxW2pdICsgJ1wiIHJlbD1cIm5vZm9sbG93XCIgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jaztcIiBocmVmPScgKyBzW2pdICsgJyB0YXJnZXQ9XCJfYmxhbmtcIj48L2E+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZVtrXS5pbm5lckhUTUwgPSBsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQn9C+0YHQu9C1INC/0YPQsdC70LjQutCw0YbQuNC4INGB0YLRgNCw0L3QuNGG0Ysg0Lgg0L7RgtC/0YDQsNCy0LrQuCDQsNGP0LrRgdCwXHJcbiAgICAgICAgY3JlYXRlZE5ld1BhZ2UocGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRPcmlnaW5Pcmx9P2lkPSR7cGFnZX1gO1xyXG4gICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay5ocmVmID0gYCR7Y3VycmVudE9yaWdpbk9ybH0/aWQ9JHtwYWdlfWBcclxuICAgICAgICAgICAgdGhpcy5hbGVydElzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1INCyINGE0LFcclxuICAgICAgICBwdWJsaXNoTmV3VGltZXIoKSB7XHJcbiAgICAgICAgICAgIHZ1ZV90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgY29uc3QgaWRQYWdlID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMCkpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhSlNPTiA9IHtcclxuICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBwcmVIZWFkaW5nOiB2dWVfdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGhlYWRpbmc6IHZ1ZV90aGlzLmhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHZ1ZV90aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBmaW5pc2hEYXRlOiB2dWVfdGhpcy5maW5pc2hEYXRlLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6IHZ1ZV90aGlzLmltYWdlU3JjQmFja2dyb3VuZCxcclxuICAgICAgICAgICAgICAgIGNvbG9yX2k6IHZ1ZV90aGlzLmNvbG9yX2ksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRhdGFiYXNlLnJlZigncGFnZXMvJyArIGlkUGFnZSkuc2V0KGRhdGFKU09OKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTeW5jaHJvbml6YXRpb24gc3VjY2VlZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdnVlX3RoaXMuY3JlYXRlZE5ld1BhZ2UoaWRQYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N5bmNocm9uaXphdGlvbiBmYWlsZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSBmYWxzZTsgLy8g0JLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC90L7QstGL0LUg0LTQsNC90L3Ri9C1INC6INGC0LDQudC80LXRgNGDXHJcbiAgICAgICAgYWNjZXB0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0L/QtdGA0LXQvNC10L3QvdGL0Lwg0LfQvdCw0YfQtdC90LjRjyDRgSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gZGF0YS5wcmVIZWFkaW5nO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gZGF0YS5oZWFkaW5nO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSBkYXRhLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC30LDQs9C+0LvQvtCy0L7QuiDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gZGF0YS5wYWdlVGl0bGVcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhNC+0L1cclxuICAgICAgICAgICAgdGhpcy5pbWFnZVNyY0JhY2tncm91bmQgPSBkYXRhLmltYWdlU3JjQmFja2dyb3VuZDtcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhtCy0LXRglxyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IGRhdGEuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC00LDRgtGDXHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKGRhdGEuZmluaXNoRGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBiZWZvcmVDcmVhdGUoKSB7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vINCS0YvQt9GL0LLQsNC10YLRgdGPINGB0LjQvdGF0YDQvtC90L3QviDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDRjdC60LfQtdC80L/Qu9GP0YDQsFxyXG4gICAgY3JlYXRlZCgpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gZGF0YV9qc29uX2RlZmF1bHQ7XHJcbiAgICAgICAgY29uc3QgdGhpc192dWUgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYWNjZXB0RGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgLy8g0J/QvtC70YPRh9Cw0LXQvCDQtNCw0L3QvdGL0LVcclxuICAgICAgICBkYXRhYmFzZS5yZWYoJ3BhZ2VzLycgKyBjdXJyZW50SWRQYWdlLmlkKS5vbmNlKCd2YWx1ZScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb21wbGl0ZScpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudElkUGFnZS5pZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzX3Z1ZS5hY2NlcHREYXRhKGUudmFsKCkpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmFpbGVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyDQktGL0LfRi9Cy0LDQtdGC0YHRjyDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YLQvtCz0L4g0LrQsNC6INGN0LrQt9C10LzQv9C70Y/RgCDQsdGL0Lsg0YHQvNC+0L3RgtC40YDQvtCy0LDQvVxyXG4gICAgbW91bnRlZCgpIHtcclxuICAgICAgICAvLyDQv9C+0LvRg9GH0LDQtdC8INC60L7QvdC10YfQvdGD0Y4g0LTQsNGC0YMgKNCX0LDQs9C+0LvQvtCy0L7QuiDQlNCw0YLRiylcclxuICAgICAgICB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuICAgICAgICAvLyDQt9Cw0L/Rg9GB0LrQsNC10Lwg0YLQsNC50LzQtdGAXHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbEluaXQgPSB0aGlzLmNsb2NrRnVuYygpO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tGdW5jKCk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgLy8g0LzQtdC90Y/QtdC8INGI0LXQudGA0YtcclxuICAgICAgICB0aGlzLnNoYXJlQ3JlYXRlTGluaygpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgdGhpcy5hY2NlcHRFZGl0VGV4dCk7XHJcbiAgICB9XHJcbn0pXHJcbiJdLCJmaWxlIjoicGFydGlhbHMvbGFuZGluZ192dWUuanMifQ==
