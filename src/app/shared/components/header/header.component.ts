import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/modules/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  user: any = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.displayUserName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.displayUserName();
  }

  logoutUser(): void {
    this.authService.logOut();
    this.router.navigate([``]);
  }

  toggleSideBar(): void {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  displayUserName(): void {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.userData?.id;
    }
  }
}
