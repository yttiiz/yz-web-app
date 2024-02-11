import { nodemailer } from "@deps";
import { Helper } from "./mod.ts";
import type {
  SendParameterType,
  CredentialsType
} from "./mod.ts";

export class Mailer {
  
  // Outlook config
  private static OUTLOOK_CONFIG = {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
  } ;

  public static async send({
    to,
    subject,
    content,
    html,
  }: SendParameterType,
  ) {
    const {
      email,
      username,
      password,
    }: CredentialsType = await Helper.convertJsonToObject(
      "/server/data/credentials/email.credentials.json",
    );

    const transporter =  nodemailer.createTransport({
      host: Mailer.OUTLOOK_CONFIG.host,
      port: Mailer.OUTLOOK_CONFIG.port,
      secure: Mailer.OUTLOOK_CONFIG.secure,
      auth: {
        user: email,
        pass: password,
      },
    });

    const info = await transporter.sendMail({
      from: `${username} - <${email}>`,
      to,
      subject,
      text: content,
      html,
    });

    await Helper.writeEmailLog(
      `Email envoyé le : ${
        Helper.displayDate({ style: "normal" })
      }. Id : ${info.messageId},`
    );
  }
}