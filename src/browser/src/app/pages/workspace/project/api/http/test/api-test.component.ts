import { Component, Output, EventEmitter } from '@angular/core';
import { TabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { testViewModel } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test.model';
@Component({
  selector: 'eo-api-http-test',
  templateUrl: './api-test.component.html'
})
export class ApiTestComponent implements TabViewComponent {
  @Output() readonly eoOnInit = new EventEmitter<testViewModel>();
}
