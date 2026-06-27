// ==============================
// Programming Study Note
// note.js
// ==============================

const params = new URLSearchParams(window.location.search);
const categoryName = params.get("category");

const title = document.getElementById("title");
const itemInput = document.getElementById("itemInput");
const addItemButton = document.getElementById("addItemButton");
const itemList = document.getElementById("itemList");
const backButton = document.getElementById("backButton");

title.textContent = categoryName;

let categories = JSON.parse(localStorage.getItem("categories")) || [];

let category = categories.find(function (c) {
    return c.name === categoryName;
});

if (!category) {
    alert("カテゴリが見つかりません。");
    location.href = "index.html";
}

if (!category.items) {
    category.items = [];
}

function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

function addItem() {

    const text = itemInput.value.trim();

    if (text === "") {
        alert("項目名を入力してください。");
        itemInput.focus();
        return;
    }

    const exists = category.items.some(function (item) {
        return item.title.toLowerCase() === text.toLowerCase();
    });

    if (exists) {
        alert("その項目は既にあります。");
        itemInput.focus();
        return;
    }

    category.items.push({
        id: Date.now(),
        title: text,
        note: "",
        open: false,
        editing: true
    });

    saveCategories();
    renderItems();

    itemInput.value = "";
    itemInput.focus();

}

function renderItems() {

    itemList.innerHTML = "";

    category.items.forEach(function (item) {

        if (item.editing === undefined) {
            item.editing = item.note === "";
        }

        const box = document.createElement("div");
        box.className = "item-box";

        const header = document.createElement("div");
        header.className = "item-header";

        const arrow = document.createElement("span");
        arrow.textContent = item.open ? "▼" : "▶";

        const itemTitle = document.createElement("span");
        itemTitle.className = "item-title";
        itemTitle.textContent = item.title;

        header.appendChild(arrow);
        header.appendChild(itemTitle);
        box.appendChild(header);

        if (item.open) {

            const buttonArea = document.createElement("div");
            buttonArea.className = "button-area";

            const renameButton = document.createElement("button");
            renameButton.textContent = "名前変更";

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "削除";
            deleteButton.className = "delete-button";

            if (item.editing || item.note === "") {

                const textarea = document.createElement("textarea");
                textarea.value = item.note;
                textarea.placeholder = "ここに勉強した内容を書きましょう";

                box.appendChild(textarea);

                const saveButton = document.createElement("button");
                saveButton.textContent = "保存";

                buttonArea.appendChild(saveButton);

                saveButton.addEventListener("click", function () {
                    item.note = textarea.value;
                    item.editing = false;

                    saveCategories();
                    renderItems();
                });

            } else {

                const displayNote = document.createElement("div");
                displayNote.className = "note-display";
                displayNote.textContent = item.note;

                box.appendChild(displayNote);

                const editButton = document.createElement("button");
                editButton.textContent = "書き直す";

                buttonArea.appendChild(editButton);

                editButton.addEventListener("click", function () {
                    item.editing = true;

                    saveCategories();
                    renderItems();
                });

            }

            buttonArea.appendChild(renameButton);
            buttonArea.appendChild(deleteButton);
            box.appendChild(buttonArea);

            renameButton.addEventListener("click", function () {

                const newName = prompt("新しい項目名を入力してください", item.title);

                if (newName === null) {
                    return;
                }

                const text = newName.trim();

                if (text === "") {
                    alert("項目名を入力してください。");
                    return;
                }

                const exists = category.items.some(function (i) {
                    return i.id !== item.id &&
                           i.title.toLowerCase() === text.toLowerCase();
                });

                if (exists) {
                    alert("その項目名は既に存在します。");
                    return;
                }

                item.title = text;

                saveCategories();
                renderItems();

            });

            deleteButton.addEventListener("click", function () {

                if (!confirm("この項目を削除しますか？")) {
                    return;
                }

                category.items = category.items.filter(function (i) {
                    return i.id !== item.id;
                });

                saveCategories();
                renderItems();

            });

        }

        header.addEventListener("click", function () {

            category.items.forEach(function (i) {
                if (i.id === item.id) {
                    i.open = !i.open;
                } else {
                    i.open = false;
                }
            });

            saveCategories();
            renderItems();

        });

        itemList.appendChild(box);

    });

}

addItemButton.addEventListener("click", addItem);

itemInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        event.preventDefault();
        addItem();
    }

});

backButton.addEventListener("click", function () {
    location.href = "index.html";
});

renderItems();