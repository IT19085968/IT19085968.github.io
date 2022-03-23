import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AreaComponent } from './widgets/area/area.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CardComponent } from './widgets/card/card.component';
import { PieComponent } from './widgets/pie/pie.component';
import { ColumnComponent } from './widgets/column/column.component';
import { BarComponent } from './widgets/bar/bar.component';
import { LineComponent } from './widgets/line/line.component';
import { DrillDownComponent } from './widgets/drill-down/drill-down.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import { TankComponent } from './widgets/tank/tank.component';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
// import * as Charts from 'fusioncharts/fusioncharts.powercharts';
// PowerCharts
import * as widgets from 'fusioncharts/fusioncharts.widgets';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import * as Ocean from 'fusioncharts/themes/fusioncharts.theme.ocean';
import * as Carbon from 'fusioncharts/themes/fusioncharts.theme.carbon';
import { GuageComponent } from './widgets/guage/guage.component';
import { CylinderComponent } from './widgets/cylinder/cylinder.component';

// require('highcharts/themes/dark-blue')(HighchartsChartModule);

Charts(FusionCharts);
FusionTheme(FusionCharts);
FusionChartsModule.fcRoot(FusionCharts, widgets, Carbon);

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    ColumnComponent,
    BarComponent,
    LineComponent,
    DrillDownComponent,
    TankComponent,
    GuageComponent,
    CylinderComponent,
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule,
    FusionChartsModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    ColumnComponent,
    BarComponent,
    LineComponent,
    DrillDownComponent,
    TankComponent,
    GuageComponent,
    CylinderComponent,
  ],
})
export class SharedModule {}
