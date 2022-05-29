import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ReportsService } from '../reports.service';

const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DashboardService } from '../dashboard.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-report-gen',
  templateUrl: './report-gen.component.html',
  styleUrls: ['./report-gen.component.scss']
})
export class ReportGenComponent implements OnInit, OnDestroy {
  // @Input() reportType:string;

  reportT: any = '';
  disp: any = '';
  // report: any = '';
  sales: any = [];
  pumps: any = [];
  terminals: any = [];
  subscriptions: Subscription[] = [];

  thumbNails: any = [];

  reportsFormGroup!: FormGroup;

  constructor(private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private reportsService: ReportsService) { }

  ngOnInit(): void {
    this.reportT = this._Activatedroute.snapshot.paramMap.get('id');
    console.log('reportT:', this.reportT);
    this.getThumbNails();
    this.displayReportType();
    this.createDeliveryForm();
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
    });
  }

  displayReportType(): void {
    switch (this.reportT) {
      case "1": {
        this.disp = 'Total Sales'
        break;
      }
      case "2": {
        this.disp = 'Pay Mode Wise Sales'
        break;
      }
      case "3": {
        this.disp = 'Pump and Terminal Wise Sales'
        break;
      }
      case "4": {
        this.disp = 'Sales Comparison'
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
  }

  createDeliveryForm(): void {
    this.reportsFormGroup = this.formBuilder.group({
      FromDate: [''],
      ToDate: [''],
    });
  }

  getReport(e: any): void {
    const filter: any = {};

    filter.FromDate = this.reportsFormGroup?.value.FromDate
      ? moment(this.reportsFormGroup?.value.FromDate).format(
        'YYYY-MM-DD'
      )
      : null;
    filter.ToDate = this.reportsFormGroup?.value.ToDate
      ? moment(this.reportsFormGroup?.value.ToDate).format('YYYY-MM-DD')
      : null;

    if (this.reportT === "1") {
      const subscription: any = this.reportsService
        .getSalesTotalReport(filter.FromDate, filter.ToDate)
        .subscribe((data) => {
          this.sales = data;
          this.generatePDF(filter.FromDate, filter.ToDate, e);
        });
      this.subscriptions.push(subscription);
    }

    if (this.reportT === "2") {
      const subscription: any = this.reportsService
        .getPMWiseReport(filter.FromDate, filter.ToDate)
        .subscribe((data) => {
          this.sales = data;
          this.generatePMWisePDF(filter.FromDate, filter.ToDate, e);
        });
      this.subscriptions.push(subscription);
    }

    if (this.reportT === "3") {
      const reports: any[] = [];
      const pumpReport$: Observable<any> = this.reportsService.getPumps(filter.FromDate, filter.ToDate);
      reports.push(pumpReport$);
      const terminalReport$: Observable<any> = this.reportsService.getTerminals(filter.FromDate, filter.ToDate);
      reports.push(terminalReport$);

      const subscription: any = forkJoin(reports).subscribe((responses: any[]) => {
        this.sales = responses;
        if (responses[0].length > 0) {
          this.pumps = responses[0];
        }
        if (responses[1].length > 0) {
          this.terminals = responses[1];
        }
        this.generatePumpsAndTerminalsPDF(filter.FromDate, filter.ToDate, e);
      });
      this.subscriptions.push(subscription);
    }

    if (this.reportT === "4") {
      const subscription: any = this.reportsService
        .getSalesComparison(filter.FromDate, filter.ToDate)
        .subscribe((data) => {
          this.sales = data;
          this.generateSalesComparisonPDF(filter.FromDate, filter.ToDate, e);
        });
      this.subscriptions.push(subscription);
    }

  }

  clearFieldsDel(): void {
    this.reportsFormGroup.reset();
    this.sales = [];
  }

  generatePDF(fromDate: any, ToDate: any, e: any) {
    if (this.reportT === "1") {
      const docDefinition = {
        content:
          [
            {
              columns: [
                [
                  {
                    text: " ",
                    fontSize: 13,
                    // bold: true
                  },
                  // { text: "84 street, Baltimore" },
                  // { text: "jqhome@gmail.com" },
                  // { text: "51247862" }
                ],
                [
                  {
                    text: [
                      {
                        text: `Print Date :  `,
                        fontSize: 9,
                        alignment: 'right',
                        bold: true
                      },
                      {
                        text: `   ${moment(new Date()).format('YYYY/MM/DD')}`,
                        fontSize: 9,
                        alignment: 'right'
                      },

                    ]
                  },
                  {
                    text: [
                      {
                        text: `Print Time : `,
                        fontSize: 9,
                        alignment: 'right',
                        bold: true
                      },
                      {
                        text: `  ${new Date().toLocaleTimeString().replace("AM", "am").replace("PM", "pm")}`,
                        fontSize: 9,
                        alignment: 'right'
                      }
                    ]
                  }

                ]
              ]
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 10,
                  x2: 530, y2: 10,
                  lineWidth: 1
                },
              ]
            },
            {
              text: 'Sales Report',
              fontSize: 13,
              margin: 5,
              alignment: 'center'
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 0,
                  x2: 530, y2: 0,
                  lineWidth: 1
                },
              ]
            },
            {
              columns: [
                [
                  {

                    // bold: true
                    text: [
                      {
                        text: `\nFrom: `,
                        fontSize: 8,
                        bold: true
                      },
                      {
                        text: ` ${moment(new Date(fromDate)).format('YYYY-MM-DD')} \t\t\t\t`,
                        fontSize: 8,
                      },
                      {
                        text: `To: `,
                        fontSize: 8,
                        bold: true
                      },
                      {
                        text: ` ${moment(new Date(ToDate)).format('YYYY-MM-DD')} \n\n\n`,
                        fontSize: 8,
                      },
                    ]
                  },
                  // { text: "84 street, Baltimore" },
                  // { text: "jqhome@gmail.com" },
                  // { text: "51247862" }
                ],
              ]
            },
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [{ text: 'Receipt#', border: [false, false, false, true] }, { text: 'Date', border: [false, false, false, true] }, { text: 'Time', border: [false, false, false, true] }, { text: 'Pump', border: [false, false, false, true] }, { text: 'Blend', border: [false, false, false, true] }, { text: 'Quantity(Ltrs)', border: [false, false, false, true] }, { text: 'UnitPrice', border: [false, false, false, true] }, { text: 'Init Amount', border: [false, false, false, true] }, { text: 'Pay Mode', border: [false, false, false, true] }],
                  ...this.sales.map((p: any) => ([{ text: p.transactionNumber, border: [false, false, false, false] }, { text: moment(new Date(p.dDate)).format('YYYY/MM/DD'), border: [false, false, false, false] }, { text: p.dTime, border: [false, false, false, false] }, { text: p.pumpID, border: [false, false, false, false] }, { text: p.productName, border: [false, false, false, false] }, { text: parseFloat(p.quantity).toFixed(2), border: [false, false, false, false] }, { text: parseFloat(p.unitPrice).toFixed(2), border: [false, false, false, false] }, { text: parseFloat(p.amount).toFixed(2), border: [false, false, false, false] }, { text: p.cardType, border: [false, false, false, false] }])),
                  [{ text: 'Totals', colSpan: 3, border: [false, true, false, true] },
                  { text: '', border: [false, true, false, true] }, { text: '', border: [false, true, false, true] },
                  { text: '', border: [false, true, false, true] }, { text: '', border: [false, true, false, true] },
                  { text: this.sales.reduce((sum: any, p: any) => sum + parseFloat(p.quantity), 0).toFixed(2), border: [false, true, false, true] },
                  { text: '', border: [false, true, false, true] },
                  { text: this.sales.reduce((sum: any, p: any) => sum + parseFloat(p.amount), 0).toFixed(2), border: [false, true, false, true] },
                  { text: '', border: [false, true, false, true] }]

                ],
              },
              // layout: 'headerLineOnly',
              fontSize: 8,
            }
          ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          }
        }

      };
      // pdfMake.createPdf(docDefinition).open();
      if (e === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (e === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).open();
      }
    }

  }

  generatePMWisePDF(fromDate: any, ToDate: any, e: any) {
    if (this.reportT === "2") {
      const docDefinition = {
        content:
          [
            {
              columns: [
                [
                  {
                    text: " ",
                    fontSize: 13,
                    // bold: true
                  },
                  // { text: "84 street, Baltimore" },
                  // { text: "jqhome@gmail.com" },
                  // { text: "51247862" }
                ],
                [
                  {
                    text: [
                      {
                        text: `Print Date :  `,
                        fontSize: 9,
                        alignment: 'right',
                        bold: true
                      },
                      {
                        text: `   ${moment(new Date()).format('YYYY/MM/DD')}`,
                        fontSize: 9,
                        alignment: 'right'
                      },

                    ]
                  },
                  {
                    text: [
                      {
                        text: `Print Time : `,
                        fontSize: 9,
                        alignment: 'right',
                        bold: true
                      },
                      {
                        text: `  ${new Date().toLocaleTimeString().replace("AM", "am").replace("PM", "pm")}`,
                        fontSize: 9,
                        alignment: 'right'
                      }
                    ]
                  }

                ]
              ]
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 10,
                  x2: 530, y2: 10,
                  lineWidth: 1
                },
              ]
            },
            {
              text: 'Pay Mode Wise Sales Report',
              fontSize: 13,
              margin: 5,
              alignment: 'center'
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 0,
                  x2: 530, y2: 0,
                  lineWidth: 1
                },
              ]
            },
            {
              columns: [
                [
                  {

                    // bold: true
                    text: [
                      {
                        text: `\nFrom: `,
                        fontSize: 9,
                        bold: true
                      },
                      {
                        text: ` ${moment(new Date(fromDate)).format('YYYY-MM-DD')} \t\t\t\t`,
                        fontSize: 9,
                      },
                      {
                        text: `To: `,
                        fontSize: 9,
                        bold: true
                      },
                      {
                        text: ` ${moment(new Date(ToDate)).format('YYYY-MM-DD')} \n\n\n`,
                        fontSize: 9,
                      },
                    ]
                  },
                  // { text: "84 street, Baltimore" },
                  // { text: "jqhome@gmail.com" },
                  // { text: "51247862" }
                ],
              ]
            },
            {
              table: {
                headerRows: 1,
                widths: [100, 100, 100, 'auto'],
                body: [
                  [{ text: 'CardTypeName', border: [false, true, false, true],bold:true,fontSize: 9 }, 
                  { text: 'Quantity', border: [false, true, false, true],bold:true,fontSize: 9 }, 
                  { text: 'TotalAmt', border: [false, true, false, true],bold:true,fontSize: 9 }, 
                  { text: 'Date', border: [false, true, false, true],bold:true,fontSize: 9 },],
                  ...this.sales.map((p: any) => ([{ text: p.cardType, border: [false, false, false, false],fontSize: 8 }, 
                    { text: parseFloat(p.quantity).toFixed(2), border: [false, false, false, false],fontSize: 8 }, 
                    { text: parseFloat(p.totalAmt).toFixed(2), border: [false, false, false, false],fontSize: 8 },
                    { text: moment(new Date(p.dDate)).format('YYYY/MM/DD'), border: [false, false, false, false],fontSize: 8 }, 
                    
                    ])),
                  [{ text: '', border: [false, true, false, true],fontSize: 8 },
                  { text: this.sales.reduce((sum: any, p: any) => sum + parseFloat(p.quantity), 0).toFixed(2), border: [false, true, false, true],bold:true,fontSize: 8 },
                  { text: this.sales.reduce((sum: any, p: any) => sum + parseFloat(p.totalAmt), 0).toFixed(2), border: [false, true, false, true],bold:true,fontSize: 8 },
                  { text: '', border: [false, true, false, true] }]

                ],
              },
              // layout: 'headerLineOnly',
              // fontSize: 9,
            }
          ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          }
        }

      };
      // pdfMake.createPdf(docDefinition).open();
      if (e === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (e === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).open();
      }
    }

  }

  generatePumpsAndTerminalsPDF(fromDate: any, ToDate: any, e: any) {
    if (this.reportT === "3") {
      const docDefinition = {
        content:
          [
            {
              columns: [
                [
                  {
                    text: " ",
                    fontSize: 13,
                    // bold: true
                  },
                  // { text: "84 street, Baltimore" },
                  // { text: "jqhome@gmail.com" },
                  // { text: "51247862" }
                ],
                [
                  {
                    text: [
                      {
                        text: `Print Date :  `,
                        fontSize: 9,
                        alignment: 'right',
                        bold: true
                      },
                      {
                        text: `   ${moment(new Date()).format('YYYY/MM/DD')}`,
                        fontSize: 9,
                        alignment: 'right'
                      },

                    ]
                  },
                  {
                    text: [
                      {
                        text: `Print Time : `,
                        fontSize: 9,
                        alignment: 'right',
                        bold: true
                      },
                      {
                        text: `  ${new Date().toLocaleTimeString().replace("AM", "am").replace("PM", "pm")}`,
                        fontSize: 9,
                        alignment: 'right'
                      }
                    ]
                  }

                ]
              ]
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 10,
                  x2: 530, y2: 10,
                  lineWidth: 1
                },
              ]
            },
            {
              text: 'Pump & Terminal Wise Sales Report',
              fontSize: 13,
              margin: 5,
              alignment: 'center'
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 0,
                  x2: 530, y2: 0,
                  lineWidth: 1
                },
              ]
            },
            {
              columns: [
                [
                  {

                    // bold: true
                    text: [
                      {
                        text: `\nFrom: `,
                        fontSize: 9,
                        bold: true
                      },
                      {
                        text: ` ${moment(new Date(fromDate)).format('YYYY-MM-DD')} \t\t\t\t`,
                        fontSize: 9,
                      },
                      {
                        text: `To: `,
                        fontSize: 9,
                        bold: true
                      },
                      {
                        text: ` ${moment(new Date(ToDate)).format('YYYY-MM-DD')} \n\n\n`,
                        fontSize: 9,
                      },
                    ]
                  },
                  // { text: "84 street, Baltimore" },
                  // { text: "jqhome@gmail.com" },
                  // { text: "51247862" }
                ],
              ]
            },
            {
              columns: [
                [
                  {
                    text: "Pump Wise Sales",
                    fontSize: 11,
                    bold: true,
                    margin: 7,
                  },
                  {
                    table: {
                      headerRows: 1,
                      widths: ['auto', 'auto', 'auto', 'auto'],
                      body: [
                        [{ text: 'Pump', border: [false, true, false, true] },
                        { text: 'Quantity(Ltrs)', border: [false, true, false, true] },
                        { text: 'Amount', border: [false, true, false, true] },
                        { text: 'Date', border: [false, true, false, true] }],
                        ...this.pumps.map((p: any) => ([
                          { text: p.pumpID, border: [false, false, false, false] },
                          { text: parseFloat(p.quantity).toFixed(2), border: [false, false, false, false] },
                          { text: parseFloat(p.totalAmount).toFixed(2), border: [false, false, false, false] },
                          { text: moment(new Date(p.dDate)).format('YYYY/MM/DD'), bold: true, border: [false, false, false, false] },
                        ])),
                        [{ text: 'Totals', border: [false, false, false, true], bold: true },
                        { text: this.pumps.reduce((sum: any, p: any) => sum + parseFloat(p.quantity), 0).toFixed(2), border: [false, false, false, true], bold: true },
                        { text: this.pumps.reduce((sum: any, p: any) => sum + parseFloat(p.totalAmount), 0).toFixed(2), border: [false, false, false, true], bold: true },
                        { text: '', border: [false, false, false, true], bold: true }]

                      ],
                    },
                    // layout: 'headerLineOnly',
                    fontSize: 9,
                  }
                ],
                [
                  {
                    text: "Terminal Wise Sales",
                    fontSize: 11,
                    bold: true,
                    margin: 7,
                    border: true
                  },
                  {
                    table: {
                      headerRows: 1,
                      widths: ['auto', 'auto', 'auto', 'auto'],
                      body: [
                        [{ text: 'TerminalID', border: [false, true, false, true] },
                        { text: 'Quantity(Ltrs)', border: [false, true, false, true] },
                        { text: 'Amount', border: [false, true, false, true] },
                        { text: 'Date', border: [false, true, false, true] }],
                        ...this.terminals.map((p: any) => ([
                          { text: p.terminalID, border: [false, false, false, false] },
                          { text: parseFloat(p.quantity).toFixed(2), border: [false, false, false, false] },
                          { text: parseFloat(p.totalAmt).toFixed(2), border: [false, false, false, false] },
                          { text: moment(new Date(p.dDate)).format('YYYY/MM/DD'), bold: true, border: [false, false, false, false] },
                        ])),
                        [{ text: 'Totals', border: [false, false, false, true], bold: true },
                        { text: this.terminals.reduce((sum: any, p: any) => sum + parseFloat(p.quantity), 0).toFixed(2), border: [false, false, false, true], bold: true },
                        { text: this.terminals.reduce((sum: any, p: any) => sum + parseFloat(p.totalAmt), 0).toFixed(2), border: [false, false, false, true], bold: true },
                        { text: '', border: [false, false, false, true], bold: true }]

                      ],
                    },
                    // layout: 'lightHorizontalLines',
                    fontSize: 9,
                  },
                  // layout: 'headerLineOnly',
                ],
              ],
            },

          ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          }
        }

      };
      // pdfMake.createPdf(docDefinition).open();
      if (e === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (e === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).open();
      }
    }
  }

  generateSalesComparisonPDF(fromDate: any, ToDate: any, e: any) {
    if (this.reportT === "4") {
      const docDefinition = {
        content:
          [
            {
              columns: [
                [
                  {
                    text: " ",
                    fontSize: 13,
                    // bold: true
                  },
                  // { text: "84 street, Baltimore" },
                  // { text: "jqhome@gmail.com" },
                  // { text: "51247862" }
                ],
                [
                  {
                    text: [
                      {
                        text: `Print Date :  `,
                        fontSize: 9,
                        alignment: 'right',
                        bold: true
                      },
                      {
                        text: `   ${moment(new Date()).format('YYYY/MM/DD')}`,
                        fontSize: 9,
                        alignment: 'right'
                      },

                    ]
                  },
                  {
                    text: [
                      {
                        text: `Print Time : `,
                        fontSize: 9,
                        alignment: 'right',
                        bold: true
                      },
                      {
                        text: `  ${new Date().toLocaleTimeString().replace("AM", "am").replace("PM", "pm")}`,
                        fontSize: 9,
                        alignment: 'right'
                      }
                    ]
                  }

                ]
              ]
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 10,
                  x2: 530, y2: 10,
                  lineWidth: 1
                },
              ]
            },
            {
              text: 'Sales Comparison Report',
              fontSize: 13,
              margin: 5,
              alignment: 'center'
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 0,
                  x2: 530, y2: 0,
                  lineWidth: 1
                },
              ]
            },
            {
              columns: [
                [
                  {

                    // bold: true
                    text: [
                      {
                        text: `\nFrom: `,
                        fontSize: 8,
                        bold: true
                      },
                      {
                        text: ` ${moment(new Date(fromDate)).format('YYYY-MM-DD')} \t\t\t\t`,
                        fontSize: 8,
                      },
                      {
                        text: `To: `,
                        fontSize: 8,
                        bold: true
                      },
                      {
                        text: ` ${moment(new Date(ToDate)).format('YYYY-MM-DD')} \n\n\n`,
                        fontSize: 8,
                      },
                    ]
                  },
                  // { text: "84 street, Baltimore" },
                  // { text: "jqhome@gmail.com" },
                  // { text: "51247862" }
                ],
              ]
            },
            {
              table: {
                headerRows: 1,
                // widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [{ text: 'Item Code', border: [true, true, false, false] },
                  { text: 'Item Name', border: [true, true, false, false] },
                  { text: 'Electronic Totals', border: [true, true, true, true], colSpan: 2 },
                  { text: '', border: [true, true, true, true] },
                  { text: 'Delivery Totals', border: [true, true, true, true], colSpan: 2 },
                  { text: '', border: [true, true, true, true] },
                  { text: 'Sales Totals', border: [true, true, true, true] },],
                  [{ text: '', border: [true, false, false, false] },
                  { text: '', border: [true, false, false, false] },
                  { text: 'Qty(Ltrs)', border: [true, true, true, true] },
                  { text: 'Amount(NZD)', border: [true, true, true, true] },
                  { text: 'Qty(Ltrs)', border: [true, true, true, true] },
                  { text: 'Amount(NZD)', border: [true, true, true, true] },
                  { text: 'Amount(NZD)', border: [true, true, true, true] },
                  ],
                  ...this.sales.map((p: any) => ([
                    { text: p.itemcode, border: [true, true, true, true] },
                    { text: p.itemname, border: [true, true, true, true] },
                    { text: parseFloat(p.electronicTotalQty).toFixed(2), border: [true, true, false, true] },
                    { text: parseFloat(p.electronicTotalAmount).toFixed(2), border: [true, true, true, true] },
                    { text: parseFloat(p.deliveryTotalQty).toFixed(2), border: [true, true, true, true] },
                    { text: parseFloat(p.deliveryTotalAmount).toFixed(2), border: [true, true, true, true] },
                    { text: parseFloat(p.salesAmount).toFixed(2), border: [true, true, true, true] },])),


                ],
              },
              // layout: 'lightHorizontalLines',
              fontSize: 8,
            }
          ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          }
        }

      };
      if (e === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (e === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).open();
      }
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }


}
