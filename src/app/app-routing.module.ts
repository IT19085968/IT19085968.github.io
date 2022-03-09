import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PostsComponent } from './modules/posts/posts.component';
import { TransactionsComponent } from './modules/transactions/transactions.component';
import { DispenserStatusComponent } from './modules/dispenser-status/dispenser-status.component';
import { CreateUserComponent } from './modules/create-user/create-user.component';
import { LoginComponent } from './modules/login/login.component';
import { TankInfoComponent } from './modules/tank-info/tank-info.component';
import { AuthGuardService } from './modules/auth-guard.service';
import { TransactionsForDayComponent } from './modules/transactions-for-day/transactions-for-day.component';
import { UpdateRecordsComponent } from './modules/update-records/update-records.component';
import { TerminalsComponent } from './modules/terminals/terminals.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'default',
    component: DefaultComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'posts',
        component: PostsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'dispenserStatus',
        component: DispenserStatusComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'createUser',
        component: CreateUserComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'tankInformation',
        component: TankInfoComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'transactionsForDay',
        component: TransactionsForDayComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'updateRecords',
        component: UpdateRecordsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'terminals',
        component: TerminalsComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
