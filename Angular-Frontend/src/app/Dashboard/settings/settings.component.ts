import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../title.service';
import { Observable } from 'rxjs';
import { UserService } from '../../model/user.service';
import { User } from '../../model/user';
import { Session } from '../../../assets/js/SessionStorage.js';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  sessionS = new Session();
  users: Observable<User[]>;
  user: User;

  constructor(private SpinnerService: NgxSpinnerService, private appService: TitleService,
              private userService: UserService) {}

  enableButton(){
    const buttonEl = document.getElementById('saveBtn') as HTMLButtonElement;
    buttonEl.style.background = '#d4af37';
    buttonEl.disabled = false;
  }

  retrieveSettings(){
    if (this.sessionS.retrieveUserInfo() != null) {
      const buttonEl = document.getElementById('saveBtn') as HTMLButtonElement;
      const smsSettings = document.getElementById('smsSlider') as HTMLInputElement;
      const emailSettings = document.getElementById('emailSlider') as HTMLInputElement;

      buttonEl.style.background = 'grey';
      buttonEl.disabled = true;

      this.userService.getUserById(this.sessionS.retrieveUserInfo().id).subscribe(
        data => {
          // console.log(data);
          smsSettings.checked = data.notifySMS;
          emailSettings.checked = data.notifyEmail;
          this.user = data;
        }
      );
    }
  }

  setUserSettings() {
    if (this.sessionS.retrieveUserInfo() != null) {
      const smsSet = document.getElementById('smsSlider') as HTMLInputElement;
      const emailSet = document.getElementById('emailSlider') as HTMLInputElement;
      this.user.notifyEmail = emailSet.checked;
      this.user.notifySMS = smsSet.checked;

      this.SpinnerService.show();
      this.userService.updateUser(this.sessionS.retrieveUserInfo().id, this.user)
        .subscribe(() => {
          setTimeout(() => {
            this.SpinnerService.hide();
            this.retrieveSettings();
          }, 500);
        });
      // this.retrieveSettings();
    }
  }

  ngOnInit(): void {
    this.appService.setTitle('Settings');
    this.retrieveSettings();
  }
}