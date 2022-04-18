### github oauth2


Work flow: There is a parallel icon besides the existing google login
bottom. When a user click that, it will redirect to a callback handler
and jump to the github authorization page. When uses input their account
and password for github, our backend can get the user's github username and
id.(Anything we want, including repo, profile) but we only need the username.
We store this unique id(combine with username and id) and send this to the 
frontend. The username should be displayed on the screen, such as "Hello, username"
and serve for identification of further circuit storage.

PS: You need to create an oauth2 app in github/develop setting. Homepage should be 
"https://www.opencircuits.io" and callback should be http://www.opencircuits.io/api/login/github/callback
In local test, you can use localhost:3000. Remember to replace the clientid and clientserect in the code.
ClientID and ClientSecret should be stored in environment variable.

Improvement, for now, I can only move to the github authorization page with in the window,
which means it will remove all the work of the user when he or she is in the 
"not-login-status". It is good to create a popup, and in the popup, redirect to the github page,
after we get the user info we want, close the popup and return the info to the front end.

This oauth2 extension is half-done, but I will graduate soon. For anyone who wants to get it down, if you need
background info, you can contact me by the email address on my profile. Thanks.