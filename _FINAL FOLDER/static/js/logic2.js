// // DROPDOWN MENU


// // toggle function
// function myFunction() {
//   document.getElementById("barDropdown").classList.toggle("show");
// }

// // close dropdown when clicking off
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }

// // populate dropdown with bar names from flask API
// d3.json("http://localhost:5000/api/v1.0/bar_names", function(barName) {
//   var dropdownContent = document.querySelector('.dropdown-content');
//   for (i = 0; i < barName.length; i++) {
//     var element = barName[i];
//     var htmlToAppend = document.createElement('a');
//     htmlToAppend.innerHTML = element;
//     dropdownContent.appendChild(htmlToAppend);
//   };
// });

// // event listener for when content is selected from dropdown

// // filter function
// function selectedBar(barName) {
//   return barName.name;
// }

// var filteredBar = barMarker.filter(selectedBar);