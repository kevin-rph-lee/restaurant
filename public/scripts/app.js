$(() => {

  /**
   * Checks the current prices in the DB
   */
  function renderPrices(){
    $.ajax({
      url: '/menu_items',
      method: 'GET'
    }).done((prices) => {
      for(let i = 0; i < prices.length; i ++){
        const name = prices[i]['name'];
        if(name === 'Hamburger'){
          $('.burger-price').text("$ " + prices[i]['price'] / 100);
        }
        if(name === 'Fries'){
          $('.fries-price').text("$ " + prices[i]['price'] / 100);
        }
        if(name === 'Shakes'){
          $('.shakes-price').text("$ " + prices[i]['price'] / 100);
        }
      }
    });
  }

  //Controlling the increment buttons of the menu items
  $('.burgerAdd').click(function(e) {
    e.preventDefault();
    var quantity = parseInt($('#burger_quantity').val());
    $('#burger_quantity').val(quantity + 1);
  });

  $('.burgerRemove').click(function(e) {
    e.preventDefault();
    var quantity = parseInt($('#burger_quantity').val());
    if(quantity > 0) {
      $('#burger_quantity').val(quantity - 1);
    }
  });

  $('.friesAdd').click(function(e) {
    e.preventDefault();
    var quantity = parseInt($('#fries_quantity').val());
    $('#fries_quantity').val(quantity + 1);
  });

  $('.friesRemove').click(function(e) {
    e.preventDefault();
    var quantity = parseInt($('#fries_quantity').val());
    if(quantity > 0) {
      $('#fries_quantity').val(quantity - 1);
    }
  });

  $('.shakesAdd').click(function(e) {
    e.preventDefault();
    var quantity = parseInt($('#shakes_quantity').val());
    $('#shakes_quantity').val(quantity + 1);
  });

  $('.shakesRemove').click(function(e) {
    e.preventDefault();
    var quantity = parseInt($('#shakes_quantity').val());
    if(quantity > 0) {
      $('#shakes_quantity').val(quantity - 1);
    }
  });

  //Submitting an order, this is done via an AJAX request.
  $('.submit-order').on('click', function(event) {
    const $burgerQuantity = $('#burger_quantity').val();
    const $friesQuantity = $('#fries_quantity').val();
    const $shakesQuantity = $('#shakes_quantity').val();
    const $customerNotes = $('#customer-notes').val();

    if ($burgerQuantity === '0' && $friesQuantity === '0' && $shakesQuantity === '0') {
      alert('At least one item must be selected');
    } else {
      $.ajax({
        url: '/orders',
        method: 'POST',
        data: {
          burgers: $burgerQuantity,
          fries: $friesQuantity,
          shakes: $shakesQuantity,
          notes: $customerNotes
        }
      }).done((ID) => { });
    }
    $('#burger_quantity').val('0');
    $('#fries_quantity').val('0');
    $('#shakes_quantity').val('0');
    $('#customer-notes').val('');
    alert('Your order is successfully submitted');
  });

  //Renders prices recieved from the DB
  // renderPrices();
});




