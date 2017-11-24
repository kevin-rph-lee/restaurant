

$(() => {
   $('.burgerAdd').click(function(e){

        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#burger_quantity').val());
        // console.log(quantity);
        // If is not undefined

            $('#burger_quantity').val(quantity + 1);


            // Increment

    });

     $('.burgurRemove').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#burger_quantity').val());

        // If is not undefined

            // Increment
            if(quantity>0){
            $('#burger_quantity').val(quantity - 1);
            }
    });

        $('.friesAdd').click(function(e){

        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#fries_quantity').val());
         //console.log(quantity);
        // If is not undefined

            $('#fries_quantity').val(quantity + 1);


            // Increment

    });

     $('.friesRemove').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#fries_quantity').val());

        // If is not undefined

            // Increment
            if(quantity>0){
            $('#fries_quantity').val(quantity - 1);
            }
    });

        $('.shakesAdd').click(function(e){

        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#shakes_quantity').val());
         //console.log(quantity);
        // If is not undefined

            $('#shakes_quantity').val(quantity + 1);


            // Increment

    });

     $('.shakesRemove').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#shakes_quantity').val());

        // If is not undefined

            // Increment
            if(quantity>0){
            $('#shakes_quantity').val(quantity - 1);
            }
    });
   /*  $.ajax({
       url: '/orders',
       method: 'POST',
       data: $(this).serialize()
       success: function(data) {
       time: req.params.time,
       user_id: req.params.user_id,
       order_id:req.params.id
      }
*/   $('.submit-order').on('click', function(event) {
            console.log($('#burger_quantity').val());
            console.log($('#fries_quantity').val());
            console.log($('#shakes_quantity').val());
            c
        })
    /*   $.ajax({
        method: "POST",
        url: "/users/test",
        data: {'burgers': 3, shakes, phonenumber:

              }
        success: function(data) {
          console.log('ajex reuest succesful!')
}
*/
        });



