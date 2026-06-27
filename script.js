let categories = [];

const input = document.getElementById("categoryInput");
const addButton = document.getElementById("addButton");
const categoryList = document.getElementById("categoryList");
const exportButton = document.getElementById("exportButton");

function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

function deleteCategory(id) {

    if (!confirm("このカテゴリを削除しますか？")) {
        return;
    }

    categories = categories.filter(function (category) {
        return category.id !== id;
    });

    saveCategories();
    renderCategories();

}

function renderCategories() {

    categoryList.innerHTML = "";

    categories.forEach(function (category) {

        const li = document.createElement("li");

        const row = document.createElement("div");
        row.className = "category-row";

        const categoryBox = document.createElement("div");
        categoryBox.className = "category-box";
        categoryBox.textContent = category.name;

        categoryBox.addEventListener("click", function () {
            location.href =
                "note.html?category=" +
                encodeURIComponent(category.name);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function (event) {
            event.stopPropagation();
            deleteCategory(category.id);
        });

        row.appendChild(categoryBox);
        row.appendChild(deleteButton);

        li.appendChild(row);
        categoryList.appendChild(li);

    });

}

function addCategory() {

    const text = input.value.trim();

    if (text === "") {
        alert("カテゴリ名を入力してください。");
        input.focus();
        return;
    }

    const exists = categories.some(function (category) {
        return category.name.toLowerCase() === text.toLowerCase();
    });

    if (exists) {
        alert("そのカテゴリは既にあります。");
        input.focus();
        return;
    }

    categories.push({
        id: Date.now(),
        name: text,
        items: []
    });

    saveCategories();
    renderCategories();

    input.value = "";
    input.focus();

}

function exportPortfolioData() {

    const portfolioData = categories.map(function (category) {

        return {
            name: category.name,
            items: category.items.map(function (item) {

                return {
                    title: item.title,
                    note: item.note
                };

            })
        };

    });

    const fileText =
        "const portfolioData = " +
        JSON.stringify(portfolioData, null, 4) +
        ";";

    const blob = new Blob([fileText], {
        type: "text/javascript"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-data.js";
    a.click();

    URL.revokeObjectURL(url);

    alert("portfolio-data.js を書き出しました。GitHubにアップロードしてください。");

}

addButton.addEventListener("click", addCategory);

input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        event.preventDefault();
        addCategory();
    }

});

exportButton.addEventListener("click", exportPortfolioData);

window.onload = function () {

    try {

        const saved = localStorage.getItem("categories");

        if (saved) {
            categories = JSON.parse(saved);
        }

    } catch (e) {
        categories = [];
    }

    categories = categories.map(function (category) {

        if (typeof category === "string") {

            return {
                id: Date.now() + Math.random(),
                name: category,
                items: []
            };

        }

        if (!category.items) {
            category.items = [];
        }

        return category;

    });

    saveCategories();
    renderCategories();

};