# SECRET Browser Extension
This is the extension you will need to be able to use **SECRET** as a password manager

## Installation
### Prerequisites
 - Install **Firefox** Browser
 
1. Open Firefox and enter `about:debugging` in the url
2. Click `This Firefox` on the left hand menu
3. Click `Load Temporary Add-on...`
4. Navigate to the root of this repo
5. Double-Click on `manifest.json`


## How it All Works ##
### popup/* ### 
The popup keeps the user informed about the status of the whole operation. It can let the user know when a token has been sent successfully. It also lets the user know if there are any pending requests he has to confirm on the pi. There is also a checkbox to toggle the proxy which allows post request to be routed through our proxy.
### manifest.json ###
This is the meta file about the extesnion. It lists the information about the extension and the permissions it has.
### background.js ###
This is the bulk of the extension. The javascript is in charge of communicating with the server, generating and sending tokens, and communicating with the popup in order to inform the user of any failures.
### script.js ###
This script gets injected into the webpage, Its only purpose is to fill out the input fiels with the generated tokens.
