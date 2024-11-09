const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".msg");
const list = document.querySelector(".ajax-section .cities");

//API Key
const apiKey = "be042ac94d764ba38d8142205240210";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputVal = input.value;

  //check if a city is already there
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";

      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      }
              ...otherwise be more specific by providing the country code as well`;
      form.reset();
      input.focus();
      return;
    }
  }

  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${inputVal}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // do stuff with the data

      const { current, location } = data;
      const icon = current.condition.icon;
      const li = document.createElement("li");
      li.classList.add("city");

      const markup = ` 
        <h2 class="city-name" data-name="${location.name},${location.country}"> 
        <span>${location.name}</span> 
        <sup>${location.country}</sup> 
        </h2> 
        <div class="city-temp">${Math.round(current.temp_c)}<sup>°C</sup> 
        </div> 
        <figure> 
        <img class="city-icon" src="${icon}" alt="${current.condition.icon}"> 
        <figcaption>${current.condition.text}</figcaption> 
        </figure> 
        `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city ";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});
