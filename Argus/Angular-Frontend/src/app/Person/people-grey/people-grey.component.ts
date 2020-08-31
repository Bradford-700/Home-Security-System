import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../title.service';
import {Observable} from 'rxjs';
import {Person} from '../../model/person';
import {PersonService} from '../../model/person.service';
import {Router} from '@angular/router';
import {User} from '../../model/user';
import Session from '../../../assets/js/SessionStorage';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-people-grey',
  templateUrl: './people-grey.component.html',
  styleUrls: ['./people-grey.component.css']
})
export class PeopleGreyComponent implements OnInit {
  sessionS = new Session();
  info: User = this.sessionS.retrieveUserInfo();
  person: Observable<Person[]>;
  psn: Person;

  constructor(private personService: PersonService, private appService: TitleService,
              private SpinnerService: NgxSpinnerService, private router: Router) {
  }

  reloadData() {
    this.psn = new Person();
    this.person = this.personService.getPersonList();
    setTimeout(() => {
      this.ngOnInit();
    }, 300000);
  }

  addToWhiteList(id: number) {
    this.SpinnerService.show();
    this.personService.getPersonById(id)
      .subscribe(
        data => {
          // console.log(data);
          this.psn = data;
          this.psn.personListed = 'White';
          this.personService.updatePerson(id, this.psn)
            .subscribe(value =>
            {
              // console.log(value);
              setTimeout(() => {
                this.SpinnerService.hide();
              }, 500);
              this.reloadData();
            }, error => console.log(error));
        }, error => console.log(error));
  }

  addToBlackList(id: number) {
    this.SpinnerService.show();
    this.personService.getPersonById(id)
      .subscribe(
        data => {
          // console.log(data);
          this.psn = data;
          this.psn.personListed = 'Black';
          this.personService.updatePerson(id, this.psn)
            .subscribe(value =>
            {
              // console.log(value);
              setTimeout(() => {
                this.SpinnerService.hide();
              }, 500);
              this.reloadData();
            }, error => console.log(error));
        }, error => console.log(error));
  }

  ngOnInit(): void {
    this.appService.setTitle('Person Grey-List');
    this.deleteOld();
    this.reloadData();
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
            const temp = data[counter].personCreated;
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
    else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
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
