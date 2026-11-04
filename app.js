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
        const list = JSON.parse(saved);
        list.forEach(function (project) {
            if (!project.id) project.id = createId();
        });
        return list;
    } catch(error) { 
        return starterProjects;
    }
}

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2 ,7);
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
    <a class="project-card" href="#p/${project.id}">
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
        </a>
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
        id: createId(),
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
    
});
function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
function renderRoute() {
    const match = location.hash.match(/^#p\/(.+)$/);
    const homeView = document.getElementById("projects");
    const projectView = document.getElementById("project-view");
    if (!match)
    {
        homeView.hidden = false;
        projectView.hidden = true;
        document.title = "Partbook";
        return;
    }

    const project = projects.find(function (p) {
        return p.id === match[1];
    });
    if (!project) {
        location.hash = "#/";
        return;
    }
    document.getElementById("project-title").textContent = project.name;
    document.getElementById("project-note").textContent = project.note || "No description yet.";
    homeView.hidden = true;
    projectView.hidden = false;
    document.title = project.name + " · Partbook";
 }

 window.addEventListener("hashchange",renderRoute);

 renderProjects();
 renderRoute();
