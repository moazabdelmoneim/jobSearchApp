export const verifyAccountTempl = (code) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <style>
      body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    
    .otp-box {
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      text-align: center;
      max-width: 300px;
      width: 100%;
    }
    
    .title {
      color: #333333;
      font-size: 24px;
      margin-bottom: 1.5rem;
    }
    
    .otp-text {
      color: #666666;
      font-size: 18px;
      margin: 0;
    }
    
    .otp {
      font-weight: bold;
      color: #007bff;
      font-size: 20px;
    }
      </style>
    </head>
    <body>
      <div class="otp-box">
        <h2 class="title">OTP Verification</h2>
        <p class="otp-text">Your OTP is: <span class="otp">${code}</span></p>
      </div>
    </body>
    </html>`;
};

export const notifiactionTemp = ({ companyName, status, jobTitle, name }) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 15px;
            font-size: 20px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">🔔 Notification Alert</div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>You have a new notification from ${companyName}</p>
            <p>your applictation for ${jobTitle} has been ${status}</p>
            <a href="{{action_link}}" class="button">View Details</a>
        </div>
        <div class="footer">
            <p>If you didn’t request this, you can ignore this email.</p>
            <p>© 2025 YourCompany. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};
