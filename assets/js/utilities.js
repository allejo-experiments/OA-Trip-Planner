function removeFluff (array) {
    if (!Array.isArray(array)) {
        return;
    }

    for (var i = 0; i < array.length ; i++) {
        array[i] = array[i].replace("•", "").trim();
    }
}

function handleCurrency (string) {
    if (string.toLowerCase() === "free") {
        return "Free";
    }
    else if (string.charAt(0) !== "$") {
        return "$" + string;
    }

    return string;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}