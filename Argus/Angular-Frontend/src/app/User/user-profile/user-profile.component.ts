import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TitleService} from '../../title.service';
import {UserService} from '../../model/user.service';
import {Session} from '../../../assets/js/SessionStorage.js';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../model/user';
import {WebcamImage} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  sessionS = new Session();
  userObj: Session = this.sessionS.retrieveUserInfo();
  id: number;
  user: User;

  constructor(private route: ActivatedRoute, private router: Router,
              private appService: TitleService, private userService: UserService,
              private SpinnerService: NgxSpinnerService) {
  }

  public get triggerObservable(): Observable<void> {
    return this.snapTrigger.asObservable();
  }

  conPass = '';
  /* ======================================================== */
  /*         START of Camera for taking profile picture       */
  /* ======================================================== */

  @ViewChild('video')
  public webcam: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;

  public captures: Array<any>;

  public showCam = true;

  public camImg: WebcamImage = null;

  public snapTrigger: Subject<void> = new Subject<void>();


  ngOnInit(): void {
    this.populateFields();
    this.appService.setTitle('User Profile');
    this.user = new User();
  }

  public trigger_s(): void {
    this.snapTrigger.next();
  }

  public handleShot(img: WebcamImage): void {
    this.camImg = img;
  }

  /* ======================================================== */
  /*         END of Camera for taking profile picture         */

  /* ======================================================== */

  populateFields() {
    const FName = document.getElementById('firstNameDisplay') as HTMLDataElement;
    const SName = document.getElementById('lastNameDisplay') as HTMLDataElement;
    const UName = document.getElementById('usernameDisplay') as HTMLDataElement;
    const contact = document.getElementById('numberDisplay') as HTMLInputElement;
    const email = document.getElementById('emailDisplay') as HTMLDataElement;
    const password = document.getElementById('passwordField1') as HTMLDataElement;
    const uPic = document.getElementById('userPic') as HTMLImageElement;

    this.userService.getUserById(this.userObj.id)
      .subscribe(data => {
        FName.value = data.fname;
        SName.value = data.lname;
        contact.value = data.contactNo;
        UName.value = data.username;
        email.value = data.email;
        password.value = data.userPass;
        uPic.src = data.profilePhoto;
        this.user = data;
      });
  }

  loadModal() {
    const uName = document.getElementById('uFirstName') as HTMLInputElement;
    const uSurname = document.getElementById('uLastName') as HTMLInputElement;
    const uUsername = document.getElementById('uUsername') as HTMLInputElement;
    const uNumber = document.getElementById('uNumber') as HTMLInputElement;
    const uEmail = document.getElementById('uEmail') as HTMLInputElement;
    const uPassword = document.getElementById('passwordField1') as HTMLInputElement;
    const uPic = document.getElementById('userPic') as HTMLImageElement;

    this.userService.getUserById(this.userObj.id)
      .subscribe(data => {
        uName.value = data.fname;
        uSurname.value = data.lname;
        uNumber.value = data.contactNo;
        uEmail.value = data.email;
        uUsername.value = data.username;
        uPassword.value = data.userPass;
        uPic.src = data.profilePhoto;
      });
  }

  updateUser() {
    const uName = document.getElementById('uFirstName') as HTMLInputElement;
    const uSurname = document.getElementById('uLastName') as HTMLInputElement;
    const uUsername = document.getElementById('uUsername') as HTMLInputElement;
    const uNumber = document.getElementById('uNumber') as HTMLInputElement;
    const uEmail = document.getElementById('uEmail') as HTMLInputElement;
    const uPassword = document.getElementById('passwordField1') as HTMLInputElement;

    this.user.fname = uName.value;
    this.user.lname = uSurname.value;
    this.user.contactNo = uNumber.value;
    this.user.email = uEmail.value;
    this.user.username = uUsername.value;
    this.user.userPass = uPassword.value;

    this.userService.updateUser(this.userObj.id, this.user)
      .subscribe(() => {
        this.gotoList();
      });
  }

  updateUserPic() {
    const photoInp = document.getElementById('submitPhoto').getAttribute('src');

    let userObj;
    userObj = this.sessionS.retrieveUserInfo();

    this.user.profilePhoto = photoInp;

    this.userService.updateUser(userObj.id, this.user)
      .subscribe(() => {
        // this.populateFields();
        this.gotoList();
      });
  }

  addIfNew() {
    let counter = 0;
    const usernameInp = document.getElementById('uUsername') as HTMLInputElement;
    const emailInp = document.getElementById('uEmail') as HTMLInputElement;
    let exists = false;
    let email = false;
    let username = false;

    this.userService.getUserList().subscribe(
      data => {
        while (data[counter] != null) {
          if (data[counter].userId !== this.user.userId) {
            if (data[counter].userDeleted === null) {
              if (data[counter].username === usernameInp.value) {
                exists = true;
                username = true;
                usernameInp.value = '';
                usernameInp.focus();
              }
              if (data[counter].email.toLowerCase() === emailInp.value.toLowerCase()) {
                exists = true;
                email = true;
                emailInp.value = '';
                emailInp.focus();
              }
            }
          }
          counter++;
        }
        if (email && username) {
          alert('Email address and username are already in use. Please enter another email address and username.');
        } else if (email) {
          alert('Email address is already in use. Please enter another email address.');
        } else if (username) {
          alert('Username address is already in use. Please enter another username.');
        }
      }, error => {},
      () => {
        if (!exists) {
          this.updateUser();
        }
      }
    );
  }

  onSubmit() {
    this.addIfNew();
  }

  gotoList() {
    this.router.navigate(['/user-profile']);
    this.SpinnerService.show();
    setTimeout(() => {
      this.SpinnerService.hide();
      location.reload();
    }, 500);
  }
}
