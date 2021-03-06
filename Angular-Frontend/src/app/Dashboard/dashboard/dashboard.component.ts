import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from 'rxjs';
import {TitleService} from '../../title.service';
import {PersonService} from '../../model/person.service';
import {Person} from '../../model/person';
import * as CanvasJS from '../../../assets/js/canvasjs.min';
import {Notification} from '../../model/notification';
import {NotificationService} from '../../model/notification.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {SessionClass} from '../../model/session';
import {AuthService} from '../../model/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private appService: TitleService,
              private personService: PersonService, private notificationService: NotificationService,
              private authService: AuthService) {
  }

  info: SessionClass = this.authService.retrieveUserInfo();
  people: Observable<Person[]>;
  currentDate = new Date();

  notification: Observable<Notification[]>;
  note: Notification;
  title = 'Dashboard';

  // noinspection JSAnnotator
  @ViewChild('canvas')
  public canvas: ElementRef;

  public showCam = true;

  // ==========================================================================================

  public calculateNumberOfPeople(): void {
    this.personService.getPersonList().subscribe(data => {
      let threat = 0;
      let cleared = 0;
      let unknown = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < data.length; i++) {
        if ((data[i].personListed === 'Grey') && (data[i].personDeleted === null)
          && (data[i].network.netName === this.info.network)) {
          unknown++;
        } else if ((data[i].personListed === 'Black') && (data[i].personDeleted === null) &&
          (data[i].network.netName === this.info.network)) {
          threat++;
        } else if ((data[i].personListed === 'White') && (data[i].personDeleted === null) &&
          (data[i].network.netName === this.info.network)) {
          cleared++;
        } else {
          // cleared++;
        }
      }
      this.pieChart(cleared, unknown, threat);
    });
  }

  // ==========================================================================================

  public calculateNumberOfNotifications(): void {
    this.note = new Notification();
    this.notificationService.getNotificationList().subscribe(data => {

      let six = 0;
      let five = 0;
      let four = 0;
      let three = 0;
      let two = 0;
      let one = 0;
      let today = 0;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < data.length; i++) {
        if (data[i].onDate === this.dayTester(0)) {
          today++;
        } else if (data[i].onDate === this.dayTester(1)) {
          one++;
        } else if (data[i].onDate === this.dayTester(2)) {
          two++;
        } else if (data[i].onDate === this.dayTester(3)) {
          three++;
        } else if (data[i].onDate === this.dayTester(4)) {
          four++;
        } else if (data[i].onDate === this.dayTester(5)) {
          five++;
        } else if (data[i].onDate === this.dayTester(6)) {
          six++;
        } else {
        }
      }
      this.barchart(six, five, four, three, two, one, today);
    });
  }

  // ==========================================================================================

  public dayTester(days) {
    const date = new Date();
    const last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    const day = last.getDate();
    const month = 1 + last.getMonth();
    let monthSmall = '';
    let daySmall = '';

    if (month < 10) {
      monthSmall = ('0' + month).toString();
    }
    if (day < 10) {
      daySmall = ('0' + month).toString();
    }

    const year = last.getFullYear();

    if (monthSmall === '' && daySmall === '') {
      return (year + '-' + month + '-' + day).toString();
    } else if (monthSmall === '' && daySmall !== '') {
      return (year + '-' + month + '-' + daySmall).toString();
    } else if (monthSmall !== '' && daySmall === '') {
      return (year + '-' + monthSmall + '-' + day).toString();
    } else if (monthSmall !== '' && daySmall !== '') {
      return (year + '-' + monthSmall + '-' + daySmall).toString();
    } else {
      return (year + '-' + month + '-' + day).toString();
    }
  }

  // ==========================================================================================

  public getCorrectDay(days) {
    const date = new Date();
    const last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    const day = last.getDate();
    const month = 1 + last.getMonth();
    // const year = last.getFullYear();
    return (day + '/' + month).toString();
  }

  // ==========================================================================================

  public barchart(Mon, Tue, Wed, Thu, Fri, Sat, Sun): void {
    // const date = new Date();

    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      title: {},
      data: [{
        type: 'column',
        dataPoints: [
          {y: Mon, label: this.getCorrectDay(6)},
          {y: Tue, label: this.getCorrectDay(5)},
          {y: Wed, label: this.getCorrectDay(4)},
          {y: Thu, label: this.getCorrectDay(3)},
          {y: Fri, label: this.getCorrectDay(2)},
          {y: Sat, label: this.getCorrectDay(1)},
          {y: Sun, label: this.getCorrectDay(0)}
        ]
      }]
    });

    chart.render();
  }

  // ==========================================================================================

  public pieChart(val1, val2, val3): void {
    const chart = new CanvasJS.Chart('chartContainer2', {
      // light2 or dark2
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      title: {},
      data: [{
        type: 'doughnut',
        showInLegend: true,
        toolTipContent: '<b>{name}</b>: {y} (#percent%)',
        indexLabel: '{name} - #percent%',
        dataPoints: [
          {y: val2, name: 'Unknown'},
          {y: val1, name: 'Cleared'},
          {y: val3, name: 'Threat'}
        ]
      }]
    });

    chart.class = 'chartJS';
    chart.render();
  }

// ==========================================================================================
  // private ChartItems: ChartService;

  ngOnInit(): void {
    this.appService.setTitle('Dashboard');
    this.calculateNumberOfPeople();
    this.calculateNumberOfNotifications();
    // this.getCameras();
    // this.newCam('http://102.132.160.185:5231/feed/0', '1');
    // this.newCam2('http://102.132.160.185:5231/feed/1', '2');

    this.noCamOnline();
    this.newCam('', '1');
    this.newCam2('', '2');
  }

  public noCamOnline(): void {
    const liveFeedDiv = document.getElementById('liveFeedDiv');
    const noCam = document.createElement('div');
    noCam.innerHTML = 'Currently no cameras detected! Please check that your Raspberry Pi is online.';

    const noCamIcon = document.createElement('i');
    noCamIcon.setAttribute('class', 'material-icons');
    noCamIcon.innerHTML = 'videocam_off';

    liveFeedDiv.appendChild(noCamIcon);
    liveFeedDiv.appendChild(noCam);
  }

  public toggleCam(): void {
    this.showCam = !this.showCam;
  }

  private getCameras() {
    let numCams = 0;
    let camAdded = false;
    let noCamMessage = false;
    const thisRef = this;

    const camUrls = ['http://102.132.160.185:5231/feed/0', 'http://102.132.160.185:5231/feed/1'];

    function newCam(currentUrl, currentNum) {
      // console.log(currentUrl);
      const liveFeedDiv = document.getElementById('liveFeedDiv');
      const newCamFeed = document.createElement('iframe');
      newCamFeed.src = currentUrl;
      newCamFeed.width = '500';
      newCamFeed.height = '300';
      newCamFeed.setAttribute('class', 'liveCamera');
      newCamFeed.setAttribute('id', 'cam' + currentNum);
      newCamFeed.hidden = false;

      const toggleCam = document.createElement('a');
      toggleCam.setAttribute('class', 'material-icons toggleCam');
      toggleCam.setAttribute('title', 'Toggle Camera');

      toggleCam.setAttribute('id', 'toggleCam' + currentNum);
      toggleCam.innerText = 'videocam';
      toggleCam.hidden = false;

      const camNum = document.createElement('div');
      camNum.className = 'top-left hoverPointer';
      camNum.innerHTML = 'Camera ' + currentNum + ': ';
      camNum.appendChild(toggleCam);

      const camOffMsg = document.createElement('div');
      camOffMsg.className = 'camOffMsg';
      camOffMsg.innerHTML = 'Camera ' + currentNum + ' is switched off.';
      camOffMsg.hidden = true;

      const gridItem = document.createElement('div');
      gridItem.setAttribute('class', 'grid-item');
      gridItem.id = 'gridItem' + currentNum;
      gridItem.appendChild(camNum);
      gridItem.appendChild(camOffMsg);
      gridItem.appendChild(newCamFeed);

      if (camAdded) {
        const gridContainer = document.getElementById('cameraGrid');
        gridContainer.appendChild(gridItem);
        liveFeedDiv.appendChild(gridContainer);
      } else {
        const gridContainer = document.createElement('div');
        gridContainer.setAttribute('class', 'grid-container');
        gridContainer.setAttribute('id', 'cameraGrid');
        gridContainer.appendChild(gridItem);

        liveFeedDiv.appendChild(gridContainer);
      }

      camAdded = true;

      function camToggleFunc() {
        newCamFeed.hidden = !newCamFeed.hidden;
        camOffMsg.hidden = !camOffMsg.hidden;
        if (toggleCam.innerText === 'videocam') {
          toggleCam.innerText = 'videocam_off';
        } else {
          toggleCam.innerText = 'videocam';
        }
      }

      camNum.onclick = camToggleFunc;
    }

    camUrls.forEach(item => {
      const request = new XMLHttpRequest();
      request.open('GET', item, true);
      // tslint:disable-next-line:only-arrow-functions
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          thisRef.stopSpin();
          if (request.status !== 200) {
            if (!noCamMessage) {
              noCamMessage = true;
              const liveFeedDiv = document.getElementById('liveFeedDiv');
              const noCam = document.createElement('div');
              noCam.innerHTML = 'Currently no cameras online';

              const noCamIcon = document.createElement('i');
              noCamIcon.setAttribute('class', 'material-icons');
              noCamIcon.innerHTML = 'videocam_off';

              liveFeedDiv.appendChild(noCamIcon);
              liveFeedDiv.appendChild(noCam);
            }
          } else {
            numCams++;
            noCamMessage = true;
            document.getElementById('liveIcon').setAttribute('class', 'material-icons liveIcon-enable');
            document.getElementById('liveIcon').removeAttribute('liveIcon-disable');
            newCam(item, numCams);
          }
        }
      };
      request.send();
    });
  }

  stopSpin() {
    document.getElementById('loadingDiv').style.display = 'none';
    document.getElementById('liveFeedDiv').style.height = 'fit-content';
  }

  newCam(currentUrl, currentNum) {
    document.getElementById('liveIcon').setAttribute('class', 'material-icons liveIcon-enable');
    document.getElementById('liveIcon').removeAttribute('liveIcon-disable');
    const liveFeedDiv = document.getElementById('liveFeedDiv');
    const newCamFeed = document.createElement('img');
    // newCamFeed.frameBorder = '0';
    newCamFeed.src = currentUrl;
    // newCamFeed.width = '500';
    // newCamFeed.height = '300';
    newCamFeed.setAttribute('class', 'liveCamera');
    newCamFeed.setAttribute('id', 'cam' + currentNum);
    newCamFeed.hidden = false;

    const toggleCam = document.createElement('a');
    toggleCam.setAttribute('class', 'material-icons toggleCam');
    toggleCam.setAttribute('title', 'Toggle Camera');

    toggleCam.setAttribute('id', 'toggleCam' + currentNum);
    toggleCam.innerText = 'videocam';
    toggleCam.hidden = false;

    const camNum = document.createElement('div');
    camNum.className = 'top-left hoverPointer';
    camNum.innerHTML = 'Camera ' + currentNum + ': ';
    camNum.appendChild(toggleCam);

    const camOffMsg = document.createElement('div');
    camOffMsg.className = 'camOffMsg';
    camOffMsg.innerHTML = 'Camera ' + currentNum + ' is switched off.';
    camOffMsg.hidden = true;

    const gridItem = document.createElement('div');
    gridItem.setAttribute('class', 'grid-item');
    gridItem.id = 'gridItem' + currentNum;
    gridItem.appendChild(camNum);
    gridItem.appendChild(camOffMsg);
    gridItem.appendChild(newCamFeed);

    const gridContainer = document.createElement('div');
    gridContainer.setAttribute('class', 'grid-container');
    gridContainer.setAttribute('id', 'cameraGrid');
    gridContainer.appendChild(gridItem);

    liveFeedDiv.appendChild(gridContainer);
    // if (camAdded) {
    //   const gridContainer = document.getElementById('cameraGrid');
    //   gridContainer.appendChild(gridItem);
    //   liveFeedDiv.appendChild(gridContainer);
    // } else {
    //   const gridContainer = document.createElement('div');
    //   gridContainer.setAttribute('class', 'grid-container');
    //   gridContainer.setAttribute('id', 'cameraGrid');
    //   gridContainer.appendChild(gridItem);
    //
    //   liveFeedDiv.appendChild(gridContainer);
    // }

    function camToggleFunc() {
      newCamFeed.hidden = !newCamFeed.hidden;
      camOffMsg.hidden = !camOffMsg.hidden;
      if (toggleCam.innerText === 'videocam') {
        toggleCam.innerText = 'videocam_off';
      } else {
        toggleCam.innerText = 'videocam';
      }
    }

    camNum.onclick = camToggleFunc;
  }

  newCam2(currentUrl, currentNum) {
    const liveFeedDiv = document.getElementById('liveFeedDiv');
    const newCamFeed = document.createElement('img');
    // newCamFeed.frameBorder = '0';
    newCamFeed.src = currentUrl;
    // newCamFeed.width = '500';
    // newCamFeed.height = '300';
    newCamFeed.setAttribute('class', 'liveCamera');
    newCamFeed.setAttribute('id', 'cam' + currentNum);
    newCamFeed.hidden = false;

    const toggleCam = document.createElement('a');
    toggleCam.setAttribute('class', 'material-icons toggleCam');
    toggleCam.setAttribute('title', 'Toggle Camera');

    toggleCam.setAttribute('id', 'toggleCam' + currentNum);
    toggleCam.innerText = 'videocam';
    toggleCam.hidden = false;

    const camNum = document.createElement('div');
    camNum.className = 'top-left hoverPointer';
    camNum.innerHTML = 'Camera ' + currentNum + ': ';
    camNum.appendChild(toggleCam);

    const camOffMsg = document.createElement('div');
    camOffMsg.className = 'camOffMsg';
    camOffMsg.innerHTML = 'Camera ' + currentNum + ' is switched off.';
    camOffMsg.hidden = true;

    const gridItem = document.createElement('div');
    gridItem.setAttribute('class', 'grid-item');
    gridItem.id = 'gridItem' + currentNum;
    gridItem.appendChild(camNum);
    gridItem.appendChild(camOffMsg);
    gridItem.appendChild(newCamFeed);

    const gridContainer = document.getElementById('cameraGrid');
    gridContainer.appendChild(gridItem);
    liveFeedDiv.appendChild(gridContainer);

    // if (camAdded) {
    //   const gridContainer = document.getElementById('cameraGrid');
    //   gridContainer.appendChild(gridItem);
    //   liveFeedDiv.appendChild(gridContainer);
    // } else {
    //   const gridContainer = document.createElement('div');
    //   gridContainer.setAttribute('class', 'grid-container');
    //   gridContainer.setAttribute('id', 'cameraGrid');
    //   gridContainer.appendChild(gridItem);
    //
    //   liveFeedDiv.appendChild(gridContainer);
    // }

    function camToggleFunc() {
      newCamFeed.hidden = !newCamFeed.hidden;
      camOffMsg.hidden = !camOffMsg.hidden;
      if (toggleCam.innerText === 'videocam') {
        toggleCam.innerText = 'videocam_off';
      } else {
        toggleCam.innerText = 'videocam';
      }
    }

    camNum.onclick = camToggleFunc;
  }
}
