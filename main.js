var config = {
    url: 'https://api.parse.com/1/functions/send_mail',
    toEmail: 'info@implantscr.com',
    domain: 'implantscr.com'
}


var FlashMessenger = function () {
    var flashMessage = $("#flashMessage");
    var successColor = '#B5FFC8';
    var errorColor = '#FFBBBB';
    return {
        setSuccessMessage: function (message) {
            flashMessage.html(message);
            flashMessage.css('background-color', successColor);
        },
        setErrorMessage: function (message) {
            flashMessage.html(message);
            flashMessage.css('background-color', errorColor);
        },
        resetMessage: function () {
            flashMessage.html("");
            flashMessage.css('background', 'none');
        }
    }
}

var ContactForm = function () {
    var flashMessenger = FlashMessenger();
    var sendButton = $('#sendButton');
    sendButton.css("cursor", "pointer");
    var name = $('#name');
    var email = $('#email');
    var phone = $('#phone');
    var message = $('#message');
    var nameInvalid = false;
    var emailInvalid = false;


    function setFormInProgress() {
        sendButton.html("Enviando...");
        name.prop('disabled', true);
        email.prop('disabled', true);
        phone.prop('disabled', true);
        message.prop('disabled', true);
    }

    function unsetFormInProgress() {
        sendButton.html("Enviar");
        name.prop('disabled', false);
        email.prop('disabled', false);
        phone.prop('disabled', false);
        message.prop('disabled', false);
    }

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    var validate = function () {
        if (name.val().trim() === "") {
            flashMessenger.setErrorMessage("Por favor ingrese un nombre.")
            return false;
        }

        if (email.val().trim() === "" || !validateEmail(email.val())) {
            flashMessenger.setErrorMessage("Por favor ingrese un email válido.")
            return false
        }
        return true;
    }

    var resetForm = function () {
        name.val("");
        email.val("");
        phone.val("");
        message.val("");
        unsetFormInProgress();
    }

    return {
        sendEmail: function () {
            flashMessenger.resetMessage();
            var isFormValid = validate();
            if (isFormValid) {
                setFormInProgress()


                var payload = {};
                payload.subject = 'Mensaje recibido desde formulario de ' + config.domain;
                payload.from = email.val();
                payload.to = config.toEmail;
                payload.name = name.val() || "";
                payload.phone = phone.val() || "";
                payload.message = message.val() || "";
                $.ajax
                ({
                    type: "POST",
                    url: config.url,
                    dataType: 'json',
                    async: true,
                    data: JSON.stringify(payload),
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-Parse-Application-Id', 'Vh0nyB6ljbmxGk7vsI2wu3QaQqNlpGdGxAQ0camv');
                        xhr.setRequestHeader('X-Parse-REST-API-Key', 'bv9RgZVrewHZdDLTrNLl3TOXJpUhohXVHy56on2Z');
                        xhr.setRequestHeader('Content-Type', 'application/json');
                    },
                    success: function () {
                        flashMessenger.setSuccessMessage("Mensaje enviado exitosamente. Pronto estaremos en contacto con usted.")
                    },
                    error: function () {
                        flashMessenger.setErrorMessage("Algo salió mal. Por favor escríbanos a "+config.toEmail)
                    },
                    complete: function () {
                        resetForm();
                    }
                });
            }
        }
    }
}