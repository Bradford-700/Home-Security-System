package com.springboot.SpringBackend.controller;

import com.springboot.SpringBackend.service.MailerService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.File;
import java.io.FileOutputStream;

@Controller
public class MailerController {
    @Autowired
    private MailerService emailSender;
    private String imagePath = "C:\\Users\\Brad\\Home-Security-System\\Argus\\Angular-Frontend\\src\\assets\\Images\\Argus.png";

    // Usage: get request, http://localhost:8080/springboot/sendmailGrey/{email}
    // @GetMapping(value = "/sendmailGrey/{emailAddress}")
    public String sendmailGrey(/*@PathVariable("emailAddress")*/ String email) {
        String x = "sent";
        emailSender.sendMail(
                email,
                "Argus System Suspicious person Alert",
                "An suspicious person was detected on the Argus system."
        );

        return x;
    }
    // Usage: get request, http://localhost:8080/springboot/sendmailBlack/{email}
    // @GetMapping(value = "/sendmailBlack/{emailAddress}")
    public String sendmailBlack(/*@PathVariable("emailAddress")*/ String email) {
        String x = "sent";
        emailSender.sendMail(
                email,
                "Argus System Threat List Alert",
                "A person from your threat list has been detected on the Argus system."
        );

        return x;
    }
    // Usage: get request, http://localhost:8080/springboot/sendmailBlackAtatchment/{emailAddress}
    // @GetMapping(value = "/sendmailBlackAtatchment/{emailAddress}")
    public String sendWithAttatchBL(/*@PathVariable("emailAddress")*/ String email) {
        String x = "sent";
        emailSender.sendMailWithInlineResources(
                email,
                "WARNING: Argus Threat-list Detection",
                imagePath,
                "This person from your threat list has been detected. Image captured below:"
        );

        return x;
    }
    // Usage: get request, http://localhost:8080/springboot/sendmailGreyAtatchment/{emailAddress}
    // @GetMapping(value = "/sendmailGreyAtatchment/{emailAddress}")
    public String sendWithAttatchGL(/*@PathVariable("emailAddress")*/ String email) {
        String x = "sent";
        emailSender.sendMailWithInlineResources(
                email,
                "ALERT: Argus Suspicious Person Detection",
                imagePath,
                "A suspicious person has been detected. Image captured below:"
        );

        return x;
    }

    public void setImagePath(String imgPathVar) {
        imagePath = imgPathVar;
    }
    /*public void setImage(String b64Image){
        try {
            byte image[] = Base64.decodeBase64(b64Image);
            FileOutputStream fos = new FileOutputStream(new File(imagePath + "/abc.bmp"));
            fos.write(image);
            fos.close();
        }
        catch (Exception e){
            System.out.println("Error with storing the image in the file. Please check if the file path exists");
        }
    }*/
}