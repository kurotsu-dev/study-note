const portfolioList = document.getElementById("portfolioList");

function renderPortfolio() {

    portfolioList.innerHTML = "";

    if (!portfolioData || portfolioData.length === 0) {

        portfolioList.textContent = "表示する学習内容がありません。";
        return;

    }

    portfolioData.forEach(function (category) {

        const categoryArea = document.createElement("div");
        categoryArea.className = "portfolio-category";

        const categoryTitle = document.createElement("h2");
        categoryTitle.className = "portfolio-category-title";
        categoryTitle.textContent = category.name;

        categoryArea.appendChild(categoryTitle);

        if (!category.items || category.items.length === 0) {

            const emptyText = document.createElement("p");
            emptyText.textContent = "まだ項目がありません。";
            categoryArea.appendChild(emptyText);

        } else {

            category.items.forEach(function (item) {

                const itemBox = document.createElement("div");
                itemBox.className = "portfolio-item";

                const itemTitle = document.createElement("h3");
                itemTitle.className = "portfolio-item-title";
                itemTitle.textContent = item.title;

                const note = document.createElement("p");
                note.className = "portfolio-note";
                note.textContent = item.note;

                itemBox.appendChild(itemTitle);
                itemBox.appendChild(note);

                categoryArea.appendChild(itemBox);

            });

        }

        portfolioList.appendChild(categoryArea);

    });

}

renderPortfolio();