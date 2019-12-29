Project I: Five different flaws

LINK: https://github.com/rovaniemi/cybersecuritybase-project

FLAW 1: A5 – Broken Access Control https://www.owasp.org/index.php/Top_10-2017_A5-Broken_Access_Control

Description: In the application, a signed-in user can create items and delete items they have created. Users should not be able to delete items made by other users or update them. Furthermore, due to missing access control, an attacker can remove or update via API any item without being the owner of that item. The attacker only has to make a GET OR DELETE request to /items/{id} where {id} is the ID of the item with some auth token. The attacker can find item id:s with a GET request to /items/.

How to fix: There must be check-in /items/{id} route controller, where the access control should first check whether the user is signed-in and then if that user is the creator of that item. Only if a signed-in user is the creator of that item should we delete it. There should be some test in the application which detects flaws like this.

FLAW 2: A3 – Sensitive Data Exposure https://www.owasp.org/index.php/Top_10-2017_A3-Sensitive_Data_Exposure

Description: The application does not use encrypted passwords, which makes it possible for an attacker to get every user password if he/she can somehow connect to the server or the database. There are multiple vulnerabilities in that version of mongoose (version 4.11.5 ), so it probably would not even be hard / impossible for an attacker to access a part of the database.

How to fix: The application should use some encryption when saving the passwords. Bcrypt is the most common one in the javascript scene. Bcrypt uses a hashing algorithm that is a one-way function. After this, the application should save the hashed password to the database and then use the hash to identify the correct password. When an application uses encrypted passwords, the attacker gets only the hashed passwords if he / she can access the server or database. Passwords should always be encrypted nowadays.

FLAW 3: A2 – Broken Authentication https://www.owasp.org/index.php/Top_10-2017_A2-Broken_Authentication

Description: User can sign up in the application with a password and an email address. The app does not demand any requirements for the password or the email address. Also, there are no rate limits in the sign-in path, which makes it easy for an attacker to attempt a brute-force attack.

How to fix: First there must be some requirements for the password, at least length. The password length should be at least eight characters, preferably more. There is also an API called haveibeenpwned. There, an application could check whether the password in question is leaked before. Using this type of API is also a security risk because then the API administrator will get every password and can try to figure out the correct password - email pairs. Also, we should check the email address. The only proper way to check whether the email is correct one is to send an email to it. We can not do that in the frontend regex or some other hax way.

The second fix is that the app should have rate limitations on the sign-in form and add captcha to the sign-in form. Then the attacker can only try a couple of different email password pairs.

The best option is to use two-factor authentication. OWASP recommends that too. My opinion is that the combination of a secure password, rate limits, a captcha and two-factor authentication is the best idea.

FLAW 4: A9 – Using Components with Known Vulnerabilities https://www.owasp.org/index.php/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities

Description: Application uses multiple libraries. These libraries have numerous vulnerabilities. In the Javascript world, we use the Node Package Manager, which has its own audit tool like Maven Dependency Check plugin in Java. NPM audit detects 840 vulnerabilities (307 low, 37 moderate, 495 high and one critical) when checking the application. Example vulnerability https://www.npmjs.com/advisories/146. The growl package does not sanitize the input before passing it to exec.

How to fix: Administrator / developer should update packages with npm audit command. Also, the developer has to do some refactoring. Multiple libraries syntax has changed in the newer versions. Example mongoose does not use some commands which the code uses now. Summarizing: packages should be updated.

FLAW 5: A10 – Insufficient Logging https://www.owasp.org/index.php/Top_10-2017_A10-Insufficient_Logging%26Monitoring

Description: If the user does something "wrong" the server response contain logging information. Example if the user goes to the wrong route, he / she will get data of the current server state. The response can provide unwanted data which helps the attacker to figure out more significant leaks.

How to fix: There should be standard response handler / middleware which formulates a response to contain only the desired data. The middleware can return different data when the developer run application in the development environment. In the production environment, we should always provide as little data as possible.
