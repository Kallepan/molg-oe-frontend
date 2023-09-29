import { AfterViewInit, Component, EventEmitter, Input, NgModule, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Sample } from 'src/app/samples/sample';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime, filter } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonModule } from '@angular/common';
import { fadeOut, rowsAnimation } from './animations';

export type ColumnsSchema = {
  columnDef: string;
  header: string;
  cell?: (element: Sample) => string;
}

@Component({
  selector: 'app-samples-table',
  templateUrl: './samples-table.component.html',
  styleUrls: ['./samples-table.component.scss'],
  animations: [
    fadeOut, rowsAnimation
  ]
})
export class SamplesTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
 
  @Output() onSampleClick = new EventEmitter<Sample>();
  @Input() samples: Sample[];

  // table
  dataSource: MatTableDataSource<Sample> = new MatTableDataSource<Sample>();
  columnsSchema: ColumnsSchema[] = [
    { columnDef: 'displaySampleId', header: 'Sample ID', cell: (element: Sample) => `${element.displaySampleId}` },
    { columnDef: 'internalID', header: 'Interne Nummer', cell: (element: Sample) => `${element.internal_number}` },
    { columnDef: 'created_at', header: "Erstellt am", cell: (element: Sample) => `${new Date(element.created_at).toDateString()}` },
    { columnDef: 'created_by', header: 'Erstellt von', cell: (element: Sample) => `${element.created_by}` },
    { columnDef: 'position', header: 'Rack Position', cell: (element: Sample) => `${element.full_rack_position}` },
    { columnDef: 'actions', header: 'Aktionen'},
  ];
  @Input() displayedColumns: string[] = [];

  // filter
  searchControl = new FormControl('');
  filter$ = this.searchControl.valueChanges.pipe(
    filter((contents): contents is string => typeof contents === 'string'),
    debounceTime(250),
  );
  private _filterSubscription: Subscription | undefined;

  // pagniation
  pageSizeOptions = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onSampleClicked(sample: Sample) {
    this.onSampleClick.emit(sample);
  }

  ngOnInit(): void {
    this.dataSource.data = this.samples;
    this._filterSubscription = this.filter$.subscribe({
      next: (filter) => {
        this.dataSource.filter = filter;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["samples"]) {
      const samples = changes["samples"].currentValue as Sample[];
      this.dataSource.data = samples;
      return;
    }
  }

  ngOnDestroy(): void {
    this._filterSubscription?.unsubscribe();
  }
}

@NgModule({
  declarations: [
    SamplesTableComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    SamplesTableComponent,
  ]
})
export class SamplesTableModule {

}