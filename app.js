const STORAGE_KEY = "partbook.projects";
const starterProjects = [{
    name: "Robot Arm v2",
        note: "Six servos, aluminium, one very patient weekend.",
        items: 24,
        units: 137,
        total: 412.8,
        currency: "GBP"
}];

function loadProjects() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterProjects;
    try {
        return JSON.parse(saved);
    } catch(error) { 
        return starterProjects;
    }
}

let projects = loadProjects();


const grid = document.getElementById("project-grid");

function money(amount, currency) {
    return new Intl.NumberFormat("en-GB",{
        style: "currency" ,
        currency: currency
    }).format(amount);
}

function cardHtml(project, index) {
    const number = String(index + 1).padStart(2,"0");
    return `
    <article class="project-card">
        <div class="card-topline">
            <span class="card-number">${number}</span>
            <span class="card-symbol">◆</span>
            </div>

            <h2>${project.name}</h2>
            <p>${project.note}</p>

            <div class="card-details">
                <div>
                    <span>Items</span>
                    <strong>${project.items}</strong>
                </div>
                <div>
                    <span>Units</span>
                    <strong>${project.units}</strong>
                </div>
            </div>

            <div class="card-total">
                <span>Total</span>
                <strong>${money(project.total, project.currency)}</strong>
            </div>
        </article>
    `;
    
}
const newCard = `
        <button class="project-card new-card" id="new-project" type="button">
        <span class="plus">+</span>
        <span>New project</span>
    </button>


`;

function renderProjects() {
    grid.innerHTML = projects.map(cardHtml).join("") + newCard;
}

const dialog = document.getElementById("project-dialog");
const form = document.getElementById("project-form");
const nameInput = document.getElementById("project-name");
const currencySelect = document.getElementById("project-currency");

grid.addEventListener("click", function (event) {
    if (!event.target.closest("#new-project")) return;

    form.reset();
    currencySelect.value = "GBP";
    dialog.showModal();
    nameInput.focus();
});

document.getElementById("cancel-project").addEventListener("click", function () {
    dialog.close();
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    if (!name) {
        nameInput.focus();
        return;
    }

    projects.push({
        name: name,
        note: "",
        items: 0,
        units: 0,
        total: 0,
        currency: currencySelect.value
    });
    
    saveProjects();
    dialog.close();
    renderProjects();
    dialog.close();
    renderProjects();
});
function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
renderProjects();