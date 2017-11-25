

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
    $.ajax({
      method: "POST",
      url: "/orders/",
      data: {'burgers': $('#burger_quantity').val(),
        'fries': $('#fries_quantity').val(),
        'shakes': $('#shakes_quantity').val()
      }
    });
    $('#burger_quantity').val('0');
    $('#fries_quantity').val('0');
    $('#shakes_quantity').val('0');
  });
});



