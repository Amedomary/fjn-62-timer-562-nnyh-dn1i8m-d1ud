<!--
// ====================
// LMS: material-item
// 20-04-2018: Петр
// ____________________
// пункт с материалом курса
// ====================
-->

// <template lang="pug">
//     include ../../section/tools/mixins.pug
//     li.b-material__item
//         +b.material__title {{material.title}}
//             span(:class='generatedClasses')
//             slot(name='counter' v-if='material.testResult')
//         +b.material__text {{material.text}}
// </template>
// <script>
//     export default {
//         computed: {
//             generatedClasses: function () {
//                 var status = this.materialStatus[this.material.materialId];
//                 var result = 'b-checkmark';
//                 result = (status === "locked") ? 'b-icon b-icon--locked icon-locked' : result;
//                 result = (status === "current") ? 'b-icon b-icon--current icon-current' : result;
//                 return result;
//             }
//         },
//         props: {
//             material: {type: Object, required: true},
//             materialStatus: {type: Object, required: true}
//         }
//     }
// </script>
