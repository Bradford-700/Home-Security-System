import { Component, OnInit } from '@angular/core';
import {Person} from '../../model/person';
import {PersonService} from '../../model/person.service';
import {TitleService} from '../../title.service';
import {User} from '../../model/user';
import {UserService} from '../../model/user.service';
import Session from '../../../assets/js/SessionStorage';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-deleted-black',
  templateUrl: './deleted-black.component.html',
  styleUrls: ['./deleted-black.component.css']
})
export class DeletedBlackComponent implements OnInit {
  sessionS = new Session();
  info: User = this.sessionS.retrieveUserInfo();
  person: Observable<Person[]>;
  psn: Person;

  constructor(private personService: PersonService, private userService: UserService,
              private SpinnerService: NgxSpinnerService, private appService: TitleService, private router: Router) { }

  reloadData() {
    this.person = this.personService.getPersonList();
    // this.activateButtons();
  }

  restorePerson(id: number){
    this.SpinnerService.show();
    this.psn = new Person();
    this.personService.getPersonById(id)
      .subscribe(
        data => {
          // console.log(data);
          this.psn = data;
          this.psn.personDeleted = null;
          this.personService.updatePerson(id, this.psn)
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
    this.appService.setTitle('Deleted People');
    this.deleteOld();
    this.reloadData();
  }

  back() {
    this.router.navigate(['people-black']);
  }

  deleteOld() {
    let counter = 0;
    const today = new Date();
    const year = today.getFullYear();
    const month = ((today.getMonth() + 1) >= 10) ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1);
    const day = today.getDate();

    this.personService.getPersonList()
      .subscribe(
        data => {
          while (data[counter] != null) {
            let num = 0;
            // console.log(data);
            const temp = data[counter].personDeleted;
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
                    this.personService.deletePerson(data[counter].personId)
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
