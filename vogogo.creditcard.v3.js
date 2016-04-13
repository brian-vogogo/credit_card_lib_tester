var Vogogo = (function () {
    var uriDomain = 'https://api.vogogo.com';
    var merchantId = null;

    function is_dictionary(obj) {
        if (!obj) return false;
        if (obj.constructor == Array) return false;
        if (obj.constructor != Object) return false;
        return true;
    }

    function encodedCard(card) {
        var encoded = '';
        for (var key in card) {
            encoded += "&" + key + "=" + encodeURIComponent(card[key]);
        }
        return encoded;
    }

    // Construct the GET URI from card data
    function uri(card, callback) {
        var uri = uriDomain + '/v3/customers/' + card['customer_id'] + '/card_accounts/new?';
        uri += 'merchant_id=' + encodeURIComponent(merchantId);
        uri += '&callback=' + encodeURIComponent(callback.name);
        return (uri + encodedCard(card));
    }

    function send(uri) {
        var script = document.createElement('script');
        script.src = uri;
        document.querySelector('head').appendChild(script);
    }

    function getCardFromForm(form) {
        var inputs = form.querySelectorAll("input[data-vogogo-cc]");

        var card = {};
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            card[input.getAttribute('data-vogogo-cc')] = input.value;
        }

        return card;
    }

    // Set the merchant ID (required)
    function setMerchantId(id) {
        merchantId = id;
    }

    function setUriDomain(newUriDomain) {
        uriDomain = newUriDomain;
    }

    // Submit card data to Vogogo and get the card's public reference ID
    // - 'form':
    //   a) can be the HTML form annotated with 'data-vogogo-cc' as per documentation or
    //   b) JSON card data extracted manually with keys as per documentation
    // - 'callback':
    //   The callback function that will receive the response.
    //
    // E.g.
    //   setMerchantId('MERCHANT ID');
    //   getCardId(htmlForm,
    //             function callback(data) {
    //               if (data.error) {
    //                 return console.log(data.error);
    //               }
    //
    //               console.log(data.id); // Card ID
    //               console.log(data.last4); // Card number xxxxxxxxxxxx1234
    //             }
    //   )
    function getCardId(form, callback) {
        if (!merchantId) {
            throw "Merchant ID must be set";
        }

        if (!is_dictionary(form)) {
            form = getCardFromForm(form);
        }

        send(uri(form, callback));
    }

    return {
        setMerchantId: setMerchantId,
        setUriDomain: setUriDomain,
        getCardId: getCardId
    }
}());
