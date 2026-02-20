import { sendEmail } from "./mail";

export const sendScheduleConfirmationEmail = async (
  email: string,
  otp: string,
) => {
  await sendEmail({
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;padding:40px 20px;">
          <tr>
            <td style="background-color:#ffffff;padding:40px;border-radius:12px;text-align:center;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
              
              <h2 style="margin:0 0 10px;color:#2F1357;">Verification Code</h2>
              
              <p style="color:#555;font-size:14px;margin:0 0 30px;">
                Please use the verification code below to continue.
                This code will expire in <strong>10 minutes</strong>.
              </p>

              <div style="
                font-size:28px;
                letter-spacing:8px;
                font-weight:bold;
                color:#365C7E;
                background-color:#f3f3f3;
                padding:15px 20px;
                border-radius:10px;
                display:inline-block;
              ">
                ${otp}
              </div>

              <p style="margin-top:30px;font-size:12px;color:#888;">
                If you did not request this code, please ignore this email.
              </p>

            </td>
          </tr>
        </table>
      </div>
    `,
  });
};
