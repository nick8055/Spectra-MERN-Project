* The 'node_modules' folder has been removed from all the three folders (Server, Admin and Student). When you pull this repository into your local machine, make sure to perform 'npm install' command in each and every folder using the command prompt.

* The Repository contains three folders - Admin, Student and Server. The former two are the react client apps, while the latter is the backend server (ExpressJS). All the three have .env files. Therefore, modify the env variables accordingly to deploy the app.

* When modifying or creating env variables for the React Apps, ensure to add the prefix REACT_APP_ to the name of the variable.

* Kindly change the email ID and email Password values stored in the env file of 'Server'. These credentials are used to facilitate NODEMAILER to send emails or OTPs from the Server. Ensure that the new email credentials are configured to function as NODEMAILER

* All The OTPs are generated and sent only to emails, not phone numbers. This is because the SMS function has been temporarily disabled, since it requires a 3rd party app that can send SMS to all numbers. One example 3rd party service is called TWILIO. This one requires a subscription, in order to to send SMS to any phone number. By default, you can only send SMS to the number registered in the TWILIO account.

* Excel file containing list of student details <br/>
This file will contain the list of students with their details such as Name, Reg No and kmail ID. This file is then uploaded into the Admin Portal by the Admin, and the backend server will then send a registration link to the enlisted students via their kmail IDs, which they can use to register an account in the Student Portal. Do not change the attribute names of this excel sheet, as the server looks out for those specific attribute names.

NOTE -> This App will not work in Karunya WiFi, as it doesnt allow any api routes to be processed via the AXIOS library that I used in The front end modules (Admin and Student).
