import nodemailer from "nodemailer";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

type props = {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: Types.ObjectId;
};

export const sendVerificationEmail = async ({
  email,
  emailType,
  userId,
}: props) => {
  try {
    const token = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verificationToken: token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forGotPasswordToken: token,
        forGotPasswordExpires: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptionsFor_email_verification = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN
        }/verifyemail?token=${token}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"
        }
                or copy and paste the link below in your browser.<br> ${process.env.DOMAIN
        }/verifyemail?token=${token}
                </p>`,
    };

    const mailOptionsFor_password_reset = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN
        }/reset-password?token=${token}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"
        }
                or copy and paste the link below in your browser.<br> ${process.env.DOMAIN
        }/reset-password?token=${token}
                </p>`,
    };

    if (emailType === "VERIFY") {
      const mailResponse = await transport.sendMail(mailOptionsFor_email_verification);
      return {
        error: null,
        info: mailResponse,
        message: "Verification email sent successfully",
        success: true,
      };
    } else if (emailType === "RESET") {
      const mailResponse = await transport.sendMail(mailOptionsFor_password_reset);
      return {
        error: null,
        info: mailResponse,
        message: "Password reset email sent successfully",
        success: true,
      };
    }


  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
