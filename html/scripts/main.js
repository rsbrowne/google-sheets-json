// Unique Key of the Google Spreadsheet we need
const spreadsheetKey = '1PPC22XwRcY7_XYDj9OgYBkdY7Jz6gmDrrdosHF6cSgA';

// Constructed URL to return JSON
const url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetKey + '/od6/public/basic?alt=json';

// Creat an empty array to return our values to
let booksList = [];

$(document).ready(function() {

  // Pass constructed url from above into jQuery getJSON function
  $.getJSON(url, function(data) {

    // Grabs correct section of the returned data to process
    var entry = data.feed.entry;

    // Processes each entry that is returned
    $(entry).each(function() {

      // Create an empty object to hold book info
      let book = {};

      // Process values and pass to book object
      book.title = this.title.$t;
      book.author = this.content.$t.split('author: ').pop().split(',')[0];
      book.link = this.content.$t.split('link: ').pop().split(',')[0];
      book.genre = this.content.$t.split('genre: ').pop();

      // Push completed book to end of the books array we created above
      booksList.push(book);
    })
  }).fail(function() {
    // Add fail notification if connection to spreadsheet does not work
    console.error('No books found, please check that correct spreadsheet is being used!');
  }).done(function() {
    // After Async call is complete - A modern way to approach this is to use async/await but w/e

    // Test that books were actually returned
    if (booksList.length) {

      $('.js-books').empty();

      $(booksList).each(function() {
        $('.js-books').append(
          `
            <div class="book">
              <h3>${this.title}</h3>
              <p>${this.author}</p>
              <div class="button">More Info</div>
            </div>
          `
        )
      });
    }
  });


});