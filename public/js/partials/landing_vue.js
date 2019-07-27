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

        editButton() {
            if (this.createTimerShow) {
                this.stateEditButton = true;
            }
        },
        cancelEditButton() {
            this.stateEditButton = false;
        },
        acceptEditButton() {
            this.stateEditButton = false;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXJ0aWFscy9sYW5kaW5nX3Z1ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4vLyBWVUUg0L/RgNC40LvQvtC20LXQvdC40LVcclxuLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmxldCBjdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxubGV0IGN1cnJlbnRJZFBhZ2UgPSBxcy5wYXJzZShjdXJyZW50VVJMLCB7IGlnbm9yZVF1ZXJ5UHJlZml4OiB0cnVlIH0pO1xyXG5cclxuaWYgKCFjdXJyZW50VVJMLm1hdGNoKC9eXFw/aWQ9L2lnKSkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICc/aWQ9MCc7XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRPcmlnaW5PcmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG5cclxuY29uc3QgZGF0YV9qc29uX2RlZmF1bHQgPSB7XHJcbiAgICBwYWdlVGl0bGU6IFwi0KLQsNC50LzQtdGAXCIsXHJcbiAgICBoZWFkaW5nOiBcItCX0LDQs9GA0YPQt9C60LAuLi5cIixcclxuICAgIHByZUhlYWRpbmc6IFwiXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgIGZpbmlzaERhdGU6IFwiXCIsXHJcbiAgICBpbWFnZVNyY0JhY2tncm91bmQ6IFwiXCIsXHJcbiAgICBjb2xvcl9pOiAxNzIsXHJcbn1cclxuXHJcbi8vIFlvdXIgd2ViIGFwcCdzIEZpcmViYXNlIGNvbmZpZ3VyYXRpb25cclxuY29uc3QgZmlyZWJhc2VDb25maWcgPSB7XHJcbiAgICBhcGlLZXk6IFwiQUl6YVN5QVBxNkEwc0RYX3VucjMzUXk4YXFyQWJ2bzJFcklSSERzXCIsXHJcbiAgICBhdXRoRG9tYWluOiBcInRpbWVyLWJhNTJkLmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly90aW1lci1iYTUyZC5maXJlYmFzZWlvLmNvbVwiLFxyXG4gICAgcHJvamVjdElkOiBcInRpbWVyLWJhNTJkXCIsXHJcbiAgICBzdG9yYWdlQnVja2V0OiBcInRpbWVyLWJhNTJkLmFwcHNwb3QuY29tXCIsXHJcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCI0NDg1OTc1ODkxMTlcIixcclxuICAgIGFwcElkOiBcIjE6NDQ4NTk3NTg5MTE5OndlYjoxYmI0ODBjMDkwNDcwN2VhXCJcclxufTtcclxuXHJcbi8vIEluaXRpYWxpemUgRmlyZWJhc2VcclxuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XHJcbmNvbnN0IGRhdGFiYXNlID0gZmlyZWJhc2UuZGF0YWJhc2UoKTtcclxuXHJcblxyXG5mdW5jdGlvbiBpc1ZhbGlkRGF0ZShkYXRlKSB7XHJcbiAgICByZXR1cm4gZGF0ZSBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKGRhdGUpO1xyXG59XHJcblxyXG4vLyBWVUUgYXBwXHJcbnZhciBhcHBMYW5kaW5nID0gbmV3IFZ1ZSh7XHJcbiAgICBlbDogJyNsYW5kaW5nLWFwcCcsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgLy8g0KHQvtGB0YLQvtGP0L3QuNGPINC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgc3RhdGVBcHA6IHtcclxuICAgICAgICAgICAgcHJlTG9hZGluZ0FwcDogdHJ1ZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjcmVhdGVUaW1lclNob3c6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgIHdlSGF2ZU1vZGlmaWNhdGVUaW1lcjogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDRgSDQvdC+0LLRi9C80Lgg0LTQsNC90L3Ri9C80LhcclxuICAgICAgICB3ZUFscmVhZHlIYXZlQ2hhbmdlczogZmFsc2UsIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDQutC+0LPQtNCwINGF0L7RgtGPINCx0Ysg0YDQsNC3INC/0YDQuNC80LXQvdGP0LvQuCDQuNC30LzQtdC90LXQvdC40Y9cclxuXHJcbiAgICAgICAgLy8g0JrQu9Cw0YHRgdGLXHJcbiAgICAgICAgdnVlQXBwQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUJhY2tDbGFzczogJ2hpZGUnLFxyXG4gICAgICAgIHZ1ZVNoYXJlQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUNpcmNsZUNsYXNzOiAnJyxcclxuICAgICAgICB2dWVCdXR0b25DbGFzczogJycsXHJcbiAgICAgICAgdnVlQ2xvY2tDbGFzczogJycsXHJcbiAgICAgICAgdnVlUHJlSGVhZGluZ0NsYXNzOiAnJyxcclxuICAgICAgICB2dWVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzOiAnJyxcclxuICAgICAgICBkZXNjcmlwdGlvblBhbmVsOiAnaGlkZScsXHJcbiAgICAgICAgdnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uOiAnY2xhc3MnLFxyXG5cclxuICAgICAgICAvLyDQodGC0LjQu9C4XHJcbiAgICAgICAgc3R5bGVBcHA6ICcnLFxyXG5cclxuICAgICAgICAvLyDQpNC+0YLQvlxyXG4gICAgICAgIGltYWdlU3JjQmFja2dyb3VuZDogJycsXHJcblxyXG4gICAgICAgIHN0YXRlV2FzTW9kaWZpZWQ6IGZhbHNlLCAvLyDQsdGL0LvQviDQu9C+INC70Lgg0LjQt9C80LXQvdC10L3QviDRgdC+0YHRgtC+0Y/QvdC40LVcclxuXHJcbiAgICAgICAgc3RhdGVFZGl0UHJlSGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0L/QvtC0LdCX0LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIHN0YXRlRWRpdEhlYWRpbmc6IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/QtdGC0YHRjyDQu9C4INCX0LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIHN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dDogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0J7Qv9C40YHQsNC90LjQtVxyXG4gICAgICAgIHN0YXRlRWRpdENsb2NrOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0Y7RgtGB0Y8g0LvQuCDRh9Cw0YHRi1xyXG4gICAgICAgIHN0YXRlRWRpdEJ1dHRvbjogZmFsc2UsIC8vINC40LfQvNC10L3Rj9GO0YIg0LvQuCDQutC90L7Qv9C60YM/XHJcblxyXG4gICAgICAgIHdhbGxwYXBlclNpZGVCYXJPcGVuOiBmYWxzZSwgLy8g0J7RgtC60YDRi9GCINC70Lgg0YHQsNC50LQg0LHQsNGAINC00LvRjyDRhNC+0L3QsFxyXG5cclxuICAgICAgICBoZWFkaW5nTWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0LfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgbGFzdEVkaXRIZWFkaW5nTWVzc2FnZTogJycsXHJcbiAgICAgICAgb2xkSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YLQtdC60YHRgtCwXHJcbiAgICAgICAgbmV3SGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDRgtC10LrRgdGC0LBcclxuXHJcbiAgICAgICAgZGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0L7Qv9C40YHQsNC90LjRj1xyXG4gICAgICAgIGxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTogJycsIC8vINC+0L/QuNGB0LDQvdC40LUg0L/RgNC10LTRi9C00YPRidC10LPQviDRgdC+0YXRgNCw0L3QtdC90LjRj1xyXG4gICAgICAgIG9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L7Qv9C40YHQsNC90LjRjyDQstC+INCy0YDQtdC80Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgIG5ld0Rlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDQvtC/0LjRgdCw0L3QuNGPXHJcblxyXG4gICAgICAgIHByZUhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0YLQtdC60YHRgiDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICBsYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlOiAnJyxcclxuICAgICAgICBvbGRQcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8g0L/RgNC10LTRi9C00YPRidC10LPQviDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuICAgICAgICBuZXdQcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGP0YfQtdC50LrQsCDQtNC70Y8g0L3QvtCy0L7Qs9C+INC/0YDQtdC0INCX0LDQs9C+0LvQvtCy0LrQsFxyXG5cclxuICAgICAgICAvLyDQotCw0LnQvNC10YAgPT09PT09PT09PT09PT09PT1cclxuICAgICAgICBmaW5pc2hEYXRlOiAnJywgLy8gKHllYXIsIG1vbnRoLCBkYXRlLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbXMpXHJcbiAgICAgICAgbW9udGhOYW1lOiAnJyxcclxuXHJcbiAgICAgICAgaW50ZXJ2YWw6IFwiXCIsXHJcbiAgICAgICAgaW50ZXJ2YWxJbml0OiBcIlwiLFxyXG4gICAgICAgIGNsX21vbnRoOiAnJyxcclxuICAgICAgICBjbF9kYXlzOiAnJyxcclxuICAgICAgICBjbF9ob3VyczogJycsXHJcbiAgICAgICAgY2xfbWludXRlczogJycsXHJcbiAgICAgICAgY2xfc2Vjb25kczogJycsXHJcbiAgICAgICAgY2xfZGF5c190aXRsZTogJycsXHJcblxyXG4gICAgICAgIGNsb2NrRGF0ZUlucHV0RXJyb3I6IGZhbHNlLFxyXG4gICAgICAgIGNsb2NrVGltZUlucHV0RXJyb3I6IGZhbHNlLFxyXG5cclxuICAgICAgICAvLyDQktGL0LHQvtGAINGG0LLQtdGC0LAgPT09PT09PVxyXG4gICAgICAgIGNvbG9yX2k6IDAsXHJcblxyXG4gICAgICAgIC8vINC+0L/QvtCy0LXRidC10L3QuNC1INC/0YPQsdC70LjQutCw0YbQuNC4XHJcbiAgICAgICAgYWxlcnRJc09wZW46IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAvLyDQt9Cw0L/Rg9GB0LrQsNC10Lwg0YLQsNC50LzQtdGAXHJcbiAgICAgICAgc3RhcnRUaW1lcigpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbEluaXQgPSB0aGlzLmNsb2NrRnVuYygpO1xyXG4gICAgICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgtC10LzRgyDRgNC10LTQvtC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgY3JlYXRlVGltZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZXJTaG93ID0gIXRoaXMuY3JlYXRlVGltZXJTaG93O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJ21vZGlmaWNhdGlvbic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnZWRpdGFibGUnOyAvLyBcImVkaXRhYmxlIGVkaXRlZFwiXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdEhlYWRpbmdNZXNzYWdlID0gdGhpcy5oZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RWRpdFByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5wcmVIZWFkaW5nTWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IGZhbHNlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vINCa0LvQuNC6INC/0L4g0J7RgtC80LXQvdC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJ1dHRvbkNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMubGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0SGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gZmFsc2U7IC8v0LLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSBcItCyINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LhcIlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2VBbHJlYWR5SGF2ZUNoYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCf0YDQuNC80LXQvdGP0LXQvCDQuNC30LzQtdC90LXQvdC40Y8g0J/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICBhY2NlcHRDcmVhdGVUaW1lcigpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaW1lclNob3cgPSAhdGhpcy5jcmVhdGVUaW1lclNob3c7IC8vINC80LXQvdGP0LXQvCDRgdC+0YHRgtC+0Y/QvdC40Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICAvLyDRg9Cx0LjQstCw0LXQvCDQutC70LDRgdGB0Ysg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUFwcENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQnV0dG9uQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlSGVhZGluZ0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnJztcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IGZhbHNlOyAvLyDQktGL0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1IFwi0LIg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQuFwiXHJcbiAgICAgICAgICAgIHRoaXMud2VIYXZlTW9kaWZpY2F0ZVRpbWVyID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB0aGlzLndlQWxyZWFkeUhhdmVDaGFuZ2VzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INGH0LDRgdGLICjRgdGC0LDQstC40Lwg0L3QvtCy0YPRjiDQtNCw0YLRgylcclxuICAgICAgICBlZGl0Q2xvY2soKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IHRydWU7IC8vINCy0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSBlZGl0aW5nJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FuY2VsRWRpdENsb2NrKCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgLy8g0YLQsNC50LzQsNGD0YIg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8g0YHQsNC80L7Qs9C+INGB0LXQsdGPXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhY2NlcHRFZGl0Q2xvY2soKSB7XHJcbiAgICAgICAgICAgIGxldCAkY2xvY2tJbnB1dERhdGUgPSB0aGlzLiRyZWZzLmVsQ2xvY2tJbnB1dERhdGU7XHJcbiAgICAgICAgICAgIGxldCAkY2xvY2tJbnB1dFRpbWUgPSB0aGlzLiRyZWZzLmVsQ2xvY2tJbnB1dFRpbWU7XHJcblxyXG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwLiDQktCy0LXQu9C4LdC70Lgg0LzRiyDQt9C90LDRh9C10L3QuNGPP1xyXG4gICAgICAgICAgICBpZiAoJGNsb2NrSW5wdXREYXRlLnZhbHVlID09ICcnICYmICRjbG9ja0lucHV0VGltZS52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGNsb2NrSW5wdXREYXRlLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGNsb2NrSW5wdXRUaW1lLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja0RhdGVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dFllYXIgPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMF0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0TW91dGggPSBOdW1iZXIoJGNsb2NrSW5wdXREYXRlLnZhbHVlLnNwbGl0KCctJylbMV0pIC0gMTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dERheSA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVsyXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRIb3VyID0gTnVtYmVyKCRjbG9ja0lucHV0VGltZS52YWx1ZS5zcGxpdCgnOicpWzBdKTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dE1pbnV0ZXMgPSBOdW1iZXIoJGNsb2NrSW5wdXRUaW1lLnZhbHVlLnNwbGl0KCc6JylbMV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKGNsb2NrRGF0ZUltcHV0WWVhciwgY2xvY2tEYXRlSW1wdXRNb3V0aCwgY2xvY2tEYXRlSW1wdXREYXksIGNsb2NrRGF0ZUltcHV0SG91ciwgY2xvY2tEYXRlSW1wdXRNaW51dGVzLCAwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgIC8vINGC0LDQudC80LDRg9GCINC00LvRjyDRg9C00LDQu9C10L3QuNGPINGB0LDQvNC+0LPQviDRgdC10LHRj1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSBmYWxzZTsgfSwgMTAwKTsgLy8gb2ZmINGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBlZGl0QnV0dG9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0QnV0dG9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FuY2VsRWRpdEJ1dHRvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFjY2VwdEVkaXRCdXR0b24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0QnV0dG9uID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J3QsNGH0LjQvdCw0LXQvCDRgNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDQv9C+0LQt0LfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgZWRpdFByZUhlYWRpbmcoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2xkUHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLnByZUhlYWRpbmdNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgCwgLy8g0YLQsNC50LzQsNGD0YIg0LbQtNGR0YIg0YHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRQcmVIZWFkaW5nLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0UHJlSGVhZGluZy5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Z1ZS5wcmVIZWFkaW5nTWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LVcclxuICAgICAgICBjb21wbGVhdGVFZGl0UHJlSGVhZGluZygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdFByZUhlYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDRhNC+0YDQvNCwINC/0YPRgdGC0LDRjyDQuCDQvdC1INGC0LDQutCw0Y8g0LbQtVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gdGhpcy5vbGRQcmVIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMINC30LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIGVkaXRIZWFkaW5nKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0SGVhZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9sZEhlYWRpbmdNZXNzYWdlID0gdGhpcy5oZWFkaW5nTWVzc2FnZTsgLy8g0JfQsNC/0L7QvNC40L3QsNC10Lwg0YHRgtCw0YDQvtC1INC90LDQt9Cy0LDQvdC40LVcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YBcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dEhlYWRpbmcuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRIZWFkaW5nLm9uaW5wdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVnVlLmhlYWRpbmdNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtVxyXG4gICAgICAgIGNvbXBsZWF0ZUVkaXRIZWFkaW5nKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0SGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDRhNC+0YDQvNCwINC/0YPRgdGC0LDRjyDQuCDQvdC1INGC0LDQutCw0Y8g0LbQtVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGluZ01lc3NhZ2UgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gdGhpcy5vbGRIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMIERlc2NyaXB0aW9uVGV4dFxyXG4gICAgICAgIGVkaXREZXNjcmlwdGlvblRleHQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGREZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGlzVnVlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXREZXNjcmlwdGlvblRleHQub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNWdWUuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUgRGVzY3JpcHRpb25UZXh0XHJcbiAgICAgICAgY29tcGxlYXRlRWRpdERlc2NyaXB0aW9uVGV4dCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5vbGREZXNjcmlwdGlvblRleHRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINC/0YDQuNC80LXQvdC40YLRjCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1INGC0LXQutGB0YLQsCDQv9C+INC60LvQsNCy0LjRiNC1INCt0L3RgtGAXHJcbiAgICAgICAgYWNjZXB0RWRpdFRleHQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIC8vINC10YHQu9C4INC80Ysg0LIg0L/RgNC+0YbQtdGB0LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQuCDRgNC10LTQsNC60YLQuNGA0YPQtdC8INC30LDQs9Cw0LvQvtCy0L7QuiDQuCDQvdCw0LbQsNC70Lgg0Y3QvdGC0LXRgFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdEhlYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdFByZUhlYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cgJiYgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgJiYgZS5rZXkgPT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wbGVhdGVFZGl0RGVzY3JpcHRpb25UZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQodC60YDRi9Cy0LDQtdC8INC/0LDQvdC10LvRjNC60YMg0L7Qv9C40YHQsNC90LjRjyDQvdCwINC80L7QsdC40LvQtVxyXG4gICAgICAgIGhpZGVEZXNjcmlwdGlvblBhbmVsKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblBhbmVsID09PSAnaGlkZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2xvY2sgPT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGNsb2NrRnVuYygpIHtcclxuICAgICAgICAgICAgLy8gLy8g0YHQvtC30LTQsNGR0Lwg0LTQsNGC0YMg0L3QvtCy0YPRjlxyXG4gICAgICAgICAgICBsZXQgbm93RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5maW5pc2hEYXRlIC0gbm93RGF0ZSk7IC8vINC/0L7Qu9GD0YfQsNC10Lwg0YDQsNC30L3QuNGG0YNcclxuICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4odGhpcy5maW5pc2hEYXRlKVxyXG5cclxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YLQsNC50LzQtdGAINC/0YDQvtGI0ZHQu1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9tb250aCA9IFwiSXQncyBvdmVyXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSAnMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gJzAwJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbWludXRlcyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX3NlY29uZHMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ9C00LXQvdGMJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWNvbmRzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDAgLyA2MCkgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaG91cnMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwIC8gNjAgLyA2MCkgJSAyNCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF5cyA9IE1hdGguZmxvb3IocmVzdWx0IC8gMTAwMCAvIDYwIC8gNjAgLyAyNCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSBtaW51dGVzID0gJzAnICsgbWludXRlcztcclxuICAgICAgICAgICAgICAgIGlmIChob3VycyA8IDEwKSBob3VycyA9ICcwJyArIGhvdXJzO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbW9udGggPSB0aGlzLm1vbnRoTmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5cyA9IGRheXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gaG91cnM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX21pbnV0ZXMgPSBtaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9zZWNvbmRzID0gc2Vjb25kcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfZGF5c190aXRsZSA9ICfQtNC90LXQuSc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xfZGF5cyA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ9C00LXQvdGMJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3JlYXRlTmFtZU9mRmluaXNoRGF0ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb250aE5hbWUgPSB0aGlzLmZpbmlzaERhdGUudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtb250aDogXCJsb25nXCIsIGRheTogJ251bWVyaWMnLCBob3VyOiAnbnVtZXJpYycsIG1pbnV0ZTogJ251bWVyaWMnIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09PT09PT09PVxyXG4gICAgICAgIGNvbG9yUGljaygpIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFwcCA9IHsgJy0tdGhlbWUtY29sb3InOiB0aGlzLmNvbG9yX2kgfTtcclxuICAgICAgICAgICAgdGhpcy5jb2xvcl9pID0gdGhpcy5jb2xvcl9pICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTcpICsgOTsgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGA0LDQvdC00L7QvNC90YvQuSDRhtCy0LXRgiDQvtGCIDkgLSAyOFxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YTQvtC90L7QstC+0LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICAgICAgd2FsbHBhcGVyUGljaygpIHtcclxuICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB3YWxscGFwZXJQaWNrQ2xvc2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFuZ2VJbWFnZUJhY2tncm91bmQoZXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0ICRpbnB1dCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dC5maWxlcyAmJiAkaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZtID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmltYWdlU3JjQmFja2dyb3VuZCA9IGUudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKCRpbnB1dC5maWxlc1swXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDRgdC80LXQvdCwINGE0L7RgtC+INC40Lcg0LrQvtC70LvQtdC60YbQuNC4XHJcbiAgICAgICAgc3dhcEltYWdlQmFja2dyb3VuZChldmVudCkge1xyXG4gICAgICAgICAgICBsZXQgc3JjT2ZOZXdCYWNrZ3JvdW5kID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2FsbHBhcGVyJyk7XHJcbiAgICAgICAgICAgIGlmIChzcmNPZk5ld0JhY2tncm91bmQgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlU3JjQmFja2dyb3VuZCA9IHNyY09mTmV3QmFja2dyb3VuZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBzaGFyZVxyXG4gICAgICAgIHNoYXJlQ3JlYXRlTGluaygpIHtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ItbGFuZGluZ19fc2hhcmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGUubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5jbGFzc05hbWUuaW5kZXhPZignJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpICE9IC0xKSB2YXIgdSA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSAhPSAtMSkgdmFyIHQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2UnKSAhPSAtMSkgdmFyIGkgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSAhPSAtMSkgdmFyIGQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpICE9IC0xKSB2YXIgZiA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWljb25zLWZpbGUnKSAhPSAtMSkgdmFyIGZuID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbnMtZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhdGgobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzYyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3IgPSBuZXcgUmVnRXhwKCdeKC4qL3wpKCcgKyBuYW1lICsgJykoWyM/XXwkKScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwLCBzY0wgPSBzYy5sZW5ndGg7IHAgPCBzY0w7IHArKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IFN0cmluZyhzY1twXS5zcmMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWF0Y2goc3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1bMV0ubWF0Y2goL14oKGh0dHBzP3xmaWxlKVxcOlxcL3syLH18XFx3OltcXC9cXFxcXSkvKSkgcmV0dXJuIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobVsxXS5pbmRleE9mKFwiL1wiKSA9PSAwKSByZXR1cm4gbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmFzZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJbMF0gJiYgYlswXS5ocmVmKSByZXR1cm4gYlswXS5ocmVmICsgbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC8oLipbXFwvXFxcXF0pLylbMF0gKyBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHBhdGgoJ3NoYXJlNDIuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXUpIHUgPSBsb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXQpIHQgPSBkb2N1bWVudC50aXRsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikgZm4gPSAnaWNvbnMucG5nJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlc2MoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWV0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtZXRhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1ldGEubGVuZ3RoOyBtKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YVttXS5uYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2Rlc2NyaXB0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YVttXS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWQpIGQgPSBkZXNjKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBlbmNvZGVVUklDb21wb25lbnQodSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBlbmNvZGVVUklDb21wb25lbnQodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSB0LnJlcGxhY2UoL1xcJy9nLCAnJTI3Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBlbmNvZGVVUklDb21wb25lbnQoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBlbmNvZGVVUklDb21wb25lbnQoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBkLnJlcGxhY2UoL1xcJy9nLCAnJTI3Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmJRdWVyeSA9ICd1PScgKyB1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgZmJRdWVyeSA9ICdzPTEwMCZwW3VybF09JyArIHUgKyAnJnBbdGl0bGVdPScgKyB0ICsgJyZwW3N1bW1hcnldPScgKyBkICsgJyZwW2ltYWdlc11bMF09JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmtJbWFnZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgdmtJbWFnZSA9ICcmaW1hZ2U9JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IG5ldyBBcnJheSgnXCIjXCIgZGF0YS1jb3VudD1cInZrXCIgb25jbGljaz1cIndpbmRvdy5vcGVuKFxcJy8vdmsuY29tL3NoYXJlLnBocD91cmw9JyArIHUgKyAnJnRpdGxlPScgKyB0ICsgdmtJbWFnZSArICcmZGVzY3JpcHRpb249JyArIGQgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQktCa0L7QvdGC0LDQutGC0LVcIicsICdcIiNcIiBkYXRhLWNvdW50PVwiZmJcIiBvbmNsaWNrPVwid2luZG93Lm9wZW4oXFwnLy93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9JyArIHUgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQsiBGYWNlYm9va1wiJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxcSA9IFsnYi1pY29uIGItaWNvbi0tc2hhcmUgYi1pY29uLS12ayBpY29uLXZrJywgJ2ItaWNvbiBiLWljb24tLXNoYXJlIGljb24tZmInXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCArPSAnPGEgY2xhc3M9XCInICsgcXFbal0gKyAnXCIgcmVsPVwibm9mb2xsb3dcIiBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrO1wiIGhyZWY9JyArIHNbal0gKyAnIHRhcmdldD1cIl9ibGFua1wiPjwvYT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlW2tdLmlubmVySFRNTCA9IGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCf0L7RgdC70LUg0L/Rg9Cx0LvQuNC60LDRhtC40Lgg0YHRgtGA0LDQvdC40YbRiyDQuCDQvtGC0L/RgNCw0LLQutC4INCw0Y/QutGB0LBcclxuICAgICAgICBjcmVhdGVkTmV3UGFnZShwYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJHJlZnMuYWxlcnRMaW5rLnRleHRDb250ZW50ID0gYCR7Y3VycmVudE9yaWdpbk9ybH0/aWQ9JHtwYWdlfWA7XHJcbiAgICAgICAgICAgIHRoaXMuJHJlZnMuYWxlcnRMaW5rLmhyZWYgPSBgJHtjdXJyZW50T3JpZ2luT3JsfT9pZD0ke3BhZ2V9YFxyXG4gICAgICAgICAgICB0aGlzLmFsZXJ0SXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LUg0LIg0YTQsNC40YDQsdGN0LnQt1xyXG4gICAgICAgIHB1Ymxpc2hOZXdUaW1lcigpIHtcclxuICAgICAgICAgICAgdnVlX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICBjb25zdCBpZFBhZ2UgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhSlNPTiA9IHtcclxuICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogdnVlX3RoaXMuaGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBwcmVIZWFkaW5nOiB2dWVfdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGhlYWRpbmc6IHZ1ZV90aGlzLmhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHZ1ZV90aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBmaW5pc2hEYXRlOiB2dWVfdGhpcy5maW5pc2hEYXRlLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBpbWFnZVNyY0JhY2tncm91bmQ6IHZ1ZV90aGlzLmltYWdlU3JjQmFja2dyb3VuZCxcclxuICAgICAgICAgICAgICAgIGNvbG9yX2k6IHZ1ZV90aGlzLmNvbG9yX2ksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRhdGFiYXNlLnJlZigncGFnZXMvJyArIGlkUGFnZSkuc2V0KGRhdGFKU09OKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTeW5jaHJvbml6YXRpb24gc3VjY2VlZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdnVlX3RoaXMuY3JlYXRlZE5ld1BhZ2UoaWRQYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N5bmNocm9uaXphdGlvbiBmYWlsZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSBmYWxzZTsgLy8g0JLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8INC90L7QstGL0LUg0LTQsNC90L3Ri9C1INC6INGC0LDQudC80LXRgNGDXHJcbiAgICAgICAgYWNjZXB0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRlID0gbmV3IERhdGUoZGF0YS5maW5pc2hEYXRlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkRGF0ZShuZXdEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0LLQtdGA0L3QsFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0J3QlSDQstC10YDQvdCwXHJcbiAgICAgICAgICAgICAgICBuZXdEYXRlID0gbmV3IERhdGUoMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0L/QtdGA0LXQvNC10L3QvdGL0Lwg0LfQvdCw0YfQtdC90LjRjyDRgSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gZGF0YS5wcmVIZWFkaW5nO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gZGF0YS5oZWFkaW5nO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSBkYXRhLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC30LDQs9C+0LvQvtCy0L7QuiDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gZGF0YS5wYWdlVGl0bGVcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhNC+0L1cclxuICAgICAgICAgICAgdGhpcy5pbWFnZVNyY0JhY2tncm91bmQgPSBkYXRhLmltYWdlU3JjQmFja2dyb3VuZDtcclxuICAgICAgICAgICAgLy8g0L/RgNC40YHQstCw0LXQstCw0LXQvCDRhtCy0LXRglxyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IGRhdGEuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC00LDRgtGDXHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoRGF0ZSA9IG5ld0RhdGU7XHJcbiAgICAgICAgICAgIC8vINCy0LrQu9GO0YfQsNC10Lwg0L3QvtCy0YPRjiDQtNCw0YLRg1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBmaW5pc2hQcmVsb2FkaW5nRG9uZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZUFwcC5wcmVMb2FkaW5nQXBwID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lcigpO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbGVkTG9hZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkaW5nTWVzc2FnZSA9ICc0MDQgOignO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSfQn9GA0L7QuNC30L7RiNC70LAg0L7RiNC40LHQutCwINC/0YDQuCDQv9C+0L/Ri9GC0LrQtSDQt9Cw0LPRgNGD0LfQuNGC0Ywg0LTQsNC90L3Rg9GOINGB0YLRgNCw0L3QuNGG0YMsINC/0YDQvtCy0LXRgNGM0YLQtSDQv9GA0LDQstC40LvRjNC90L7RgdGC0Ywg0YHRgdGL0LvQutC4INC4INC/0L7QstGC0L7RgNC40YLQtSDQv9C+0L/Ri9GC0LrRgydcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGJlZm9yZUNyZWF0ZSgpIHtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g0JLRi9C30YvQstCw0LXRgtGB0Y8g0YHQuNC90YXRgNC+0L3QvdC+INGB0YDQsNC30YMg0L/QvtGB0LvQtSDRgdC+0LfQtNCw0L3QuNGPINGN0LrQt9C10LzQv9C70Y/RgNCwXHJcbiAgICBjcmVhdGVkKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBkYXRhX2pzb25fZGVmYXVsdDtcclxuICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5hY2NlcHREYXRhKGRhdGEpO1xyXG5cclxuICAgICAgICAvLyDQn9C+0LvRg9GH0LDQtdC8INC00LDQvdC90YvQtVxyXG4gICAgICAgIGRhdGFiYXNlLnJlZigncGFnZXMvJyArIGN1cnJlbnRJZFBhZ2UuaWQpLm9uY2UoJ3ZhbHVlJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmFjY2VwdERhdGEoZS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICAvLyDQktC60LvRjtGH0LDQtdC8INC/0YDQuNC70L7QttC10L3QuNC1XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5maW5pc2hQcmVsb2FkaW5nRG9uZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5mYWlsZWRMb2FkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyDQktGL0LfRi9Cy0LDQtdGC0YHRjyDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YLQvtCz0L4g0LrQsNC6INGN0LrQt9C10LzQv9C70Y/RgCDQsdGL0Lsg0YHQvNC+0L3RgtC40YDQvtCy0LDQvVxyXG4gICAgbW91bnRlZCgpIHtcclxuICAgICAgICAvLyDQv9C+0LvRg9GH0LDQtdC8INC60L7QvdC10YfQvdGD0Y4g0LTQsNGC0YMgKNCX0LDQs9C+0LvQvtCy0L7QuiDQlNCw0YLRiylcclxuICAgICAgICAvLyB0aGlzLmNyZWF0ZU5hbWVPZkZpbmlzaERhdGUoKTtcclxuICAgICAgICAvLyDQvNC10L3Rj9C10Lwg0YjQtdC50YDRi1xyXG4gICAgICAgIHRoaXMuc2hhcmVDcmVhdGVMaW5rKCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCB0aGlzLmFjY2VwdEVkaXRUZXh0KTtcclxuICAgIH1cclxufSlcclxuIl0sImZpbGUiOiJwYXJ0aWFscy9sYW5kaW5nX3Z1ZS5qcyJ9
