import { nodemailer } from "@deps";
import { Helper } from "./mod.ts";
import type {
  CredentialsType,
  MailConfigType,
  SendParameterType,
} from "./mod.ts";

export class Mailer {
  // Outlook config
  private static OUTLOOK_CONFIG: MailConfigType = {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
  };

  // Hostinger config
  private static HOSTINGER_CONFIG: MailConfigType = {
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
  };

  public static async send({
    to,
    receiver,
  }: SendParameterType) {
    const {
      hostinger: {
        email,
        username,
        password,
      },
    }: CredentialsType = await Helper.convertJsonToObject(
      "/server/data/credentials/email.credentials.json",
    );

    const transporter = nodemailer.createTransport({
      host: Mailer.HOSTINGER_CONFIG.host,
      port: Mailer.HOSTINGER_CONFIG.port,
      secure: Mailer.HOSTINGER_CONFIG.secure,
      auth: {
        user: email,
        pass: password,
      },
    });

    const info = await transporter.sendMail({
      from: `${username} - <${email}>`,
      to,
      subject: "Réservation validée",
      text: Mailer.plainText(receiver),
      html: Mailer.html(receiver),
    });

    await Helper.writeEmailLog(
      `Email envoyé le ${
        Helper.displayDate({ style: "normal" })
      }. Id : ${info.messageId},`,
    );
  }

  private static plainText(receiver: string) {
    return `Félicitations ${receiver}.\nNous avons bien enregistré votre réservation...`;
  }

  private static html(receiver: string) {
    return `<h1>Félicitations ${receiver}</h1>
    <p>Nous avons bien enregistré votre réservation...</p>`;
  }
}
