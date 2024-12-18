class Job {
    constructor (jobNo, title, link, posted, type, level, estimatedTime, skill, detail) {
        this.jobNo = jobNo;
        this.title = title;
        this.link = link;
        this.posted = posted;
        this.type = type;
        this.level = level;
        this.estimatedTime = estimatedTime;
        this.skill = skill;
        this.detail = detail;
    }

    getDetails() {
        return `
            <strong>Job No:</strong> ${this.jobNo}<br>
            <strong>Title:</strong> <a href="${this.link}" target="_blank">${this.title}</a><br>
            <strong>Posted:</strong> ${this.posted}<br>
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Estimated Time:</strong> ${this.estimatedTime}<br>
            <strong>Skill:</strong> ${this.skill}<br>
            <strong>Detail:</strong> ${this.detail}<br>
        `;
    }
}
let jobs = [];
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("sort-title").addEventListener("click", sortJobs);
    document.getElementById("sort-time").addEventListener("click", sortJobs);
    document.getElementById("filter-level").addEventListener("change", filterJobs);
    document.getElementById("filter-type").addEventListener("change", filterJobs);
    document.getElementById("filter-skill").addEventListener("change", filterJobs);
    document.getElementById("closePopup").addEventListener("click", closePopup);
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if(!file) {
        displayError("No file selected.");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            jobs = data.map(job => new Job(
                job["Job No"],
                job["Title"],
                job["Job Page Link"],
                job["Posted"],
                job["Type"],
                job["Level"],
                job["Estimated Time"],
                job["Skill"],
                job["Detail"]
            ));
            populateFilters();
            displayJobs(jobs);
        } catch (err) {
            alert("invalid JSON format");
        }
    };
    reader.readAsText(file);
}
document.getElementById("file-upload").addEventListener("change", handleFileUpload);

function displayError(message) {
    const errorEl = document.getElementById("upload-error");
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function displayJobs(jobList) {
    const container = document.getElementById("jobList");
    container.innerHTML = "";
    jobList.forEach((job, index) => {
        const li = document.createElement("li");
        li.textContent = job.title;
        li.setAttribute("data-index", index);
        li.addEventListener("click", showJobDetails);
        container.appendChild(li);
    });
}

function populateFilters() {
    const levels = new Set(jobs.map(job => job.level));
    const types = new Set(jobs.map(job => job.type));
    const skills = new Set(jobs.map(job => job.skill));

    populateSelect("filter-level", levels);
    populateSelect("filter-type", types);
    populateSelect("filter-skill", skills);
}
function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">All</option>';
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}
document.getElementById("filter-sort-section").addEventListener("change", filterJobs);

function filterJobs() {
    const level = document.getElementById("filter-level").value;
    const type = document.getElementById("filter-type").value;
    const skill = document.getElementById("filter-skill").value;

    const filtered = jobs.filter(job =>
    (!level || job.level === level) &&
    (!type || job.type === type) &&
    (!skill || job.skill === skill)
    );
    displayJobs(filtered);
}
document.getElementById("sort").addEventListener("change", sortJobs);

function sortJobs() {
    const sortBy = event.target.id === "sort-title" ? "title" : "posted";
    const sortedJobs = [...jobs].sort((a, b) => {
        if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        } else {
            return new Date(a.posted) - new Date(b.posted);
        }
    });
    displayJobs(sortedJobs);
}

closePopupBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    detailsPopup.style.display = 'none';
});

const jobListEl = document.getElementById("jobList");
const jobDetailsEl = document.getElementById("job-details");
const overlay = document.getElementById("overlay");
const detailsPopup = document.getElementById("details-popup");
const closePopupBtn = document.getElementById("close-popup-btn");
const filterLevel = document.getElementById("filter-level");
const filterType = document.getElementById("filter-type");
const filterSkill = document.getElementById("filter-skill");
const sortTitleBtn = document.getElementById("sort-title-btn");
const sortTimeBtn = document.getElementById("sort-time-btn");

jobListEl.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    if (index !== null) {
        jobDetailsEl.innerHTML = jobs[index].getDetails();
        overlay.style.display = 'block';
        detailsPopup.style.display = 'block';
    }
});

function showJobDetails(event) {
    const index = event.target.getAttribute("data-index");
    const job = jobs[index];
    const jobDetails = document.getElementById("jobDetails");
    jobDetails.innerHTML = job.getDetails();
    document.getElementById("overlay").style.display = 'block';
    document.getElementById("detailsPopup").style.display = 'block';
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("closePopup").addEventListener("click", closePopup);
    document.getElementById("overlay").addEventListener("click", closePopup);
});

function closePopup() {
    document.getElementById("detailsPopup").style.display = 'none';
    document.getElementById("overlay").style.display = 'none';
}

