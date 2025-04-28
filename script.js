let imageShowed = "";
const listImages = document.getElementById('list-images');
const btnLoadImage = document.getElementById('btn-load-image');
const loadJsonButton = document.getElementById('load-json-button');
const saveJsonButton = document.getElementById('save-json-button');
const cleanAllLabelsButton = document.getElementById('clean-all-labels-button');
const nameImage = document.getElementById('name-image');
const nameImageJson = document.getElementById('name-image-json');
const imageGarmentViewer = document.getElementById('image-garment');
let labelsImages = {}
let listGarmentImages = []
let maxWidthDefault = "100%", maxHeightDefault = "500px"
let JUST_LOAD_JSON = false
var currentZoomCount = 5;
let isUpdateJson = false;
let nameFileDefault = "localStorage.json"

window.addEventListener('beforeunload', function (e) {
    if (isUpdateJson) {
        var message = 'Bạn có chắc chắn muốn rời khỏi trang này?';
        e.preventDefault();
        e.returnValue = message;
        return message;
    }
    var message = 'Bạn có chắc chắn muốn rời khỏi trang này?';
    e.preventDefault();
    e.returnValue = message;
    return message;
});

// Tạo danh sách label
const labelList = document.getElementById('label-list');

// Cấu trúc dữ liệu label
const LABELS = {
    "texture_and_color": [
        "Solid color", "Complex but none deal breaker", "Repeating high-frequency", "Deal breaker", "See through", "Reflective", "Others",
    ],
    "top": {
        "top-neck": ["collar", "turtle", "round", "v-shape", "square", "plunging", "bustier", "hoodie", "offshoulder", "offshoulder-no-sleeve", "others",],
        "top-body": {
            "zipper/button": ["symmetry", "asymmetry", "none",],
            "length": ["chest", "belly", "normal", "long",],
            "fit": ["fit", "regular", "loose", "puff", "others",],
            "style": ["Upper wire", "lower-wire", "flowery", "cut-out", "pocket", "layer", "pin", "pin-ending", "asymmetry", "others",]
        },
        "sleeve": {
            "length": ["long", "short", "sleeveless", "others",],
            "fit": ["tight", "regular", "puff", "loose", "upper loose", "lower loose", "others",],
            "style": ["1-shoulder", "layer", "flowery", "pin", "pin ending", "band ending", "others",]
        },
        "accessories": ["bow", "ruffle", "band", "belt", "others",],
    },
    "bottom": {
        "skirt": {
            "bottom-body": {
                "zipper/button": ["symmetry", "asymmetry", "none",],
                "length": ["extra-long", "long", "knee", "mini",],
                "fit": ["tight", "regular", "puff", "loose", "upper loose", "lower loose", "others",],
                "style": ["layer", "lower-wire", "flowery", "cut-out", "pocket", "pin", "pin ending", "asymmetry", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        },
        "pant": {
            "leg": {
                "zipper/button": ["symmetry", "asymmetry", "none",],
                "length": ["extra-long", "long", "knee", "mini",],
                "fit": ["tight", "regular", "loose", "puff", "upper loose", "lower loose", "others",],
                "style": ["layer", "flowery", "pocket", "cut-out", "flare ending", "pin", "pin ending", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        },
        "panty": {
            "panty": ["panty"],
            "accessories": ["others",],
        }
    },
    "whole-body": {
        "dress/long coat": {
            "dress/long coat-neck": ["collar", "turtle", "round", "v-shape", "square", "plunging", "bustier", "offshoulder", "offshoulder-no-sleeve", "others",],
            "whole-body-body": {
                "zipper/button": ["symmetry", "asymmetry", "none",],
                "length": ["chest", "mini", "knee", "long", "extra-long", "others",],
                "fit_upper": ["fit", "regular", "loose", "puff", "others",],
                "fit_lower": ["fit", "regular", "loose", "puff", "others",],
                "style": ["Upper wire", "lower-wire", "flowery", "cut-out", "pocket", "layer", "pin", "pin-ending", "asymmetry", "others",]
            },
            "sleeve": {
                "length": ["long", "short", "sleeveless", "others",],
                "fit": ["tight", "regular", "puff", "loose", "upper loose", "lower loose", "others",],
                "style": ["1-shoulder", "cut out", "layer", "flowery", "pin", "pin ending", "band ending", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        },
        "jumpsuit": {
            "jumpsuit-neck": ["collar", "turtle", "round", "v-shape", "square", "plunging", "bustier", "hoodie", "offshoulder", "offshoulder-no-sleeve", "others",],
            "jumpsuit-body": {
                "zipper/button": ["symmetry", "asymmetry", "none",],
                "length": ["chest", "others",],
                "fit": ["fit", "regular", "loose", "puff", "others",],
                "style": ["Upper wire", "lower-wire", "flowery", "cut-out", "pocket", "layer", "pin", "pin-ending", "others",]
            },
            "sleeve": {
                "length": ["long", "short", "sleeveless", "others",],
                "fit": ["tight", "regular", "loose", "puff", "upper loose", "lower loose", "others",],
                "style": ["1-shoulder", "layer", "flowery", "pin", "pin ending", "band ending", "others",]
            },
            "leg": {
                "length": ["extra-long", "long", "short", "mini", "others",],
                "fit": ["tight", "regular", "loose", "puff", "upper loose", "lower loose", "others",],
                "style": ["layer", "flowery", "pin", "pin ending", "flare ending", "pocket", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        },
        "one-piece swimwear": {
            "swimwear-neck": ["collar", "turtle", "round", "v-shape", "square", "plunging", "bustier", "hoodie", "offshoulder", "offshoulder-no-sleeve", "others",],
            "swimwear-body": {
                "zipper/button": ["symmetry", "asymmetry", "none",],
                "length": ["chest", "others",],
                "fit": ["fit", "others",],
                "style": ["Upper wire", "lower-wire", "flowery", "cut-out", "pocket", "layer", "others",]
            },
            "sleeve": {
                "length": ["long", "short", "sleeveless", "others",],
                "style": ["1-shoulder", "others",]
            },
            "accessories": ["bow", "ruffle", "band", "belt", "others",],
        }
    },
    "set": {
        "top": ["Solid color", "Complex but none deal breaker", "Repeating high-frequency", "Deal breaker", "See through", "Reflective", "Others",],
        "bottom": ["Solid color", "Complex but none deal breaker", "Repeating high-frequency", "Deal breaker", "See through", "Reflective", "Others",]
    }
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

        const filesArray = Array.from(files);
        filesArray.sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        });
        filesArray.filter(file => {
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
    let tempChecked = labelsImages[nameImage.innerText]["labels"];

    function filterObjectByString(obj, searchString) {
        const result = {};
        for (const key in obj) {
            const value = obj[key];
            // Nếu value là array
            if (Array.isArray(value)) {
                if (value.some(item => item.toLowerCase().includes(searchString.toLowerCase()))) {
                    result[key] = value;
                }
            }
            else if (typeof value === 'object' && value !== null) {
                const filteredNested = filterObjectByString(value, searchString);
                if (Object.keys(filteredNested).length > 0) {
                    result[key] = filteredNested;
                }
            }
        }
        
        return result;
    }

    function VerifyLabels(obj1, obj2) {
        for (const key in obj1) {
            let is_obj1_array = Array.isArray(obj1[key])
            let is_obj2_array = Array.isArray(obj2[key])
            if (is_obj1_array == true && is_obj2_array == false) {
                value_obj1 = obj1[key]
                value_obj2 = obj2[key]
                for (idx in value_obj1) {
                    let tmppp = filterObjectByString(value_obj2, value_obj1[idx])
                    obj1[key] = tmppp
                }

            }
            else if (is_obj1_array == false && is_obj2_array == true){
                // Trường hợp nội dung cập nhật từ object thành array
                continue
            }
            else if (is_obj1_array == false && is_obj2_array == false) {
                VerifyLabels(obj1[key], obj2[key])
            }
        }
    }

    // TODO: VERIFY HAVE DIFF WITH LABELS
    VerifyLabels(tempChecked, LABELS)
    return tempChecked
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
    if (!JUST_LOAD_JSON) {
        labelsImages[nameImage.innerText]["labels"] = labelsChecked
        console.log(JSON.stringify(labelsChecked))
    }
    else if (!compareJson(labelsImages[nameImage.innerText]["labels"], labelsChecked)) {
        labelsImages[nameImage.innerText]["labels"] = labelsChecked
        console.log(JSON.stringify(labelsChecked))
    }
    JUST_LOAD_JSON = false
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
    isUpdateJson = true;

    imageGarmentViewer.style.maxWidth = maxWidthDefault
    imageGarmentViewer.style.maxHeight = maxHeightDefault
    currentZoomCount = 5;

    // TODO: Show json 
    const listCheckboxChecked = GetCheckedLabels();
    let jsonData = JSON.stringify(listCheckboxChecked, null, 2);
    jsonData = simplifyJSON(jsonData)
    document.getElementById('json-data').innerHTML = syntaxHighlight(jsonData);
    nameImageJson.innerText = nameImage.innerText;

    // TODO: Save autoSaveJsonToLocalStorage
    autoSaveJsonToLocalStorage()
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
    localStorage.removeItem(nameFileDefault);
});
loadJsonButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.multiple = true; // Cho phép chọn nhiều file
    input.click();

    input.addEventListener('change', async () => {
        const files = input.files;

        for (const file of files) {
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
                Object.assign(labelsImages, jsonData);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }

        // In ra object kết quả
        JUST_LOAD_JSON = true
        console.log("Merged JSON:", labelsImages);
    });
});

// TODO: HANDLE BUTTON CLEAN ALL LABELS
cleanAllLabelsButton.addEventListener('click', () => {
    ResetChecked();
    if (imageGarmentViewer.getAttribute('src') !== "") {
        GetListLabelsChecked();
    }
    HandleShortedListLabels();
    let isUpdateJson = false;
    
    // TODO: Show json 
    const listCheckboxChecked = GetCheckedLabels();
    let jsonData = JSON.stringify(listCheckboxChecked, null, 2);
    jsonData = simplifyJSON(jsonData)
    document.getElementById('json-data').innerHTML = syntaxHighlight(jsonData);
    nameImageJson.innerText = nameImage.innerText;
})

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

    document.addEventListener('keydown', function (event) {
        if (imageGarmentViewer.getAttribute('src') === "") return;
    
        if (event.key === 'ArrowLeft' && currentZoomCount < 10) {
            zoomImage(1);
            currentZoomCount++;
        } else if (event.key === 'ArrowRight' && currentZoomCount > 0) {
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
    const jsonObject = JSON.parse(jsonString);

    function flattenArrays(obj) {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                obj[key] = obj[key].join(', ');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                flattenArrays(obj[key]);
            }
        }
    }

    flattenArrays(jsonObject);
    return JSON.stringify(jsonObject, null, 2);
}

function syntaxHighlight(json) {
    if (!json) return ""; //no JSON from response

    json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            var cls = "number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";
                } else {
                    cls = "string";
                }
            } else if (/true|false/.test(match)) {
                cls = "boolean";
            } else if (/null/.test(match)) {
                cls = "null";
            }
            return '<span class="' + cls + '">' + match + "</span>";
        }
    );
}

// UNIT FUNCTION
function compareJson(obj1, obj2) {

    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 === 'object' && obj1 !== null && obj2 !== null) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (let key of keys1) {
            if (!compareJson(obj1[key], obj2[key])) return false;
        }

        return true;
    } else {
        return obj1 === obj2;
    }
}

function autoSaveJsonToLocalStorage() {
    if (imageGarmentViewer.getAttribute('src') !== "") {
        GetListLabelsChecked();
    }
    const jsonString = JSON.stringify(labelsImages, null, 2);
    localStorage.setItem(nameFileDefault, jsonString);
    console.log(`File ${nameFileDefault} đã được lưu vào localStorage.`);
}

function autoDownloadJsonFromLocalStorage(jsonFileName) {
    const jsonString = localStorage.getItem(jsonFileName);
    
    if (jsonString) {
        const jsonData = JSON.parse(jsonString);

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `labels.json`; 
        
        link.click();
        
        URL.revokeObjectURL(url);
        console.log(`File ${jsonFileName}.json đã được tải xuống tự động.`);
    } else {
        console.log(`File ${jsonFileName} không tồn tại trong localStorage.`);
    }
}
window.addEventListener('load', () => {
    autoDownloadJsonFromLocalStorage(nameFileDefault);
});

// TODO: SCROLL EACH SECTIONS
const scrollableSections = document.querySelectorAll('.scrollable');
scrollableSections.forEach(section => {
    section.addEventListener('wheel', (event) => {
        const delta = event.deltaY;
        const scrollTop = section.scrollTop;
        const scrollHeight = section.scrollHeight;
        const clientHeight = section.clientHeight;

        const isScrollableDown = delta > 0 && scrollTop + clientHeight < scrollHeight;
        const isScrollableUp = delta < 0 && scrollTop > 0;

        if (isScrollableDown || isScrollableUp) {
            event.preventDefault();
            section.scrollTop += delta;
        } else {
            event.preventDefault();
        }
    });
});


// TODO: CHANGE FONT SIZE JSON
const zoomInButton = document.getElementById('json-zoom-in');
const zoomOutButton = document.getElementById('json-zoom-out');
const jsonData = document.getElementById('json-data');

let currentFontSize = 14;

zoomInButton.addEventListener('click', () => {
    currentFontSize += 2; 
    jsonData.style.fontSize = `${currentFontSize}px`;
});

zoomOutButton.addEventListener('click', () => {
    if (currentFontSize > 8) {
        currentFontSize -= 2;
        jsonData.style.fontSize = `${currentFontSize}px`;
    }
});