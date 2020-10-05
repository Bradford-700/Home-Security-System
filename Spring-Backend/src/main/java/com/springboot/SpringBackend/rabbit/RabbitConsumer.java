package com.springboot.SpringBackend.rabbit;

import com.springboot.SpringBackend.config.RabbitMQConfig;
import com.springboot.SpringBackend.controller.MailerController;
import com.springboot.SpringBackend.model.*;
import com.springboot.SpringBackend.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Component
public class RabbitConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitConsumer.class);
    private final NotificationService nservice;
    private final PersonService personService;
    private final UserService userService;
    private final NetworkService netServece;
    private final SmsSender sender;
    private final MailerController mailer;
    private final RabbitTemplate amqpTemplate;

    @Autowired
    public RabbitConsumer(NotificationService ns, PersonService ps,
                          UserService us, NetworkService nets,SmsSender sms,
                          MailerController mc, RabbitTemplate template) {
        this.nservice = ns;
        this.personService = ps;
        this.userService = us;
        this.netServece = nets;
        this.sender = sms;
        this.mailer = mc;
        this.amqpTemplate = template;
    }

    @RabbitListener(queues = {"alertQueue"})
    public void receivedAlert(RabbitAlert alert) {
        List<User> arr = userService.getAllUsers();
        Optional<Network> net = netServece.getNetworkById(alert.getNetworkId());

        for (User u : arr) {
            if (net.isPresent()) {
                if (u.getNetwork().getNetName().equals(net.get().getNetName())) {
                    if (alert.getPersonId() != 0) {
                        Optional<Person> p = personService.getPersonById(alert.getPersonId());

                        try {
                            if (p.isPresent()) {
                                String email = u.getEmail();
                                Boolean notify1 = u.getNotifyEmail();
                                Boolean notify2 = u.getNotifySMS();

                                if (p.get().getPersonDeleted() != null) {
                                    if (alert.getType().equalsIgnoreCase("Grey")) {
                                        nservice.createNotification(new Notification(alert.getImageStr(), "Suspicious",
                                                "Person: " + p.get().getFname(), u.getNetwork()));
                                    } else {
                                        nservice.createNotification(new Notification(alert.getImageStr(), "Threat",
                                                "Intruder: " + p.get().getFname() + " " + p.get().getLname(), u.getNetwork()));

                                        if (notify1) {
                                            mailer.sendmailBlack(email);
                                        }
                                        if (notify2) {
                                            SmsRequest request = new SmsRequest(u.getContactNo());
                                            sender.sendSmsThreat(request);
                                        }
                                    }
                                } else {
                                    p.get().setPersonDeleted(null);
                                    personService.updatePerson(p.get());

                                    if (alert.getType().equalsIgnoreCase("Grey")) {
                                        nservice.createNotification(new Notification(alert.getImageStr(), "Suspicious",
                                                "Person: " + p.get().getFname(), u.getNetwork()));
                                    } else {
                                        nservice.createNotification(new Notification(alert.getImageStr(), "Threat",
                                                "Intruder: " + p.get().getFname() + " " + p.get().getLname(), u.getNetwork()));

                                        if (notify1) {
                                            mailer.sendmailBlack(email);
                                        }
                                        if (notify2) {
                                            SmsRequest request = new SmsRequest(u.getContactNo());
                                            sender.sendSmsThreat(request);
                                        }
                                    }
                                }
                            }
                                /*else if (p.get() == null) {
                                    // Recreate the person
                                    Person psn = new Person(alert.getPersonId(), alert.getImageStr());
                                    personService.createPerson(psn);
                                    // Update them to the correct list
                                    RabbitPerson updatePerson = new RabbitPerson(psn.getPersonId(), "0", psn.getPersonListed(), true, alert.getImageStr(), true);
                                    amqpTemplate.convertAndSend(RabbitMQConfig.DIRECT_EXCHANGE, RabbitMQConfig.UPDATE_PERSON_KEY, updatePerson);
                                    // Send notification
                                    nservice.createNotification(new Notification(alert.getImageStr(), "Suspicious",
                                            "Person: " + p.get().getFname(), u));
                                }*/

                        } catch (NoSuchElementException ex) {
                            LOGGER.info(String.valueOf(ex));
                        }
                    } else {
                        try {
                            if (alert.getType().equalsIgnoreCase("Grey")) {
                                nservice.createNotification(new Notification(alert.getImageStr(), "Suspicious",
                                        "Person: " + "Unknown", u.getNetwork()));
                            }
                        } catch (NoSuchElementException ex) {
                            LOGGER.info(String.valueOf(ex));
                        }
                    }

                    LOGGER.info("Notification Created");
                }
            }
        }
    }

    @RabbitListener(queues = {"personQueue"})
    public void receivePerson(RabbitPerson psn) {
        // Creating a Grey-list person from Python
        if(psn.getPersonId() == 0) {
            Optional<Network> net = netServece.getNetworkById(psn.getNetworkId());
            if(net.isPresent()) {
                Person p = personService.createPerson(new Person(psn.getImageStr(), net.get()));

                RabbitPerson updatePerson = new RabbitPerson(p.getPersonId(), psn.getTempId(), psn.getType(), true, psn.getImageStr(), true, psn.getNetworkId());
                amqpTemplate.convertAndSend(RabbitMQConfig.DIRECT_EXCHANGE, RabbitMQConfig.UPDATE_PERSON_KEY, updatePerson);

                LOGGER.info("Grey-list Person Added");
            }
        }
    }
}
