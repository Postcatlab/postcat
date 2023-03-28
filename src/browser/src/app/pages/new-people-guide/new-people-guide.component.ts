import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import showdown from 'showdown';

// @ts-ignore
import newPeopleGuide from './newPeopleGuide.md';

@Component({
  selector: 'pc-new-people-guide',
  templateUrl: './new-people-guide.component.html',
  styleUrls: ['./new-people-guide.component.scss']
})
export class NewPeopleGuideComponent {
  constructor(private http: HttpClient) {
    // const file = this.http.get('/README.md');
    // console.log(file);
    // file.subscribe({
    //   next: data => {
    //     console.log(data);
    //   }
    // })
  }
  async ngAfterViewInit() {
    document.getElementById('markdown').innerHTML = newPeopleGuide;
  }
}
