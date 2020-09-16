import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LiveFeedComponent} from './Dashboard/live-feed/live-feed.component';
import {DashboardComponent} from './Dashboard/dashboard/dashboard.component';
import {FooterComponent} from './Dashboard/footer/footer.component';
import {LoginComponent} from './Dashboard/login/login.component';
import {SettingsComponent} from './Dashboard/settings/settings.component';
import {SideNavComponent} from './Dashboard/side-nav/side-nav.component';
import {TopNavComponent} from './Dashboard/top-nav/top-nav.component';
import {ViewUserComponent} from './User/view-user/view-user.component';
import {AddUserComponent} from './User/add-user/add-user.component';
import {EditUserComponent} from './User/edit-user/edit-user.component';
import {DeletedUsersComponent} from './User/deleted-users/deleted-users.component';
import {ListUsersComponent} from './User/list-users/list-users.component';
import {UserProfileComponent} from './User/user-profile/user-profile.component';
import {PeopleWhiteComponent} from './Person/people-white/people-white.component';
import {PeopleBlackComponent} from './Person/people-black/people-black.component';
import {PeopleGreyComponent} from './Person/people-grey/people-grey.component';
import {AddPersonComponent} from './Person/add-person/add-person.component';
import {EditPersonComponent} from './Person/edit-person/edit-person.component';
import {DeletedWhiteComponent} from './Person/deleted-white/deleted-white.component';
import {DeletedBlackComponent} from './Person/deleted-black/deleted-black.component';
import {NotificationComponent} from './Dashboard/notification/notification.component';
import {ResetPasswordComponent} from './Dashboard/reset-password/reset-password.component';
import {VehicleWhiteComponent} from './Vehicle/vehicle-white/vehicle-white.component';
import {VehicleBlackComponent} from './Vehicle/vehicle-black/vehicle-black.component';
import {VehicleGreyComponent} from './Vehicle/vehicle-grey/vehicle-grey.component';
import {AddVehicleComponent} from './Vehicle/add-vehicle/add-vehicle.component';
import {EditVehicleComponent} from './Vehicle/edit-vehicle/edit-vehicle.component';
import {RemovedWhiteComponent} from './Vehicle/removed-white/removed-white.component';
import {RemovedBlackComponent} from './Vehicle/removed-black/removed-black.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, data: {title: 'Login | Argus'}},
  {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard | Argus'}},
  {path: 'user-profile', component: UserProfileComponent, data: {title: 'User Profile | Argus'}},
  {path: 'user-list', component: ListUsersComponent, data: {title: 'User List | Argus'}},
  {path: 'add-user', component: AddUserComponent, data: {title: 'Add User | Argus'}},
  {path: 'deleted-users', component: DeletedUsersComponent, data: {title: 'Deleted Users | Argus'}},
  {path: 'edit-user/:id', component: EditUserComponent, data: {title: 'Edit User | Argus'}},
  {path: 'view-user/:id', component: ViewUserComponent, data: {title: 'View User | Argus'}},
  {path: 'people-cleared', component: PeopleWhiteComponent, data: {title: 'Person White-List | Argus'}},
  {path: 'people-unknown', component: PeopleGreyComponent, data: {title: 'Person Grey-List | Argus'}},
  {path: 'people-threat', component: PeopleBlackComponent, data: {title: 'Person Black-List | Argus'}},
  {path: 'deleted-cleared', component: DeletedWhiteComponent, data: {title: 'Deleted Person White-List | Argus'}},
  {path: 'deleted-threat', component: DeletedBlackComponent, data: {title: 'Deleted Person Black-List | Argus'}},
  {path: 'add-person', component: AddPersonComponent, data: {title: 'Add Person | Argus'}},
  {path: 'edit-person/:id', component: EditPersonComponent, data: {title: 'Edit Person | Argus'}},
  {path: 'settings', component: SettingsComponent, data: {title: 'Notifications | Argus'}},
  {path: 'live-feed', component: LiveFeedComponent, data: {title: 'Live Feed | Argus'}},
  {path: 'notification', component: NotificationComponent, data: {title: 'Notifications | Argus'}},
  {path: 'reset-password', component: ResetPasswordComponent, data: {title: 'Reset Password | Argus'}},
  {path: 'vehicles-cleared', component: VehicleWhiteComponent, data: {title: 'Vehicle White-List | Argus'}},
  {path: 'vehicles-unknown', component: VehicleGreyComponent, data: {title: 'Vehicle Grey-List | Argus'}},
  {path: 'vehicles-threat', component: VehicleBlackComponent, data: {title: 'Vehicle Black-List | Argus'}},
  {path: 'removed-cleared', component: RemovedWhiteComponent, data: {title: 'Deleted Vehicle White-List | Argus'}},
  {path: 'removed-threat', component: RemovedBlackComponent, data: {title: 'Deleted Vehicle Black-List | Argus'}},
  {path: 'add-vehicle', component: AddVehicleComponent, data: {title: 'Add Vehicle | Argus'}},
  {path: 'edit-vehicle/:id', component: EditVehicleComponent, data: {title: 'Edit Vehicle | Argus'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}