// document.addEventListener('DOMContentLoaded'), () => {
//     const BREAKPOINT = '(max-width:430px)';
//     const mq = window.matchMedia(BREAKPOINT);
//     const item = document.querrySelector('.second-iphone-child');
//     if (!item) return;
//     const originalParent = item.parentNode;
//     const originalNext = item.nextSibling;
//     const targetParent = document.querySelector ('.second-iphone-parent')
//     function moveToTarget(){
//         if(targetPArent && targetPArent !== originalParent){
//             targetParent.appendChild(item);
//             return;
//         }
//     }
//     function restoreOriginal (){
//         if (originalNext && originalNext.parentNode === originalParent){
//             originalParent.insertBefore(item, originalNext);
//         }else {
//             originalParent.appendChild(item);
//         }
//     }
//     function handle(e){
//         if (e.matches) moveToTarget();
//         else restoreOriginal();
//     }
// };
"use strict";