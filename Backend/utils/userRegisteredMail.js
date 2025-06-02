// utils/userRegisteredMail.js

const userRegisteredMailStruct = (userEmail) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Service</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .content {
                font-size: 16px;
                color: #333;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #aaa;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Our Service, ${userEmail}!</h1>
            </div>
            <div class="content">
                <p>Hi ${userEmail},</p>
                <p>Thank you for registering with us. We're excited to have you onboard. Your registration details are as follows:</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                <p>Best Regards,</p>
                <p>The Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Our Service. All Rights Reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = userRegisteredMailStruct;
