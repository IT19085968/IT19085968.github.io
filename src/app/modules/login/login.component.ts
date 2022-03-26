import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, interval } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { AuthService } from 'src/app/modules/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  userFormGroup!: FormGroup;
  userName: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);
  rtPassword: FormControl = new FormControl('', [Validators.required]);

  invalidCredentialMsg: string = '';
  retUrl: any = '';

  subscriptions: Subscription[] = [];
  public showPassword: boolean = false;
  isUserLoggedIn: boolean = false;
  loggedUserName: string = '';
  user: User = {
    id: '',
    userName: '',
    password: '',
    isActive: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.retUrl = params.get('retUrl');
      console.log('LoginComponent/ngOnInit ' + this.retUrl);
    });
    this.createForm();
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  createForm(): void {
    this.userFormGroup = this.formBuilder.group({
      userName: this.userName,
      password: this.password,
      rtPassword: this.rtPassword,
    });
  }

  openSweetAlertSuccess(): void {
    // Swal.fire({
    //     text: 'Login Successful!',
    //     icon: 'success'
    //   });
    // Swal.fire({
    //   title: 'Loading data.. Please wait',
    // });
    Swal.fire('Loading data...', 'Please wait');
    Swal.showLoading();
  }

  openSweetAlertFail(): void {
    Swal.fire({
      title: 'Login Unsuccessful!',
      text: 'Incorrect username or password',
      customClass: 'swal-height',
      icon: 'error',
    });
    // Swal.fire('Login Unsuccessful!', 'Incorrect username or password', 'error');
  }

  loginUser(): void {
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

    if (user.userName && user.password) {
      // const sub2: any = this.userService.createUser(user).subscribe((data) => {
      //   console.log('isSuccess: ', data);
      // });
      // this.subscriptions.push(sub2);
      const sub2: any = this.authService
        .fetchUserById(user.id)
        .subscribe((data) => {
          // console.log('return to ' + this.retUrl);
          let pwd: any = this.userFormGroup.controls.password.value
            ? this.userFormGroup.controls.password.value
            : null;
          if (data.length > 0 && pwd && pwd === data[0].password) {
            console.log('success');
            this.openSweetAlertSuccess();
            this.retUrl = 'default';
            this.user = data[0];
            this.authService.setSessionStorage(this.user);
            this.isUserLoggedIn = this.authService.isLoggedIn();
            this.loggedUserName = this.getUserData();
            if (this.retUrl != null) {
              this.router.navigate([this.retUrl]);
            } else {
              this.router.navigate(['']);
            }
            // this.goToDashboard();
          } else {
            console.log('fail');
            this.openSweetAlertFail();
          }
          // console.log('user: ', data);
        });
      // this.authService.fetchUserById(user.id);

      // this.subscriptions.push(sub2);
    }
  }

  goToDashboard() {
    this.router.navigate([`\default`]);
  }

  getUserData(): any {
    return this.authService.userData?.userName;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
