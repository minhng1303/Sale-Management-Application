import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input('totalItems') totalItems: number = 0;
  @Input('itemsPerPage') itemsPerPage: number = 0;
  @Output('onPageChange')
  onPageChange: EventEmitter<number> = new EventEmitter();

  totalPages: number = 0;
  pages: any[] = [];
  selectedPage: number = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.totalPages > 0) {
      if (this.totalPages === 1) {
        this.pages = [0];
      } else if (this.totalPages === 2) {
        this.pages = [0, 1];
      } else {
        this.pages = [0, 1, 2];
      }
    } else {
      this.pages = [];
    }
  }

  goToPage(page: number): void {
    if (page === this.selectedPage) return;
    this.selectedPage = page;
    this.onPageChange.emit(page);
    if (page === this.pages[this.pages.length - 1]) this.next();
    if (page === this.pages[this.pages.length - 3]) this.previous();
  }

  next(): void {
    if (!this.disableNextButton())
      this.pages = this.pages.map((page) => page + 1);
  }

  disableNextButton(): boolean {
    return (
      this.pages.length === 0 ||
      this.pages[this.pages.length - 1] >= this.totalPages - 1
    );
  }

  previous(): void {
    if (this.pages[0] > 0) {
      this.pages = this.pages.map((page) => page - 1);
    }
  }

  disablePreviousButton(): boolean {
    return this.pages.length === 0 || this.pages[0] === 0;
  }
}


