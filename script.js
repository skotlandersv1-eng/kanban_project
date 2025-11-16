const addBtn = document.getElementById("bikinibotton");
const taskInput = document.getElementById("taskinput");
const statusInput = document.getElementById("statusinput");

addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text === "") return;

    const card = document.createElement("div");
    card.classList.add("task-card");
    card.innerHTML = `
    ${text}
   
    <button class="delete-btn">×</button>
`;

    card.draggable = true;

    card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });

const deleteBtn = card.querySelector(".delete-btn");
deleteBtn.addEventListener("click", () => {
    card.remove();
});

    document.getElementById(statusInput.value + "-list").appendChild(card);

    taskInput.value = "";
});

const columns = document.querySelectorAll(".kanban-list");

columns.forEach(col => {
    col.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    col.addEventListener("drop", () => {
        const draggingCard = document.querySelector(".dragging");
        col.appendChild(draggingCard);
    });
});
