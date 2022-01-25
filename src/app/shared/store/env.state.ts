import { Injectable } from '@angular/core';
import { State, Action } from '@ngxs/store';

export class Change {
  static readonly type = 'Change';
  constructor(public data: any) {}
}

@State<any>({
  name: 'env',
  defaults: {
    parameters: [],
    frontURI: '',
  },
})
@Injectable()
export class EnvState {
  @Action(Change)
  changeEnv({ setState }, { data }) {
    setState({
      env: data || {},
    });
  }
}
