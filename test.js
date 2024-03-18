function renderLabels(data, parentElement, key_parent) {
    // parentElement.innerHTML = "";

    for (const labelCategory in data) {
        const categoryElement = document.createElement('li');
        categoryElement.classList.add('category');
        categoryElement.classList.add('label_1');
        categoryElement.setAttribute('name', key_parent + labelCategory);

        const divContainer = document.createElement('div');
        divContainer.classList.add('icon-and-text-container')


        // Add Icon to li tag
        const iconSpan = document.createElement('span');
        iconSpan.classList.add("toggle-icon");
        iconSpan.textContent = '-';
        iconSpan.addEventListener('click', (e) => {
            const parent = e.target.parentNode.parentNode;
            const childs = parent.querySelector(".childs-container");
            if (childs.style.display !== "none") {
                iconSpan.textContent = "+";
                childs.style.display = "none";
            } else {
                iconSpan.textContent = "-";
                childs.style.display = "block";
            }
        });
        divContainer.appendChild(iconSpan);

        const pElement = document.createElement('p');
        pElement.textContent = labelCategory;
        divContainer.appendChild(pElement);

        categoryElement.appendChild(divContainer);

        const ul = document.createElement('ul');
        ul.classList.add("childs-container");

        if (Array.isArray(data[labelCategory
        ]) || typeof data[labelCategory
        ] === 'string') {
            // If it's an array or string, render the items
            console.log(data[labelCategory
            ])
            renderLabelsItems(data[labelCategory
            ], ul, key_parent + labelCategory);
        } else {
            // If it's an object, recursively render its children
            renderLabels(data[labelCategory
            ], ul, key_parent + labelCategory);
        }

        categoryElement.appendChild(ul);
        parentElement.appendChild(categoryElement);
    }
}

function renderLabelsItems(items, parentElement, key_parent) {
    for (const idx in items) {
        if (typeof items[idx
        ] === "object") {
            renderLabels(items[idx
            ], parentElement,
            "");
        } else {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            const labelName = items[idx
            ];
            checkbox.type = 'checkbox';
            checkbox.name = key_parent + labelName;
            checkbox.classList.add('label_2');

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(labelName));
            parentElement.appendChild(li);
        }
    }
}




function HideTodoList() {
    const labels1 = labelList.querySelectorAll('li.label_1');
    labels1.forEach(e1 => {
        if (e1.parentNode !== labelList) {
            return
        }
        if (e1.querySelector('li.label_1') === null) {
        }
        else {
            if (e1.parentNode !== labelList) {
                return
            }
            HideChildTodoList(e1)
            const iconSpan = e1.querySelector(".toggle-icon");
            const childsContainer = e1.querySelector(".childs-container")
            iconSpan.textContent = '+';
            childsContainer.style.display = "none";
        }
    });
}
function HideChildTodoList(e1) {
    const parents = e1.querySelectorAll('li.label_1');
    parents.forEach(parent => {
        if (parent.parentNode.parentNode !== e1) {
            return
        }
        if (parent.querySelector('li.label_1') === null) {
            const iconSpan = parent.querySelector(".toggle-icon");
            const childsContainer = parent.querySelector(".childs-container")
            iconSpan.textContent = '+';
            childsContainer.style.display = "none";
        }
        else {
            HideChildTodoList(parent)
            const iconSpan = parent.querySelector(".toggle-icon");
            const childsContainer = parent.querySelector(".childs-container")
            iconSpan.textContent = '+';
            childsContainer.style.display = "none";
        }
    })
}

const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    if (imageGarmentViewer.getAttribute('src') !== "") {
        const checkedLabels = getCheckedLabels();
    }
    else {
        console.log("Load image")
    }
});


// Hàm lấy danh sách các checkbox đã được chọn
function getCheckedLabels() {
    const listLabels = labelList.querySelectorAll('li.label_1');
    // let getLabels = {};

    let attributes = {};
    labels1.forEach(e1 => {
        if (e1.parentNode !== labelList) {
            return
        }
        if (e1.querySelector('li.label_1') === null) {
            const labels2 = e1.querySelectorAll('input.label_2');
            let temp = []
            labels2.forEach(e2 => {
                if (e2.checked) {
                    temp.push(e2.name);
                }
            });
            if (temp.length > 0) {
                attributes[e1.querySelector('p').textContent] = temp
            }
        }
        else {
            if (e1.parentNode !== labelList) {
                return
            }
            let res = GetTest(e1)
            attributes = { ...attributes, ...res }
        }
    });
    // getLabels[imageShowed] = attributes;
    labelsImages[imageShowed]["labels"] = attributes
    console.log(attributes)
}

function GetTest(e1) {
    const parents = e1.querySelectorAll('li.label_1');
    let res = {}
    parents.forEach(parent => {
        let attributes = [];
        if (parent.parentNode.parentNode !== e1) {
            return
        }
        if (parent.querySelector('li.label_1') === null) {
            const labels2 = parent.querySelectorAll('input.label_2');

            labels2.forEach(e2 => {
                if (e2.checked) {
                    console.log(e2)
                    attributes.push(e2.name);
                }
            });

            if (attributes.length > 0) {
                res[parent.querySelector('p').textContent] = attributes
            }
        }
        else {
            let temp = GetTest(parent)
            res[parent.querySelector('p').textContent] = temp
        }
    })
    let final_res = {}
    final_res[e1.querySelector("p").textContent] = res
    return final_res
}