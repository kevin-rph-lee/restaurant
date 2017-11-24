$(() => {
   $('.burgerAdd').click(function(e){

        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#burger_quantity').val());
         console.log(quantity);
        // If is not undefined

            $('#burger_quantity').val(quantity + 1);


            // Increment

    });

     $('.burgerRemove').click(function(e){
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
         console.log(quantity);
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
         console.log(quantity);
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

    // $.post('/tweets', $form.serialize())
    //   .success(() => {
    //     loadTweets();
    //     $textArea.val('');
    //   })
    //   .error(data => alert('ERROR talking to server!  Help!'));
    // };


    // $.ajax({
    //     url: '/orders',
    //     method: 'POST',
    //     data: {},
    //     success: function () {
    //         console.log('It will take: ', )
    //     }

    //   })

});
