import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import {from, Observable} from 'rxjs';
import {Notification} from '../../model/notification';
import {NotificationService} from '../../model/notification.service';
import {TitleService} from '../../title.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent implements OnInit {
  notification: Observable<Notification[]>;
  note: Notification;

  constructor(private notificationService: NotificationService, private SpinnerService: NgxSpinnerService,
              private appService: TitleService) { }

  reloadData() {
    this.note = new Notification();
    this.notification = this.notificationService.getNotificationList();
    setTimeout(() => {
      this.ngOnInit();
    }, 300000);
  }

  removeNotification(id: number) {
    this.SpinnerService.show();
    this.notificationService.getNotificationById(id)
      .subscribe(
      data => {
        // console.log(data);
        this.note = data;
        this.note.notificationDeleted = new Date();
        this.notificationService.updateNotification(id, this.note)
          .subscribe(value => {
            // console.log(value);
            setTimeout(() => {
              this.SpinnerService.hide();
            }, 500);
            this.reloadData();
          }, error => console.log(error));
      }, error => console.log(error));
  }

  ngOnInit(): void {
    this.appService.setTitle('Notifications');
    this.deleteOld();
    this.reloadData();
  }

  deleteOld() {
    let counter = 0;
    const today = new Date();
    const year = today.getFullYear();
    const month = ((today.getMonth() + 1) >= 10) ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1);
    const day = today.getDate();

    this.notificationService.getNotificationList()
      .subscribe(
        data => {
          while (data[counter] != null) {
            let num = 0;
            // console.log(data);
            const temp = data[counter].onDate;
            if (temp != null) {
              const tempYear = temp.substr(0, 4);
              const tempMonth = temp.substr(5, 2);
              const tempDay = temp.substr(8, 2);
              if (tempYear === year.toString()) {
                const x = Number(tempMonth) + 1;
                const y = Number(month) + 1;
                if (tempMonth === month || x === y) {
                  num = this.getDay(Number(tempMonth), Number(tempDay));
                  if (num === day) {
                    this.notificationService.deleteNotification(data[counter].notificationId)
                      .subscribe(value => {
                        // console.log(value);
                      }, error => console.log(error));
                  }
                }
              }
            }
            counter++;
          }
        }, error => console.log(error));
  }

  getDay(month: number, day: number): number {
    let num = 0;
    let temp = 0;

    if (month === 2) {
      if (day <= 21) {
        return (day + 7);
      }
      else {
        num = 28 - day;
        temp = 7 - num;
        return temp;
      }
    }
    else if (month === 1 || month === 3 || month === 5 || month === 7 ||
      month === 8 || month === 10 || month === 12) {
      if (day <= 24) {
        return (day + 7);
      }
      else {
        num = 31 - day;
        temp = 7 - num;
        return temp;
      }
    }
    else {
      if (day <= 23) {
        return (day + 7);
      }
      else {
        num = 30 - day;
        temp = 7 - num;
        return temp;
      }
    }
  }
}
