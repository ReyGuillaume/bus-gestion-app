import emailjs from "emailjs-com";
import { config } from "../configs/email.config";

const sendMailTemplate = (templateId, userInfos) => {
  try {
    emailjs.send(
      config.serviceId,
      templateId,
      {
        from_name: config.fromName,
        email_client: userInfos.mail,
        firstname: userInfos.firstname,
        login: userInfos.login,
      },
      config.emailUserId
    );
  } catch (error) {
    console.error({ error });
  }
};

const sendMail = (message, userInfos) => {
  try {
    emailjs.send(
      config.serviceId,
      "template_2lkyfis",
      {
        to_name: userInfos.firstname,
        from_name: config.fromName,
        message: message,
        email_client: userInfos.mail,
      },
      config.emailUserId
    );
  } catch (error) {
    console.error({ error });
  }
};

export { sendMailTemplate, sendMail };
