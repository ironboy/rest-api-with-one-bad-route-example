// get a list of all pet owners from the REST api
let result = await fetch('/api/pet-owners');
// unpack from json
let petOwners = await result.json();

// create som html from the data
let html = '';
for (let owner of petOwners) {
  html += `
    <div>
      <h2>${owner.first_name} ${owner.last_name}</h2>
      <h4>${owner.email}</h4>
    </div>
  `;
}

// show the html
document.body.innerHTML = html;