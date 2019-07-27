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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXJ0aWFscy9sYW5kaW5nX3Z1ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4vLyBWVUUg0L/RgNC40LvQvtC20LXQvdC40LVcclxuLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxubGV0IGN1cnJlbnRJZFBhZ2UgPSBxcy5wYXJzZShjdXJyZW50VVJMLCB7IGlnbm9yZVF1ZXJ5UHJlZml4OiB0cnVlIH0pO1xyXG5cclxuaWYgKCFjdXJyZW50VVJMLm1hdGNoKC9eXFw/aWQ9L2lnKSkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9MCc7XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRPcmlnaW5PcmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG5cclxuY29uc3QgZGF0YV9qc29uX2RlZmF1bHQgPSB7XHJcbiAgICBwYWdlVGl0bGU6IFwiVGltZXJcIixcclxuICAgIGhlYWRpbmc6IFwiTG9hZGluZy4uLlwiLFxyXG4gICAgcHJlSGVhZGluZzogXCJcIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIlwiLFxyXG4gICAgZmluaXNoRGF0ZTogXCJcIixcclxuICAgIGltYWdlU3JjQmFja2dyb3VuZDogXCJcIixcclxuICAgIGNvbG9yX2k6IDE3MixcclxufVxyXG5cclxuLy8gWW91ciB3ZWIgYXBwJ3MgRmlyZWJhc2UgY29uZmlndXJhdGlvblxyXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcclxuICAgIGFwaUtleTogXCJBSXphU3lBUHE2QTBzRFhfdW5yMzNReThhcXJBYnZvMkVySVJIRHNcIixcclxuICAgIGF1dGhEb21haW46IFwidGltZXItYmE1MmQuZmlyZWJhc2VhcHAuY29tXCIsXHJcbiAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3RpbWVyLWJhNTJkLmZpcmViYXNlaW8uY29tXCIsXHJcbiAgICBwcm9qZWN0SWQ6IFwidGltZXItYmE1MmRcIixcclxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwidGltZXItYmE1MmQuYXBwc3BvdC5jb21cIixcclxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjQ0ODU5NzU4OTExOVwiLFxyXG4gICAgYXBwSWQ6IFwiMTo0NDg1OTc1ODkxMTk6d2ViOjFiYjQ4MGMwOTA0NzA3ZWFcIlxyXG59O1xyXG5cclxuLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxyXG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcclxuY29uc3QgZGF0YWJhc2UgPSBmaXJlYmFzZS5kYXRhYmFzZSgpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGlzVmFsaWREYXRlKGRhdGUpIHtcclxuICAgIHJldHVybiBkYXRlIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4oZGF0ZSk7XHJcbn1cclxuXHJcbi8vIFZVRSBhcHBcclxudmFyIGFwcExhbmRpbmcgPSBuZXcgVnVlKHtcclxuICAgIGVsOiAnI2xhbmRpbmctYXBwJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICAvLyDQodC+0YHRgtC+0Y/QvdC40Y8g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICBzdGF0ZUFwcDoge1xyXG4gICAgICAgICAgICBwcmVMb2FkaW5nQXBwOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNyZWF0ZVRpbWVyU2hvdzogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgd2VIYXZlTW9kaWZpY2F0ZVRpbWVyOiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INGBINC90L7QstGL0LzQuCDQtNCw0L3QvdGL0LzQuFxyXG4gICAgICAgIHdlQWxyZWFkeUhhdmVDaGFuZ2VzOiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INC60L7Qs9C00LAg0YXQvtGC0Y8g0LHRiyDRgNCw0Lcg0L/RgNC40LzQtdC90Y/Qu9C4INC40LfQvNC10L3QtdC90LjRj1xyXG5cclxuICAgICAgICAvLyDQmtC70LDRgdGB0YtcclxuICAgICAgICB2dWVBcHBDbGFzczogJycsXHJcbiAgICAgICAgdnVlQmFja0NsYXNzOiAnaGlkZScsXHJcbiAgICAgICAgdnVlU2hhcmVDbGFzczogJycsXHJcbiAgICAgICAgdnVlQ2lyY2xlQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUJ1dHRvbkNsYXNzOiAnJyxcclxuICAgICAgICB2dWVDbG9ja0NsYXNzOiAnJyxcclxuICAgICAgICB2dWVQcmVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUhlYWRpbmdDbGFzczogJycsXHJcbiAgICAgICAgdnVlRGVzY3JpcHRpb25UZXh0Q2xhc3M6ICcnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uUGFuZWw6ICdoaWRlJyxcclxuICAgICAgICB2dWVBY2NlcHRFZGl0RGVzY3JpcHRpb246ICdjbGFzcycsXHJcblxyXG4gICAgICAgIC8vINCh0YLQuNC70LhcclxuICAgICAgICBzdHlsZUFwcDogJycsXHJcblxyXG4gICAgICAgIC8vINCk0L7RgtC+XHJcbiAgICAgICAgaW1hZ2VTcmNCYWNrZ3JvdW5kOiAnJyxcclxuXHJcbiAgICAgICAgc3RhdGVXYXNNb2RpZmllZDogZmFsc2UsIC8vINCx0YvQu9C+INC70L4g0LvQuCDQuNC30LzQtdC90LXQvdC+INGB0L7RgdGC0L7Rj9C90LjQtVxyXG5cclxuICAgICAgICBzdGF0ZUVkaXRQcmVIZWFkaW5nOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQv9C+0LQt0JfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgc3RhdGVFZGl0SGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0JfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0OiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0LXRgtGB0Y8g0LvQuCDQntC/0LjRgdCw0L3QuNC1XHJcbiAgICAgICAgc3RhdGVFZGl0Q2xvY2s6IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/RjtGC0YHRjyDQu9C4INGH0LDRgdGLXHJcblxyXG4gICAgICAgIHdhbGxwYXBlclNpZGVCYXJPcGVuOiBmYWxzZSwgLy8g0J7RgtC60YDRi9GCINC70Lgg0YHQsNC50LQg0LHQsNGAINC00LvRjyDRhNC+0L3QsFxyXG5cclxuICAgICAgICBoZWFkaW5nTWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0LfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgbGFzdEVkaXRIZWFkaW5nTWVzc2FnZTogJycsXHJcbiAgICAgICAgb2xkSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YLQtdC60YHRgtCwXHJcbiAgICAgICAgbmV3SGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDRgtC10LrRgdGC0LBcclxuXHJcbiAgICAgICAgZGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0L7Qv9C40YHQsNC90LjRj1xyXG4gICAgICAgIGxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINC+0L/QuNGB0LDQvdC40LUg0L/RgNC10LTRi9C00YPRidC10LPQviDRgdC+0YXRgNCw0L3QtdC90LjRj1xyXG4gICAgICAgIG9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L7Qv9C40YHQsNC90LjRjyDQstC+INCy0YDQtdC80Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgIG5ld0Rlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDQvtC/0LjRgdCw0L3QuNGPXHJcblxyXG4gICAgICAgIHByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICBsYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlOiAnJyxcclxuICAgICAgICBvbGRQcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICBuZXdQcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG5cclxuICAgICAgICAvLyDQotCw0LnQvNC10YAgPT09PT09PT09PT09PT09PT1cclxuICAgICAgICBmaW5pc2hEYXRlOiAnJywgLy8gKHllYXIsIG1vbnRoLCBkYXRlLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbXMpXHJcbiAgICAgICAgbW9udGhOYW1lOiAnJyxcclxuXHJcbiAgICAgICAgaW50ZXJ2YWw6IFwiXCIsXHJcbiAgICAgICAgaW50ZXJ2YWxJbml0OiBcIlwiLFxyXG4gICAgICAgIGNsX21vbnRoOiAnJyxcclxuICAgICAgICBjbF9kYXlzOiAnJyxcclxuICAgICAgICBjbF9ob3VyczogJycsXHJcbiAgICAgICAgY2xfbWludXRlczogJycsXHJcbiAgICAgICAgY2xfc2Vjb25kczogJycsXHJcbiAgICAgICAgY2xfZGF5c190aXRsZTogJycsXHJcblxyXG4gICAgICAgIGNsb2NrRGF0ZUlucHV0RXJyb3I6IGZhbHNlLFxyXG4gICAgICAgIGNsb2NrVGltZUlucHV0RXJyb3I6IGZhbHNlLFxyXG5cclxuICAgICAgICAvLyDQktGL0LHQvtGAINGG0LLQtdGC0LAgPT09PT09PVxyXG4gICAgICAgIGNvbG9yX2k6IDAsXHJcblxyXG4gICAgICAgIC8vINC+0L/QvtCy0LXRidC10L3QuNC1INC/0YPQsdC70LjQutCw0YbQuNC4XHJcbiAgICAgICAgYWxlcnRJc09wZW46IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAvLyDQt9Cw0L/Rg9GB0LrQsNC10Lwg0YLQsNC50LzQtdGAXHJcbiAgICAgICAgc3RhcnRUaW1lcigpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbEluaXQgPSB0aGlzLmNsb2NrRnVuYygpO1xyXG4gICAgICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgtC10LzRgyDRgNC10LTQvtC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgY3JlYXRlVGltZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJ21vZGlmaWNhdGlvbic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnZWRpdGFibGUnOyAvLyBcImVkaXRhYmxlIGVkaXRlZFwiXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdEhlYWRpbmdNZXNzYWdlID0gdGhpcy5oZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5wcmVIZWFkaW5nTWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IGZhbHNlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vINCa0LvQuNC6INC/0L4g0J7RgtC80LXQvdC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMubGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSBmYWxzZTsgLy/QstGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1IFwi0LIg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQuFwiXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53ZUFscmVhZHlIYXZlQ2hhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC40LfQvNC10L3QtdC90LjRjyDQn9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgIGFjY2VwdENyZWF0ZVRpbWVyKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRpbWVyU2hvdyA9ICF0aGlzLmNyZWF0ZVRpbWVyU2hvdzsgLy8g0LzQtdC90Y/QtdC8INGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIC8vINGD0LHQuNCy0LDQtdC8INC60LvQsNGB0YHRiyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIHRoaXMudnVlQXBwQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVCdXR0b25DbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gZmFsc2U7IC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUgXCLQsiDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC4XCJcclxuICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgIHRoaXMud2VBbHJlYWR5SGF2ZUNoYW5nZXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0YfQsNGB0YsgKNGB0YLQsNCy0LjQvCDQvdC+0LLRg9GOINC00LDRgtGDKVxyXG4gICAgICAgIGVkaXRDbG9jaygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gdHJ1ZTsgLy8g0LLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlIGVkaXRpbmcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5jZWxFZGl0Q2xvY2soKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyDRgtCw0LnQvNCw0YPRgiDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyDRgdCw0LzQvtCz0L4g0YHQtdCx0Y9cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFjY2VwdEVkaXRDbG9jaygpIHtcclxuICAgICAgICAgICAgbGV0ICRjbG9ja0lucHV0RGF0ZSA9IHRoaXMuJHJlZnMuZWxDbG9ja0lucHV0RGF0ZTtcclxuICAgICAgICAgICAgbGV0ICRjbG9ja0lucHV0VGltZSA9IHRoaXMuJHJlZnMuZWxDbG9ja0lucHV0VGltZTtcclxuXHJcbiAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAuINCS0LLQtdC70Lgt0LvQuCDQvNGLINC30L3QsNGH0LXQvdC40Y8/XHJcbiAgICAgICAgICAgIGlmICgkY2xvY2tJbnB1dERhdGUudmFsdWUgPT0gJycgJiYgJGNsb2NrSW5wdXRUaW1lLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkY2xvY2tJbnB1dERhdGUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkY2xvY2tJbnB1dFRpbWUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0WWVhciA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVswXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRNb3V0aCA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVsxXSkgLSAxO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0RGF5ID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzJdKTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dEhvdXIgPSBOdW1iZXIoJGNsb2NrSW5wdXRUaW1lLnZhbHVlLnNwbGl0KCc6JylbMF0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0TWludXRlcyA9IE51bWJlcigkY2xvY2tJbnB1dFRpbWUudmFsdWUuc3BsaXQoJzonKVsxXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlID0gbmV3IERhdGUoY2xvY2tEYXRlSW1wdXRZZWFyLCBjbG9ja0RhdGVJbXB1dE1vdXRoLCBjbG9ja0RhdGVJbXB1dERheSwgY2xvY2tEYXRlSW1wdXRIb3VyLCBjbG9ja0RhdGVJbXB1dE1pbnV0ZXMsIDAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmFtZU9mRmluaXNoRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgLy8g0YLQsNC50LzQsNGD0YIg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8g0YHQsNC80L7Qs9C+INGB0LXQsdGPXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IGZhbHNlOyB9LCAxMDApOyAvLyBvZmYg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCd0LDRh9C40L3QsNC10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Ywg0L/QvtC0LdC30LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIGVkaXRQcmVIZWFkaW5nKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9sZFByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5wcmVIZWFkaW5nTWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YAsIC8vINGC0LDQudC80LDRg9GCINC20LTRkdGCINGB0L7Qt9C00LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsFxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0UHJlSGVhZGluZy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNWdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dFByZUhlYWRpbmcub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUucHJlSGVhZGluZ01lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1XHJcbiAgICAgICAgY29tcGxlYXRlRWRpdFByZUhlYWRpbmcoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y8g0Lgg0L3QtSDRgtCw0LrQsNGPINC20LVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZUhlYWRpbmdNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMub2xkUHJlSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQt9Cw0LPQvtC70L7QstC+0LpcclxuICAgICAgICBlZGl0SGVhZGluZygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRIZWFkaW5nTWVzc2FnZSA9IHRoaXMuaGVhZGluZ01lc3NhZ2U7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRIZWFkaW5nLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0SGVhZGluZy5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Z1ZS5oZWFkaW5nTWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LVcclxuICAgICAgICBjb21wbGVhdGVFZGl0SGVhZGluZygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0YTQvtGA0LzQsCDQv9GD0YHRgtCw0Y8g0Lgg0L3QtSDRgtCw0LrQsNGPINC20LVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWRpbmdNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9IHRoaXMub2xkSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCBEZXNjcmlwdGlvblRleHRcclxuICAgICAgICBlZGl0RGVzY3JpcHRpb25UZXh0KCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2xkRGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgFxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0RGVzY3JpcHRpb25UZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0RGVzY3JpcHRpb25UZXh0Lm9uaW5wdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnYWNjZXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vINCh0L7RhdGA0L7QvdGP0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1IERlc2NyaXB0aW9uVGV4dFxyXG4gICAgICAgIGNvbXBsZWF0ZUVkaXREZXNjcmlwdGlvblRleHQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDRhNC+0YDQvNCwINC/0YPRgdGC0LDRj1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMub2xkRGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQv9GA0LjQvNC10L3QuNGC0Ywg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtSDRgtC10LrRgdGC0LAg0L/QviDQutC70LDQstC40YjQtSDQrdC90YLRgFxyXG4gICAgICAgIGFjY2VwdEVkaXRUZXh0OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAvLyDQtdGB0LvQuCDQvNGLINCyINC/0YDQvtGG0LXRgdC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0Lgg0YDQtdC00LDQutGC0LjRgNGD0LXQvCDQt9Cw0LPQsNC70L7QstC+0Log0Lgg0L3QsNC20LDQu9C4INGN0L3RgtC10YBcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93ICYmIHRoaXMuc3RhdGVFZGl0SGVhZGluZyAmJiBlLmtleSA9PSAnRW50ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXRIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93ICYmIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyAmJiBlLmtleSA9PSAnRW50ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXRQcmVIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93ICYmIHRoaXMuc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0ICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdERlc2NyaXB0aW9uVGV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0KHQutGA0YvQstCw0LXQvCDQv9Cw0L3QtdC70YzQutGDINC+0L/QuNGB0LDQvdC40Y8g0L3QsCDQvNC+0LHQuNC70LVcclxuICAgICAgICBoaWRlRGVzY3JpcHRpb25QYW5lbCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9PT0gJ2hpZGUnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uUGFuZWwgPSAnJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICdoaWRlJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIENsb2NrID09PT09PT09PT09PT09PT1cclxuICAgICAgICBjbG9ja0Z1bmMoKSB7XHJcbiAgICAgICAgICAgIC8vIC8vINGB0L7Qt9C00LDRkdC8INC00LDRgtGDINC90L7QstGD0Y5cclxuICAgICAgICAgICAgbGV0IG5vd0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZmluaXNoRGF0ZSAtIG5vd0RhdGUpOyAvLyDQv9C+0LvRg9GH0LDQtdC8INGA0LDQt9C90LjRhtGDXHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoRGF0ZSBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHRoaXMuZmluaXNoRGF0ZSlcclxuXHJcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INC/0YDQtdC70L7QsNC00LjQvdCzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlQXBwLnByZUxvYWRpbmdBcHApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9udGhOYW1lID0gJ0xvYWRpbmcnO1xyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgtCw0LnQvNC10YAg0L/RgNC+0YjRkdC7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9tb250aCA9IFwiSXQncyBvdmVyXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSAnMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gJzAwJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbWludXRlcyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX3NlY29uZHMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ2RheSc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2Vjb25kcyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDApICUgNjApO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwIC8gNjApICUgNjApO1xyXG4gICAgICAgICAgICAgICAgbGV0IGhvdXJzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCAvIDYwIC8gNjApICUgMjQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRheXMgPSBNYXRoLmZsb29yKHJlc3VsdCAvIDEwMDAgLyA2MCAvIDYwIC8gMjQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoaG91cnMgPCAxMCkgaG91cnMgPSAnMCcgKyBob3VycztcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX21vbnRoID0gdGhpcy5tb250aE5hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSBkYXlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9ob3VycyA9IGhvdXJzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9taW51dGVzID0gbWludXRlcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfc2Vjb25kcyA9IHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXNfdGl0bGUgPSAnZGF5cyc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xfZGF5cyA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ2RheSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9udGhOYW1lID0gdGhpcy5maW5pc2hEYXRlLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbW9udGg6IFwibG9uZ1wiLCBkYXk6ICdudW1lcmljJywgaG91cjogJ251bWVyaWMnLCBtaW51dGU6ICdudW1lcmljJyB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQktGL0LHQvtGAINGG0LLQtdGC0LAgPT09PT09PT09PT09PT1cclxuICAgICAgICBjb2xvclBpY2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGVBcHAgPSB7ICctLXRoZW1lLWNvbG9yJzogdGhpcy5jb2xvcl9pIH07XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JfaSA9IHRoaXMuY29sb3JfaSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgzMCAtIDQpKSArIDQ7IC8vINCU0L7QsdCw0LLQu9GP0LXQvCDRgNCw0L3QtNC+0LzQvdGL0Lkg0YbQstC10YIg0L7RgiA0MCAtIDRcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQktGL0LHQvtGAINGE0L7QvdC+0LLQvtCz0L4g0LjQt9C+0LHRgNCw0LbQtdC90LjRj1xyXG4gICAgICAgIHdhbGxwYXBlclBpY2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2FsbHBhcGVyUGlja0Nsb3NlKCkge1xyXG4gICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhbmdlSW1hZ2VCYWNrZ3JvdW5kKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCAkaW5wdXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgIGlmICgkaW5wdXQuZmlsZXMgJiYgJGlucHV0LmZpbGVzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgICAgIGxldCB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pbWFnZVNyY0JhY2tncm91bmQgPSBlLnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTCgkaW5wdXQuZmlsZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0YHQvNC10L3QsCDRhNC+0YLQviDQuNC3INC60L7Qu9C70LXQutGG0LjQuFxyXG4gICAgICAgIHN3YXBJbWFnZUJhY2tncm91bmQoZXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IHNyY09mTmV3QmFja2dyb3VuZCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXdhbGxwYXBlcicpO1xyXG4gICAgICAgICAgICBpZiAoc3JjT2ZOZXdCYWNrZ3JvdW5kICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNyY0JhY2tncm91bmQgPSBzcmNPZk5ld0JhY2tncm91bmQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gc2hhcmVcclxuICAgICAgICBzaGFyZUNyZWF0ZUxpbmsoKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiLWxhbmRpbmdfX3NoYXJlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBlLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uY2xhc3NOYW1lLmluZGV4T2YoJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKSAhPSAtMSkgdmFyIHUgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgIT0gLTEpIHZhciB0ID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWltYWdlJykgIT0gLTEpIHZhciBpID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWRlc2NyaXB0aW9uJykgIT0gLTEpIHZhciBkID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKSAhPSAtMSkgdmFyIGYgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29ucy1maWxlJykgIT0gLTEpIHZhciBmbiA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWljb25zLWZpbGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwYXRoKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyID0gbmV3IFJlZ0V4cCgnXiguKi98KSgnICsgbmFtZSArICcpKFsjP118JCknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMCwgc2NMID0gc2MubGVuZ3RoOyBwIDwgc2NMOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG0gPSBTdHJpbmcoc2NbcF0uc3JjKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hdGNoKHNyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtWzFdLm1hdGNoKC9eKChodHRwcz98ZmlsZSlcXDpcXC97Mix9fFxcdzpbXFwvXFxcXF0pLykpIHJldHVybiBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1bMV0uaW5kZXhPZihcIi9cIikgPT0gMCkgcmV0dXJuIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jhc2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiWzBdICYmIGJbMF0uaHJlZikgcmV0dXJuIGJbMF0uaHJlZiArIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvKC4qW1xcL1xcXFxdKS8pWzBdICsgbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBwYXRoKCdzaGFyZTQyLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1KSB1ID0gbG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0KSB0ID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZm4pIGZuID0gJ2ljb25zLnBuZyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZXNjKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGEgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWV0YScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBtZXRhLmxlbmd0aDsgbSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFbbV0ubmFtZS50b0xvd2VyQ2FzZSgpID09ICdkZXNjcmlwdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFbbV0uY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkKSBkID0gZGVzYygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gZW5jb2RlVVJJQ29tcG9uZW50KHUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gdC5yZXBsYWNlKC9cXCcvZywgJyUyNycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gZW5jb2RlVVJJQ29tcG9uZW50KGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gZW5jb2RlVVJJQ29tcG9uZW50KGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gZC5yZXBsYWNlKC9cXCcvZywgJyUyNycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZiUXVlcnkgPSAndT0nICsgdTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT0gJ251bGwnICYmIGkgIT0gJycpIGZiUXVlcnkgPSAncz0xMDAmcFt1cmxdPScgKyB1ICsgJyZwW3RpdGxlXT0nICsgdCArICcmcFtzdW1tYXJ5XT0nICsgZCArICcmcFtpbWFnZXNdWzBdPScgKyBpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZrSW1hZ2UgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT0gJ251bGwnICYmIGkgIT0gJycpIHZrSW1hZ2UgPSAnJmltYWdlPScgKyBpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBuZXcgQXJyYXkoJ1wiI1wiIGRhdGEtY291bnQ9XCJ2a1wiIG9uY2xpY2s9XCJ3aW5kb3cub3BlbihcXCcvL3ZrLmNvbS9zaGFyZS5waHA/dXJsPScgKyB1ICsgJyZ0aXRsZT0nICsgdCArIHZrSW1hZ2UgKyAnJmRlc2NyaXB0aW9uPScgKyBkICsgJ1xcJywgXFwnX2JsYW5rXFwnLCBcXCdzY3JvbGxiYXJzPTAsIHJlc2l6YWJsZT0xLCBtZW51YmFyPTAsIGxlZnQ9MTAwLCB0b3A9MTAwLCB3aWR0aD01NTAsIGhlaWdodD00NDAsIHRvb2xiYXI9MCwgc3RhdHVzPTBcXCcpO3JldHVybiBmYWxzZVwiIHRpdGxlPVwi0J/QvtC00LXQu9C40YLRjNGB0Y8g0JLQmtC+0L3RgtCw0LrRgtC1XCInLCAnXCIjXCIgZGF0YS1jb3VudD1cImZiXCIgb25jbGljaz1cIndpbmRvdy5vcGVuKFxcJy8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScgKyB1ICsgJ1xcJywgXFwnX2JsYW5rXFwnLCBcXCdzY3JvbGxiYXJzPTAsIHJlc2l6YWJsZT0xLCBtZW51YmFyPTAsIGxlZnQ9MTAwLCB0b3A9MTAwLCB3aWR0aD01NTAsIGhlaWdodD00NDAsIHRvb2xiYXI9MCwgc3RhdHVzPTBcXCcpO3JldHVybiBmYWxzZVwiIHRpdGxlPVwi0J/QvtC00LXQu9C40YLRjNGB0Y8g0LIgRmFjZWJvb2tcIicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXEgPSBbJ2ItaWNvbiBiLWljb24tLXNoYXJlIGItaWNvbi0tdmsgaWNvbi12aycsICdiLWljb24gYi1pY29uLS1zaGFyZSBpY29uLWZiJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwgKz0gJzxhIGNsYXNzPVwiJyArIHFxW2pdICsgJ1wiIHJlbD1cIm5vZm9sbG93XCIgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jaztcIiBocmVmPScgKyBzW2pdICsgJyB0YXJnZXQ9XCJfYmxhbmtcIj48L2E+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZVtrXS5pbm5lckhUTUwgPSBsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQn9C+0YHQu9C1INC/0YPQsdC70LjQutCw0YbQuNC4INGB0YLRgNCw0L3QuNGG0Ysg0Lgg0L7RgtC/0YDQsNCy0LrQuCDQsNGP0LrRgdCwXHJcbiAgICAgICAgY3JlYXRlZE5ld1BhZ2UocGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRPcmlnaW5Pcmx9P2lkPSR7cGFnZX1gO1xyXG4gICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay5ocmVmID0gYCR7Y3VycmVudE9yaWdpbk9ybH0/aWQ9JHtwYWdlfWBcclxuICAgICAgICAgICAgdGhpcy5hbGVydElzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1INCyINGE0LDQuNGA0LHRjdC50LdcclxuICAgICAgICBwdWJsaXNoTmV3VGltZXIoKSB7XHJcbiAgICAgICAgICAgIHZ1ZV90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgY29uc3QgaWRQYWdlID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMCkpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhSlNPTiA9IHtcclxuICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBwcmVIZWFkaW5nOiB2dWVfdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGhlYWRpbmc6IHZ1ZV90aGlzLmhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHZ1ZV90aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBmaW5pc2hEYXRlOiB2dWVfdGhpcy5maW5pc2hEYXRlLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6IHZ1ZV90aGlzLmltYWdlU3JjQmFja2dyb3VuZCxcclxuICAgICAgICAgICAgICAgIGNvbG9yX2k6IHZ1ZV90aGlzLmNvbG9yX2ksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRhdGFiYXNlLnJlZigncGFnZXMvJyArIGlkUGFnZSkuc2V0KGRhdGFKU09OKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTeW5jaHJvbml6YXRpb24gc3VjY2VlZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdnVlX3RoaXMuY3JlYXRlZE5ld1BhZ2UoaWRQYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N5bmNocm9uaXphdGlvbiBmYWlsZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSBmYWxzZTsgLy8g0JLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC90L7QstGL0LUg0LTQsNC90L3Ri9C1INC6INGC0LDQudC80LXRgNGDXHJcbiAgICAgICAgYWNjZXB0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRlID0gbmV3IERhdGUoZGF0YS5maW5pc2hEYXRlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkRGF0ZShuZXdEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0LLQtdGA0L3QsFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0J3QlSDQstC10YDQvdCwXHJcbiAgICAgICAgICAgICAgICBuZXdEYXRlID0gbmV3IERhdGUoMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0L/QtdGA0LXQvNC10L3QvdGL0Lwg0LfQvdCw0YfQtdC90LjRjyDRgSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gZGF0YS5wcmVIZWFkaW5nO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gZGF0YS5oZWFkaW5nO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSBkYXRhLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC30LDQs9C+0LvQvtCy0L7QuiDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gZGF0YS5wYWdlVGl0bGVcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhNC+0L1cclxuICAgICAgICAgICAgdGhpcy5pbWFnZVNyY0JhY2tncm91bmQgPSBkYXRhLmltYWdlU3JjQmFja2dyb3VuZDtcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhtCy0LXRglxyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IGRhdGEuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC00LDRgtGDXHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoRGF0ZSA9IG5ld0RhdGU7XHJcbiAgICAgICAgICAgIC8vINCy0LrQu9GO0YfQsNC10Lwg0L3QvtCy0YPRjiDQtNCw0YLRg1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBmaW5pc2hQcmVsb2FkaW5nRG9uZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZUFwcC5wcmVMb2FkaW5nQXBwID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lcigpO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbGVkTG9hZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9ICc0MDQgOignO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBsb2FkaW5nIHRoZSBkYXRhLCBjaGVjayB0aGUgaWQgYW5kIG1ha2Ugc3VyZSBpdCBleGlzdHMnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBiZWZvcmVDcmVhdGUoKSB7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vINCS0YvQt9GL0LLQsNC10YLRgdGPINGB0LjQvdGF0YDQvtC90L3QviDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDRjdC60LfQtdC80L/Qu9GP0YDQsFxyXG4gICAgY3JlYXRlZCgpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gZGF0YV9qc29uX2RlZmF1bHQ7XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYWNjZXB0RGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgLy8g0J/QvtC70YPRh9Cw0LXQvCDQtNCw0L3QvdGL0LVcclxuICAgICAgICBkYXRhYmFzZS5yZWYoJ3BhZ2VzLycgKyBjdXJyZW50SWRQYWdlLmlkKS5vbmNlKCd2YWx1ZScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5hY2NlcHREYXRhKGUudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDQv9GA0LjQu9C+0LbQtdC90LjQtVxyXG4gICAgICAgICAgICAgICAgX3RoaXMuZmluaXNoUHJlbG9hZGluZ0RvbmUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZmFpbGVkTG9hZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g0JLRi9C30YvQstCw0LXRgtGB0Y8g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGC0L7Qs9C+INC60LDQuiDRjdC60LfQtdC80L/Qu9GP0YAg0LHRi9C7INGB0LzQvtC90YLQuNGA0L7QstCw0L1cclxuICAgIG1vdW50ZWQoKSB7XHJcbiAgICAgICAgLy8g0L/QvtC70YPRh9Cw0LXQvCDQutC+0L3QtdGH0L3Rg9GOINC00LDRgtGDICjQl9Cw0LPQvtC70L7QstC+0Log0JTQsNGC0YspXHJcbiAgICAgICAgLy8gdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcbiAgICAgICAgLy8g0LzQtdC90Y/QtdC8INGI0LXQudGA0YtcclxuICAgICAgICB0aGlzLnNoYXJlQ3JlYXRlTGluaygpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgdGhpcy5hY2NlcHRFZGl0VGV4dCk7XHJcbiAgICB9XHJcbn0pXHJcbiJdLCJmaWxlIjoicGFydGlhbHMvbGFuZGluZ192dWUuanMifQ==
