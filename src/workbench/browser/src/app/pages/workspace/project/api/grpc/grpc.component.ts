import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'eo-grpc',
  templateUrl: './grpc.component.html',
  styleUrls: ['./grpc.component.scss']
})
export class GrpcComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      url: [null, [Validators.required]],
      serviceName: [null, [Validators.required]],
      methodName: [null, [Validators.required]]
    });
  }
}
