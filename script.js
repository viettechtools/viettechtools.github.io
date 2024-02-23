let imageShowed = "";
const todoList = document.getElementById('todo-list');
const btnLoadImage = document.getElementById('btn-load-image');
const loadJsonButton = document.getElementById('load-json-button');
const imageGarmentViewer = document.getElementById('image-garment');
const imageModelViewer = document.getElementById('image-model');
let labelsImages = {}
let listGarmentImages = []
let listModelImages = []

btnLoadImage.addEventListener('click', () => {
    // Hiển thị hộp thoại chọn ảnh
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();

    // Xử lý khi chọn ảnh
    input.addEventListener('change', () => {
        listGarmentImages = []
        listModelImages = []
        const files = input.files;
        Array.from(files).filter(file => {
            if (file.name.includes("_0.")) {
                listGarmentImages.push(file)
            }
        })
        Array.from(listGarmentImages).filter(fileGarment => {
            Array.from(files).filter(file => {
                if (fileGarment.name !== file.name &&
                    file.name.includes("_1.") &&
                    fileGarment.name.split('_')[0] === file.name.split('_')[0]) {
                    listModelImages.push(file)
                }
            })
        })
        for (let i = 0; i < listGarmentImages.length; i++) {
            const fileGarment = listGarmentImages[i];
            const fileModel = listModelImages[i];

            // Tạo phần tử mới trong danh sách ảnh
            const li = document.createElement('li');
            li.textContent = fileGarment.name;
            li.addEventListener('click', () => {
                // Hiển thị ảnh được chọn
                const readerGarment = new FileReader();
                readerGarment.onload = () => {
                    imageGarmentViewer.src = readerGarment.result;
                };
                readerGarment.readAsDataURL(fileGarment);

                // Hiển thị ảnh được chọn
                const readerModel = new FileReader();
                readerModel.onload = () => {
                    imageModelViewer.src = readerModel.result;
                };
                readerModel.readAsDataURL(fileModel);
            });
            todoList.appendChild(li);
            labelsImages[fileGarment.name] = {
                name: fileGarment.name,
                labels: {},
            }
        }
    });
});

// Tạo danh sách label
const labelList = document.getElementById('label-list');

// Cấu trúc dữ liệu label
const LABELS = {
    "pant": [
        "long",
        "short",
        "thin",
    ],
    "shirt": [
        "long",
        "new",
        "old",
    ],
    "level1": {
        "level2_1": {
            "level3_1": [
                "level4_1",
                "level4_2",
            ],
            "level3_2": [
                "level4_1",
                "level4_2",
                "level4_4",
            ]
        },
        "level2_2": [
            "level3_1",
            "level3_2",
        ]
    }
};

function renderLabels(data, parentElement) {
    parentElement.innerHTML = "";

    for (const labelCategory in data) {
        const categoryElement = document.createElement('li');
        categoryElement.classList.add('category');
        categoryElement.classList.add('label_1');
        categoryElement.setAttribute('name', labelCategory);

        // Tạo checkbox cho label bậc 1
        // const categoryCheckbox = document.createElement('input');
        // categoryCheckbox.classList.add('label_1');
        // categoryCheckbox.type = 'checkbox';
        // categoryCheckbox.name = labelCategory;
        // categoryElement.appendChild(categoryCheckbox);

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

        if (Array.isArray(data[labelCategory]) || typeof data[labelCategory] === 'string') {
            // If it's an array or string, render the items
            renderLabelsItems(data[labelCategory], ul);
        } else {
            // If it's an object, recursively render its children
            renderLabels(data[labelCategory], ul);
        }

        categoryElement.appendChild(ul);
        parentElement.appendChild(categoryElement);
    }
}

function renderLabelsItems(items, parentElement) {
    for (const idx in items) {
        if (typeof items[idx] === "object") {
            renderLabels(items[idx], parentElement);
        } else {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            const labelName = items[idx];
            checkbox.type = 'checkbox';
            checkbox.name = labelName;
            checkbox.classList.add('label_2');

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(labelName));
            parentElement.appendChild(li);
        }
    }
}

// Call the function to render the labels
renderLabels(LABELS, labelList);

// Xử lý khi chọn ảnh
todoList.addEventListener('click', (e) => {
    const image = e.target.textContent;
    imageShowed = image;
    updateLabelsForImage(image);
});

function updateLabelsForImage(image) {
    resetChecked()
    const imageLabels = getLabelsForImage(image);

    for (const labelName in LABELS) {
        const checkbox = document.querySelector(`li[name="${labelName}"].label_1`);
        if (checkbox.parentNode !== labelList) {
            continue
        }
        if (checkbox.querySelector("li.label_1") === null) {
            for (const idx in LABELS[labelName]) {
                const child = LABELS[labelName][idx]
                const childBox = checkbox.querySelector(`input[name="${child}"].label_2`)
                if (imageLabels["labels"][labelName] && imageLabels["labels"][labelName].includes(child)) {
                    childBox.checked = true
                }
            }
        }
        else {
            updateLabelsLevels(LABELS[labelName], checkbox, imageLabels["labels"][labelName])
        }
        // const ulBox = checkbox.parentNode.querySelector('ul')
        // if (imageLabels["labels"][labelName] !== undefined) {
        //     console.log(imageLabels["labels"][labelName])
        //     for (const idx in LABELS[labelName]) {
        //         const child = LABELS[labelName][idx]
        //         const childBox = ulBox.querySelector(`input[name="${child}"].label_2`)
        //         if (imageLabels["labels"][labelName].includes(child)) {
        //             childBox.checked = true
        //         }
        //     }
        // }
    }
}

function updateLabelsLevels(labels, parent, imageLabels) {
    for (const label in labels) {
        if (imageLabels[label] === undefined) {
            continue
        }
        const checkbox = document.querySelector(`li[name="${label}"].label_1`);
        if (checkbox.querySelector("li.label_1") === null) {
            for (const idx in imageLabels[label]) {
                const child = imageLabels[label][idx]
                const childBox = checkbox.querySelector(`input[name="${child}"].label_2`)
                if (imageLabels[label].includes(child)) {
                    childBox.checked = true
                }
            }
        }
        else {
            console.log(labels[label])
            console.log(checkbox)
            console.log(imageLabels[label][label])
            updateLabelsLevels(labels[label], checkbox, imageLabels[label][label])
        }
    }
}

const resetChecked = () => {
    const checkboxes = labelList.querySelectorAll('input[type="checkbox"]')
    for (const idx in checkboxes) {
        checkboxes[idx].checked = false
    }
}

const getLabelsForImage = (image) => {
    return labelsImages[image]
}

// Xử lý sự kiện thay đổi checkbox
labelList.addEventListener('change', (e) => {
    const checkbox = e.target;
    const labelName = checkbox.name;

    if (Array.isArray(LABELS[labelName])) {
        console.log("Handle checked 1")
        const ulBox = checkbox.parentNode.querySelector('ul')
        const childCheckbox = ulBox.querySelectorAll('input[type="checkbox"]')
        childCheckbox.forEach(child => {
            child.checked = checkbox.checked;
        });
    } else {
        console.log("Handle checked 2")
    }
});

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
    const labels1 = labelList.querySelectorAll('li.label_1');
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

const saveJsonButton = document.getElementById('save-json-button');
saveJsonButton.addEventListener('click', () => {
    console.log(labelsImages)
    const jsonString = JSON.stringify(labelsImages, null, 2); // thêm null và 2 để định dạng đẹp

    // Tạo một blob từ chuỗi JSON
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Tạo một đường link để tải về blob
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'labels.json';

    // Thêm đường link vào DOM và kích hoạt sự kiện click
    document.body.appendChild(a);
    a.click();

    // Loại bỏ đường link từ DOM
    document.body.removeChild(a);
});

loadJsonButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.click();

    // Lấy file JSON được chọn
    input.addEventListener('change', () => {
        const file = input.files[0];

        // Đọc dữ liệu JSON từ file
        const reader = new FileReader();
        reader.onload = () => {
            const jsonData = JSON.parse(reader.result);
            labelsImages = jsonData
        };
        reader.readAsText(file);
    });
});