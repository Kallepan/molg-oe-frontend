import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Sample } from '../../sample';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, filter } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

const COLUMNS = [
  { columnDef: 'displaySampleId', header: 'Sample ID', cell: (element: Sample) => `${element.displaySampleId}` },
  { columnDef: 'internalID', header: 'Interne Nummer', cell: (element: Sample) => `${element.internal_number}` },
  { columnDef: 'created_at', header: "Erstellt am", cell: (element: Sample) => `${new Date(element.created_at).toDateString()}`},
  { columnDef: 'created_by', header: 'Erstellt von', cell: (element: Sample) => `${element.created_by}` },
  { columnDef: 'actions', header: 'Actions',},
];

@Component({
  selector: 'app-samples-table',
  templateUrl: './samples-table.component.html',
  styleUrls: ['./samples-table.component.scss']
})
export class SamplesTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() onSampleClick = new EventEmitter<Sample>();
  @Input() samples: Sample[];

  // table
  dataSource: MatTableDataSource<Sample> = new MatTableDataSource<Sample>();
  columnsSchema = COLUMNS;
  displayedColumns = this.columnsSchema.map(c => c.columnDef);

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
  
    ngOnDestroy(): void {
      this._filterSubscription?.unsubscribe();
    } 
}
