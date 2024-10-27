/** @format */

document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector('[role="slider"]');
    const track = document.querySelector("#track");
    const fill = document.querySelector("#slider_fill");
    slider.addEventListener("mousedown", startDragging);
    track.addEventListener("click", (e) => {
        drag(e);
        fetch(`/volume?volume=${slider.ariaValueNow}`, { method: "GET" }).then((res) => {
            console.log("Request complete! response:", res);
        });
    });

    function startDragging(e) {
        e.preventDefault();
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDragging);
    }
    function drag(e) {
        const rect = track.getBoundingClientRect();
        let percentage = ((e.clientX - rect.left) / rect.width) * 100;
        percentage = Math.max(0, Math.min(percentage, 100));
        slider.style.left = slider.parentElement.style.left = `${percentage}%`;
        fill.style.right = slider.parentElement.style.right = `${100 - percentage}%`;
        if (percentage >= 97) {
            slider.parentElement.style.left = "auto";
            slider.parentElement.style.right = "-1.25rem";
        }
        slider.setAttribute("aria-valuenow", Math.round(percentage));
    }
    function stopDragging() {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDragging);
        fetch(`/volume?volume=${slider.ariaValueNow}`, { method: "GET" }).then((res) => {
            console.log("Request complete! response:", res);
        });
    }
});
document.querySelector("#update").addEventListener("click", update);
function update() {
    document.querySelector("#update").removeEventListener("click", update);
    fetch("/update", { method: "GET" })
        .then((res) => {
            document.querySelector("#update").innerHTML = "Updating...";
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
            document.querySelector("#update").innerHTML = "Failed to update :(";
        });
}

document.querySelector("#shutdown").addEventListener("click", shutdown);
function shutdown() {
    document.querySelector("#shutdown").removeEventListener("click", shutdown);
    fetch("/shutdown", { method: "GET" })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
}

document.querySelector("#upload").addEventListener("click", uploadFile);
function uploadFile() {
    const fileInput = document.querySelector("#file_input");
    const file = fileInput.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    fetch("/upload", { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));
}
