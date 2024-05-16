
export const sortJournalByAZ =(dataToSort)=>{
  console.log(dataToSort,'dataToSort in helper fn');
    let alphabet={}
    const sortedArr = dataToSort.sort((a,b)=>{

        if(a.journalTitle.toUpperCase() < b.journalTitle.toUpperCase()) return -1
        if(a.journalTitle.toUpperCase() > b.journalTitle.toUpperCase()) return 1
        else return 0
      })
      console.log(sortedArr,'sortedArr in helper');
      sortedArr.map(journal=>{
        let letter = journal.journalTitle.charAt(0)  
      
        if(alphabet[letter] === undefined) {  
      
          alphabet = {...alphabet,[letter]:[]}
          alphabet[letter].push(journal)
      
        }
        else {
          alphabet[letter].push(journal)
        }
        
      })
      return alphabet
      
}

export const wordLimit = (journalAbstract) => {
  const string = journalAbstract
  let finalString = ''
  const tempArray = string.split(' ')
  if(tempArray.length >=60){
      tempArray.splice(60)
      finalString = tempArray.join(' ') + "..."
      return finalString
  }
  else return string
  
}

export const axiosTokenHeader =() => {
  const token = JSON.parse(localStorage.getItem('currentUser')).token
       return  `Bearer ${token}`
}

export const getDates = (dateString) => {
  const date = new Date(dateString);
  
  // Array of month names
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  
  // Get month and year
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const dates = date.getDate();
  console.log(`${month} ${year} ${dates}`);
  return `${dates} ${month} ${year}`
}

export const getPdfName = (url)=>{
  const pattern = /\/([^/]+)\.pdf$/;
const match = url.match(pattern);

if (match && match[1]) {
  // Extracted string
  return match[1];
}

}

export function calculateIssue(startYear, startMonth, currentYear, currentMonth) {
  const monthsPerIssue = 3;
  const startTotalMonths = (startYear - 1) * 12 + startMonth;
  const currentTotalMonths = (currentYear - 1) * 12 + currentMonth;
  const issue = Math.ceil((currentTotalMonths - startTotalMonths + 1) / monthsPerIssue);
  return issue;
}


export const httpRoute = 'http://localhost:3001' // backend url

// https://react-journal.onrender.com

// http://localhost:3001

//https://react-journal.onrender.com (latest)