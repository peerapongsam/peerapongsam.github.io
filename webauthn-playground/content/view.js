function hide(divName) {
    var x = document.getElementById(divName);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  
  }
  
  function displayOptions() {
    var selectedOption = document.getElementsByName("webAuthnRequestTypeMenu")[0].value;
    var getOptions = document.getElementById("getOptions");
    var createOptions = document.getElementById("createOptions");
  
    if (selectedOption === "get") {
      getOptions.style.display = "block";
      createOptions.style.display = "none";
    }
    else if (selectedOption === "create") {
      getOptions.style.display = "none";
      createOptions.style.display = "block";
    }
    else {
      getOptions.style.display = "none";
      createOptions.style.display = "none";
    }
  
  }
  
  function addCredentialIdToOptions(menu, credentialId) {
    modifyMenu = document.getElementsByName(menu)[0];
  
    if (!testMultiSelect(modifyMenu.options, credentialId)) {
      wkCredentialId = credentialId.substring(0, 4) + "..." + credentialId.substring(credentialId.length - 4, credentialId.length);
      modifyMenu.options[modifyMenu.options.length] = new Option(wkCredentialId, credentialId, false, false);
      //modifyMenu.options[1] = new Option("${lastGeneratedId("+wkCredentialId+")}",credentialId, false, false);
    }
  }
  
  function decodeAttestation() {
    var cbor = require('cbor');
    const base64url = require('base64url');
    let attestationObjectBuffer = base64url.toBuffer(responseObj.response.attestationObject);
    let ctapMakeCredResp        = cbor.decodeAllSync(attestationObjectBuffer)[0];
    return ctapMakeCredResp;
  }
  
  
  function testMultiSelect(multiselect, teststring) {
  
    for (i = 0; i < multiselect.length; i++) {
      if (multiselect[i].value === teststring) {
        return true;
      }
    }
    return false;
  
  }