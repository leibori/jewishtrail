const siteList = document.querySelector('#site-list');
const searchButton = document.getElementById("search-button");
const searchForm = document.querySelector('#search-form')


searchForm.addEventListener('submit',(e) => {
    e.preventDefault();

    dropList = searchForm['by-category'].value;
    searchVal = searchForm['search-text'].value;
    searchVal = searchVal[0].toUpperCase() + searchVal.slice(1);
    
    siteList.innerHTML = '';

    db.collection('sites').where(dropList, '==', searchVal).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderSite(doc);
        })
    })
})


function renderSite(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let country = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    country.textContent = doc.data().country;

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(country);

    siteList.appendChild(li);
}