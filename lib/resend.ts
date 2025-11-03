import { Resend } from "resend";
export async function sendResetEmail(email: string, link: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "RESEND_API_KEY not set. Skipping sending email. Reset link:",
      link
    );
    return;
  }

  const emailBg = "#101010";         
  const emailCardBg = "#1A1A1A";     
  const emailText = "#E2E8F0";        
  const emailMutedText = "#94A3B8";  
  const emailPrimaryAccent = "#58A6FF"; 
  const emailError = "#EF4444";       
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Canopy <onboarding@resend.dev>", 
      to: email,
      subject: "Reset your Canopy password", 
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Canopy Password Reset</title>
            <style>
                /* Base styles for a dark mode email */
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: ${emailBg};
                    margin: 0;
                    padding: 0;
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                    color: ${emailText};
                }
                table {
                    border-collapse: collapse;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    width: 100%;
                }
                td {
                    padding: 0;
                }
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                }
                a {
                    text-decoration: none;
                    color: ${emailPrimaryAccent}; /* Blue accent for links */
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: ${emailCardBg}; /* Card-like background */
                    border-radius: 12px; /* Rounded corners like your form */
                    overflow: hidden;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); /* Darker, subtle shadow */
                    border: 1px solid rgba(255, 255, 255, 0.08); /* Faint border like your form */
                }
                .header {
                    background-color: ${emailCardBg}; /* Header background same as card for continuity */
                    padding: 25px 20px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* Subtle separator */
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                    line-height: 1.2;
                    color: ${emailText}; /* App name in light text */
                }
                .content-area {
                    padding: 30px 25px;
                    line-height: 1.6;
                    color: ${emailText};
                }
                .button {
                    display: inline-block;
                    background-color: ${emailPrimaryAccent}; /* Blue accent for button */
                    color: ${emailBg}; /* Dark text on light button */
                    padding: 12px 25px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 20px;
                    font-size: 16px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Button shadow */
                }
                .footer {
                    background-color: ${emailCardBg}; /* Footer background same as card */
                    padding: 20px 25px;
                    text-align: center;
                    font-size: 12px;
                    color: ${emailMutedText}; /* Muted text for footer */
                    border-top: 1px solid rgba(255, 255, 255, 0.05); /* Subtle separator */
                }
                .footer a {
                    color: ${emailMutedText};
                }
                .warning {
                    font-size: 12px;
                    color: ${emailError}; /* Error red */
                    margin-top: 20px;
                    text-align: center;
                }

                /* Responsive styles */
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100% !important;
                        margin: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                    }
                    .content-area {
                        padding: 20px 15px !important;
                    }
                    .header h1 {
                        font-size: 24px !important;
                    }
                    .button {
                        width: 100%;
                        text-align: center;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table class="header" role="presentation">
                    <tr>
                        <td style="text-align: center; padding: 25px 20px;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: bold; line-height: 1.2; color: ${emailText};">Canopy</h1>
                            </td>
                    </tr>
                </table>

                <table class="content-area" role="presentation">
                    <tr>
                        <td style="padding: 30px 25px;">
                            <p style="margin-top: 0; margin-bottom: 15px; font-size: 16px;">Hi There,</p>
                            <p style="margin-bottom: 15px; font-size: 16px;">You recently requested to reset your password for your Canopy account.</p>
                            <p style="margin-bottom: 15px; font-size: 16px;">To complete the process, please click the button below:</p>

                            <p style="text-align: center;">
                                <a href="${link}" class="button">Reset My Password</a>
                            </p>

                            <p style="margin-top: 25px; margin-bottom: 15px; font-size: 14px; color: ${emailMutedText};">This password reset link is only valid for the next 10 minutes.</p>
                            <p style="margin-bottom: 0; font-size: 14px; color: ${emailMutedText};">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="warning" style="text-align: center; padding: 0 25px 20px 25px;">
                            <p style="margin: 0;">For security reasons, please do not share this link with anyone.</p>
                        </td>
                    </tr>
                </table>

                <table class="footer" role="presentation">
                    <tr>
                        <td style="padding: 20px 25px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Canopy. All rights reserved.</p>
                            <p style="margin-top: 8px; margin-bottom: 0;"><a href="YOUR_WEBSITE_URL" style="color: ${emailMutedText};">Visit Canopy</a> | <a href="YOUR_PRIVACY_POLICY_URL" style="color: ${emailMutedText};">Privacy Policy</a></p>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("Failed to send reset email:", err);
    throw err;
  }
}