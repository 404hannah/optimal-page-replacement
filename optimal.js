let string;
let frames;
let arrStr = [];
let allPageFrames = [];
let faults;

function gen(){
    /* Initializes the string to empty so that the previous generated value/s are not retained */
    string = "";

    // Generates random page-reference string
    for(let i=0; i<20; i++){
        /* A single digit positive integer is generated and then concatenated to a string until the length of the string is 20. */
        string = string.concat(Math.floor((Math.random() * 10)));
    }

    /* For testing:
        String -> Frames -> Page Faults
        80542136150747347025 -> 3 -> 15
        49030088368660474686 -> 3 -> 9
    */
   
    string = "80542136150747347025";
    // string = "49030088368660474686";

    // Displays the said string
    document.querySelector(".txt-string").innerText = string;

    // Automatically provides the solution immediately after generation
    solve();
}

function main(){
    // Takes the page frames selected by the user
    frames = document.querySelector('select').value;

    // Random page-reference string is converted to an array
    arrStr = string.split("");

    /* Initializes an array and a variable to empty so that the previous generated value/s are not retained */
    let pageFrames = [];
    let farthest;

    // Adds the first column of the table by adding the first row in the 2d array
    allPageFrames.push(["Pages"]);
    for(let i=1; i<=frames; i++){
        allPageFrames[0].push("Frame " + i);
    }
    allPageFrames[0].push("Faults");

    // To check comment
    // Each page in the string has an iteration for the page-replacement algorithm
    for(let i=0; i<arrStr.length; i++){
        
        if (pageFrames.includes(arrStr[i])){
            /* The condition is the previous line checks if the iterated page of the string has an equivalent page in one of the frames. */

            /* If this condition is met, then the program records no changes in the pages inside the frames and page fault is not incremented. */
            allPageFrames.push(Array.from(pageFrames));
            allPageFrames[allPageFrames.length-1][Number(frames)] = '0';
        } else if(pageFrames.length < frames){
            /* If the number of page frames is less than the pages in the frames, then the current page of the iteration is added to a frame. */
            pageFrames.push(arrStr[i]);

            // Records new pages in frames and page faults
            allPageFrames.push(Array.from(pageFrames));
            allPageFrames[allPageFrames.length-1][Number(frames)] = '1';
            faults += 1;
        } else {
            /* Initializes the future pages by making a subset of the reference string array starting from the current page. */
            arrFuture = [];
            arrFuture = arrStr.slice(i, arrStr.length);

            // Sets the farthest to -1 so it will always be overwritten
            farthest = -1;

            /* An array for holding one or more pages that is not included in the array of future pages */
            notInFuture = [];

            // Finds the index of each page in the current page frames.
            for(let j=0; j<frames; j++){
                let index = arrFuture.indexOf(pageFrames[j]);
                
                /* Finds the farthest index of the pages in the current page frames and stores pages of frames that will not appear later */
                if (index == -1){
                    notInFuture.push(pageFrames[j]);
                } else if (index > farthest){
                    farthest = index;
                    farthestPage = arrFuture[index];
                }
            }

            /* Frames with pages that will not appear in the future have higher precedence over the frame with the page farthest in the future */
            if(notInFuture.length == 0){
                // Updates the page frames
                pageFrames[pageFrames.indexOf(farthestPage)] = arrStr[i];
            } else { 
                /* If multiple pages in the frames are not present in the list of future pages, FIFO is used. */
                let least = 20;
                var indexPast;
                var leastPage;

                /* Like the array for future pages but from the first element to the element before the current page */
                arrPast = arrStr.slice(0, i);
                notInFuture.forEach(element => {
                    // Finds the page that appears first in the string
                    indexPast = arrPast.indexOf(element);
                    if(indexPast < least){
                        least = indexPast;
                        leastPage = element;
                    }
                });

                // Finalizes and records the earliest page
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

function solve(){
    // Without generated random page-reference string, the algorithm would not run.
    if (!document.querySelector(".txt-string").innerText == ""){
        arrStr = [];
        allPageFrames = [];
        faults = 0;

        // Performs the algorithm
        main();
    } else {
        document.querySelector(".txt-faults").innerText = "Error: No random page-reference string";
        document.querySelector(".results").style.display = "flex";
    }
}