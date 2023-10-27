const places = document.querySelector(".places");


const submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", function(event) {
        places.classList.remove("hide");
        event.preventDefault();
        places.replaceChildren();
        console.log(document.querySelector("#place").value)
        url = `https://api.inaturalist.org/v1/places/autocomplete?q=${document.querySelector("#place").value}`;
        fetchPlaces(url);
       
    });


async function fetchPlaces(url){

    const response = await fetch(url);
    const data = await response.json();
    console.log(data.results);
    data.results.forEach(element => {
        let li = document.createElement("li");
        li.innerHTML = `<a href="https://api.inaturalist.org/v1/identifications/${element.id}">${element.display_name}</a>`;
        console.log(element.id);
        places.appendChild(li);
        li.addEventListener("click", function(event) {
            event.preventDefault();
            fetchIdentifications(`https://api.inaturalist.org/v1/identifications/${element.id}`)
           
           
        });
    });


}




async function fetchIdentifications(url){
    const response = await fetch(url);
    const data = await response.json();
    document.querySelector("#ids").replaceChildren();
    //console.log(data.results[0].observation.taxon.name);
    console.log(data);
    let uniqueElements = [];
    if (data.results.length != 0){
        uniqueElements = data.results[0].observation.identifications.filter((element, index, array) => {
        return array.findIndex(t => t.taxon.name === element.taxon.name) === index;
    });
    }
    
    console.log(uniqueElements);
    if (data.results.length != 0){
        uniqueElements.forEach(element => {
            console.log(element.taxon.name);
            console.log(element.taxon.default_photo.medium_url);
            let li = document.createElement("li");
            let div = document.createElement("div");
            let title = document.createElement("h1");
            let picture = document.createElement("img");
            title.textContent = element.taxon.name;
            picture.src = element.taxon.default_photo.medium_url;
            div.appendChild(picture);
            div.appendChild(title);
            li.appendChild(div);
            document.querySelector("#ids").appendChild(li);
        });
       
    }
}

