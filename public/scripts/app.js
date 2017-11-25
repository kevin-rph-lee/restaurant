

$(() => {
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

  $('.submit-order').on('click', function(event) {
    const $burgerQuantity = $('#burger_quantity').val();
    const $friesQuantity = $('#fries_quantity').val();
    const $shakesQuantity = $('#shakes_quantity').val();

    if ($burgerQuantity == 0 && $friesQuantity == 0 && $shakesQuantity == 0) {
      alert('Cannot be 0');
    }


    $('#burger_quantity').val('0');
    $('#fries_quantity').val('0');
    $('#shakes_quantity').val('0');
  });

  function renderPrices(){
    $.ajax({
      url: '/menu_items',
      method: 'GET'
    }).done((prices) => {
      $('.burger-price').text("$ " + prices[0]['price']/100);
      $('.fries-price').text("$ " + prices[1]['price']/100);
      $('.shakes-price').text("$ " +prices[2]['price']/100);
    })
  }

  renderPrices();

});




