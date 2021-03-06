package com.springboot.SpringBackend.model;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "person")
public class Person implements Serializable {
    private static final long serialVersionUID = -2126183802877200868L;

    public enum personType {
        White, Grey, Black
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "person_id", nullable = false)
    private Long id;

    @Column(name = "image", nullable = false)
    private String personImg;

    @Size(max = 20)
    @Column(name = "fname", nullable = false)
    private String fname = "";

    @Size(max = 20)
    @Column(name = "lname", nullable = false)
    private String lname = "";

    @Enumerated(EnumType.STRING)
    @Column(name = "personlisted", nullable = false)
    private personType personListed;
    //private String personListed;

    @Column(name = "personcreated", nullable = false)
    private LocalDate personCreated;

    @Column(name = "persondeleted")
    private LocalDate personDeleted = null;

    @ManyToOne
    @JoinColumn(name="network_id", nullable = false)
    private Network network;

    public Person() { }

    public Person(String img, Network n) {
        this.personImg = img;
        this.fname = "Unknown";
        this.lname = "Unknown";
        this.personListed = personType.Grey;
        this.personCreated = LocalDate.now();
        if(n != null) { this.network = n; }
    }

    public Person(String img, String listed, Network n) {
        this.personImg = img;
        this.fname = "Unknown";
        this.lname = "Unknown";

        if(listed.equalsIgnoreCase("White"))
        {
            //this.personListed = "White";
            this.personListed = personType.White;
        }
        else if(listed.equalsIgnoreCase("Black"))
        {
            //this.personListed = "Black";
            this.personListed = personType.Black;
        }
        else
        {
            //this.personListed = "Grey";
            this.personListed = personType.Grey;
        }

        this.personCreated = LocalDate.now();
        if(n != null) { this.network = n; }
    }

    public Person(String img, String name, String surname, String listed, Network n) {
        this.personImg = img;
        if(validateInput(name)) { this.fname = Jsoup.clean(name, Whitelist.simpleText()); }
        if(validateInput(surname)) { this.lname = Jsoup.clean(surname, Whitelist.simpleText()); }
        this.network = n;

        if(listed.equalsIgnoreCase("White"))
        {
            //this.personListed = "White";
            this.personListed = personType.White;
        }
        else if(listed.equalsIgnoreCase("Black"))
        {
            //this.personListed = "Black";
            this.personListed = personType.Black;
        }
        else
        {
            //this.personListed = "Grey";
            this.personListed = personType.Grey;
        }

        this.personCreated = LocalDate.now();
    }

    public Person(String img, String name, String surname, Network n) {
        this.personImg = img;
        if(validateInput(name)) { this.fname = Jsoup.clean(name, Whitelist.simpleText()); }
        if(validateInput(surname)) {this.lname = Jsoup.clean(surname, Whitelist.simpleText()); }
        //this.personListed = "Grey";
        this.personListed = personType.Grey;
        this.personCreated = LocalDate.now();
        if(n != null) { this.network = n; }
    }

    public Long getPersonId() {
        return this.id;
    }
    public void setPersonId(Long id) {
        this.id = id;
    }

    public String getPersonImg() { return this.personImg; }
    public void setPersonImg(String img) { this.personImg = img; }

    public String getFname() {
        return this.fname;
    }
    public void setFname(String name) {
        if(validateInput(name)) {
            this.fname = Jsoup.clean(name, Whitelist.simpleText());
        }
    }

    public String getLname() {
        return this.lname;
    }
    public void setLname(String surname) {
        if(validateInput(surname)) {
            this.lname = Jsoup.clean(surname, Whitelist.simpleText());
        }
    }

    public String getPersonListed() { return this.personListed.toString(); }
    public void setPersonListed(String listed) {
        if(listed.equalsIgnoreCase("White"))
        {
            //this.personListed = "White";
            this.personListed = personType.White;
        }
        else if(listed.equalsIgnoreCase("Black"))
        {
            //this.personListed = "Black";
            this.personListed = personType.Black;
        }
        else
        {
            //this.personListed = "Grey";
            this.personListed = personType.Grey;
        }
    }

    public LocalDate getPersonCreated() {
        return this.personCreated;
    }
    public void setPersonCreated(LocalDate date) { this.personCreated = date; }

    public LocalDate getPersonDeleted() {
        if(personDeleted != null) {
            return this.personDeleted;
        }
        return null;
    }
    public void setPersonDeleted(LocalDate date) {
        if (date != null) {
            this.personDeleted = LocalDate.now();
        } else {
            this.personDeleted = null;
        }
    }

    public Long getNetworkId() { return this.network.getNetworkId(); }
    public Network getNetwork() { return this.network; }
    public void setNetwork(Network x) {
        if(x != null) { this.network = x; }
    }

    private Boolean validateInput(String str) {
        return str.matches("\\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+");
    }
}
