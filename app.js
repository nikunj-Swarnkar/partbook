const STORAGE_KEY = "partbook.projects";
const starterProjects = [{
    id: "starter-robot-arm",
    name: "Robot Arm v2",
    note: "Six servos, aluminium, one very patient weekend.",
    currency: "GBP",
    parts: [
        { name: "MG996R servo", link: "", cost: 8.9, qty: 6 },
        { name: "Servo bracket", link: "", cost: 12.4, qty: 4 },
        { name: "M3 bolt", link: "", cost: 0.12, qty: 40 }
    ]
}];


function loadProjects() {
     const saved = localStorage.getItem(STORAGE_KEY);
     if (!saved) return starterProjects;
     try {
        const list = JSON.parse(saved);
        list.forEach(function (project) {
            if (!project.id) project.id = createId();
            if (!Array.isArray(project.parts)) project.parts = [];
        });
        return list;
     } catch (error) {
        return starterProjects;
     }
}

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2 ,7);
}

let projects = loadProjects();
let currentProject = null;
const grid = document.getElementById("project-grid");

function money(amount, currency) {
    return new Intl.NumberFormat("en-GB",{
        style: "currency" ,
        currency: currency
    }).format(amount);
}

function unitsOf(project) {
    return project.parts.reduce(function (sum, part)
    {
        return sum + part.qty ; 
    } ,0);
}

function totalOf(project) {
    return project.parts.reduce(function (sum, part) {
        return sum + part.cost * part.qty ;
    } , 0 ) ; 
}

function cardHtml(project, index) {
    const number = String(index + 1).padStart(2,"0");
    return `
    <a class="project-card" href="#p/${project.id}">
        <div class="card-topline">
            <span class="card-number">${number}</span>
            <span class="card-symbol">&#9670;</span>
            </div>

            <h2>${project.name}</h2>
            <p>${project.note}</p>

            <div class="card-details">
                <div>
                    <span>Items</span>
                    <strong>${project.parts.length}</strong>
                </div>
                <div>
                    <span>Units</span>
                    <strong>${unitsOf(project)}</strong>
                </div>
            </div>

            <div class="card-total">
                <span>Total</span>
                <strong>${money(totalOf(project), project.currency)}</strong>
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
        parts: [],
        currency: currencySelect.value
    });
    
    saveProjects();
    dialog.close();
    renderProjects();

});
    const partForm = document.getElementById("part-form");

    partForm.addEventListener("submit" , function (event) {
        event.preventDefault();
        if (!currentProject) return;
    const partName = document.getElementById("part-name").value.trim();
    const link = document.getElementById("part-link").value.trim();
    const cost = Number(document.getElementById("part-cost").value);
    const qty = Number(document.getElementById("part-qty").value);

    if (!partName || !isFinite(cost) || !isFinite(qty) || qty < 1) return;

    currentProject.parts.push({
        name: partName,
        link: link,
        cost: cost,
        qty: qty
    });

    saveProjects();
    renderParts(currentProject);
    renderProjects();

    partForm.reset();
    document.getElementById("part-qty").value = "1";
    document.getElementById("part-name").focus();

});







function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderParts(project) {
    const body= document.getElementById("parts-body");
    if (project.parts.length === 0) {
        body.innerHTML = '<tr><td colspan="5" class="empty">No parts yet.</td></tr>';
    }  else {
        body.innerHTML = project.parts.map(function (part) {
            return `
                <tr>
                    <td>${part.name}</td>
                    <td>${part.link || "—"}</td>
                    <td class="r">${money(part.cost, project.currency)}</td>
                    <td class="r">${part.qty}</td>
                    <td class="r">${money(part.cost * part.qty, project.currency)}</td>
                </tr>
            `;
        }).join("");
    }
    document.getElementById("stat-parts").textContent = project.parts.length;
    document.getElementById("stat-units").textContent = unitsOf(project);
    document.getElementById("stat-total").textContent = money(totalOf(project), project.currency);
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
    currentProject = project;
    document.getElementById("project-title").textContent = project.name;
    document.getElementById("project-note").textContent = project.note || "No description yet.";
    renderParts(project);
    homeView.hidden = true;
    projectView.hidden = false;
    document.title = project.name + " - Partbook";
 }

 window.addEventListener("hashchange",renderRoute);

 renderProjects();
 renderRoute();
