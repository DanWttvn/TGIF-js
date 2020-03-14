let data;
let membersData;

const loader = document.getElementById("loader");

let membersTable = document.getElementById("membersTable");
let bodySection = document.getElementById("bodySection");

let url = "";
if (window.location.href == "file:///C:/Users/Daniela/OneDrive%20-%20Universidad%20Polit%C3%A9cnica%20de%20Madrid/Documentos/CODE/UBIQUM/P2/senatePage.html") {
	url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (window.location.href == "file:///C:/Users/Daniela/OneDrive%20-%20Universidad%20Polit%C3%A9cnica%20de%20Madrid/Documentos/CODE/UBIQUM/P2/housePage.html") {
	url = "https://api.propublica.org/congress/v1/113/house/members.json";
}

if (window.location.href.endsWith("senatePage.html")) {
	url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (window.location.href.endsWith("housePage.html")) {
	url = "https://api.propublica.org/congress/v1/113/house/members.json";
}

loadData();
function loadData() {
	loader.removeAttribute("hidden");
	fetch(url , {
		method: "GET",
		headers: {
			'X-API-KEY': "FqzcD73sx0q8pCMxXJo58m4TfvslZ3bEwG3FPqau"
		}
	}).then(function(response) {
		if (response.ok) {
			return response.json();
		}
	}).then(function(json) {
		
		data = json;
		membersData = data.results[0].members;
		getDataIntoTable(membersData);

		loader.setAttribute("hidden", "");
			
	}).catch(function(error) {
		console.log("Request failed: " + error.message);
	});
}

// ******************* DATA INTO TABLE *********************** 

function getDataIntoTable(array) {

	for (let i = 0; i < array.length; i++) {
		
		let fullName = "";
		if (array[i].middle_name === null) {
			fullName = array[i].first_name + " " + array[i].last_name;
		} else {
			fullName = array[i].first_name + " " + array[i].middle_name + " " + array[i].last_name; 
		}
		let party = array[i].party; 
		let state = array[i].state; 
		let seniority = array[i].seniority; 
		let percentageVotes = array[i].votes_with_party_pct + "%"; 
		let wikiURL = "";
		if (array[i].middle_name === null) {
			wikiURL = "https://en.wikipedia.org/wiki/" + array[i].first_name + "_" + array[i].last_name;
		} else {
			wikiURL = "https://en.wikipedia.org/wiki/" + array[i].first_name + "_" + array[i].middle_name + "_" + array[i].last_name; 
		}

		let newRow = document.createElement("tr");
		let td1 = document.createElement("td");
		let linkTag = document.createElement("a");

		td1.appendChild(linkTag);
		newRow.appendChild(td1);

		td1.setAttribute("class", "alignLeft memberName");
		linkTag.setAttribute("href", wikiURL);
		linkTag.innerHTML = fullName;

		let td2 = newRow.appendChild(document.createElement("td"));
		td2.innerHTML = party;
		let td3 = newRow.appendChild(document.createElement("td"));
		td3.innerHTML = state;
		let td4 = newRow.appendChild(document.createElement("td"));
		td4.innerHTML = seniority;
		let td5 = newRow.appendChild(document.createElement("td"));
		td5.innerHTML = percentageVotes;

		bodySection.appendChild(newRow);			
	}
}

// ******************* SEARCH MEMBERS *********************** 
const searchBar = document.getElementById("searchMember");
searchBar.addEventListener("keyup", function(e) {
	const term = e.target.value.toLowerCase();
	const membersList = bodySection.getElementsByTagName("tr");
	
	Array.from(membersList).forEach(function (member){
		const name =  member.firstElementChild.textContent;
		if (name.toLowerCase().indexOf(term) != -1) {
			member.style.display = "table-row";
		} else {
			member.style.display = "none";
		}
	});
});

// ******************* FILTER BY PARTY AND STATE ***********************

const filterDemocrats = document.getElementById("filterDemocrats");
const filterRepublicans = document.getElementById("filterRepublicans");
const filterIndependents = document.getElementById("filterIndependents");

//------- general FUNCTIONS --------

let filteredArrayByParty = [];
let filteredArrayByState = [];
let filteredArrayTotal = [];

function filterByPartyState() {

	filteredArrayByParty = membersData.filter(checkParty);
	filteredArrayByState = membersData.filter(checkState);
	getCommonArray(filteredArrayByParty, filteredArrayByState);

	cleanTable();
	getDataIntoTable(filteredArrayTotal);

	if (filteredArrayTotal.length === 0) {
		displayNoMembersMessage();	
	}
}

//------- part FUNCTIONS --------

function cleanTable() {	
	while (bodySection.firstChild) {
		bodySection.firstChild.remove();
	}
}

function checkParty(member) {
	if (member.party === "D" && filterDemocrats.checked) {
		filteredArrayByParty.push(member);
		return filteredArrayByParty;
	}
	if (member.party === "R" && filterRepublicans.checked) {
		filteredArrayByParty.push(member);
		return filteredArrayByParty;
	}
	if (member.party === "I" && filterIndependents.checked) {
		filteredArrayByParty.push(member);
		return filteredArrayByParty;
	}
	if (!filterDemocrats.checked && !filterRepublicans.checked && !filterIndependents.checked) {
		filteredArrayByParty = membersData;
		return filteredArrayByParty;
	}
}

function checkState(member) {
	let stateDropdown = document.getElementsByName("stateSelection")[0];
	if (stateDropdown.value == "all") {
		filteredArrayByState = membersData;
		return filteredArrayByState;
	} else {
		return member.state === stateDropdown.value;
	}
}

function getCommonArray(arrayByParty, arrayByState) {
	filteredArrayTotal = arrayByParty.filter(value => arrayByState.includes(value));
}

function displayNoMembersMessage() {
	let newRow = document.createElement("tr");
	let td1 = document.createElement("td");
	td1.setAttribute("class", "alignLeft");
	td1.innerHTML = "*No members*";

	newRow.appendChild(td1);
	bodySection.appendChild(newRow);			
}


