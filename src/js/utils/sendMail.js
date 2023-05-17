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

function messageByTypeMail(typeMail, data=null) {
    let message = ""
    switch (typeMail){
        case "ConfirmReserv" :
            message = "Nous sommes heureux de vous informer que votre réservation de bus avec GoBus a été validée. \n" +
                "\n" +
                "Veuillez vous connecter à votre compte sur notre site web et accéder à la section \"Gérer mes réservations\" pour visualiser toutes les informations relatives à votre réservation, notamment l'horaire de départ et d'arrivée prévue.\n" +
                "\n" +
                "Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. Nous sommes toujours prêts à vous aider.\n" +
                "\n" +
                "Nous vous remercions de votre confiance envers GoBus et nous sommes impatients de vous fournir un service de qualité supérieure.\n";
            break;
        case "ConfirmInscriptionConducteur":
            message = "Nous sommes heureux de vous confirmer que votre inscription en tant que conducteur de bus GoBus a été prise en compte. Vous avez désormais accès à tous les services nécessaires pour exercer votre travail avec succès.\n" +
                "\n" +
                "Veuillez noter que votre login est ";
            message += data.login;
            message += " et que votre mot de passe temporaire est \"gobus123\". Nous vous conseillons de le changer dès que possible pour des raisons de sécurité.\n" +
                "\n" +
                "Nous sommes heureux de vous informer que vous pouvez désormais accéder à votre agenda de conduite sur notre site web, où vous pouvez visualiser tous vos créneaux de conduite pour les semaines à venir. Cela vous permettra de mieux planifier vos journées et de ne manquer aucune de vos affectations.\n" +
                "\n" +
                "Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. Nous sommes toujours prêts à vous aider.\n" +
                "\n" +
                "Encore une fois, merci de votre confiance envers GoBus. Nous sommes impatients de vous fournir un service de qualité supérieure."
            break;
        default :
            break;
    }
    return message;
}

function subjectByTypeMail(typeMail) {
    let subject = ""
    switch (typeMail){
        case "ConfirmReserv" :
            subject = "Confirmation de votre réservation de bus avec GoBus";
            break;
        case "ConfirmInscriptionConducteur" :
            subject = "Confirmation de l'inscription en tant que conducteur de bus GoBus";
            break;
        default :
            break;
    }
    return subject;
}

const sendMail = (typeMail, userInfos) => {
  try {
      emailjs.send(
      config.serviceId,
          "template_22nwjcg",
          {
          firstname: userInfos.firstname,
          from_name: config.fromName,
          message: messageByTypeMail(typeMail, userInfos),
          email_client: userInfos.mail,
          subject: subjectByTypeMail(typeMail)
          },
          config.emailUserId
      );
  } catch (error) {
      console.error({ error });
  }
};

export { sendMailTemplate, sendMail };
