// ====================
// VUE приложение
// ====================

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
        createdNewPage(ajax_answer) {
            this.$refs.alertLink.textContent = `amedomary.tmweb.ru/${ajax_answer}`;
            this.$refs.alertLink.href = `/${ajax_answer}`            
            this.alertIsOpen = true;
        },

        publishNewTimer() {
            vue_this = this;
            
            $.ajax({
                url: '../include/for_db.php',
                type: 'POST',
                data: {
                    "pageTitle": vue_this.headingMessage,
                    "preHeading": vue_this.preHeadingMessage,
                    "heading": vue_this.headingMessage,
                    "description": vue_this.descriptionTextMessage,
                    "imageSrcBackground": vue_this.imageSrcBackground,
                    "color_i": vue_this.color_i,
                    "finishDate": vue_this.finishDate
                },
                dataType: 'json',
                success: function (result) {
                    vue_this.createdNewPage(result);
                }
            });
        }
    },

    beforeCreate() {
    },

    // Вызывается синхронно сразу после создания экземпляра
    created() {
        const data = data_json;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXJ0aWFscy9sYW5kaW5nX3Z1ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4vLyBWVUUg0L/RgNC40LvQvtC20LXQvdC40LVcclxuLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbnZhciBhcHBMYW5kaW5nID0gbmV3IFZ1ZSh7XHJcbiAgICBlbDogJyNsYW5kaW5nLWFwcCcsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgY3JlYXRlVGltZXJTaG93OiBmYWxzZSwgLy8g0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICB3ZUhhdmVNb2RpZmljYXRlVGltZXI6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0YEg0L3QvtCy0YvQvNC4INC00LDQvdC90YvQvNC4XHJcbiAgICAgICAgd2VBbHJlYWR5SGF2ZUNoYW5nZXM6IGZhbHNlLCAvLyDRgdC+0YHRgtC+0Y/QvdC40LUg0LrQvtCz0LTQsCDRhdC+0YLRjyDQsdGLINGA0LDQtyDQv9GA0LjQvNC10L3Rj9C70Lgg0LjQt9C80LXQvdC10L3QuNGPXHJcblxyXG4gICAgICAgIC8vINCa0LvQsNGB0YHRi1xyXG4gICAgICAgIHZ1ZUFwcENsYXNzOiAnJyxcclxuICAgICAgICB2dWVCYWNrQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZVNoYXJlQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZUNpcmNsZUNsYXNzOiAnJyxcclxuICAgICAgICB2dWVCdXR0b25DbGFzczogJycsXHJcbiAgICAgICAgdnVlQ2xvY2tDbGFzczogJycsXHJcbiAgICAgICAgdnVlUHJlSGVhZGluZ0NsYXNzOiAnJyxcclxuICAgICAgICB2dWVIZWFkaW5nQ2xhc3M6ICcnLFxyXG4gICAgICAgIHZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzOiAnJyxcclxuICAgICAgICBkZXNjcmlwdGlvblBhbmVsOiAnaGlkZScsXHJcbiAgICAgICAgdnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uOiAnY2xhc3MnLFxyXG5cclxuICAgICAgICAvLyDQodGC0LjQu9C4XHJcbiAgICAgICAgc3R5bGVBcHA6ICcnLFxyXG5cclxuICAgICAgICAvLyDQpNC+0YLQvlxyXG4gICAgICAgIGltYWdlU3JjQmFja2dyb3VuZDogJycsXHJcblxyXG4gICAgICAgIHN0YXRlV2FzTW9kaWZpZWQ6IGZhbHNlLCAvLyDQsdGL0LvQviDQu9C+INC70Lgg0LjQt9C80LXQvdC10L3QviDRgdC+0YHRgtC+0Y/QvdC40LVcclxuXHJcbiAgICAgICAgc3RhdGVFZGl0UHJlSGVhZGluZzogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0L/QvtC0LdCX0LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIHN0YXRlRWRpdEhlYWRpbmc6IGZhbHNlLCAvLyDQuNC30LzQtdC90Y/QtdGC0YHRjyDQu9C4INCX0LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIHN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dDogZmFsc2UsIC8vINC40LfQvNC10L3Rj9C10YLRgdGPINC70Lgg0J7Qv9C40YHQsNC90LjQtVxyXG4gICAgICAgIHN0YXRlRWRpdENsb2NrOiBmYWxzZSwgLy8g0LjQt9C80LXQvdGP0Y7RgtGB0Y8g0LvQuCDRh9Cw0YHRi1xyXG5cclxuICAgICAgICB3YWxscGFwZXJTaWRlQmFyT3BlbjogZmFsc2UsIC8vINCe0YLQutGA0YvRgiDQu9C4INGB0LDQudC0INCx0LDRgCDQtNC70Y8g0YTQvtC90LBcclxuXHJcbiAgICAgICAgaGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC30LDQs9C+0LvQvtCy0LrQsFxyXG4gICAgICAgIGxhc3RFZGl0SGVhZGluZ01lc3NhZ2U6ICcnLFxyXG4gICAgICAgIG9sZEhlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INGC0LXQutGB0YLQsFxyXG4gICAgICAgIG5ld0hlYWRpbmdNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0YLQtdC60YHRgtCwXHJcblxyXG4gICAgICAgIGRlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDRgtC10LrRgdGCINC+0L/QuNGB0LDQvdC40Y9cclxuICAgICAgICBsYXN0RWRpdERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U6ICcnLCAvLyDQvtC/0LjRgdCw0L3QuNC1INC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YHQvtGF0YDQsNC90LXQvdC40Y9cclxuICAgICAgICBvbGREZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC+0L/QuNGB0LDQvdC40Y8g0LLQviDQstGA0LXQvNGPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICBuZXdEZXNjcmlwdGlvblRleHRNZXNzYWdlOiAnJywgLy8g0Y/Rh9C10LnQutCwINC00LvRjyDQvdC+0LLQvtCz0L4g0L7Qv9C40YHQsNC90LjRj1xyXG5cclxuICAgICAgICBwcmVIZWFkaW5nTWVzc2FnZTogJycsIC8vINGC0LXQutGB0YIg0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgbGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZTogJycsXHJcbiAgICAgICAgb2xkUHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0L/RgNC10LQg0JfQsNCz0L7Qu9C+0LLQutCwXHJcbiAgICAgICAgbmV3UHJlSGVhZGluZ01lc3NhZ2U6ICcnLCAvLyDRj9GH0LXQudC60LAg0LTQu9GPINC90L7QstC+0LPQviDQv9GA0LXQtCDQl9Cw0LPQvtC70L7QstC60LBcclxuXHJcblxyXG4gICAgICAgIC8vINCi0LDQudC80LXRgCA9PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGZpbmlzaERhdGU6ICcnLCAvLyAoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcylcclxuICAgICAgICBtb250aE5hbWU6ICcnLFxyXG5cclxuICAgICAgICBpbnRlcnZhbDogXCJcIixcclxuICAgICAgICBpbnRlcnZhbEluaXQ6IFwiXCIsXHJcbiAgICAgICAgY2xfbW9udGg6ICcnLFxyXG4gICAgICAgIGNsX2RheXM6ICcnLFxyXG4gICAgICAgIGNsX2hvdXJzOiAnJyxcclxuICAgICAgICBjbF9taW51dGVzOiAnJyxcclxuICAgICAgICBjbF9zZWNvbmRzOiAnJyxcclxuICAgICAgICBjbF9kYXlzX3RpdGxlOiAnJyxcclxuXHJcbiAgICAgICAgY2xvY2tEYXRlSW5wdXRFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgY2xvY2tUaW1lSW5wdXRFcnJvcjogZmFsc2UsXHJcblxyXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09XHJcbiAgICAgICAgY29sb3JfaTogMCxcclxuXHJcbiAgICAgICAgLy8g0L7Qv9C+0LLQtdGJ0LXQvdC40LUg0L/Rg9Cx0LvQuNC60LDRhtC40LhcclxuICAgICAgICBhbGVydElzT3BlbjogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICAgIC8vINCS0LrQu9GO0YfQsNC10Lwg0YLQtdC80YMg0YDQtdC00L7QutGC0LjRgNC+0LLQsNC90LjRjyBcclxuICAgICAgICBjcmVhdGVUaW1lcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRpbWVyU2hvdyA9ICF0aGlzLmNyZWF0ZVRpbWVyU2hvdztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICdtb2RpZmljYXRpb24nO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZVNoYXJlQ2xhc3MgPSAnaGlkZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNpcmNsZUNsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCdXR0b25DbGFzcyA9ICdmYWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQ2xvY2tDbGFzcyA9ICdlZGl0YWJsZSc7IC8vIFwiZWRpdGFibGUgZWRpdGVkXCJcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlUHJlSGVhZGluZ0NsYXNzID0gJ2VkaXRhYmxlJzsgLy8gXCJlZGl0YWJsZSBlZGl0ZWRcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVIZWFkaW5nQ2xhc3MgPSAnZWRpdGFibGUnOyAvLyBcImVkaXRhYmxlIGVkaXRlZFwiXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZURlc2NyaXB0aW9uVGV4dENsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXRIZWFkaW5nTWVzc2FnZSA9IHRoaXMuaGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RFZGl0RGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEVkaXRQcmVIZWFkaW5nTWVzc2FnZSA9IHRoaXMucHJlSGVhZGluZ01lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSBmYWxzZTsgLy8g0JLQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQvtC00LjRhNC40YbQuNGA0L7QstCw0L3QvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDQmtC70LjQuiDQv9C+INCe0YLQvNC10L3QtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBcHBDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlU2hhcmVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDaXJjbGVDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCdXR0b25DbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZVByZUhlYWRpbmdDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlRGVzY3JpcHRpb25UZXh0Q2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICdoaWRlJztcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLmxhc3RFZGl0UHJlSGVhZGluZ01lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gdGhpcy5sYXN0RWRpdEhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gdGhpcy5sYXN0RWRpdERlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gZmFsc2U7IC8v0LLRi9C60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSBcItCyINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LhcIlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2VBbHJlYWR5SGF2ZUNoYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndlSGF2ZU1vZGlmaWNhdGVUaW1lciA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCf0YDQuNC80LXQvdGP0LXQvCDQuNC30LzQtdC90LXQvdC40Y8g0J/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICBhY2NlcHRDcmVhdGVUaW1lcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRpbWVyU2hvdyA9ICF0aGlzLmNyZWF0ZVRpbWVyU2hvdzsgLy8g0LzQtdC90Y/QtdC8INGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIC8vINGD0LHQuNCy0LDQtdC8INC60LvQsNGB0YHRiyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgICAgICAgICAgIHRoaXMudnVlQXBwQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVTaGFyZUNsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQ2lyY2xlQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVCdXR0b25DbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVQcmVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVIZWFkaW5nQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgdGhpcy52dWVEZXNjcmlwdGlvblRleHRDbGFzcyA9ICcnO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gZmFsc2U7IC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDRgdC+0YHRgtC+0Y/QvdC40LUgXCLQsiDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC4XCJcclxuICAgICAgICAgICAgdGhpcy53ZUhhdmVNb2RpZmljYXRlVGltZXIgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgIHRoaXMud2VBbHJlYWR5SGF2ZUNoYW5nZXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53YWxscGFwZXJTaWRlQmFyT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0YfQsNGB0YsgKNGB0YLQsNCy0LjQvCDQvdC+0LLRg9GOINC00LDRgtGDKVxyXG4gICAgICAgIGVkaXRDbG9jazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0Q2xvY2sgPSB0cnVlOyAvLyDQstC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC00LDRgtGLXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUgZWRpdGluZyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbmNlbEVkaXRDbG9jazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgLy8g0YLQsNC50LzQsNGD0YIg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8g0YHQsNC80L7Qs9C+INGB0LXQsdGPXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdENsb2NrID0gZmFsc2U7IC8vIG9mZiDRgdC+0YHRgtC+0Y/QvdC40LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQtNCw0YLRi1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVDbG9ja0NsYXNzID0gJ2VkaXRhYmxlJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhY2NlcHRFZGl0Q2xvY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0ICRjbG9ja0lucHV0RGF0ZSA9IHRoaXMuJHJlZnMuZWxDbG9ja0lucHV0RGF0ZTtcclxuICAgICAgICAgICAgbGV0ICRjbG9ja0lucHV0VGltZSA9IHRoaXMuJHJlZnMuZWxDbG9ja0lucHV0VGltZTtcclxuXHJcbiAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAuINCS0LLQtdC70Lgt0LvQuCDQvNGLINC30L3QsNGH0LXQvdC40Y8/XHJcbiAgICAgICAgICAgIGlmICgkY2xvY2tJbnB1dERhdGUudmFsdWUgPT0gJycgJiYgJGNsb2NrSW5wdXRUaW1lLnZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkY2xvY2tJbnB1dERhdGUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrVGltZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkY2xvY2tJbnB1dFRpbWUudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tUaW1lSW5wdXRFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrRGF0ZUlucHV0RXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2tEYXRlSW5wdXRFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9ja1RpbWVJbnB1dEVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0WWVhciA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVswXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvY2tEYXRlSW1wdXRNb3V0aCA9IE51bWJlcigkY2xvY2tJbnB1dERhdGUudmFsdWUuc3BsaXQoJy0nKVsxXSkgLSAxO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0RGF5ID0gTnVtYmVyKCRjbG9ja0lucHV0RGF0ZS52YWx1ZS5zcGxpdCgnLScpWzJdKTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9ja0RhdGVJbXB1dEhvdXIgPSBOdW1iZXIoJGNsb2NrSW5wdXRUaW1lLnZhbHVlLnNwbGl0KCc6JylbMF0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2NrRGF0ZUltcHV0TWludXRlcyA9IE51bWJlcigkY2xvY2tJbnB1dFRpbWUudmFsdWUuc3BsaXQoJzonKVsxXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maW5pc2hEYXRlID0gbmV3IERhdGUoY2xvY2tEYXRlSW1wdXRZZWFyLCBjbG9ja0RhdGVJbXB1dE1vdXRoLCBjbG9ja0RhdGVJbXB1dERheSwgY2xvY2tEYXRlSW1wdXRIb3VyLCBjbG9ja0RhdGVJbXB1dE1pbnV0ZXMsIDAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmFtZU9mRmluaXNoRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUNsb2NrQ2xhc3MgPSAnZWRpdGFibGUnO1xyXG4gICAgICAgICAgICAgICAgLy8g0YLQsNC50LzQsNGD0YIg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8g0YHQsNC80L7Qs9C+INGB0LXQsdGPXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zdGF0ZUVkaXRDbG9jayA9IGZhbHNlOyB9LCAxMDApOyAvLyBvZmYg0YHQvtGB0YLQvtGP0L3QuNC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0LTQsNGC0YtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCd0LDRh9C40L3QsNC10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Ywg0L/QvtC0LdC30LDQs9C+0LvQvtCy0L7QulxyXG4gICAgICAgIGVkaXRQcmVIZWFkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXRQcmVIZWFkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2xkUHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLnByZUhlYWRpbmdNZXNzYWdlOyAvLyDQl9Cw0L/QvtC80LjQvdCw0LXQvCDRgdGC0LDRgNC+0LUg0L3QsNC30LLQsNC90LjQtVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9ICcnOyAvLyDQuCDQvNC10L3Rj9C10Lwg0YLQtdC60YHRgiDQsiDRhNC+0YDQvNC1INC90LAg0L/Rg9GB0YLQvtC5XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LLQvdC+0LLRjCDRgdC+0LfQtNCw0L3Ri9C5INC40L3Qv9GD0YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINC90LXQs9C+INC60YPRgNGB0L7RgCwgLy8g0YLQsNC50LzQsNGD0YIg0LbQtNGR0YIg0YHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRQcmVIZWFkaW5nLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0UHJlSGVhZGluZy5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Z1ZS5wcmVIZWFkaW5nTWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LVcclxuICAgICAgICBjb21wbGVhdGVFZGl0UHJlSGVhZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INGE0L7RgNC80LAg0L/Rg9GB0YLQsNGPINC4INC90LUg0YLQsNC60LDRjyDQttC1XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVIZWFkaW5nTWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlSGVhZGluZ01lc3NhZ2UgPSB0aGlzLm9sZFByZUhlYWRpbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVdhc01vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCd0LDRh9C40L3QsNC10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Ywg0LfQsNCz0L7Qu9C+0LLQvtC6XHJcbiAgICAgICAgZWRpdEhlYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdEhlYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRIZWFkaW5nTWVzc2FnZSA9IHRoaXMuaGVhZGluZ01lc3NhZ2U7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gJyc7IC8vINC4INC80LXQvdGP0LXQvCDRgtC10LrRgdGCINCyINGE0L7RgNC80LUg0L3QsCDQv9GD0YHRgtC+0LlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQuNGJ0LXQvCDQstC90L7QstGMINGB0L7Qt9C00LDQvdGL0Lkg0LjQvdC/0YPRgiDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0L3QtdCz0L4g0LrRg9GA0YHQvtGAXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLmVsSW5wdXRIZWFkaW5nLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpc1Z1ZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcmVmcy5lbElucHV0SGVhZGluZy5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Z1ZS5oZWFkaW5nTWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzVnVlLnZ1ZUFjY2VwdEVkaXREZXNjcmlwdGlvbiA9ICdhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0KHQvtGF0YDQvtC90Y/QtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LVcclxuICAgICAgICBjb21wbGVhdGVFZGl0SGVhZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVUaW1lclNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVFZGl0SGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDRhNC+0YDQvNCwINC/0YPRgdGC0LDRjyDQuCDQvdC1INGC0LDQutCw0Y8g0LbQtVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGluZ01lc3NhZ2UgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmdNZXNzYWdlID0gdGhpcy5vbGRIZWFkaW5nTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQndCw0YfQuNC90LDQtdC8INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMIERlc2NyaXB0aW9uVGV4dFxyXG4gICAgICAgIGVkaXREZXNjcmlwdGlvblRleHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlRWRpdERlc2NyaXB0aW9uVGV4dCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9sZERlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2U7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INGB0YLQsNGA0L7QtSDQvdCw0LfQstCw0L3QuNC1XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uVGV4dE1lc3NhZ2UgPSAnJzsgLy8g0Lgg0LzQtdC90Y/QtdC8INGC0LXQutGB0YIg0LIg0YTQvtGA0LzQtSDQvdCwINC/0YPRgdGC0L7QuVxyXG5cclxuICAgICAgICAgICAgICAgIC8vINC40YnQtdC8INCy0L3QvtCy0Ywg0YHQvtC30LTQsNC90YvQuSDQuNC90L/Rg9GCINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdC10LPQviDQutGD0YDRgdC+0YBcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dERlc2NyaXB0aW9uVGV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNWdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuZWxJbnB1dERlc2NyaXB0aW9uVGV4dC5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Z1ZS5kZXNjcmlwdGlvblRleHRNZXNzYWdlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Z1ZS52dWVBY2NlcHRFZGl0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNWdWUudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJ2FjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDQodC+0YXRgNC+0L3Rj9C10Lwg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtSBEZXNjcmlwdGlvblRleHRcclxuICAgICAgICBjb21wbGVhdGVFZGl0RGVzY3JpcHRpb25UZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVyU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUVkaXREZXNjcmlwdGlvblRleHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudnVlQWNjZXB0RWRpdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAvLyDQtdGB0LvQuCDRhNC+0YDQvNCwINC/0YPRgdGC0LDRj1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSA9IHRoaXMub2xkRGVzY3JpcHRpb25UZXh0TWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDQv9GA0LjQvNC10L3QuNGC0Ywg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtSDRgtC10LrRgdGC0LAg0L/QviDQutC70LDQstC40YjQtSDQrdC90YLRgFxyXG4gICAgICAgIGFjY2VwdEVkaXRUZXh0OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAvLyDQtdGB0LvQuCDQvNGLINCyINC/0YDQvtGG0LXRgdC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0Lgg0YDQtdC00LDQutGC0LjRgNGD0LXQvCDQt9Cw0LPQsNC70L7QstC+0Log0Lgg0L3QsNC20LDQu9C4INGN0L3RgtC10YBcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93ICYmIHRoaXMuc3RhdGVFZGl0SGVhZGluZyAmJiBlLmtleSA9PSAnRW50ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXRIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93ICYmIHRoaXMuc3RhdGVFZGl0UHJlSGVhZGluZyAmJiBlLmtleSA9PSAnRW50ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZWF0ZUVkaXRQcmVIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZXJTaG93ICYmIHRoaXMuc3RhdGVFZGl0RGVzY3JpcHRpb25UZXh0ICYmIGUua2V5ID09ICdFbnRlcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxlYXRlRWRpdERlc2NyaXB0aW9uVGV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0KHQutGA0YvQstCw0LXQvCDQv9Cw0L3QtdC70YzQutGDINC+0L/QuNGB0LDQvdC40Y8g0L3QsCDQvNC+0LHQuNC70LVcclxuICAgICAgICBoaWRlRGVzY3JpcHRpb25QYW5lbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kZXNjcmlwdGlvblBhbmVsID09PSAnaGlkZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25QYW5lbCA9ICcnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvblBhbmVsID0gJ2hpZGUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2xvY2sgPT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGNsb2NrRnVuYzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAvLyDRgdC+0LfQtNCw0ZHQvCDQtNCw0YLRgyDQvdC+0LLRg9GOXHJcbiAgICAgICAgICAgIHZhciBub3dEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICh0aGlzLmZpbmlzaERhdGUgLSBub3dEYXRlKTsgLy8g0L/QvtC70YPRh9Cw0LXQvCDRgNCw0LfQvdC40YbRg1xyXG5cclxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YLQsNC50LzQtdGAINC/0YDQvtGI0ZHQu1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9tb250aCA9IFwiSXQncyBvdmVyXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSAnMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2hvdXJzID0gJzAwJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfbWludXRlcyA9ICcwMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX3NlY29uZHMgPSAnMDAnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ2RheSc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKHJlc3VsdCAvIDEwMDApICUgNjApO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBNYXRoLmZsb29yKChyZXN1bHQgLyAxMDAwIC8gNjApICUgNjApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcigocmVzdWx0IC8gMTAwMCAvIDYwIC8gNjApICUgMjQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRheXMgPSBNYXRoLmZsb29yKHJlc3VsdCAvIDEwMDAgLyA2MCAvIDYwIC8gMjQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoaG91cnMgPCAxMCkgaG91cnMgPSAnMCcgKyBob3VycztcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX21vbnRoID0gdGhpcy5tb250aE5hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXMgPSBkYXlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9ob3VycyA9IGhvdXJzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbF9taW51dGVzID0gbWludXRlcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xfc2Vjb25kcyA9IHNlY29uZHM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsX2RheXNfdGl0bGUgPSAnZGF5cyc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xfZGF5cyA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbF9kYXlzX3RpdGxlID0gJ2RheSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWF0ZU5hbWVPZkZpbmlzaERhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb250aE5hbWUgPSB0aGlzLmZpbmlzaERhdGUudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtb250aDogXCJsb25nXCIsIGRheTogJ251bWVyaWMnLCBob3VyOiAnbnVtZXJpYycsIG1pbnV0ZTogJ251bWVyaWMnIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YbQstC10YLQsCA9PT09PT09PT09PT09PVxyXG4gICAgICAgIGNvbG9yUGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXBwID0geyAnLS10aGVtZS1jb2xvcic6IHRoaXMuY29sb3JfaSB9O1xyXG4gICAgICAgICAgICB0aGlzLmNvbG9yX2kgPSB0aGlzLmNvbG9yX2kgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMzAgLSA0KSkgKyA0OyAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0YDQsNC90LTQvtC80L3Ri9C5INGG0LLQtdGCINC+0YIgNDAgLSA0XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g0JLRi9Cx0L7RgCDRhNC+0L3QvtCy0L7Qs9C+INC40LfQvtCx0YDQsNC20LXQvdC40Y9cclxuICAgICAgICB3YWxscGFwZXJQaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2FsbHBhcGVyU2lkZUJhck9wZW4gPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2FsbHBhcGVyUGlja0Nsb3NlKCkge1xyXG4gICAgICAgICAgICB0aGlzLndhbGxwYXBlclNpZGVCYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudnVlQmFja0NsYXNzID0gJ2ZhZGUnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhbmdlSW1hZ2VCYWNrZ3JvdW5kKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCAkaW5wdXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgIGlmICgkaW5wdXQuZmlsZXMgJiYgJGlucHV0LmZpbGVzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgICAgIGxldCB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pbWFnZVNyY0JhY2tncm91bmQgPSBlLnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTCgkaW5wdXQuZmlsZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52dWVCYWNrQ2xhc3MgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVXYXNNb2RpZmllZCA9IHRydWU7IC8vINCS0LrQu9GO0YfQsNC10Lwg0YHQvtGB0YLQvtGP0L3QuNC1INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g0YHQvNC10L3QsCDRhNC+0YLQviDQuNC3INC60L7Qu9C70LXQutGG0LjQuFxyXG4gICAgICAgIHN3YXBJbWFnZUJhY2tncm91bmQoZXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IHNyY09mTmV3QmFja2dyb3VuZCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXdhbGxwYXBlcicpO1xyXG4gICAgICAgICAgICBpZiAoc3JjT2ZOZXdCYWNrZ3JvdW5kICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNyY0JhY2tncm91bmQgPSBzcmNPZk5ld0JhY2tncm91bmQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlV2FzTW9kaWZpZWQgPSB0cnVlOyAvLyDQktC60LvRjtGH0LDQtdC8INGB0L7RgdGC0L7Rj9C90LjQtSDQvNC+0LTQuNGE0LjRhtC40YDQvtCy0LDQvdC90L7Qs9C+INC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ1ZUJhY2tDbGFzcyA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gc2hhcmVcclxuICAgICAgICBzaGFyZUNyZWF0ZUxpbms6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ItbGFuZGluZ19fc2hhcmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGUubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5jbGFzc05hbWUuaW5kZXhPZignJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpICE9IC0xKSB2YXIgdSA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSAhPSAtMSkgdmFyIHQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2UnKSAhPSAtMSkgdmFyIGkgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSAhPSAtMSkgdmFyIGQgPSBlW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpICE9IC0xKSB2YXIgZiA9IGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVba10uZ2V0QXR0cmlidXRlKCdkYXRhLWljb25zLWZpbGUnKSAhPSAtMSkgdmFyIGZuID0gZVtrXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbnMtZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhdGgobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzYyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3IgPSBuZXcgUmVnRXhwKCdeKC4qL3wpKCcgKyBuYW1lICsgJykoWyM/XXwkKScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwLCBzY0wgPSBzYy5sZW5ndGg7IHAgPCBzY0w7IHArKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IFN0cmluZyhzY1twXS5zcmMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWF0Y2goc3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1bMV0ubWF0Y2goL14oKGh0dHBzP3xmaWxlKVxcOlxcL3syLH18XFx3OltcXC9cXFxcXSkvKSkgcmV0dXJuIG1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobVsxXS5pbmRleE9mKFwiL1wiKSA9PSAwKSByZXR1cm4gbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmFzZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJbMF0gJiYgYlswXS5ocmVmKSByZXR1cm4gYlswXS5ocmVmICsgbVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC8oLipbXFwvXFxcXF0pLylbMF0gKyBtWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHBhdGgoJ3NoYXJlNDIuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXUpIHUgPSBsb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXQpIHQgPSBkb2N1bWVudC50aXRsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikgZm4gPSAnaWNvbnMucG5nJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlc2MoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWV0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtZXRhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1ldGEubGVuZ3RoOyBtKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YVttXS5uYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2Rlc2NyaXB0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YVttXS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWQpIGQgPSBkZXNjKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBlbmNvZGVVUklDb21wb25lbnQodSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBlbmNvZGVVUklDb21wb25lbnQodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSB0LnJlcGxhY2UoL1xcJy9nLCAnJTI3Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBlbmNvZGVVUklDb21wb25lbnQoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBlbmNvZGVVUklDb21wb25lbnQoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBkLnJlcGxhY2UoL1xcJy9nLCAnJTI3Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmJRdWVyeSA9ICd1PScgKyB1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgZmJRdWVyeSA9ICdzPTEwMCZwW3VybF09JyArIHUgKyAnJnBbdGl0bGVdPScgKyB0ICsgJyZwW3N1bW1hcnldPScgKyBkICsgJyZwW2ltYWdlc11bMF09JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmtJbWFnZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAnbnVsbCcgJiYgaSAhPSAnJykgdmtJbWFnZSA9ICcmaW1hZ2U9JyArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IG5ldyBBcnJheSgnXCIjXCIgZGF0YS1jb3VudD1cInZrXCIgb25jbGljaz1cIndpbmRvdy5vcGVuKFxcJy8vdmsuY29tL3NoYXJlLnBocD91cmw9JyArIHUgKyAnJnRpdGxlPScgKyB0ICsgdmtJbWFnZSArICcmZGVzY3JpcHRpb249JyArIGQgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQktCa0L7QvdGC0LDQutGC0LVcIicsICdcIiNcIiBkYXRhLWNvdW50PVwiZmJcIiBvbmNsaWNrPVwid2luZG93Lm9wZW4oXFwnLy93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9JyArIHUgKyAnXFwnLCBcXCdfYmxhbmtcXCcsIFxcJ3Njcm9sbGJhcnM9MCwgcmVzaXphYmxlPTEsIG1lbnViYXI9MCwgbGVmdD0xMDAsIHRvcD0xMDAsIHdpZHRoPTU1MCwgaGVpZ2h0PTQ0MCwgdG9vbGJhcj0wLCBzdGF0dXM9MFxcJyk7cmV0dXJuIGZhbHNlXCIgdGl0bGU9XCLQn9C+0LTQtdC70LjRgtGM0YHRjyDQsiBGYWNlYm9va1wiJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxcSA9IFsnYi1pY29uIGItaWNvbi0tc2hhcmUgYi1pY29uLS12ayBpY29uLXZrJywgJ2ItaWNvbiBiLWljb24tLXNoYXJlIGljb24tZmInXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCArPSAnPGEgY2xhc3M9XCInICsgcXFbal0gKyAnXCIgcmVsPVwibm9mb2xsb3dcIiBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrO1wiIGhyZWY9JyArIHNbal0gKyAnIHRhcmdldD1cIl9ibGFua1wiPjwvYT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlW2tdLmlubmVySFRNTCA9IGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vINCf0L7RgdC70LUg0L/Rg9Cx0LvQuNC60LDRhtC40Lgg0YHRgtGA0LDQvdC40YbRiyDQuCDQvtGC0L/RgNCw0LLQutC4INCw0Y/QutGB0LBcclxuICAgICAgICBjcmVhdGVkTmV3UGFnZShhamF4X2Fuc3dlcikge1xyXG4gICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay50ZXh0Q29udGVudCA9IGBhbWVkb21hcnkudG13ZWIucnUvJHthamF4X2Fuc3dlcn1gO1xyXG4gICAgICAgICAgICB0aGlzLiRyZWZzLmFsZXJ0TGluay5ocmVmID0gYC8ke2FqYXhfYW5zd2VyfWAgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hbGVydElzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcHVibGlzaE5ld1RpbWVyKCkge1xyXG4gICAgICAgICAgICB2dWVfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLi4vaW5jbHVkZS9mb3JfZGIucGhwJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhZ2VUaXRsZVwiOiB2dWVfdGhpcy5oZWFkaW5nTWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICBcInByZUhlYWRpbmdcIjogdnVlX3RoaXMucHJlSGVhZGluZ01lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJoZWFkaW5nXCI6IHZ1ZV90aGlzLmhlYWRpbmdNZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogdnVlX3RoaXMuZGVzY3JpcHRpb25UZXh0TWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlU3JjQmFja2dyb3VuZFwiOiB2dWVfdGhpcy5pbWFnZVNyY0JhY2tncm91bmQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl9pXCI6IHZ1ZV90aGlzLmNvbG9yX2ksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaW5pc2hEYXRlXCI6IHZ1ZV90aGlzLmZpbmlzaERhdGVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZ1ZV90aGlzLmNyZWF0ZWROZXdQYWdlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmVmb3JlQ3JlYXRlKCkge1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyDQktGL0LfRi9Cy0LDQtdGC0YHRjyDRgdC40L3RhdGA0L7QvdC90L4g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0Y3QutC30LXQvNC/0LvRj9GA0LBcclxuICAgIGNyZWF0ZWQoKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGRhdGFfanNvbjtcclxuICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC/0LXRgNC10LzQtdC90L3Ri9C8INC30L3QsNGH0LXQvdC40Y8g0YEg0YHQtdGA0LLQtdGA0LBcclxuICAgICAgICB0aGlzLnByZUhlYWRpbmdNZXNzYWdlID0gZGF0YS5wcmVIZWFkaW5nO1xyXG4gICAgICAgIHRoaXMuaGVhZGluZ01lc3NhZ2UgPSBkYXRhLmhlYWRpbmc7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvblRleHRNZXNzYWdlID0gZGF0YS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC30LDQs9C+0LvQvtCy0L7QuiDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBkYXRhLnBhZ2VUaXRsZVxyXG4gICAgICAgIC8vINC/0YDQuNGB0LLQsNC10LLQsNC10Lwg0YTQvtC9XHJcbiAgICAgICAgdGhpcy5pbWFnZVNyY0JhY2tncm91bmQgPSBkYXRhLmltYWdlU3JjQmFja2dyb3VuZDtcclxuICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INGG0LLQtdGCXHJcbiAgICAgICAgdGhpcy5zdHlsZUFwcCA9IHsgJy0tdGhlbWUtY29sb3InOiBkYXRhLmNvbG9yX2kgfTtcclxuICAgICAgICAvLyDQv9GA0LjRgdCy0LDQtdCy0LDQtdC8INC00LDRgtGDXHJcbiAgICAgICAgdGhpcy5maW5pc2hEYXRlID0gbmV3IERhdGUoZGF0YS5maW5pc2hEYXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g0JLRi9C30YvQstCw0LXRgtGB0Y8g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGC0L7Qs9C+INC60LDQuiDRjdC60LfQtdC80L/Qu9GP0YAg0LHRi9C7INGB0LzQvtC90YLQuNGA0L7QstCw0L1cclxuICAgIG1vdW50ZWQoKSB7XHJcbiAgICAgICAgLy8g0L/QvtC70YPRh9Cw0LXQvCDQutC+0L3QtdGH0L3Rg9GOINC00LDRgtGDICjQl9Cw0LPQvtC70L7QstC+0Log0JTQsNGC0YspXHJcbiAgICAgICAgdGhpcy5jcmVhdGVOYW1lT2ZGaW5pc2hEYXRlKCk7XHJcbiAgICAgICAgLy8g0LfQsNC/0YPRgdC60LDQtdC8INGC0LDQudC80LXRgFxyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxJbml0ID0gdGhpcy5jbG9ja0Z1bmMoKTtcclxuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb2NrRnVuYygpO1xyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIC8vINC80LXQvdGP0LXQvCDRiNC10LnRgNGLXHJcbiAgICAgICAgdGhpcy5zaGFyZUNyZWF0ZUxpbmsoKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIHRoaXMuYWNjZXB0RWRpdFRleHQpO1xyXG4gICAgfVxyXG59KVxyXG4iXSwiZmlsZSI6InBhcnRpYWxzL2xhbmRpbmdfdnVlLmpzIn0=
