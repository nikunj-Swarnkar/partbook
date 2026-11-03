const projects = [
    {
        name: "Name here",
        note: "note here",
        items: 24,
        units: 137,
        total: 412.8,
        currency: "GBP"
    }
];

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
        <button class="project-card new-card" type="button">
        <span class="plus">+</span>
        <span>New project</span>
    </button>


`;

grid.innerHTML = projects.map(cardHtml).join("") + newCard;