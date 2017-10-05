/*
 * Create a list that holds all of your cards
 */
 let card_elems = $('.card').children();
 class Card {
   constructor(card_elem) {
     this.card_elem = card_elem;
     this.open = false;
     this.match = false;
   }

   check_card() {
     this.card_elem.addClass('show');
   }
 }

 const shuffled_values = [];
 for (let i = 0; i < card_elems.length; i++) {
   shuffled_values.push(card_elems[i].className);
 }

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let open_cards = 0;
let card_obj = ''
// Shuffles card values and places them in dom in mixed order
shuffle(shuffled_values);
card_elems.each(function(index) {
  const card_elem = $(this);
  card_elem.attr('class', shuffled_values[index]);
  card_elem.parent().click(function() {
    const parent_elem = $(this);
    const child_elem = parent_elem.children();
    parent_elem.addClass('open show');

    open_cards++
    if (open_cards == 2) {
      let prev_child = card_obj.children()
      if (child_elem.attr('class') !== prev_child.attr('class')) {
        setTimeout(function() {
          parent_elem.removeClass('open show');
          card_obj.removeClass('open show');
        }, 1000);
      } else {
        parent_elem.addClass('match');
        card_obj.addClass('match');
      }
      open_cards = 0;
    } else {
      card_obj = $(this);
    }
  })
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


