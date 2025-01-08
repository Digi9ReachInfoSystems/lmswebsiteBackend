
function login(username) {
  var currentdate = new Date();
  var datetime = " " + currentdate.getDay() + "/" + currentdate.getMonth()
    + "/" + currentdate.getFullYear() + " at "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  return `
     <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8"> 
  <meta http-equiv="x-ua-compatible" content="ie=edge"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert - Account Accessed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #e6eef4;
      font-family: Arial, sans-serif;
      color: #333333;
    }

    .container {
      width: 100%;
      background-color: #e6eef4;
      text-align: center;
      padding: 40px 20px;
    }

    .content-box {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
    }

    .logo {
      margin-bottom: 40px;
    }

    .logo img {
      max-width: 200px; 
      border-radius: 50%;
    }

    .message {
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
      text-align: left;
    }

    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #307cf4;
      color: #ffffff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0 40px 0;
    }

    .social-links {
      margin-bottom: 30px;
    }

    .social-links img {
      width: 24px;
      height: 24px;
      margin: 0 8px;
      vertical-align: middle;
    }

    .footer {
      font-size: 12px;
      color: #888888;
      line-height: 1.5;
    }

    .footer .product-name {
      font-weight: bold;
      color: #333333;
    }

    @media (max-width: 600px) {
      .content-box {
        padding: 30px 20px;
      }

      .message {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Main logo section -->
    <div class="logo">
      <!-- Replace with your main logo URL -->
      <img src="https://firebasestorage.googleapis.com/v0/b/sveccha-11c31.appspot.com/o/LOGO.png?alt=media&token=f388a952-766d-42f4-86f3-12cc9d03aedc" alt="Logo">
    </div>

    <div class="content-box">
      <p class="message">
        Hello ${username},<br><br>
        We wanted to let you know that your  The Topper Academy account was accessed on ${datetime} .<br><br>
        If this was you, no further action is required. However, if you do not recognize this activity, please secure your account immediately by changing your password.<br><br> 
      </p>
      
      <!-- Replace with your change password link -->

      <p class="message">
        For any assistance or to report suspicious activity, please contact our support team at [Support Email/Link].<br><br>
        Stay Safe,<br>
        The Topper Academy Team
      </p>
    </div>

    <div class="social-links">
      <!-- Replace these with your own social media icons and links -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
      <!-- Updated to X logo -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
    </div>

    <div class="footer">
      <p>
        © 2022 
        <span class="product-name">ProductName</span><br>
        ProductName tagline
      </p>
    </div>
  </div>
</body>
</html>

  `;
}

function loginAdmin(username) {
  var currentdate = new Date();
  var datetime = " " + currentdate.getDay() + "/" + currentdate.getMonth()
    + "/" + currentdate.getFullYear() + " at "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  return `
     <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8"> 
  <meta http-equiv="x-ua-compatible" content="ie=edge"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert - Account Accessed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #e6eef4;
      font-family: Arial, sans-serif;
      color: #333333;
    }

    .container {
      width: 100%;
      background-color: #e6eef4;
      text-align: center;
      padding: 40px 20px;
    }

    .content-box {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
    }

    .logo {
      margin-bottom: 40px;
    }

    .logo img {
      max-width: 200px; 
      border-radius: 50%;
    }

    .message {
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
      text-align: left;
    }

    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #307cf4;
      color: #ffffff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0 40px 0;
    }

    .social-links {
      margin-bottom: 30px;
    }

    .social-links img {
      width: 24px;
      height: 24px;
      margin: 0 8px;
      vertical-align: middle;
    }

    .footer {
      font-size: 12px;
      color: #888888;
      line-height: 1.5;
    }

    .footer .product-name {
      font-weight: bold;
      color: #333333;
    }

    @media (max-width: 600px) {
      .content-box {
        padding: 30px 20px;
      }

      .message {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Main logo section -->
    <div class="logo">
      <!-- Replace with your main logo URL -->
      <img src="https://firebasestorage.googleapis.com/v0/b/lmseducationplaform.appspot.com/o/logo%2Fdigi9logo.png?alt=media&token=85a991d2-0a56-43a7-b245-4f323c474adf" alt="Logo">
    </div>

    <div class="content-box">
      <p class="message">
        Hello ${username},<br><br>
        We wanted to let you know that your  The Topper Academy account was accessed on ${datetime} .<br><br>
        If this was you, no further action is required. However, if you do not recognize this activity, please secure your account immediately by changing your password.<br><br> 
      </p>
      
      <!-- Replace with your change password link -->

      <p class="message">
        For any assistance or to report suspicious activity, please contact our support team at [Support Email/Link].<br><br>
        Stay Safe,<br>
        The Digi9 Team
      </p>
    </div>

    <div class="social-links">
      <!-- Replace these with your own social media icons and links -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
      <!-- Updated to X logo -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
    </div>

    <div class="footer">
      <p>
        © 2025 
        <span class="product-name">Digi 9</span><br>
      
      </p>
    </div>
  </div>
</body>
</html>

  `;
}




function createUser(name, email, password) {
  return `
    <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8"> 
  <meta http-equiv="x-ua-compatible" content="ie=edge"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert - Account Accessed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #e6eef4;
      font-family: Arial, sans-serif;
      color: #333333;
    }

    .container {
      width: 100%;
      background-color: #e6eef4;
      text-align: center;
      padding: 40px 20px;
    }

    .content-box {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
    }

    .logo {
      margin-bottom: 40px;
    }

    .logo img {
      max-width: 200px; 
      border-radius: 50%;
    }

    .message {
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
      text-align: left;
    }

    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #307cf4;
      color: #ffffff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0 40px 0;
    }

    .social-links {
      margin-bottom: 30px;
    }

    .social-links img {
      width: 24px;
      height: 24px;
      margin: 0 8px;
      vertical-align: middle;
    }

    .footer {
      font-size: 12px;
      color: #888888;
      line-height: 1.5;
    }

    .footer .product-name {
      font-weight: bold;
      color: #333333;
    }

    @media (max-width: 600px) {
      .content-box {
        padding: 30px 20px;
      }

      .message {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Main logo section -->
    <div class="logo">
      <!-- Replace with your main logo URL -->
      <img src="https://firebasestorage.googleapis.com/v0/b/sveccha-11c31.appspot.com/o/LOGO.png?alt=media&token=f388a952-766d-42f4-86f3-12cc9d03aedc" alt="Logo">
    </div>

   <div class="content-box">
      <p class="message">
        Hello ${name},  
      </p>
      <p class="message">
        Welcome to <span class="highlight">The Topper Academy!</span> We’re thrilled to have you on board.
      </p>
      <p class="message">
        Your account has been successfully created. You can now access all the resources and courses we offer to help you excel in your studies.
      </p>
      <p class="message">
        <span class="highlight">Account Details:</span><br>
        <span class="highlight">Username:</span>${email}<br>
        <span class="highlight">Password:</span> ${password}<br>
      </p>
      <p class="message">
        If you have any questions or need assistance, feel free to reach out to our support team at [Support Email] or [Support Phone Number].
      </p>
      <p class="message">
        Thank you for choosing <span class="highlight">The Topper Academy</span>. We’re committed to helping you achieve your academic goals!
      </p>
      <p class="message">
        Best Regards,<br>
        The Topper Academy Team
      </p>
    </div>

    <div class="social-links">
      <!-- Replace these with your own social media icons and links -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
      <!-- Updated to X logo -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
    </div>

    <div class="footer">
      <p>
        © 2022 
        <span class="product-name">ProductName</span><br>
        ProductName tagline
      </p>
    </div>
  </div>
</body>
</html>

    `;
}

function approveApplication(name, microsoftPrincipleName, microsoftPassword) {
  return `
    <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8"> 
  <meta http-equiv="x-ua-compatible" content="ie=edge"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The Topper Academy!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #e6eef4;
      font-family: Arial, sans-serif;
      color: #333333;
    }

    .container {
      width: 100%;
      background-color: #e6eef4;
      text-align: center;
      padding: 40px 20px;
    }

    .content-box {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      text-align: left; /* Left-align text for readability */
    }

    .logo {
      margin-bottom: 40px;
      text-align: center;
    }

    .logo img {
      max-width: 200px; 
      border-radius: 50%;
    }

    .message {
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }

    .highlight {
      font-weight: bold;
      color: #333333;
    }

    .footer {
      font-size: 12px;
      color: #888888;
      line-height: 1.5;
      text-align: center;
      margin-top: 40px;
    }

    .footer .product-name {
      font-weight: bold;
      color: #333333;
    }

    .social-links {
      margin-bottom: 30px;
    }

    .social-links img {
      width: 24px;
      height: 24px;
      margin: 0 8px;
      vertical-align: middle;
    }

    @media (max-width: 600px) {
      .content-box {
        padding: 30px 20px;
      }

      .message {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Main logo section -->
    <div class="logo">
      <!-- Replace with your main logo URL -->
      <img src="https://firebasestorage.googleapis.com/v0/b/sveccha-11c31.appspot.com/o/LOGO.png?alt=media&token=f388a952-766d-42f4-86f3-12cc9d03aedc" alt="Logo">
    </div>

    <div class="content-box">
      <p class="message">
        Hello ${name},
      </p>
      <p class="message">
        Congratulations! We are delighted to inform you that your application to join <span class="highlight">The Topper Academy</span> as a teacher has been approved.
      </p>
      <p class="message">
        <span class="highlight">Your Account Details:</span><br>
        <span class="highlight">Name:</span> ${name}<br>
        <span class="highlight">Toppers Academy User Email:</span> ${microsoftPrincipleName}<br>
        <span class="highlight">Microsoft User Email:</span> ${microsoftPrincipleName}<br>
        <span class="highlight">Password:</span> ${microsoftPassword}<br>
      </p>
      <p class="message">
        <strong>Important Security Notice:</strong><br>
        For your security, we recommend changing your temporary password immediately after your first login. Never share your password with anyone.
      </p>
      <p class="message">
        If you have any questions or need assistance, feel free to reach out to our support team at [Support Email] or call us at [Support Phone Number].
      </p>
      <p class="message">
        Welcome aboard! We look forward to your valuable contributions to our community.
      </p>
      <p class="message">
        Best Regards,<br>
        The Topper Academy Team
      </p>
    </div>

    <div class="social-links">
      <!-- Replace '#' with your actual social media profile links -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
    </div>

    <div class="footer">
      <p>
        © 2022 
        <span class="product-name">ProductName</span><br>
        ProductName tagline
      </p>
    </div>
  </div>
</body>
</html>

    `;
}

function applicationSubmitted(name, emial) {
  return ``;
}

function batchCreated(name, subjectName) {
  return ``;
}

function meetingScheduled(name, timings) {
  return ``;
}

function quizCreated(name, subjectName) {
  return ``;
}

function responseSubmitted(studentName, quizName) {
  return ``;
}

function teacherApplicationRecievedAdmin(name, email) {
  //new teacher application recieved and send mail to admin
  return `
   <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8"> 
      <meta http-equiv="x-ua-compatible" content="ie=edge"> 
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Teacher Application Received - The Topper Academy</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #e6eef4;
          font-family: Arial, sans-serif;
          color: #333333;
        }

        .container {
          width: 100%;
          background-color: #e6eef4;
          text-align: center;
          padding: 40px 20px;
        }

        .content-box {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          text-align: left;
        }

        .logo {
          margin-bottom: 40px;
          text-align: center;
        }

        .logo img {
          max-width: 200px; 
          border-radius: 50%;
        }

        .message {
          font-size: 14px;
          color: #555555;
          line-height: 1.6;
          margin-bottom: 30px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight {
          font-weight: bold;
          color: #333333;
        }

        .footer {
          font-size: 12px;
          color: #888888;
          line-height: 1.5;
          text-align: center;
          margin-top: 40px;
        }

        .footer .product-name {
          font-weight: bold;
          color: #333333;
        }

        .social-links {
          margin-bottom: 30px;
        }

        .social-links img {
          width: 24px;
          height: 24px;
          margin: 0 8px;
          vertical-align: middle;
        }

        @media (max-width: 600px) {
          .content-box {
            padding: 30px 20px;
          }

          .message {
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Main logo section -->
        <div class="logo">
          <!-- Replace with your main logo URL -->
          <img src="https://firebasestorage.googleapis.com/v0/b/lmseducationplaform.appspot.com/o/logo%2Fdigi9logo.png?alt=media&token=85a991d2-0a56-43a7-b245-4f323c474adf" alt="Logo">
        </div>

        <div class="content-box">
          <p class="message">
            Hello Team,
          </p>
          <p class="message">
            A new teacher application has been successfully received at <span class="highlight">The Topper Academy</span>.
          </p>
          <p class="message">
            <span class="highlight">Teacher Application Details:</span><br>
            <span class="highlight">Name:</span> ${name}<br>
            <span class="highlight">Email:</span> ${email}<br>
          </p>
          <p class="message">
            Please review the application and take appropriate action. If you have any questions, feel free to reach out to us.
          </p>
          <p class="message">
            Thank you for your continuous efforts in maintaining high standards at <span class="highlight">The Topper Academy</span>!
          </p>
          <p class="message">
            Best Regards,<br>
            The Digi9 Team
          </p>
        </div>

        <div class="social-links">
          <!-- Replace '#' with your actual social media profile links -->
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
        </div>

        <div class="footer">
          <p>
            © 2025 
            <span class="product-name">Digi9</span><br>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
function teacherApplicationRecieved(name) {
  // send confirmation mail to teacher for application recieved
  return `
  <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8"> 
      <meta http-equiv="x-ua-compatible" content="ie=edge"> 
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received - The Topper Academy</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #e6eef4;
          font-family: Arial, sans-serif;
          color: #333333;
        }

        .container {
          width: 100%;
          background-color: #e6eef4;
          text-align: center;
          padding: 40px 20px;
        }

        .content-box {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          text-align: left;
        }

        .logo {
          margin-bottom: 40px;
          text-align: center;
        }

        .logo img {
          max-width: 200px; 
          border-radius: 50%;
        }

        .message {
          font-size: 14px;
          color: #555555;
          line-height: 1.6;
          margin-bottom: 30px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight {
          font-weight: bold;
          color: #333333;
        }

        .footer {
          font-size: 12px;
          color: #888888;
          line-height: 1.5;
          text-align: center;
          margin-top: 40px;
        }

        .footer .product-name {
          font-weight: bold;
          color: #333333;
        }

        .social-links {
          margin-bottom: 30px;
        }

        .social-links img {
          width: 24px;
          height: 24px;
          margin: 0 8px;
          vertical-align: middle;
        }

        @media (max-width: 600px) {
          .content-box {
            padding: 30px 20px;
          }

          .message {
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Main logo section -->
        <div class="logo">
          <!-- Replace with your main logo URL -->
          <img src="https://firebasestorage.googleapis.com/v0/b/sveccha-11c31.appspot.com/o/LOGO.png?alt=media&token=f388a952-766d-42f4-86f3-12cc9d03aedc" alt="Logo">
        </div>

        <div class="content-box">
          <p class="message">
            Hello ${name},
          </p>
          <p class="message">
            Thank you for your interest in joining <span class="highlight">The Topper Academy</span>. We are excited to inform you that we have received your application and will begin reviewing it shortly.
          </p>
          <p class="message">
            We will notify you about the status of your application once it's been reviewed. If you have any questions or need further assistance, please feel free to contact us.
          </p>
          <p class="message">
            Thank you for choosing <span class="highlight">The Topper Academy</span>. We look forward to having you on board!
          </p>
          <p class="message">
            Best Regards,<br>
            The Topper Academy Team
          </p>
        </div>

        <div class="social-links">
          <!-- Replace '#' with your actual social media profile links -->
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
        </div>

        <div class="footer">
          <p>
            © 2022 
            <span class="product-name">The Topper Academy</span><br>
            The Topper Academy tagline
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function studentSignUpAdmin(name, email) {
  //new student created to inform admin
  return `
  <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8"> 
      <meta http-equiv="x-ua-compatible" content="ie=edge"> 
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Student Signup - The Topper Academy</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #e6eef4;
          font-family: Arial, sans-serif;
          color: #333333;
        }

        .container {
          width: 100%;
          background-color: #e6eef4;
          text-align: center;
          padding: 40px 20px;
        }

        .content-box {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          text-align: left;
        }

        .logo {
          margin-bottom: 40px;
          text-align: center;
        }

        .logo img {
          max-width: 200px; 
          border-radius: 50%;
        }

        .message {
          font-size: 14px;
          color: #555555;
          line-height: 1.6;
          margin-bottom: 30px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight {
          font-weight: bold;
          color: #333333;
        }

        .footer {
          font-size: 12px;
          color: #888888;
          line-height: 1.5;
          text-align: center;
          margin-top: 40px;
        }

        .footer .product-name {
          font-weight: bold;
          color: #333333;
        }

        .social-links {
          margin-bottom: 30px;
        }

        .social-links img {
          width: 24px;
          height: 24px;
          margin: 0 8px;
          vertical-align: middle;
        }

        @media (max-width: 600px) {
          .content-box {
            padding: 30px 20px;
          }

          .message {
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Main logo section -->
        <div class="logo">
          <!-- Replace with your main logo URL -->
          <img src="https://firebasestorage.googleapis.com/v0/b/lmseducationplaform.appspot.com/o/logo%2Fdigi9logo.png?alt=media&token=85a991d2-0a56-43a7-b245-4f323c474adf" alt="Logo">
        </div>

        <div class="content-box">
          <p class="message">
            Hello Team,
          </p>
          <p class="message">
            A new student has successfully signed up to <span class="highlight">The Topper Academy</span>.
          </p>
          <p class="message">
            <span class="highlight">Student Details:</span><br>
            <span class="highlight">Name:</span> ${name}<br>
            <span class="highlight">Email:</span> ${email}<br>
          </p>
          <p class="message">
            Please review the new student's registration and take any necessary actions. If you have any questions or need further details, feel free to reach out.
          </p>
          <p class="message">
            Thank you for your continued efforts in supporting <span class="highlight">The Topper Academy</span> students!
          </p>
          <p class="message">
            Best Regards,<br>
            The Digi9 Team
          </p>
        </div>

        <div class="social-links">
          <!-- Replace '#' with your actual social media profile links -->
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
        </div>

        <div class="footer">
          <p>
            © 2025 
            <span class="product-name">Digi9</span><br>
           
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function studentPaymentRecievedAdmin(name, email, amount, payment_id,board,className,subject,typeOfBatch) {
  //new student payment recieved admin
  const currentDate = new Date();
  const dateString = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  const subjectList = subject.join(", ");
  const typeOfBatchList = typeOfBatch.join(", ");
  return `
 <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8"> 
  <meta http-equiv="x-ua-compatible" content="ie=edge"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Payment Successful - The Topper Academy</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #e6eef4;
      font-family: Arial, sans-serif;
      color: #333333;
    }

    .container {
      width: 100%;
      background-color: #e6eef4;
      text-align: center;
      padding: 40px 20px;
    }

    .content-box {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      text-align: left;
    }

    .logo {
      margin-bottom: 40px;
      text-align: center;
    }

    .logo img {
      max-width: 200px; 
      border-radius: 50%;
    }

    .message {
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }

    .highlight {
      font-weight: bold;
      color: #333333;
    }

    .footer {
      font-size: 12px;
      color: #888888;
      line-height: 1.5;
      text-align: center;
      margin-top: 40px;
    }

    .footer .product-name {
      font-weight: bold;
      color: #333333;
    }

    .social-links {
      margin-bottom: 30px;
      margin-top: 10px;
    }

    .social-links img {
      width: 24px;
      height: 24px;
      margin: 0 8px;
      vertical-align: middle;
    }

    @media (max-width: 600px) {
      .content-box {
        padding: 30px 20px;
      }

      .message {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Main logo section -->
    <div class="logo">
      <!-- Replace with your main logo URL -->
      <img src="https://firebasestorage.googleapis.com/v0/b/lmseducationplaform.appspot.com/o/logo%2Fdigi9logo.png?alt=media&token=85a991d2-0a56-43a7-b245-4f323c474adf" alt="Logo">
    </div>

    <div class="content-box">
      <p class="message">
        Hello Team,
      </p>
      <p class="message">
        A payment of <span class="highlight">₹${amount}</span> has been successfully received from the student at <span class="highlight">The Topper Academy</span> on <span class="highlight">${dateString}</span>.
      </p>
      <p class="message">
        <span class="highlight">Payment Details:</span><br>
        <span class="highlight">Payment ID:</span> ${payment_id}<br>
        <span class="highlight">Student Name:</span> ${name}<br>
        <span class="highlight">Student Email:</span> ${email}<br>
        <span class="highlight">Amount Paid:</span> ₹${amount}<br>
        <span class="highlight">Board:</span> ${board}<br>
        <span class="highlight">class :</span> ${className}<br>
        <span class="highlight">Subject :</span> ${subjectList}<br>
        <span class="highlight">Type of Batch :</span> ${typeOfBatchList}<br>
        <span class="highlight">Payment Date:</span> ${dateString}<br>
      </p>
      <p class="message">
        Please process the payment and update the student’s records accordingly. If you need further assistance or have any questions, feel free to contact us.
      </p>
      <p class="message">
        Thank you for your dedication to maintaining seamless operations at <span class="highlight">The Topper Academy</span>!
      </p>
      <p class="message">
        Best Regards,<br>
        The Digi9 Team
      </p>
    </div>

    <div class="social-links">
      <!-- Replace '#' with your actual social media profile links -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
    </div>

    <div class="footer">
      <p>
        © 2025 
        <span class="product-name">Digi9</span><br>

      </p>
    </div>
  </div>
</body>
</html>
  
  `;
}

function studentPaymentRecievedStudent(name, email, amount, payment_id,board,className,subject,typeOfBatch) {
  //new student payment recieved to student
  const currentDate = new Date();
  const dateString = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const subjectList = subject.join(", ");
const typeOfBatchList = typeOfBatch.join(", ");
  return `
   <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8"> 
      <meta http-equiv="x-ua-compatible" content="ie=edge"> 
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Transaction Successful - The Topper Academy</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #e6eef4;
          font-family: Arial, sans-serif;
          color: #333333;
        }

        .container {
          width: 100%;
          background-color: #e6eef4;
          text-align: center;
          padding: 40px 20px;
        }

        .content-box {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          text-align: left;
        }

        .logo {
          margin-bottom: 40px;
          text-align: center;
        }

        .logo img {
          max-width: 200px; 
          border-radius: 50%;
        }

        .message {
          font-size: 14px;
          color: #555555;
          line-height: 1.6;
          margin-bottom: 30px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight {
          font-weight: bold;
          color: #333333;
        }

        .footer {
          font-size: 12px;
          color: #888888;
          line-height: 1.5;
          text-align: center;
          margin-top: 40px;
        }

        .footer .product-name {
          font-weight: bold;
          color: #333333;
        }

        .social-links {
          margin-bottom: 30px;
          margin-top: 10px;
        }

        .social-links img {
          width: 24px;
          height: 24px;
          margin: 0 8px;
          vertical-align: middle;
        }

        @media (max-width: 600px) {
          .content-box {
            padding: 30px 20px;
          }

          .message {
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Main logo section -->
        <div class="logo">
          <!-- Replace with your main logo URL -->
          <img src="https://firebasestorage.googleapis.com/v0/b/sveccha-11c31.appspot.com/o/LOGO.png?alt=media&token=f388a952-766d-42f4-86f3-12cc9d03aedc" alt="Logo">
        </div>

        <div class="content-box">
          <p class="message">
            Hello ${name},
          </p>
          <p class="message">
            We're excited to inform you that your transaction of <span class="highlight">₹${amount}</span> to <span class="highlight">The Topper Academy</span> has been successfully completed on <span class="highlight">${dateString}</span>.
          </p>
          <p class="message">
            <span class="highlight">Transaction Details:</span><br>
            <span class="highlight">Payment ID:</span> ${payment_id}<br>
            <span class="highlight">Student Name:</span> ${name}<br>
            <span class="highlight">Student Email:</span> ${email}<br>
            <span class="highlight">Amount Paid:</span> ₹${amount}<br>
            <span class="highlight">Board:</span> ${board}<br>
            <span class="highlight">class :</span> ${className}<br>
            <span class="highlight">Subject :</span> ${subjectList}<br>
            <span class="highlight">Type of Batch :</span> ${typeOfBatchList}<br>
            <span class="highlight">Date:</span> ${dateString}<br>
          </p>
          <p class="message">
            If you have any questions or need assistance, feel free to reach out to our support team at [Support Email] or call us at [Support Phone Number].
          </p>
          <p class="message">
            Thank you for choosing <span class="highlight">The Topper Academy</span>. We look forward to supporting your academic journey!
          </p>
          <p class="message">
            Best Regards,<br>
            The Topper Academy Team
          </p>
        </div>

        <div class="social-links">
          <!-- Replace '#' with your actual social media profile links -->
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
        </div>

        <div class="footer">
          <p>
            © 2022 
            <span class="product-name">The Topper Academy</span><br>
            Your tagline here
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function customerQueryAdmin(name, email) {
  //new customer query admin
  return `
  <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8"> 
  <meta http-equiv="x-ua-compatible" content="ie=edge"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Customer Query - The Topper Academy</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #e6eef4;
      font-family: Arial, sans-serif;
      color: #333333;
    }

    .container {
      width: 100%;
      background-color: #e6eef4;
      text-align: center;
      padding: 40px 20px;
    }

    .content-box {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      text-align: left;
    }

    .logo {
      margin-bottom: 40px;
      text-align: center;
    }

    .logo img {
      max-width: 200px; 
      border-radius: 50%;
    }

    .message {
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }

    .highlight {
      font-weight: bold;
      color: #333333;
    }

    .footer {
      font-size: 12px;
      color: #888888;
      line-height: 1.5;
      text-align: center;
      margin-top: 40px;
    }

    .footer .product-name {
      font-weight: bold;
      color: #333333;
    }

    .social-links {
      margin-bottom: 30px;
    }

    .social-links img {
      width: 24px;
      height: 24px;
      margin: 0 8px;
      vertical-align: middle;
    }

    @media (max-width: 600px) {
      .content-box {
        padding: 30px 20px;
      }

      .message {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Main logo section -->
    <div class="logo">
      <!-- Replace with your main logo URL -->
      <img src="https://firebasestorage.googleapis.com/v0/b/lmseducationplaform.appspot.com/o/logo%2Fdigi9logo.png?alt=media&token=85a991d2-0a56-43a7-b245-4f323c474adf" alt="Logo">
    </div>

    <div class="content-box">
      <p class="message">
        Hello Team,
      </p>
      <p class="message">
        A new customer query has been successfully received at <span class="highlight">The Topper Academy</span>.
      </p>
      <p class="message">
        <span class="highlight">Query Details:</span><br>
        <span class="highlight">Title         :</span> ${name}<br>
        <span class="highlight">Customer Email:</span> ${email}<br>
      </p>
      <p class="message">
        Please review the query and respond to the customer as soon as possible. If you need any additional information, feel free to contact us.
      </p>
      <p class="message">
        Thank you for your continuous efforts in providing excellent customer support at <span class="highlight">The Topper Academy</span>.
      </p>
      <p class="message">
        Best Regards,<br>
        The Digi9 Team
      </p>
    </div>

    <div class="social-links">
      <!-- Replace '#' with your actual social media profile links -->
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
      <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
    </div>

    <div class="footer">
      <p>
        © 2025 
        <span class="product-name"> Digi9</span><br>
        
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function customerQueryCustomer(name, email) {
  //new customer query customer from TA
  return `
   <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8"> 
      <meta http-equiv="x-ua-compatible" content="ie=edge"> 
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Query Has Been Received - The Topper Academy</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #e6eef4;
          font-family: Arial, sans-serif;
          color: #333333;
        }

        .container {
          width: 100%;
          background-color: #e6eef4;
          text-align: center;
          padding: 40px 20px;
        }

        .content-box {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          text-align: left;
        }

        .logo {
          margin-bottom: 40px;
          text-align: center;
        }

        .logo img {
          max-width: 200px; 
          border-radius: 50%;
        }

        .message {
          font-size: 14px;
          color: #555555;
          line-height: 1.6;
          margin-bottom: 30px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight {
          font-weight: bold;
          color: #333333;
        }

        .footer {
          font-size: 12px;
          color: #888888;
          line-height: 1.5;
          text-align: center;
          margin-top: 40px;
        }

        .footer .product-name {
          font-weight: bold;
          color: #333333;
        }

        .social-links {
          margin-bottom: 30px;
        }

        .social-links img {
          width: 24px;
          height: 24px;
          margin: 0 8px;
          vertical-align: middle;
        }

        @media (max-width: 600px) {
          .content-box {
            padding: 30px 20px;
          }

          .message {
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Main logo section -->
        <div class="logo">
          <!-- Replace with your main logo URL -->
          <img src="https://firebasestorage.googleapis.com/v0/b/sveccha-11c31.appspot.com/o/LOGO.png?alt=media&token=f388a952-766d-42f4-86f3-12cc9d03aedc" alt="Logo">
        </div>

        <div class="content-box">
          <p class="message">
            Hello Customer,
          </p>
          <p class="message">
            Thank you for reaching out to <span class="highlight">The Topper Academy</span>. We have successfully received your query, and our support team will get back to you as soon as possible.
          </p>
          <p class="message">
            <span class="highlight">Your Query Details:</span><br>
            <span class="highlight">Title:</span> ${name}<br>
            <span class="highlight">Email:</span> ${email}<br>
          </p>
          <p class="message">
            If you need immediate assistance or have any further questions, feel free to contact us at [Support Email] or call us at [Support Phone Number].
          </p>
          <p class="message">
            Thank you for choosing <span class="highlight">The Topper Academy</span>. We look forward to assisting you!
          </p>
          <p class="message">
            Best Regards,<br>
            The Topper Academy Team
          </p>
        </div>

        <div class="social-links">
          <!-- Replace '#' with your actual social media profile links -->
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
        </div>

        <div class="footer">
          <p>
            © 2022 
            <span class="product-name">The Topper Academy</span><br>
            The Topper Academy tagline
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}


function newMeetingcreated(batchName) {
  //new meeting created from TA to student
  return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8"> 
      <meta http-equiv="x-ua-compatible" content="ie=edge"> 
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Meeting Created - The Topper Academy</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #e6eef4;
          font-family: Arial, sans-serif;
          color: #333333;
        }

        .container {
          width: 100%;
          background-color: #e6eef4;
          text-align: center;
          padding: 40px 20px;
        }

        .content-box {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          text-align: left;
        }

        .logo {
          margin-bottom: 40px;
          text-align: center;
        }

        .logo img {
          max-width: 200px; 
          border-radius: 50%;
        }

        .message {
          font-size: 14px;
          color: #555555;
          line-height: 1.6;
          margin-bottom: 30px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight {
          font-weight: bold;
          color: #333333;
        }

        .footer {
          font-size: 12px;
          color: #888888;
          line-height: 1.5;
          text-align: center;
          margin-top: 40px;
        }

        .footer .product-name {
          font-weight: bold;
          color: #333333;
        }

        .social-links {
          margin-bottom: 30px;
        }

        .social-links img {
          width: 24px;
          height: 24px;
          margin: 0 8px;
          vertical-align: middle;
        }

        @media (max-width: 600px) {
          .content-box {
            padding: 30px 20px;
          }

          .message {
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Main logo section -->
        <div class="logo">
          <!-- Replace with your main logo URL -->
          <img src="https://firebasestorage.googleapis.com/v0/b/sveccha-11c31.appspot.com/o/LOGO.png?alt=media&token=f388a952-766d-42f4-86f3-12cc9d03aedc" alt="Logo">
        </div>

        <div class="content-box">
          <p class="message">
            Hello, 
          </p>
          <p class="message">
            We're excited to inform you that a new meeting has been created for your batch <span class="highlight">${batchName}</span> at <span class="highlight">The Topper Academy</span>.
          </p>
          <p class="message">
            Please check the details in your account and attend the meeting at the scheduled time. If you have any questions or need assistance, feel free to reach out to our support team.
          </p>
          <p class="message">
            Thank you for being a part of <span class="highlight">The Topper Academy</span>! We look forward to your participation in the meeting.
          </p>
          <p class="message">
            Best Regards,<br>
            The Topper Academy Team
          </p>
        </div>

        <div class="social-links">
          <!-- Replace '#' with your actual social media profile links -->
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/x--v1.png" alt="X"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn"></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
        </div>

        <div class="footer">
          <p>
            © 2022 
            <span class="product-name">The Topper Academy</span><br>
            The Topper Academy tagline
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  login,
  createUser,
  approveApplication,
  applicationSubmitted,
  batchCreated,
  meetingScheduled,
  quizCreated,
  responseSubmitted,
  teacherApplicationRecievedAdmin,
  teacherApplicationRecieved,
  studentSignUpAdmin,
  studentPaymentRecievedAdmin,
  studentPaymentRecievedStudent,
  customerQueryAdmin,
  customerQueryCustomer,
  newMeetingcreated,
  loginAdmin,
  // Add other functions here if needed
};