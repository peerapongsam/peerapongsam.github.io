var currentHostName

function buildGetRequest() {

    var webAuthnRequestType = document.getElementsByName("webAuthnRequestTypeMenu")[0].value;
    var doGenerateChallenge = document.getElementsByName("doGenerateRandomChallengeGetMenu")[0].value;
    var relyingPartyId = document.getElementsByName("rpIdGetMenu")[0].value;
    var userVerification = document.getElementsByName("userVerificationGetMenu")[0].value;
    var timeout = document.getElementsByName("timeoutGetMenu")[0].value;
    var allowCredentialsTransports = document.getElementsByName("allowCredentialsTransportsGetMenu")[0];
    var allowCredentialsId = document.getElementsByName("allowCredentialsIdGetMenu")[0];

    if (doGenerateChallenge.valueOf() == "true") {
        //This is probably not crypotgraphically secure but just for demo purposes.  
        theChallenge = btoa(Math.random()).substr(0, 21) + btoa(Math.random()).substr(0, 21)
    } else {
        //Just use a recognizable static string
        theChallenge = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
    requestBuilder = {
        challenge: theChallenge,
        rpId: relyingPartyId,
    }

    if (userVerification.valueOf() != "null") {
        requestBuilder.userVerification = userVerification;
    }
    
    requestBuilder.timeout = parseInt(timeout);

    var transports = null;
    //Process through the list of credential ids if "null" is NOT also selected
    if (!testMultiSelect(allowCredentialsId.selectedOptions, "null")) {

        //Create an empty array for allowCredentials transports
        if (!testMultiSelect(allowCredentialsTransports.selectedOptions, "null")) {
            transports = [];
            //Build a list of transports that we'll just apply to each credentialId so we don't make the options too confusing
            for (i = 0; i < allowCredentialsTransports.selectedOptions.length; i++) {
                transports.push(allowCredentialsTransports.selectedOptions[i].value)
            }
        }

        requestBuilder.allowCredentials = []
        for (i = 0; i < allowCredentialsId.selectedOptions.length; i++) {
            requestBuilder.allowCredentials[i] = {}
            requestBuilder.allowCredentials[i].type = 'public-key'
            requestBuilder.allowCredentials[i].id = allowCredentialsId.selectedOptions[i].value;
            if (transports) {
                requestBuilder.allowCredentials[i].transports = transports
            }
        }
    }

    //Encode the request and put it in the query param.
    updatedUrl = buildURL(requestBuilder, "get")
    resetURL(updatedUrl)

    //Pretty print it and put it in the text area. 
    document.getElementById("getBuilderArea").value = JSON.stringify(requestBuilder, null, 2)
}

function buildCreateRequest() {

    var webAuthnRequestType = document.getElementsByName("webAuthnRequestTypeMenu")[0].value;
    var doGenerateChallenge = document.getElementsByName("doGenerateRandomChallengeCreateMenu")[0].value;
    var relyingPartyId = document.getElementsByName("rpIdCreateMenu")[0].value;
    var userVerification = document.getElementsByName("userVerificationCreateMenu")[0].value;
    var authenticatorAttachment = document.getElementsByName("authenticatorAttachmentCreateMenu")[0].value;
    var requireResidentKey = document.getElementsByName("requireResidentKeyCreateMenu")[0].value;
    var timeout = document.getElementsByName("timeoutCreateMenu")[0].value;
    var algorithm = document.getElementsByName("algorithmCreateMenu")[0].value;
    var attestation = document.getElementsByName("attestationCreateMenu")[0].value;
    var excludeCredentialsId = document.getElementsByName("excludeCredentialsIdCreateMenu")[0];
    var excludeCredentialsTransports = document.getElementsByName("excludeCredentialsTransportsCreateMenu")[0];

    var userId = document.getElementsByName("userIdCreateMenu")[0].value;
    var userName = document.getElementsByName("userNameCreateMenu")[0].value;
    var userDisplayName = document.getElementsByName("userDisplayNameCreateMenu")[0].value;

    if (doGenerateChallenge.valueOf() == "true") {
        theChallenge = btoa(Math.random()).substr(0, 21) + btoa(Math.random()).substr(0, 21)
    } else {
        //Just use a recognizable static string
        theChallenge = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }

    requestBuilder = {
        challenge: theChallenge,
        rp: {
            id: relyingPartyId,
            name: relyingPartyId
        }
    }

    if (userVerification.valueOf() != "null") {
        requestBuilder.authenticatorSelection = {}
        requestBuilder.authenticatorSelection.userVerification = userVerification;
    }

    if (authenticatorAttachment.valueOf() != "null") {
        if (!requestBuilder.authenticatorSelection) {
            requestBuilder.authenticatorSelection = {}
        }
        requestBuilder.authenticatorSelection.authenticatorAttachment = authenticatorAttachment;
    }


    if (requireResidentKey.valueOf() != "null") {
        if (!requestBuilder.authenticatorSelection) {
            requestBuilder.authenticatorSelection = {}
        }
        requestBuilder.authenticatorSelection.requireResidentKey = JSON.parse(requireResidentKey);
    }

    
    requestBuilder.timeout = parseInt(timeout);
    

    if (attestation.valueOf() != "null") {
        requestBuilder.attestation = attestation;
    }
    requestBuilder.pubKeyCredParams = [];
    requestBuilder.pubKeyCredParams[0] = {}
    requestBuilder.pubKeyCredParams[0].type = "public-key";
    requestBuilder.pubKeyCredParams[0].alg = parseInt(algorithm);

    requestBuilder.user = {}
    requestBuilder.user.id = userId;
    requestBuilder.user.name = userName;
    requestBuilder.user.displayName = userDisplayName;
    var transports = null

    //Process through the list of credential ids if "null" is NOT also selected
    if (!testMultiSelect(excludeCredentialsId.selectedOptions, "null")) {

        //Create an empty array for excludeCredentials transports
        if (!testMultiSelect(excludeCredentialsTransports.selectedOptions, "null")) {
            transports = [];
            //Build a list of transports that we'll just apply to each credentialId so we don't make the options too confusing
            for (i = 0; i < excludeCredentialsTransports.selectedOptions.length; i++) {
                transports.push(excludeCredentialsTransports.selectedOptions[i].value)
            }
        }

        requestBuilder.excludeCredentials = []
        for (i = 0; i < excludeCredentialsId.selectedOptions.length; i++) {
            requestBuilder.excludeCredentials[i] = {}
            requestBuilder.excludeCredentials[i].type = 'public-key'
            requestBuilder.excludeCredentials[i].id = excludeCredentialsId.selectedOptions[i].value;
            if (transports) {
                requestBuilder.excludeCredentials[i].transports = transports
            }
        }
    }

    //Encode the request and set the query param in the url.
    updatedUrl = buildURL(requestBuilder, "create")
    resetURL(updatedUrl)

    //Also pretty print the request and display it in the text area.
    document.getElementById("createBuilderArea").value = JSON.stringify(requestBuilder, null, 2)

}


function setFromQueryParams() {
    var url_string = window.location.href
    var url = new URL(url_string);
    requestTypeParam = url.searchParams.get("requestType");
    webauthnRequestP = url.searchParams.get("webauthnRequest");
    submitRequestParam = url.searchParams.get("submitRequest");
    currentHostName = window.location.hostname
    setInitialValues();
}

function setInitialValues() {
    //Override the rpid to wherever the site is hosted.
    document.getElementsByName("rpIdGetMenu")[0].value = currentHostName;
    document.getElementsByName("rpIdCreateMenu")[0].value = currentHostName;

    if (requestTypeParam == "get") {
        hide("getOptions")
        decodedwebauthnRequest = atob(webauthnRequestP);
        document.getElementById("getBuilderArea").value = JSON.stringify(JSON.parse(decodedwebauthnRequest), null, 2)
        document.getElementsByName("webAuthnRequestTypeMenu")[0].value = "get"
    } else if (requestTypeParam == "create") {
        hide("createOptions")
        decodedwebauthnRequest = atob(webauthnRequestP);
        document.getElementById("createBuilderArea").value = JSON.stringify(JSON.parse(decodedwebauthnRequest), null, 2)
        document.getElementsByName("webAuthnRequestTypeMenu")[0].value = "create"
    } else {
        //don't do anything with the input params
    }

    if (submitRequestParam === "true")
    {
        if (requestTypeParam === "get") {
            authenticate();
        } else if (requestTypeParam === "create") {
            register();
        } else {
            //don't do anything with the input params
        }
    }

}

function replaceMarkers(request) {
    //request = JSON.parse(request);
    var builtRequest = JSON.parse(request);    
    if (builtRequest.allowCredentials &&
      builtRequest.allowCredentials[0] &&
      builtRequest.allowCredentials[0].id === "${lastGeneratedId}") {
      builtRequest.allowCredentials[0].id = localStorage.getItem('registeredCredentialId');
    }
  
    if (builtRequest.excludeCredentials &&
      builtRequest.excludeCredentials[0] &&
      builtRequest.excludeCredentials[0].id === "${lastGeneratedId}") {
      builtRequest.excludeCredentials[0].id = localStorage.getItem('registeredCredentialId');
    }
  
    var origin = location.origin.split('://')[1];
    if (origin.includes(':')) {
      origin = origin.split(':')[0]
    }
    console.log(origin);
    if (builtRequest.rp && builtRequest.rp.id === "${origin}") {
  
      builtRequest.rp.id = origin
    }
  
    if (builtRequest.rp && builtRequest.rp.name === "${origin}") {
      builtRequest.rp.name = "f2bsr-" + origin
    }
  
    if (builtRequest.rpId === "${origin}") {
      builtRequest.rpId = origin
    }
  
    return builtRequest;
  }

function resetURL(url) {
    window.history.replaceState({}, "", url.toString());
}


function buildURL(requestJSON, requestType) {
    encodedRequestP = btoa(JSON.stringify(requestJSON))
    var url_string = window.location.href
    var url = new URL(url_string);
    url.searchParams.set("requestType", requestType);
    url.searchParams.set("webauthnRequest", encodedRequestP);
    return url;
}