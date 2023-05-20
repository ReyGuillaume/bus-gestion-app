import emailjs from "emailjs-com";
import { config } from "../configs/email.config";
import {formatedHour} from "./dates.js";
import axios from "axios";
import {addslashes} from "./formGestion.js";

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
            message = "Nous sommes heureux de vous informer que votre réservation de bus avec GoBus a été validée avec succès. Votre bus partira de l'arrêt " +data.arretDepart + " à "
                +data.debut+" le "+data.debutDate+" et arrivera à l'arrêt "+data.arretArrive+" à "+data.fin+" le "+data.finDate+".\n" +
                "\n" +
                "Veuillez vous connecter à votre compte sur notre site web et accéder à la section \"Gérer mes réservations\" pour visualiser toutes les informations relatives à votre réservation, notamment l'horaire de départ et d'arrivée prévue.\n" +
                "\n" +
                "Nous avons affecté un chauffeur expérimenté à votre bus pour vous assurer un voyage sûr et agréable. Notre équipe de conducteurs est formée pour offrir un service de qualité et pour prendre soin de nos passagers.\n" +
                "\n" +
                "Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. Nous sommes toujours prêts à vous aider.\n" +
                "\n" +
                "Nous vous remercions de votre confiance envers GoBus et nous sommes impatients de vous fournir un service de qualité supérieure."
            break;
        case "ConfirmInscriptionConducteur":
            message = "Nous sommes heureux de vous confirmer votre inscription en tant que conducteur de bus GoBus. Vous avez désormais accès à tous les services nécessaires pour exercer votre travail avec succès.\n" +
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
        case "ConfirmInscriptionResponsable":
            message = "Nous sommes heureux de vous confirmer votre inscription en tant que responsable logistique GoBus. Vous avez désormais accès à tous les services nécessaires pour exercer votre travail avec succès.\n" +
                "\n" +
                "Veuillez noter que votre login est ";
            message += data.login;
            message += " et que votre mot de passe temporaire est \"gobus123\". Nous vous conseillons de le changer dès que possible pour des raisons de sécurité.\n" +
                "\n" +
                "Nous sommes heureux de vous informer que vous pouvez désormais accéder à votre agenda sur notre site web, où vous pouvez visualiser tous vos créneaux pour les semaines à venir. Cela vous permettra de mieux planifier vos journées.\n" +
                "\n" +
                "Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. Nous sommes toujours prêts à vous aider.\n" +
                "\n" +
                "Encore une fois, merci de votre confiance envers GoBus. Nous sommes impatients de vous fournir un service de qualité supérieure."
            break;
        case "RefusInscriptionAbonne" :
            message = "Nous avons bien reçu votre demande d'inscription en tant qu'abonné GoBus. Nous sommes désolés de vous informer que votre demande a été refusée.\n" +
                "\n" +
                "Notre équipe de gestion des abonnements a examiné votre demande et a déterminé que nous ne sommes pas en mesure de vous offrir les services d'abonnement pour le moment.\n" +
                "\n" +
                "Nous vous encourageons à réessayer à l'avenir si votre situation change et que vous souhaitez bénéficier des avantages de l'abonnement GoBus.\n" +
                "\n" +
                "Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. Nous sommes toujours prêts à vous aider.\n" +
                "\n" +
                "Nous sommes désolés de ne pas pouvoir répondre favorablement à votre demande cette fois-ci, mais nous vous remercions tout de même de l'intérêt que vous portez à GoBus.";
            break;
        case "RefusReservationAbonne":
            message = "Nous regrettons de vous informer que votre demande de réservation de bus avec GoBus pour l'arrêt "+data.arretDepart + " à "
                +data.debut+" le "+data.debutDate+" a été refusée. Nous comprenons que cela puisse causer des désagréments et nous nous excusons pour les inconvénients que cela pourrait vous causer.\n" +
                "\n" +
                "Malheureusement, en raison de contraintes opérationnelles ou de disponibilité, nous ne pouvons pas honorer votre demande de réservation de bus dans les conditions souhaitées.\n" +
                "\n" +
                "Nous vous encourageons à essayer de réserver à nouveau en utilisant d'autres options de trajet ou à contacter notre équipe pour obtenir de l'aide dans la recherche d'alternatives appropriées.\n" +
                "\n" +
                "Si vous avez des questions supplémentaires ou si vous avez besoin d'une assistance supplémentaire, n'hésitez pas à nous contacter. Nous sommes là pour vous aider dans la mesure du possible.\n" +
                "\n" +
                "Nous vous remercions de votre compréhension et nous nous excusons encore une fois pour la gêne occasionnée.";
            break;
        case "ModifReservationAbonne":
            message = "Nous tenons à vous informer qu'une modification a été apportée à votre réservation de bus. Nous souhaitons vous tenir informé(e) de ces changements afin que vous puissiez planifier votre voyage en conséquence.\n" +
                "\n" +
                "Pour consulter les détails de la modification, veuillez vous connecter à votre espace d'abonné sur notre site web et accéder à la section \"Gérer les réservations\". Vous y trouverez toutes les informations mises à jour, notamment la date, l'heure d'arrivée et toute autre information pertinente.\n" +
                "\n" +
                "Si vous avez des questions ou des préoccupations concernant cette modification ou si vous avez besoin d'une assistance supplémentaire, n'hésitez pas à nous contacter. Notre équipe est à votre disposition pour vous aider.\n" +
                "\n" +
                "Nous vous remercions de votre compréhension et de votre collaboration. Nous ferons de notre mieux pour vous offrir un service de qualité supérieure.";
            break;
        case "SupprReservationAbonne":
            message = "Nous vous informons que votre réservation de bus pour l'arrêt "+data.arretDepart + " à "
                +data.debut+" le "+data.debutDate+" a été supprimée. Malheureusement, nous ne pouvons pas honorer cette réservation pour diverses raisons. Nous nous excusons pour les désagréments que cela pourrait causer.\n" +
                "\n" +
                "Pour consulter les détails de la suppression, veuillez vous connecter à votre espace abonné sur notre site web et accéder à la section \"Gérer les réservations\". Vous trouverez la réservation supprimée dans la section \"Refusées\", avec toutes les informations relatives à la réservation initiale, y compris l'arrêt, la date et l'heure de départ.\n" +
                "\n" +
                "Nous vous invitons à explorer d'autres options de trajet disponibles ou à contacter notre équipe pour obtenir de l'aide dans la recherche d'alternatives appropriées.\n" +
                "\n" +
                "Si vous avez des questions supplémentaires ou si vous avez besoin d'une assistance supplémentaire, n'hésitez pas à nous contacter. Notre équipe est là pour vous aider dans la mesure du possible.\n" +
                "\n" +
                "Nous vous remercions de votre compréhension et nous nous excusons pour les inconvénients causés par cette suppression.";
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
        case "ConfirmInscriptionResponsable" :
            subject = "Confirmation de l'inscription en tant que responsable logistique GoBus";
            break;
        case "RefusInscriptionAbonne" :
            subject = "Refus de la demande d'inscription à GoBus";
            break;
        case "RefusReservationAbonne" :
            subject = "Refus de votre demande de réservation de bus avec GoBus";
            break;
        case "ModifReservationAbonne" :
            subject = "Modification de votre réservation de bus avec GoBus";
            break;
        case "SupprReservationAbonne" :
            subject = "Suppression de votre réservation de bus avec GoBus";
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
      switch (typeMail){
          case "SupprReservationAbonne":
          case "ModifReservationAbonne":
          case "RefusReservationAbonne":
          case "ConfirmReserv":
              axios.get(`notifications/notifications.php?function=create&title=${addslashes(subjectByTypeMail(typeMail))}&message=${addslashes("Bonjour "+userInfos.firstname+",\n"+messageByTypeMail(typeMail, userInfos)+"\n\nCordialement,\nL'équipe GoBus")}&recipient=` + userInfos.id)
              break;
          default :
          break;
      }
  } catch (error) {
      console.error({ error });
  }
};

const reecritDateEtHeure = (date) => {
    let heure_debut = formatedHour(new Date(date).getHours())
    let min_debut = formatedHour(new Date(date).getMinutes())

    let debut_jour = formatedHour(new Date(date).getDate())
    let debut_annee = formatedHour(new Date(date).getFullYear())
    let debut_mois = formatedHour(new Date(date).getMonth())

    let debut = heure_debut+":"+min_debut
    let debutDate = debut_jour+"/"+debut_mois+"/"+debut_annee

    return {debut:debut, debutDate:debutDate}
}


export { sendMailTemplate, sendMail, reecritDateEtHeure };
