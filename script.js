/* =====================================
   FILE STORAGE ARRAY
===================================== */

let items = [];


/* Current filter */

let currentFilter = "all";


/* File input */

const input = document.getElementById("fileInput");


/* =====================================
   UPLOAD FILES
===================================== */

input.addEventListener("change", function (event) {

    const files = [...event.target.files];


    files.forEach(function (file) {

        let type = null;


        /* Check video */

        if (file.type.startsWith("video/")) {

            type = "video";

        }


        /* Check PDF */

        else if (
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf")
        ) {

            type = "pdf";

        }


        /* Ignore unsupported files */

        if (!type) {

            return;

        }


        /* Create temporary browser URL */

        const url = URL.createObjectURL(file);


        /* Add file to array */

        items.push({

            id: crypto.randomUUID(),

            name: file.name,

            type: type,

            size: file.size,

            url: url

        });

    });


    /* Reset input */

    input.value = "";


    /* Update page */

    render();

});



/* =====================================
   FORMAT FILE SIZE
===================================== */

function formatSize(bytes) {

    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1)
            + " KB"
        );

    }


    return (
        (bytes / 1024 / 1024).toFixed(1)
        + " MB"
    );

}



/* =====================================
   DISPLAY FILES
===================================== */

function render() {

    const grid =
        document.getElementById("grid");


    /* Apply filter */

    const shown = items.filter(function (item) {

        return (
            currentFilter === "all" ||
            item.type === currentFilter
        );

    });


    /* Clear existing cards */

    grid.innerHTML = "";


    /* No files */

    if (shown.length === 0) {

        grid.innerHTML = `
            <div class="empty">
                No files in this section.
            </div>
        `;

    }


    /* Create cards */

    shown.forEach(function (item) {

        const card =
            document.createElement("div");


        card.className = "card";


        /* Video card */

        if (item.type === "video") {

            card.innerHTML = `

                <div class="thumb">

                    <video
                        src="${item.url}"
                        muted
                        preload="metadata"
                    ></video>

                </div>


                <div class="card-body">

                    <div
                        class="title"
                        title="${escapeHtml(item.name)}"
                    >
                        ${escapeHtml(item.name)}
                    </div>


                    <div class="meta">

                        VIDEO
                        •
                        ${formatSize(item.size)}

                    </div>


                    <div class="actions">

                        <button
                            class="btn small"
                            onclick="openViewer('${item.id}')"
                        >
                            ▶ Open
                        </button>


                        <a
                            class="btn secondary small"
                            href="${item.url}"
                            download="${escapeHtml(item.name)}"
                        >
                            ⬇ Download
                        </a>


                        <button
                            class="btn secondary small"
                            onclick="removeItem('${item.id}')"
                        >
                            🗑 Delete
                        </button>

                    </div>

                </div>
            `;

        }


        /* PDF card */

        else {

            card.innerHTML = `

                <div class="thumb">

                    <div class="pdf-icon">
                        📄
                    </div>

                </div>


                <div class="card-body">

                    <div
                        class="title"
                        title="${escapeHtml(item.name)}"
                    >
                        ${escapeHtml(item.name)}
                    </div>


                    <div class="meta">

                        PDF
                        •
                        ${formatSize(item.size)}

                    </div>


                    <div class="actions">

                        <button
                            class="btn small"
                            onclick="openViewer('${item.id}')"
                        >
                            📖 Open
                        </button>


                        <a
                            class="btn secondary small"
                            href="${item.url}"
                            download="${escapeHtml(item.name)}"
                        >
                            ⬇ Download
                        </a>


                        <button
                            class="btn secondary small"
                            onclick="removeItem('${item.id}')"
                        >
                            🗑 Delete
                        </button>

                    </div>

                </div>
            `;

        }


        grid.appendChild(card);

    });


    /* Update statistics */

    updateStats();

}



/* =====================================
   ESCAPE HTML
===================================== */

function escapeHtml(text) {

    return text.replace(
        /[&<>"']/g,

        function (character) {

            return {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#039;"

            }[character];

        }
    );

}



/* =====================================
   UPDATE STATISTICS
===================================== */

function updateStats() {

    const videos =
        items.filter(
            item => item.type === "video"
        ).length;


    const pdfs =
        items.filter(
            item => item.type === "pdf"
        ).length;


    document.getElementById(
        "videoCount"
    ).textContent = videos;


    document.getElementById(
        "pdfCount"
    ).textContent = pdfs;


    document.getElementById(
        "totalCount"
    ).textContent = items.length;

}



/* =====================================
   FILTER
===================================== */

function filterItems(type, button) {

    currentFilter = type;


    /* Remove active */

    document
        .querySelectorAll(".tab")
        .forEach(function (tab) {

            tab.classList.remove("active");

        });


    /* Add active */

    button.classList.add("active");


    render();

}



/* =====================================
   OPEN VIDEO / PDF
===================================== */

function openViewer(id) {

    const item =
        items.find(
            item => item.id === id
        );


    if (!item) {

        return;

    }


    const viewer =
        document.getElementById("viewer");


    /* Video */

    if (item.type === "video") {

        viewer.innerHTML = `

            <video
                src="${item.url}"
                controls
                autoplay
            ></video>

        `;

    }


    /* PDF */

    else {

        viewer.innerHTML = `

            <iframe
                src="${item.url}#toolbar=1"
            ></iframe>

        `;

    }


    /* Show modal */

    document.getElementById(
        "modal"
    ).style.display = "flex";

}



/* =====================================
   CLOSE VIEWER
===================================== */

function closeViewer() {

    document.getElementById(
        "modal"
    ).style.display = "none";


    document.getElementById(
        "viewer"
    ).innerHTML = "";

}



/* =====================================
   DELETE ONE FILE
===================================== */

function removeItem(id) {

    const item =
        items.find(
            item => item.id === id
        );


    if (item) {

        /* Release browser memory */

        URL.revokeObjectURL(item.url);

    }


    /* Remove from array */

    items =
        items.filter(
            item => item.id !== id
        );


    render();

}



/* =====================================
   DELETE ALL FILES
===================================== */

function clearAll() {

    if (items.length === 0) {

        return;

    }


    const confirmDelete =
        confirm(
            "Delete all uploaded files from this page?"
        );


    if (!confirmDelete) {

        return;

    }


    /* Release URLs */

    items.forEach(function (item) {

        URL.revokeObjectURL(item.url);

    });


    /* Empty array */

    items = [];


    render();

}



/* =====================================
   INITIAL PAGE LOAD
===================================== */

render();
