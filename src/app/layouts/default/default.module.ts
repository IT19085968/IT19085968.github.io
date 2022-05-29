import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DefaultComponent } from './default.component';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DashboardService } from '../../modules/dashboard.service';
import { TransactionService } from '../../modules/transaction.service';
import { UserService } from '../../modules/user.service';
import { AuthService } from '../../modules/auth.service';
import { AuthGuardService } from '../../modules/auth-guard.service';
import { TerminalsService } from 'src/app/modules/terminals.service';
import { ReportsService } from 'src/app/modules/reports.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { DateFormat } from 'src/app/constants/date-format';
import { TransactionsComponent } from '../../modules/transactions/transactions.component';
import { DispenserStatusComponent } from '../../modules/dispenser-status/dispenser-status.component';
import { CreateUserComponent } from '../../modules/create-user/create-user.component';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { TankInfoComponent } from 'src/app/modules/tank-info/tank-info.component';
import { UpdateRecordsComponent } from 'src/app/modules/update-records/update-records.component';
import { TerminalsComponent } from 'src/app/modules/terminals/terminals.component';
import { ReportsComponent } from 'src/app/modules/reports/reports.component';
import { ReportGenComponent } from 'src/app/modules/report-gen/report-gen.component';
@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    TransactionsComponent,
    DispenserStatusComponent,
    CreateUserComponent,
    LoginComponent,
    TankInfoComponent,
    UpdateRecordsComponent,
    TerminalsComponent,
    ReportsComponent,
    ReportGenComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
  ],
  providers: [
    DashboardService,
    TransactionService,
    UserService,
    AuthService,
    AuthGuardService,
    TerminalsService,
    ReportsService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat },
  ],
})
export class DefaultModule {}
