import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, FileUploadComponent]
})
export class ComponentsModule {}
