import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { Subscription, Observable, BehaviorSubject, interval } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TerminalsService } from '../terminals.service';
import { AuthService } from 'src/app/modules/auth.service';
import { PriceSign } from 'src/app/shared/models/PriceSign';
import { User } from '../../shared/models/User';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-update-records',
  templateUrl: './update-records.component.html',
  styleUrls: ['./update-records.component.scss'],
})
export class UpdateRecordsComponent implements OnInit, AfterViewInit {
  updateRecordsFormGroup!: FormGroup;
  panalID: FormControl = new FormControl();
  productID: FormControl = new FormControl();
  productName: FormControl = new FormControl();
  productPrice: FormControl = new FormControl();

  subscriptions: Subscription[] = [];
  thumbNails: any = [];
  rowData: PriceSign = {
    panalID: '',
    productID: '',
    productName: '',
    productPrice: '',
    updatedBy: '',
    updatedAt: '',
  };

  dataSource = new MatTableDataSource<any>();

  @ViewChild('paginatorUR')
  paginatorUR!: MatPaginator;

  displayedColumns: string[] = [
    'indexCoumn',
    'panalID',
    'productID',
    'productName',
    'productPrice',
    'updatedAt',
    'updatedBy',
  ];

  user: any = {
    id: '',
    userName: '',
    password: '',
    isActive: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private terminalsService: TerminalsService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getPriceSignInfo();
    this.getThumbNails();
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.userData;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorUR;
  }

  createForm(): void {
    this.updateRecordsFormGroup = this.formBuilder.group({
      panalID: this.panalID,
      productID: this.productID,
      productName: this.productName,
      productPrice: this.productPrice,
      indPrice: false,
      changingPrice: 0,
    });
  }

  getPriceSignInfo(): void {
    this.terminalsService.getPriceSign().subscribe((data) => {
      this.dataSource.data = data;
      this.changeDetectorRefs.detectChanges();
    });
  }

  updatePrice(): void {
    let priceSign: any = {
      panalID: '',
      productID: '',
      productPrice: '',
      updatedBy: '',
    };
    priceSign.panalID = this.updateRecordsFormGroup.controls.panalID.value
      ? this.updateRecordsFormGroup.controls.panalID.value
      : '';
    priceSign.productID = this.updateRecordsFormGroup.controls.productID.value
      ? this.updateRecordsFormGroup.controls.productID.value
      : '';

    priceSign.productPrice = this.updateRecordsFormGroup.controls.productPrice
      .value
      ? this.updateRecordsFormGroup.controls.productPrice.value
      : '';
    priceSign.updatedBy = this.user.id;

    const isIndividual: boolean =
      this.updateRecordsFormGroup.controls.indPrice.value;

    let priceSignEach: any = {
      panalID: '',
      productID: '',
      productPrice: '',
      updatedBy: '',
    };
    let productsArray: any = [];

    if (priceSign.panalID && priceSign.productPrice) {
      if (isIndividual) {
        const sub2: any = this.terminalsService
          .postPriceSign([priceSign])
          .subscribe((data) => {
            console.log('isSuccessS: ', data);
            this.getPriceSignInfo();
          });
        this.subscriptions.push(sub2);
      } else {
        const priceChange: number =
          +this.updateRecordsFormGroup.controls.changingPrice.value;

        if (priceChange) {
          productsArray = [];

          this.dataSource.data.forEach((e: any) => {
            const priceSignEach2: any = {
              panalID: '',
              productID: '',
              productPrice: '',
              updatedBy: '',
            };
            const curPrice: number = +e.productPrice;
            const totalPrice: number = +priceChange + +curPrice;
            priceSignEach2.panalID = e.panalID;
            priceSignEach2.productID = e.productID;
            priceSignEach2.productPrice = totalPrice.toString();
            priceSignEach2.updatedBy = this.user.id;
            productsArray.push(priceSignEach2);
          });

          const sub3: any = this.terminalsService
            .postPriceSign(productsArray)
            .subscribe((data) => {
              this.getPriceSignInfo();
              console.log('isSuccessM: ', data);
            });
          this.subscriptions.push(sub3);
        }
      }
    }
  }

  onSelect(row: any): void {
    console.log('row: ', row);
    this.panalID.setValue(row.panalID);
    this.productID.setValue(row.productID);
    this.productName.setValue(row.productName);
    this.productPrice.setValue(row.productPrice);
    this.rowData = row;
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
      console.log('thumbnails: ', this.thumbNails);
    });
  }

  priceChangePerLitre(): void {
    const priceChange: any = this.updateRecordsFormGroup.controls.changingPrice
      .value
      ? this.updateRecordsFormGroup.controls.changingPrice.value
      : 0;
    if (priceChange !== null) {
      const currentPrice: any = +this.rowData.productPrice
        ? +this.rowData.productPrice
        : this.updateRecordsFormGroup.controls.productPrice.value;
      let total: number = 0;
      const newPriceChange: number = Math.abs(priceChange);

      let b1: any = currentPrice.toString().split('.');
      let b1_max: number = 0;
      if (b1.length === 2) {
        b1_max = b1[1].length;
      }

      let c1: any = newPriceChange.toString().split('.');
      let c1_max: number = 0;
      if (c1.length == 2) {
        c1_max = c1[1].length;
      }

      let max_len = b1_max > c1_max ? b1_max : c1_max;
      if (priceChange > 0) {
        total = Number((currentPrice + newPriceChange).toFixed(max_len));
      } else {
        total = Number((currentPrice - newPriceChange).toFixed(max_len));
      }

      // }

      this.updateRecordsFormGroup.controls.productPrice.setValue(total);
    }
  }

  clearFields(): void {
    this.updateRecordsFormGroup.reset();
  }
}
