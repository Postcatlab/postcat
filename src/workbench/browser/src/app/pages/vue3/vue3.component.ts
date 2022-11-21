import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vue3',
  templateUrl: './vue3.component.html',
  styleUrls: ['./vue3.component.scss'],
})
export class Vue3Component implements OnInit {
  url = `https://www.eolink.com`;
  name = 'app-vue3';

  constructor() {}

  microAppData = { msg: '来自基座的数据' };

  ngOnInit(): void {}

  handleCreate(): void {
    console.log('child-vue3 创建了');
  }

  handleBeforeMount(): void {
    console.log('child-vue3 即将被渲染');
  }

  handleMount(): void {
    console.log('child-vue3 已经渲染完成');

    setTimeout(() => {
      this.microAppData = { msg: '来自基座的新数据' };
    }, 2000);
  }

  handleUnmount(): void {
    console.log('child-vue3 卸载了');
  }

  handleError(): void {
    console.log('child-vue3 加载出错了');
  }

  handleDataChange(e): void {
    console.log('来自子应用 child-vue3 的数据:', e.detail.data);
  }
}
