// ====================
// ====================

// define(['jquery', 'vuejs'], function ($, Vue) {

var $app = $('#landing-app');

var appLanding = new Vue({
    el: '#landing-app',
    data: {
        createTimerShow: false, //состояние редактирования

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

        // Стили
        styleApp: '',

        // Consts
        CONTENTFROMSERVER: {
            // preHeading: 'Жди вместе с друзьями',
            // heading: 'Запусти свой таймер',
            // description: 'На этом сайте ты можешь создать таймер отсчёта до твоего события и поделиться с друзьями :)'
            preHeading: 'It fest',
            heading: 'UlCamp',
            description: 'Ждёте лета? Правильно делаете, есть чего ждать. 27-29 июля состоится главное событие лета для каждого уважающего себя айтишника – самая пляжная IT-конференция ULCAMP-2018. Пропустите – будете жалеть до следующего года, точно говорим.'
        },

        stateWasModified: false, // было ло ли изменено состояние

        stateEditPreHeading: false, // изменяется ли под-Заголовок
        stateEditHeading: false, // изменяется ли Заголовок
        stateEditDescriptionText: false, // изменяется ли Описание

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
        finishDate: new Date(2018, 6, 27, 20, 00, 00),  // (year, month, date, hours, minutes, seconds, ms)
        monthName: '',

        interval: "",
        intervalInit: "",
        cl_month: 'May',
        cl_days: '2',
        cl_hours: '12',
        cl_minutes: '45',
        cl_seconds: '07',
        // ! ======================

        // Выбор цвета =======
        color_i: 0,
        // ! Выбор цвета =====
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

                this.lastEditHeadingMessage = this.headingMessage;
                this.lastEditDescriptionTextMessage = this.descriptionTextMessage;
                this.lastEditPreHeadingMessage = this.preHeadingMessage;

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
                // присваеваем переменным значения с сервера
                // this.preHeadingMessage = this.CONTENTFROMSERVER.preHeading;
                // this.headingMessage = this.CONTENTFROMSERVER.heading;
                // this.descriptionTextMessage = this.CONTENTFROMSERVER.description;
                this.preHeadingMessage = this.lastEditPreHeadingMessage;
                this.headingMessage = this.lastEditHeadingMessage;
                this.descriptionTextMessage = this.lastEditDescriptionTextMessage;

                this.stateWasModified = false; //выключаем состояние "в редактировании"
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

            this.stateWasModified = false; //выключаем состояние "в редактировании"
        },


        // Изменяем часы (ставим новую дату)
        editClock: function () {
            if (this.createTimerShow) {
                // alert('В преАльфа версии эта функция недоступна. Нажмите ок.');
                let promptImputY = prompt('Введите Год вашего события', '2018');
                promptImputY = Number(promptImputY);
                let promptImputM = prompt('Месяц', '06');
                promptImputM = Number(promptImputM) + 1;
                let promptImputD = prompt('День', '31');
                promptImputD = Number(promptImputD);
                let promptImputH = prompt('Час', '00');
                promptImputH = Number(promptImputH);
                let promptImputMin = prompt('Минуту', '00');
                promptImputMin = Number(promptImputMin);

                this.finishDate = new Date(promptImputY, promptImputM, promptImputD, promptImputH, promptImputMin, 00);

                this.vueClockClass = 'editable editing';
            }
        },

        // Начинаем редактировать под-заголовок
        editPreHeading: function () {
            // alert('В преАльфа версии эта функция недоступна. Нажмите ок.');
            // TODO: сохранять старые значения надо и возвращать
            if (this.createTimerShow) {
                this.stateEditPreHeading = true;
                this.oldPreHeadingMessage = this.preHeadingMessage; // Запоминаем старое название
                this.preHeadingMessage = ''; // и меняем текст в форме на пустой
                // this.vueHeadingClass = 'editable';
            }
        },
        // Сохроняем редактирование
        compleateEditPreHeading: function () {
            if (this.createTimerShow) {
                this.stateEditPreHeading = false;
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
            // alert('В преАльфа версии эта функция недоступна. Нажмите ок.');
            // TODO: сохранять старые значения надо и возвращать
            if (this.createTimerShow) {
                this.stateEditHeading = true;
                this.oldHeadingMessage = this.headingMessage; // Запоминаем старое название
                this.headingMessage = ''; // и меняем текст в форме на пустой
                // this.vueHeadingClass = 'editable';
            }
        },
        // Сохроняем редактирование
        compleateEditHeading: function () {
            if (this.createTimerShow) {
                this.stateEditHeading = false;
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
            // alert('В преАльфа версии эта функция недоступна. Нажмите ок.');
            // TODO: сохранять старые значения надо и возвращать
            if (this.createTimerShow) {
                this.stateEditDescriptionText = true;
                this.oldDescriptionTextMessage = this.descriptionTextMessage; // Запоминаем старое название
                this.descriptionTextMessage = ''; // и меняем текст в форме на пустой
                // this.vueDescriptionTextClass = 'editable';
            }
        },
        // Сохроняем редактирование DescriptionText
        compleateEditDescriptionText: function () {
            if (this.createTimerShow) {
                this.stateEditDescriptionText = false;
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
            // if (this.createTimerShow && this.stateEditPreHeading && e.key == 'Enter') {
            //     this.compleateEditPreHeading();
            // }

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
            }

        },
        // clockCreateFinishDate
        // ! Clock ==============

        // Выбор цвета ==============
        colorPick: function () {
            this.styleApp = { '--theme-color': this.color_i };
            this.color_i = this.color_i + 15;
        }
        // ! Выбор цвета ==============


    },

    // Вызывается сразу после того как экземпляр был смонтирован
    mounted() {
        // получаем конечную дату
        this.monthName = this.finishDate.toLocaleString('ru-RU', { month: "long", day: 'numeric', hour: 'numeric', minute: 'numeric' })
        // запускаем таймер
        this.intervalInit = this.clockFunc();
        this.interval = setInterval(() => {
            this.clockFunc();
        }, 1000);
    },


    // Вызывается синхронно сразу после создания экземпляра
    created() {
        // присваеваем переменным значения с сервера
        this.preHeadingMessage = this.CONTENTFROMSERVER.preHeading;
        this.headingMessage = this.CONTENTFROMSERVER.heading;
        this.descriptionTextMessage = this.CONTENTFROMSERVER.description;

        document.addEventListener('keypress', this.acceptEditText)
    }

    // Вызывается синхронно сразу после инициализации экземпляра, до настройки наблюдения за данными, механизмов слежения и событий.
    // created() {
    // }
})

// });

/*
* Created by Negar Jamalifard at Yasna Team
* On 2018-03-11
* Codepen: https://codepen.io/negarjf
* Github: https://github.com/negarjf
* Email: n.jamalifatd@gmail.com
* 
*/

// Vue.component('Timer', {
//     template: `
//   	<div>
//       <div v-show ="statusType !== 'expired'">
//         <div class="day">
//           <span class="number">{{ days }}</span>
//           <div class="format">{{ wordString.day }}</div>
//         </div>
//         <div class="hour">
//           <span class="number">{{ hours }}</span>
//           <div class="format">{{ wordString.hours }}</div>
//         </div>
//         <div class="min">
//           <span class="number">{{ minutes }}</span>
//           <div class="format">{{ wordString.minutes }}</div>
//         </div>
//         <div class="sec">
//           <span class="number">{{ seconds }}</span>
//           <div class="format">{{ wordString.seconds }}</div>
//         </div>
//       </div>
//       <div class="message">{{ message }}</div>
//       <div class="status-tag" :class="statusType">{{ statusText }}</div>
//     </div>
//   `,
//     props: ['starttime', 'endtime', 'trans'],
//     data: function () {
//         return {
//             timer: "",
//             wordString: {},
//             start: "",
//             end: "",
//             interval: "",
//             days: "",
//             minutes: "",
//             hours: "",
//             seconds: "",
//             message: "",
//             statusType: "",
//             statusText: "",

//         };
//     },
//     created: function () {
//         this.wordString = JSON.parse(this.trans);
//     },
//     mounted() {
//         this.start = new Date(this.starttime).getTime();
//         this.end = new Date(this.endtime).getTime();
//         // Update the count down every 1 second
//         this.timerCount(this.start, this.end);
//         this.interval = setInterval(() => {
//             this.timerCount(this.start, this.end);
//         }, 1000);
//     },
//     methods: {
//         timerCount: function (start, end) {
//             // Get todays date and time
//             var now = new Date().getTime();

//             // Find the distance between now an the count down date
//             var distance = start - now;
//             var passTime = end - now;

//             if (distance < 0 && passTime < 0) {
//                 this.message = this.wordString.expired;
//                 this.statusType = "expired";
//                 this.statusText = this.wordString.status.expired;
//                 clearInterval(this.interval);
//                 return;

//             } else if (distance < 0 && passTime > 0) {
//                 this.calcTime(passTime);
//                 this.message = this.wordString.running;
//                 this.statusType = "running";
//                 this.statusText = this.wordString.status.running;

//             } else if (distance > 0 && passTime > 0) {
//                 this.calcTime(distance);
//                 this.message = this.wordString.upcoming;
//                 this.statusType = "upcoming";
//                 this.statusText = this.wordString.status.upcoming;
//             }
//         },
//         calcTime: function (dist) {
//             // Time calculations for days, hours, minutes and seconds
//             this.days = Math.floor(dist / (1000 * 60 * 60 * 24));
//             this.hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//             this.minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
//             this.seconds = Math.floor((dist % (1000 * 60)) / 1000);
//         }

//     }
// });

// new Vue({
//     el: "#timer",
// });