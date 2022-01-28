import { Component, OnInit } from '@angular/core';
import { EO } from 'eoapi-core';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const eo = new EO();
    eo.hookDemo();
  }

}
