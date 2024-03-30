let imageShowed = "";
const listImages = document.getElementById('list-images');
const btnLoadImage = document.getElementById('btn-load-image');
const loadJsonButton = document.getElementById('load-json-button');
const saveJsonButton = document.getElementById('save-json-button');
const nameImage = document.getElementById('name-image');
const nameImageJson = document.getElementById('name-image-json');
const imageGarmentViewer = document.getElementById('image-garment');
let labelsImages = {}
let listGarmentImages = []
let maxWidthDefault = "100%", maxHeightDefault = "500px"

// Tạo danh sách label
const labelList = document.getElementById('label-list');

// Cấu trúc dữ liệu label
const LABELS = {
    "texture_and_color": [
        "Solid color", "Complex but none deal breaker", "Repeating high-frequency", "Deal breaker", "See through", "Reflective", "Others",
    ],
    "top": {
        "top-neck": ["collar", "turtle", "round", "v-shape", "square", "bustier", "hoodie", "others",],
        "top-body": {
            "zipper/button": ["symmetry", "asymmetry", "others",],
            "length": ["chest", "belly", "normal", "long", "others",],
            "fit": ["fit", "regular", "loose", "puff", "others",],
            "style": ["Upper wire", "lower-wire", "flowery", "cut-out", "pocket", "layer", "pin", "pin-ending", "others",]
        },
        "sleeve": {
            "length": ["long", "short", "sleeveless", "others",],
            "fit": ["tight", "regular", "puff", "loose", "upper loose", "lower loose", "others",],
            "style": ["1-sleeve", "layer", "flowery", "pin ending", "others",]
        },
        "accessories": ["bow", "ruffle", "band", "belt", "others",],
    },
    "bottom": {
        "skirt": {
            "bottom-body": {
                "length": ["long", "knee", "mini", "others",],
                "fit": ["tight", "regular", "puff", "loose", "upper loose", "lower loose", "others",],
                "style": ["layer", "flowery", "pin ending", "others",]
            },
            "accessories": ["bow", "pocket", "ruffle", "band", "belt", "others",],
        },
        "pant": {
            "leg": {
                "length": ["long", "knee", "mini", "others",],
                "fit": ["tight", "regular", "loose", "puff", "upper loose", "lower loose", "others",],
                "style": ["layer", "flowery", "pocket", "flare ending", "pin ending", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        },
        "panty": ["panty"],
    },
    "whole-body": {
        "dress/long coat": {
            "dress/long coat-neck": ["collar", "turtle", "round", "v-shape", "square", "bustier", "others",],
            "whole-body-body": {
                "zipper/button": ["symmetry", "asymmetry", "others",],
                "length": ["mini", "knee", "long", "others",],
                "fit_upper": ["fit", "regular", "loose", "puff", "others",],
                "fit_lower": ["fit", "regular", "loose", "puff", "others",],
                "style": ["Upper wire", "lower-wire", "flowery", "cut-out", "pocket", "layer", "pin", "pin-ending", "others",]
            },
            "sleeve": {
                "length": ["long", "short", "sleeveless", "others",],
                "fit": ["tight", "regular", "puff", "loose", "upper loose", "lower loose", "others",],
                "style": ["1-sleeve", "layer", "flowery", "pin ending", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        },
        "jumpsuit": {
            "jumpsuit-neck": ["collar", "turtle", "round", "v-shape", "square", "bustier", "hoodie", "others",],
            "jumpsuit-body": {
                "zipper/button": ["symmetry", "asymmetry", "others",],
                "length": ["chest", "others",],
                "fit": ["fit", "regular", "loose", "puff", "others",],
                "style": ["Upper wire", "lower-wire", "flowery", "cut-out", "pocket", "layer", "pin", "pin-ending", "others",]
            },
            "sleeve": {
                "length": ["long", "short", "sleeveless", "others",],
                "fit": ["tight", "regular", "loose", "puff", "upper loose", "lower loose", "others",],
                "style": ["1-sleeve", "layer", "flowery", "pin ending", "others",]
            },
            "leg": {
                "length": ["long", "short", "mini", "others",],
                "fit": ["tight", "regular", "loose", "puff", "upper loose", "lower loose", "others",],
                "style": ["layer", "flowery", "pin ending", "flare ending", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        },
        "one-piece swimwear": {
            "swimwear-neck": ["collar", "turtle", "round", "v-shape", "square", "bustier", "others",],
            "swimwear-body": {
                "zipper/button": ["symmetry", "asymmetry", "others",],
                "length": ["chest", "others",],
                "fit": ["fit", "others",],
                "style": ["Upper wire", "lower-wire", "flowery", "cut-out", "pocket", "layer", "others",]
            },
            "sleeve": {
                "length": ["long", "short", "sleeveless", "others",],
                "style": ["1-sleeve", "others",]
            },
            "leg": {
                "length": ["long", "short", "mini", "others",],
                "fit": ["tight", "others",],
                "style": ["layer", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        }
    },
};


// TODO: FUNCTION HANDLE LOAD IMAGES
btnLoadImage.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();

    input.addEventListener('change', () => {
        listGarmentImages = []
        const files = input.files;
        Array.from(files).filter(file => {
            listGarmentImages.push(file)
        })
        for (let i = 0; i < listGarmentImages.length; i++) {
            const fileGarment = listGarmentImages[i];

            const li = document.createElement('li');
            li.classList.add('li_image');
            li.textContent = fileGarment.name;
            li.addEventListener('click', () => {
                if (imageGarmentViewer.getAttribute('src') !== "") {
                    GetListLabelsChecked();
                }
                const allLi = document.querySelectorAll('.li_image');
                allLi.forEach(item => {
                    item.classList.remove('active-li');
                });
                li.classList.add('active-li');
                const readerGarment = new FileReader();
                readerGarment.onload = () => {
                    imageGarmentViewer.src = readerGarment.result;
                };
                readerGarment.readAsDataURL(fileGarment);
                nameImage.innerText = fileGarment.name;
                HandleChooseImage();
            });
            listImages.appendChild(li);
            labelsImages[fileGarment.name] = {
                name: fileGarment.name,
                labels: {},
            }
        }
        console.log("Check default json: ", labelsImages)
    });
});

// TODO: LOAD LIST LABELS
const RenderLabels = (listLabels, parentElement, keyParent) => {
    for (const label in listLabels) {
        const categoryElement = document.createElement('li');
        categoryElement.classList.add('category');
        categoryElement.classList.add('label_1');
        categoryElement.setAttribute('name', `${keyParent}_${label}`);

        const divContainer = document.createElement('div');
        divContainer.classList.add('parentLabel')

        // Add icon
        const iconSpan = document.createElement('span');
        iconSpan.classList.add("toggle-icon");
        iconSpan.textContent = '-';
        iconSpan.addEventListener('click', (e) => {
            const parent = e.target.parentNode.parentNode;
            const child = parent.querySelector(".child-container");
            if (child.style.display !== "none") {
                iconSpan.textContent = "+";
                child.style.display = "none";
            } else {
                iconSpan.textContent = "-";
                child.style.display = "block";
            }
        });
        divContainer.appendChild(iconSpan);

        const pElement = document.createElement('p');
        pElement.textContent = label;
        divContainer.appendChild(pElement);

        categoryElement.appendChild(divContainer);

        const ul = document.createElement('ul');
        ul.classList.add("child-container");
        if (Array.isArray(listLabels[label]) || typeof listLabels[label] === 'string') {
            RenderChildLabels(listLabels[label], ul, `${keyParent}_${label}`);
        } else {
            RenderLabels(listLabels[label], ul, `${keyParent}_${label}`);
        }

        categoryElement.appendChild(ul);
        parentElement.appendChild(categoryElement);
    }
}
const RenderChildLabels = (listLabels, parentElement, keyParent) => {
    for (const label in listLabels) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        const labelName = listLabels[label];
        checkbox.type = 'checkbox';
        checkbox.name = `${keyParent}_${labelName}`;
        checkbox.classList.add('label_2');

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(labelName));
        parentElement.appendChild(li);
    }
}

// TODO: SHORTED LIST LABELS UI - when choose another image
const HandleShortedListLabels = () => {
    const labelsParent = labelList.querySelectorAll('li.label_1');
    labelsParent.forEach(label => {
        if (label.parentNode !== labelList) return
        HandleShortedChildLabels(label)
        const iconSpan = label.querySelector(".toggle-icon");
        const childContainer = label.querySelector(".child-container")
        iconSpan.textContent = '+';
        childContainer.style.display = "none";
    });
}
const HandleShortedChildLabels = (childLabels) => {
    const labelsParent = childLabels.querySelectorAll('li.label_1');
    labelsParent.forEach(label => {
        if (label.parentNode.parentNode !== childLabels) {
            return
        }
        // Nếu không còn object trong đó nữa
        if (label.querySelector('li.label_1') === null) {
            const iconSpan = label.querySelector(".toggle-icon");
            const childContainer = label.querySelector(".child-container")
            iconSpan.textContent = '+';
            childContainer.style.display = "none";
        }
        else {
            HandleShortedChildLabels(label)
            const iconSpan = label.querySelector(".toggle-icon");
            const childContainer = label.querySelector(".child-container")
            iconSpan.textContent = '+';
            childContainer.style.display = "none";
        }
    })
}

// TODO: CLEAR CHECKBOX CHECKED
const ResetChecked = () => {
    const checkboxes = labelList.querySelectorAll('input[type="checkbox"]')
    for (const idx in checkboxes) {
        checkboxes[idx].checked = false
    }
}

// TODO: CHECKED CHECKBOX OF IMAGES
const GetCheckedLabels = () => {
    return labelsImages[nameImage.innerText]["labels"]
}
const CheckedCheckboxImage = () => {
    const listCheckboxChecked = GetCheckedLabels();
    if (isEmpty(listCheckboxChecked)) return
    for (const label in LABELS) {
        const checkbox = document.querySelector(`li[name="_${label}"].label_1`);
        if (checkbox.parentNode !== labelList) {
            continue
        }
        // Nếu mà không còn object trong đó nữa
        if (checkbox.querySelector("li.label_1") === null) {
            for (const idx in LABELS[label]) {
                const child = LABELS[label][idx]
                const childBox = checkbox.querySelector(`input[name="_${label}_${child}"].label_2`)
                if (listCheckboxChecked[label] && listCheckboxChecked[label].includes(child)) {
                    childBox.checked = true
                }
            }
        }
        else {
            CheckedChildCheckboxImage(LABELS[label], checkbox, listCheckboxChecked[label], `_${label}`)
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
const CheckedChildCheckboxImage = (listLabels, parent, labelsChecked, keyParent) => {
    if (labelsChecked === undefined) {
        return
    }
    for (const label in listLabels) {
        if (isEmpty(labelsChecked[label]) || labelsChecked[label].length === 0) {
            continue
        }
        const checkbox = document.querySelector(`li[name="${keyParent}_${label}"].label_1`);
        if (checkbox.querySelector("li.label_1") === null) {
            for (const idx in labelsChecked[label]) {
                const child = labelsChecked[label][idx]
                const childBox = checkbox.querySelector(`input[name="${keyParent}_${label}_${child}"].label_2`)
                if (childBox != undefined && labelsChecked[label].includes(child)) {
                    childBox.checked = true
                }
            }
        }
        else {
            CheckedChildCheckboxImage(listLabels[label], checkbox, labelsChecked[label], `${keyParent}_${label}`)
        }
    }
}

// TODO: GET LIST LABELS CHECKED OF IMAGE SHOWED
const GetListLabelsChecked = () => {
    const listLabels = labelList.querySelectorAll('li.label_1');

    let labelsChecked = {};
    listLabels.forEach(label => {
        // Không phải label lớn nhất, return
        if (label.parentNode !== labelList) {
            return
        }
        // Nếu không còn object nào ở trong
        if (label.querySelector('li.label_1') === null) {
            const childLabels = label.querySelectorAll('input.label_2');
            let childChecked = []
            childLabels.forEach(child => {
                if (child.checked) {
                    childChecked.push(child.parentNode.textContent);
                }
            });
            if (childChecked.length > 0) {
                labelsChecked[label.querySelector('p').textContent] = childChecked
            }
        }
        // Nếu còn objects trong đó
        else {
            let childChecked = GetListChildLabelsChecked(label)
            if (!isEmpty(childChecked)) {
                labelsChecked[label.querySelector('p').textContent] = { ...labelsChecked[label.querySelector('p').textContent], ...childChecked }
            }
        }
    });
    // getLabels[imageShowed] = attributes;
    labelsImages[nameImage.innerText]["labels"] = labelsChecked
    console.log(JSON.stringify(labelsChecked))
}
const GetListChildLabelsChecked = (childLabel) => {
    const listLabels = childLabel.querySelectorAll('li.label_1');
    let res = {}
    listLabels.forEach(label => {
        let labelChecked = [];
        // Nếu mà không thuộc trực tiếp thẻ childLabel
        if (label.parentNode.parentNode !== childLabel) {
            return
        }
        // Nếu không còn object nào 
        if (label.querySelector('li.label_1') === null) {
            const labels2 = label.querySelectorAll('input.label_2');
            labels2.forEach(e2 => {
                if (e2.checked) {
                    labelChecked.push(e2.parentNode.textContent);
                }
            });
            if (labelChecked.length > 0) {
                res[label.querySelector('p').textContent] = labelChecked
            }
        }
        else {
            let temp = GetListChildLabelsChecked(label)
            if (!isEmpty(temp)) {
                res[label.querySelector('p').textContent] = temp
            }
        }
    })
    return res
}

// TODO: HANDLE WHEN CHOOSE IMAGES
const HandleChooseImage = () => {
    HandleShortedListLabels();
    ResetChecked();
    CheckedCheckboxImage();

    imageGarmentViewer.style.maxWidth = maxWidthDefault
    imageGarmentViewer.style.maxHeight = maxHeightDefault

    // TODO: Show json 
    const listCheckboxChecked = GetCheckedLabels();
    let jsonData = JSON.stringify(listCheckboxChecked, null, 2);
    jsonData = simplifyJSON(jsonData)
    document.getElementById('json-data').innerHTML = jsonData;
    hljs.highlightElement(document.getElementById('json-data'));
    console.log(nameImageJson)
    nameImageJson.innerText = nameImage.innerText;
}

// TODO: HANDLE BUTTON_JSON(load, save)
saveJsonButton.addEventListener('click', () => {
    if (imageGarmentViewer.getAttribute('src') !== "") {
        GetListLabelsChecked();
    }
    console.log(labelsImages)
    const jsonString = JSON.stringify(labelsImages, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'labels.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
loadJsonButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.click();

    input.addEventListener('change', async () => {
        const file = input.files[0];
        const reader = new FileReader();
        const parseJsonPromise = new Promise((resolve, reject) => {
            reader.onload = () => {
                try {
                    const jsonData = JSON.parse(reader.result);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
        });

        reader.readAsText(file);

        try {
            const jsonData = await parseJsonPromise;
            labelsImages = jsonData;
            console.log("Check load json: ", jsonData)
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    });
});

function isEmpty(obj) {
    return obj === undefined || Object.keys(obj).length === 0;
}

// TODO: MAIN()
RenderLabels(LABELS, labelList, "");
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        HandleShortedListLabels()
    }, 1000)
});


// TODO: USE KEY TO CHOOSE IMAGES
function handleArrowKeyPress(event) {
    const activeLi = document.querySelector('.active-li');
    let nextLi;

    // Nếu không có phần tử nào được chọn hoặc không phải phím mũi tên lên hoặc xuống, thoát khỏi hàm
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
        return
    } else {
        event.preventDefault();
        if (!activeLi) {
            nextLi = document.querySelector('.li_image');
        }
        else if (event.key === 'ArrowUp') {
            nextLi = activeLi.previousElementSibling;
        } else if (event.key === 'ArrowDown') {
            nextLi = activeLi.nextElementSibling;
        }
    }

    const allLi = document.querySelectorAll('.li_image');
    allLi.forEach(item => {
        item.classList.remove('active-li');
    });

    nextLi.classList.add('active-li');
    nextLi.click()
}
document.addEventListener('keydown', handleArrowKeyPress);

// TODO: ZOOM IMAGES
document.addEventListener('DOMContentLoaded', function () {
    var zoomInButton = document.getElementById('zoom-in');
    var zoomOutButton = document.getElementById('zoom-out');
    var zoomAmount = 0.1; // Tăng/giảm 10% mỗi lần click
    var currentZoomCount = 0;

    zoomInButton.addEventListener('click', function () {
        if (imageGarmentViewer.getAttribute('src') === "") {
            return
        }
        if (currentZoomCount < 10) {
            zoomImage(1);
            currentZoomCount++;
        }
    });

    zoomOutButton.addEventListener('click', function () {
        if (imageGarmentViewer.getAttribute('src') === "") {
            return
        }
        if (currentZoomCount > 0) {
            zoomImage(-1);
            currentZoomCount--;
        }
    });

    function zoomImage(direction) {
        var currentWidth = imageGarmentViewer.offsetWidth;
        var originalWidth = imageGarmentViewer.naturalWidth;
        var newWidth = currentWidth + (originalWidth * zoomAmount * direction);

        var aspectRatio = originalWidth / imageGarmentViewer.naturalHeight;
        var newHeight = newWidth / aspectRatio;

        imageGarmentViewer.style.maxWidth = newWidth + 'px';
        imageGarmentViewer.style.maxHeight = newHeight + 'px';
    }
});

function simplifyJSON(jsonString) {
    const regex = /"(\w+)":\s*\[\s*([\s\S]*?)\s*\]/gs;
    jsonString = jsonString.replace(regex, (match, p1, p2) => {
        const items = p2.split('\n').map(item => item.trim()).filter(item => item.length > 0);
        return `"${p1}": [${items.join('')}]`;
    });
    return jsonString;
}