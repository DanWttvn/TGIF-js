let data;
let membersData;

let listDemocrats = [];
let listRepublicans = [];
let listIndependents = [];	

const mostTable = document.getElementById("mostTable");
const leastTable = document.getElementById("leastTable");
const glanceBody = document.getElementById("glanceBody");

const loaderRanking1 = document.getElementById("loaderRanking1");
const loaderRanking2 = document.getElementById("loaderRanking2");
const loaderGlance = document.getElementById("loaderGlance");

let attendanceType;
let loyaltyType;

let url = "";
if (window.location.href.endsWith("S_Attendance.html") || window.location.href.endsWith("S_PartyLoyalty.html")) {
	url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (window.location.href.endsWith("H_Attendance.html") || window.location.href.endsWith("H_PartyLoyalty.html")) {
	url = "https://api.propublica.org/congress/v1/113/house/members.json";
}

loadData();
function loadData() {
	loaderRanking1.removeAttribute("hidden");
	loaderRanking2.removeAttribute("hidden");
	loaderGlance.removeAttribute("hidden");
	glanceBody.setAttribute("hidden", "");
	
	// *********** DISPLAY ATTENDANCE
	if (window.location.href.endsWith("Attendance.html")) {
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

			getListByParty(membersData);
			let statics = {};
			getStatics();
			createAttendanceTables(membersData, 10);

			loaderRanking1.setAttribute("hidden", "");
			loaderRanking2.setAttribute("hidden", "");
			loaderGlance.setAttribute("hidden", "");
			glanceBody.removeAttribute("hidden");
			
		}).catch(function(error) {
			console.log("Request failed: " + error.message);
		});
	}

	// *********** DISPLAY LOYALTY
	else if (window.location.href.endsWith("PartyLoyalty.html")) {
		fetch(url, {
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

			getListByParty(membersData);
			let statics = {};
			getStatics();
			createLoyaltyTables(membersData, 10);

			loaderRanking1.setAttribute("hidden", "");
			loaderRanking2.setAttribute("hidden", "");
			loaderGlance.setAttribute("hidden", "");
			glanceBody.removeAttribute("hidden");

		}).catch(function(error) {
			console.log("Request failed: " + error.message);
		});
	}
}

// ******************** GLOBAL GLANCE ********************************

function getListByParty(array) {
	for (let i = 0; i < array.length; i++) {
		if (array[i].party === "D") {
			listDemocrats.push(array[i]);
		}
		else if (array[i].party === "R") {
			listRepublicans.push(array[i]);
		}
		else {
			listIndependents.push(array[i]);
		}
	}
}

function getVotesWithParty(array) {
	let totalSum = 0;
	for (let i = 0; i < array.length; i++) {
		totalSum += array[i].votes_with_party_pct;
	}
	return (totalSum / array.length).toFixed(1);
}

function getStatics() {
	let votesWithParty_D = getVotesWithParty(listDemocrats);
	let votesWithParty_R = getVotesWithParty(listRepublicans);
	statics = {
		"num_of_Democrats" : listDemocrats.length,
		"num_of_Republicans" : listRepublicans.length,
		"num_of_Independents" : listIndependents.length,
		"total_Reps" : membersData.length,
	
		"votes_With_D" : votesWithParty_D,
		"votes_With_R" : votesWithParty_R,
		"votes_With_I" : "-",
		"votes_With_total" : "-",
	}
	displayGlanceTable(statics);
}

function displayGlanceTable(staticsArray) {
	let D_Row = document.getElementById("D_Row");
	td1_D = D_Row.appendChild(document.createElement("td"))
	td1_D.innerHTML = staticsArray.num_of_Democrats; 
	td2_D = D_Row.appendChild(document.createElement("td"))
	td2_D.innerHTML = staticsArray.votes_With_D;

	let R_Row = document.getElementById("R_Row");
	td1_R= R_Row.appendChild(document.createElement("td"))
	td1_R.innerHTML = staticsArray.num_of_Republicans;
	td2_R = R_Row.appendChild(document.createElement("td"))
	td2_R.innerHTML = staticsArray.votes_With_R;

	let I_Row = document.getElementById("I_Row");
	td1_I= I_Row.appendChild(document.createElement("td"))
	td1_I.innerHTML = staticsArray.num_of_Independents;
	td2_I = I_Row.appendChild(document.createElement("td"))
	td2_I.innerHTML = staticsArray.votes_With_I;

	let total_Row = document.getElementById("total_Row");
	td1_total= total_Row.appendChild(document.createElement("td"))
	td1_total.innerHTML = staticsArray.total_Reps;
	td2_total = total_Row.appendChild(document.createElement("td"))
	td2_total.innerHTML = staticsArray.votes_With_total;
}

// ************************* ATTENDANCE **************************************

function createAttendanceTables(membersArray, percentage) {
	sortObjectByValue_Attendance(membersArray);

	displayDataIntoTable(membersArray, percentage, mostTable, attendanceType);

	membersArray.reverse();
	displayDataIntoTable(membersArray, percentage, leastTable, attendanceType);
}

// ------ SORT OBJ MEMBERS BY ATTENDANCE
function sortObjectByValue_Attendance(membersArray) {
	membersArray.sort((a, b) => {
		if (a.missed_votes_pct > b.missed_votes_pct) {
			return 1;
		} else {
			return -1;
		}
	});
	return membersArray;	
}

// ************************* LOYALTY *****************************************

function createLoyaltyTables(membersArray, percentage) {
	sortObjectByValue_Loyalty(membersArray);

	displayDataIntoTable(membersArray, percentage, mostTable, loyaltyType);

	membersArray.reverse();
	displayDataIntoTable(membersArray, percentage, leastTable, loyaltyType);
}

// ------ SORT OBJ MEMBERS BY Loyalty
function sortObjectByValue_Loyalty(membersArray) {
	membersArray.sort((a, b) => {
		if (a.votes_with_party_pct < b.votes_with_party_pct) { //!! HE TENIDO QUE CAMBIAR < ççççç
			return 1;
		} else {
			return -1;
		}
	});
	return membersArray;	
}

//-------- DATA INTO TABLE 
function displayDataIntoTable(membersArray, percentage, tableToDisplay, tableType) {

	for (let i = 0; i < membersArray.length*percentage/100; i++) {
		let fullName = "";
		let wikiURL = "";
		let firstStatic = "";
		let secondStatic = ""; 
		if (membersArray[i].middle_name === null) {
			fullName = membersArray[i].first_name + " " + membersArray[i].last_name;
		} else {
			fullName = membersArray[i].first_name + " " + membersArray[i].middle_name + " " + membersArray[i].last_name; 
		}
		if (membersArray[i].middle_name === null) {
			wikiURL = "https://en.wikipedia.org/wiki/" + membersArray[i].first_name + "_" + membersArray[i].last_name;
		} else {
			wikiURL = "https://en.wikipedia.org/wiki/" + membersArray[i].first_name + "_" + membersArray[i].middle_name + "_" + membersArray[i].last_name; 
		}
		
		if (tableType == attendanceType) {
			firstStatic = membersArray[i].missed_votes; //missed votes
			secondStatic = membersArray[i].missed_votes_pct; //engagement
		} else if (tableType === loyaltyType) {
			firstStatic = (membersArray[i].total_votes * membersArray[i].votes_with_party_pct / 100).toFixed(0); // votes wth party
			secondStatic = membersArray[i].votes_with_party_pct; // loyalty
		}

		let newRow = document.createElement("tr");

		let td1 = document.createElement("td");
		let linkTag = document.createElement("a");
		td1.appendChild(linkTag);
		newRow.appendChild(td1);
		td1.setAttribute("class", "alignLeft");
		linkTag.setAttribute("href", wikiURL);
		linkTag.innerHTML = fullName;
	
		let td2 = newRow.appendChild(document.createElement("td"));
		td2.innerHTML = firstStatic;
		let td3 = newRow.appendChild(document.createElement("td"));
		td3.innerHTML = secondStatic;
	
		tableToDisplay.appendChild(newRow);
	}
}
