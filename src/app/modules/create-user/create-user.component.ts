import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, interval } from 'rxjs';
import { UserService } from '../user.service';
import { DashboardService } from '../dashboard.service';
import { User } from 'src/app/shared/models/User';
import { ConfirmedValidator } from 'src/app/shared/models/CustomValidators';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit, OnDestroy, AfterViewInit {
  userFormGroup!: FormGroup;
  userName: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);
  rtPassword: FormControl = new FormControl('', [Validators.required]);

  dataSource = new MatTableDataSource<User>();
  subscriptions: Subscription[] = [];
  users: any = [];
  thumbNails: any = [];
  buttonTitle: string = '';
  updateUserBtn: boolean = false;
  public showPassword: boolean = false;
  public showRTPassword: boolean = false;

  @ViewChild('paginatorUR')
  paginatorUR!: MatPaginator;

  displayedColumns: string[] = ['indexCoumn', 'id', 'userName'];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dashboardService: DashboardService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.dataSource.paginator = this.paginatorUR;
    this.createForm();
    this.getAllUsers();
    this.getThumbNails();
    this.buttonTitle = 'Create User';
    this.updateUserBtn = false;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorUR;
  }

  get f() {
    return this.userFormGroup.controls;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public toggleRTPasswordVisibility(): void {
    this.showRTPassword = !this.showRTPassword;
  }

  getAllUsers(): void {
    const sub1: any = this.userService.getAllUsers().subscribe((data) => {
      this.dataSource.data = data;
      console.log('users: ', data);
      this.changeDetectorRefs.detectChanges();
    });

    this.subscriptions.push(sub1);
  }

  getUserById(userID: string): void {
    const sub1: any = this.userService
      .fetchUserById(userID)
      .subscribe((data) => {
        const user: any = data;
        console.log('user fetch: ', user);
      });

    this.subscriptions.push(sub1);
  }

  createOrUpdateUser(): void {
    if (this.updateUserBtn) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser(): void {
    let user: User = {
      id: '',
      userName: '',
      password: '',
      isActive: '',
    };
    user.id = this.userFormGroup.controls.userName.value
      ? this.userFormGroup.controls.userName.value.split(' ')[0]
      : '';
    user.userName = this.userFormGroup.controls.userName.value
      ? this.userFormGroup.controls.userName.value
      : '';
    user.password = this.userFormGroup.controls.password.value
      ? this.userFormGroup.controls.password.value
      : '';
    user.isActive = this.userFormGroup.controls.userName.value ? 'Y' : 'N';

    if (user.userName) {
      const sub2: any = this.userService.createUser(user).subscribe((data) => {
        console.log('isSuccess: ', data);
        this.getAllUsers();
      });
      this.subscriptions.push(sub2);
    }
  }

  createForm(): void {
    this.userFormGroup = this.formBuilder.group(
      {
        userName: this.userName,
        password: this.password,
        rtPassword: this.rtPassword,
      },
      {
        validator: ConfirmedValidator('password', 'rtPassword'),
      }
    );
  }

  updateUser(): void {
    let user: User = {
      id: '',
      userName: '',
      password: '',
      isActive: '',
    };
    user.id = this.userFormGroup.controls.userName.value
      ? this.userFormGroup.controls.userName.value.split(' ')[0]
      : '';
    user.userName = this.userFormGroup.controls.userName.value
      ? this.userFormGroup.controls.userName.value
      : '';
    user.password = this.userFormGroup.controls.password.value
      ? this.userFormGroup.controls.password.value
      : '';
    user.isActive = this.userFormGroup.controls.userName.value ? 'Y' : 'N';

    if (user.userName) {
      const sub2: any = this.userService.updateUser(user).subscribe((data) => {
        console.log('isSuccess: ', data);
        this.getAllUsers();
      });
      this.subscriptions.push(sub2);
    }
  }

  onSelect(row: any): void {
    console.log('row: ', row);
    this.userName.setValue(row.userName);
    this.password.setValue(row.password);
    this.rtPassword.setValue(row.password);
    this.buttonTitle = 'Update User';
    this.updateUserBtn = true;
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
      console.log('thumbnails: ', this.thumbNails);
    });
  }

  clearFields(): void {
    this.userFormGroup.reset();
    this.buttonTitle = 'Create User';
    this.updateUserBtn = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
