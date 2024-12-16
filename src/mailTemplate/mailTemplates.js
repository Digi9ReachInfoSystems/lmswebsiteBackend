
export function login(username) {
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

export function createUser(name, email, password) {
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

export function approveApplication(name, microsoftId, microsoftPrincipleName, microsoftPassword) {
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
        <span class="highlight">Microsoft ID:</span> ${microsoftId}<br>
        <span class="highlight">Microsoft Principal Name:</span> ${microsoftPrincipleName}<br>
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

export function applicationSubmitted(name) {
    return ``;
}

export function batchCreated(name, subjectName) {
    return ``;
}

export function meetingScheduled(name, timings) {
    return ``;
}

export function quizCreated(name, subjectName) {
    return ``;
}

export function responseSubmitted(studentName, quizName) {
    return ``;
}
