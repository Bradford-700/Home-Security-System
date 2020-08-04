import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../title.service';
import { Observable } from 'rxjs';
import { UserService } from '../../model/user.service';
import { User } from '../../model/user';
import { Session } from '../../../assets/js/SessionStorage.js';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  sessionS = new Session();
  users: Observable<User[]>;
  user: User;

  constructor(private appService: TitleService, private userService: UserService) {}

  enableButton(){
    const buttonEl = document.getElementById('saveBtn') as HTMLButtonElement;
    buttonEl.style.background = '#d4af37';
    buttonEl.disabled = false;
  }

  retrieveSettings(){
    const buttonEl = document.getElementById('saveBtn') as HTMLButtonElement;
    const localSettings = document.getElementById('localSlider') as HTMLInputElement;
    const emailSettings = document.getElementById('emailSlider') as HTMLInputElement;

    buttonEl.style.background = 'grey';
    buttonEl.disabled = true;

    let userObj;
    userObj = this.sessionS.retrieveUserInfo();
    /*this.users = */
    this.userService.getUserById(userObj.id).subscribe(
      data => {
        localSettings.checked = data.notifyLocal;
        emailSettings.checked = data.notifyEmail;
        this.user = data;
        // console.log(this.user);
      }
    );
  }

  setUserSettings(){
    // this.user = new User();
    const localSet = document.getElementById('localSlider') as HTMLInputElement;
    const emailSet = document.getElementById('emailSlider') as HTMLInputElement;
    let userObj;
    userObj = this.sessionS.retrieveUserInfo();
    this.user.notifyEmail = emailSet.checked;
    this.user.notifyLocal = localSet.checked;

    console.log(this.user.notifyEmail);
    console.log(this.user.notifyLocal);

    // console.log(this.user);
    this.userService.updateUser(userObj.id, this.user).subscribe(data => console.log(data), error => console.log(error));
    this.user = new User();
    this.retrieveSettings();
  }

  ngOnInit(): void {
    this.appService.setTitle('Settings');
    this.retrieveSettings();
  }
}
