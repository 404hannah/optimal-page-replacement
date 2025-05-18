let string;
let frames;
let arrStr = [];
let allPageFrames = [];
let faults;

function gen(){
    string = "";

    // Generates random page-reference string
    for(let i=0; i<20; i++){
        string = string.concat(Math.floor((Math.random() * 10)));
    }

    // Displays the said string
    document.querySelector(".txt-string").innerText = string;

    // Automatically provides the solution immediately after generation
    solve();
}

function solve(){
    // Without generating a random page-reference string, the algorithm would not run.
    if (!document.querySelector(".txt-string").innerText == ""){
        arrStr = [];
        allPageFrames = [];
        faults = 0;

        // Performs the algorithm
        main();
    } else {
        // Throws error
        document.querySelector(".txt-faults").innerText = "Error: No random page-reference string";
        document.querySelector(".results").style.display = "flex";
    }
}

function main(){
    // Takes the page frames selected by the user
    frames = document.querySelector('select').value;

    // Random page-reference string is converted to an array
    arrStr = string.split("");

    let pageFrames = [];
    let farthest;

    // Adds the first column of the table by adding the first row in the 2d array
    allPageFrames.push(["Pages"]);
    for(let i=1; i<=frames; i++){
        allPageFrames[0].push("Frame " + i);
    }
    allPageFrames[0].push("Faults");

    // Each page in the string has an iteration for the page-replacement algorithm
    for(let i=0; i<arrStr.length; i++){
        
        if (pageFrames.includes(arrStr[i])){
            // If the page is in one of the frames, no page fault.
            allPageFrames.push(Array.from(pageFrames));
            allPageFrames[allPageFrames.length-1][Number(frames)] = '0';
        } else if(pageFrames.length < frames){
            // An empty frame results in a page fault.
            pageFrames.push(arrStr[i]);
            allPageFrames.push(Array.from(pageFrames));
            allPageFrames[allPageFrames.length-1][Number(frames)] = '1';
            faults += 1;
        } else {
            // An array is filled with future pages
            arrFuture = [];
            arrFuture = arrStr.slice(i, arrStr.length);

            farthest = -1;
            notInFuture = [];

            /* Finds the farthest index of the pages in the current page frames and pages not in the future */
            for(let j=0; j<frames; j++){
                let index = arrFuture.indexOf(pageFrames[j]);
                
                if (index == -1){
                    notInFuture.push(pageFrames[j]);
                } else if (index > farthest){
                    farthest = index;
                    farthestPage = arrFuture[index];
                }
            }

            if(notInFuture.length == 0){
                /* Updates the farthest page if all pages in the frames are present in the future */
                pageFrames[pageFrames.indexOf(farthestPage)] = arrStr[i];
            } else { 
                /* If multiple pages in the frames are not present in the list of future pages, FIFO is used. */
                let least = 20;
                var indexPast;
                var leastPage;

                // Finds the page that appears first in the string
                arrPast = arrStr.slice(0, i);
                notInFuture.forEach(element => {
                    indexPast = arrPast.indexOf(element);
                    if(indexPast < least){
                        least = indexPast;
                        leastPage = element;
                    }
                });

                pageFrames[pageFrames.indexOf(leastPage)] = arrStr[i];
            }
            
            // Records new pages in frames and page faults
            faults += 1;
            allPageFrames.push(Array.from(pageFrames));
            allPageFrames[allPageFrames.length-1].push('1');
        }
        
        // Records the current page before every page frames for labelling purposes
        allPageFrames[i + 1].unshift(string[i]);
    }

    // Displays page faults
    document.querySelector(".txt-faults").innerText = `Page faults: ${faults}`;

    // Generate a table for the solution
    var tableHTML = "";

    // The loop for displaying is set to fit the pages in the frames and the labels
    total = Number(frames) + 1;
    for(let i = 0; i <= total; i++){
        let cell, cellVal;
        
        for(let j = 0; j < allPageFrames.length; j++){
            // Empty frames are labelled as _
            if(!allPageFrames[j][i]){
                cellVal = '_';
            } else {
                cellVal = allPageFrames[j][i];
            }
            
            // Records the labels so that the labels can have a different style
            if(i==0 || j==0){
                // Adds styles for the cells of the pages and other labels
                cell = `
                        <div class="cell" id="cellLbl">${cellVal}</div>
                    `
            } else if (i == total){
                if(cellVal == '1'){
                    // Adds styles for the cell if there is a page fault
                    cell = `
                        <div class="cell" id="cellCheck">${cellVal}</div>
                    `
                } else {
                    // Adds styles for the cell if there is no page fault
                    cell = `
                        <div class="cell" id="cellNotCheck">${cellVal}</div>
                    `
                }
            } else {
                // An ordinary cell
                cell = `
                        <div class="cell">${cellVal}</div>
                    `
            }
            
            tableHTML += cell;
        }
    }

    // Automates the number of columns for the grid property
    var fr = "";
    for(let i = 0; i < allPageFrames.length; i++){
        fr += "1fr ";
    }
    document.querySelector(".tbl").style.gridTemplateColumns = fr;

    // 
    document.querySelector(".tbl").innerHTML = tableHTML;
    document.querySelector(".results").style.display = "flex";
}