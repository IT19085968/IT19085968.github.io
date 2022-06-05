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
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { PieComponent } from './widgets/pie/pie.component';
import { ColumnComponent } from './widgets/column/column.component';
import { LineComponent } from './widgets/line/line.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
// import * as Charts from 'fusioncharts/fusioncharts.powercharts';
// PowerCharts
import * as widgets from 'fusioncharts/fusioncharts.widgets';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import * as Ocean from 'fusioncharts/themes/fusioncharts.theme.ocean';
import * as Carbon from 'fusioncharts/themes/fusioncharts.theme.carbon';
import { CylinderComponent } from './widgets/cylinder/cylinder.component';
import { ThumbnailsComponent } from './components/thumbnails/thumbnails.component';

// require('highcharts/themes/dark-blue')(HighchartsChartModule);

Charts(FusionCharts);
FusionTheme(FusionCharts);
FusionChartsModule.fcRoot(FusionCharts, widgets, Carbon);

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    PieComponent,
    ColumnComponent,
    LineComponent,
    CylinderComponent,
    ThumbnailsComponent,
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
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
    PieComponent,
    ColumnComponent,
    LineComponent,
    CylinderComponent,
    ThumbnailsComponent,
  ],
})
export class SharedModule {}
