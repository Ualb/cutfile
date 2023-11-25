let outputDirectory = '';

window.ipcRenderer.receive('process-replay', (arg) => {
    if (arg) {
        if (arg.status) {
            // alert
            let x = document.getElementById("snackbarResult");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
            setTimeout(function () {
                closeWindow();
            }, 4000);
            return;
        }
    }
    // error alert
    let x = document.getElementById("snackbarResultError");
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}, 'process-replay')


function process() {
    window.ipcRenderer.send("toMain",
        {
            filePath: document.getElementById('file').files[0].path,
            firstLineHeaders: document.getElementById('header-row').checked,
            cutSize: document.getElementById('cut-size').value,
            fileNamePattern: document.getElementById('pattern').value,
            folderPath: outputDirectory,
        });
}

function closeWindow() {
    window.ipcRenderer.send('closeWindow');
}


// Obtén referencias a los elementos del DOM
const menu = document.getElementById('menu');
const toggleButton = document.getElementById('toggleButton');

// Agrega un event listener al botón para mostrar/ocultar el menú
toggleButton.addEventListener('click', () => {
    menu.classList.toggle('hidden'); // Alterna la clase para mostrar/ocultar
});

// Agrega un event listener al documento para cerrar el menú si se hace clic fuera de él
document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !toggleButton.contains(event.target)) {
        menu.classList.add('hidden'); // close the menu, if click outside then
    }
});

// for the button file
function getFile(id) {
    document.getElementById(id).click();
}

function getDirectory() {
    // close menu
    toggleButton.click();

    // valid the directory
    if (document.getElementById('directory').files[0].path) {
        try {
            // saving the info
            let directoryPath = document.getElementById('directory').files[0].path;
            if (directoryPath.includes('.DS_Store')) directoryPath = directoryPath.replace('.DS_Store', '');
            outputDirectory = directoryPath;
            // alert
            let x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
            return;
        } catch (e) {
            console.log(e)
        }
    }
    // error alert
    let x = document.getElementById("snackbarError");
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

function chargeFile(obj) {
    let file = obj.value;
    let fileName = file.split("\\");
    if (fileName.length > 0)
        document.getElementById("input-btn").innerHTML = fileName[fileName.length - 1];
}


//https://uiball.com/loaders/
