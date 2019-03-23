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

      let filterArray = [];

      // Remove the holding text
      $('.js-books').empty();

      // Iterate through the array of books and create a "card" for each one
      $(booksList).each(function() {
        // Attach the cards to the cards container div
        $('.js-books').append(
          // This append statement uses backticks and template literals. This is a modern approach to concatinating strings
          `
            <div class="book" data-genre="${this.genre}">
              <h3>${this.title}</h3>
              <p>${this.author}</p>
              <div class="button" data-title="${this.title}">More Info</div>
            </div>
          `
        )

        filterArray.push(this.genre);
      });

      filterArray = filterArray.filter(function(item, pos) {
        return filterArray.indexOf(item) == pos;
      });

      $(filterArray).each(function () {
        $('.js-filters').append(
          `
            <div class='filter' data-genre='${this}'>${this}</div>
          `
        )
      });
    }

    // Click handler for the modal close button
    $('.js-close').on('click', function() {
      $('.js-modal-container').css('display', 'none');
    })

    // Click handler for clicking on the read more buttons on each card
    $('.button').on('click', function() {
      // Return the clicked book title
      let clickedBook = $(this).data('title');
      // Find that book in the array to get more details
      let requiredBook = booksList.find(function(element) {
        return element.title === clickedBook;
      });

      // Clear the modal to make way for new content
      $('.js-modal-content').empty()

      // Attach the new information
      $('.js-modal-content').append(
        `
          <h2>${requiredBook.title}</h2>
          <p>${requiredBook.author} - ${requiredBook.genre}</p>
          <a href="${requiredBook.link}" target="_blank">Link to book information</a>
        `
      );

      // Show the modal once the new data has been attached
      $('.js-modal-container').css('display', 'flex');
    });

    // Adds click event listener to filter buttons
    $('.filter').on('click', function() {
      // return the genre of the filter we clicked on
      let currentGenre = $(this).data('genre');

      // Check if current filter is already active
      if($(this).hasClass('active')) {

        // If it is then reset active status and show all books
        $(this).removeClass('active');
        $('.book').each(function() {
          $(this).show();
        });
      } else {
        // If it's not then iterate through filters
        $('.filter').each(function() {
          // return each filter's genre
          let filterGenre = $(this).data('genre');

          // If genres match then add active class otherwise remove active class
          if(filterGenre === currentGenre) {
            $(this).addClass('active');
          } else {
            $(this).removeClass('active');
          }
        });

        // Then iterate through each book card
        $('.book').each(function() {
          // Return the genre of the book 
          let bookGenre = $(this).data('genre');
  
          // If the genres match then show the book otherwise hide it
          if(bookGenre === currentGenre) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      }
    });
  });
});