import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Image } from 'src/app/models/Image';
import { HttpClient } from '@angular/common/http';
import { ImageService } from 'src/app/services/image.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteImageComponent } from './components/delete-image/delete-image.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  selectedFile: File;
  imageIdNumber: number;

  loading = false;
  uploading = false;
  isButtonDisabled: boolean = true;

  base64Data: any;
  retrieveResonse: any;
  images: Image[] = [];

  public imageUrls: { [imageId: number]: string } = {};

  displayedColumns: string[] = ['imageId', 'imageName', 'type', 'image', 'action'];

  dataSource: MatTableDataSource<Image> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient, 
              private imageService: ImageService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) {

    this.getAllImageData();

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public uploadingImage() {
    this.uploading = !this.uploading;
  }

  public getAllImageData() {
    this.imageService.getAllImages().subscribe({
      next: (fetchedImages: any) => {
        console.log(fetchedImages);
        this.images = fetchedImages.data;
        console.log(this.images);

        this.dataSource = new MatTableDataSource(this.images);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: (error) => {
        console.log(error);
      },
      complete() { },
    });
  }


  getImageUrl(image: any): string {
    if (image.picByte instanceof Uint8Array) {
      const base64String = btoa(String.fromCharCode.apply(null, image.picByte));
      return 'data:' + image.type + ';base64,' + base64String;
    } else if (typeof image.picByte === 'string') {
      // If picByte is already a base64 string
      return 'data:' + image.type + ';base64,' + image.picByte;
    }
    return '';
  }

  public openDeleteDialog(imageId: number) {
    const dialogRef = this.dialog.open(DeleteImageComponent, {
      data: { id: imageId},
      disableClose: true, // Prevent closing on click outside
    });

    console.log("Id: ", imageId);

    dialogRef.afterClosed().subscribe(choose => {
      if (choose) {
        console.log('Form data received from the dialog:', choose);
        // You can now work with the form data received from the dialog
        this.deleteCategory(imageId);
      } else {
        console.log('Dialog was closed without data.');
      }
    });
  }


  public deleteCategory(imageId: number) {
    console.log(imageId);
    this.loading = true;
    this.imageService.deleteImage(imageId).subscribe({
      next: (response) => {
        console.log("Category Deleted");

        setTimeout(() => {
          this.loading = false;
        }, 1500);

        this.images = this.images.filter(imageTemp => imageTemp.id != imageId);

        this.dataSource = new MatTableDataSource(this.images);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this._snackBar.open("Image Successfully Deleted", "Close");

      },
      error: (error) => {
        console.log(error);
        this._snackBar.open("Image Not Deleted", "Close");
      },
      complete() { }
    })

  }

  //Gets called when the user selects an image
  public onFileSelected(event) {

    this.selectedFile = event.target.files[0];
    this.isButtonDisabled = false;
    console.log(this.selectedFile);
  }

  //Gets called when the user clicks on submit to upload the image
  onUpload(event: Event) {

    this.loading = true;

    // Prevent the default form submission behavior
    event.preventDefault();
    console.log(this.selectedFile);

    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

    // Hide the spinner after 2 seconds
    setTimeout(() => {
      this.loading = false;
    }, 2000);

    //Make a call to the Spring Boot Application to save the image
    this.imageService.addImage(uploadImageData).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status === 201) {
            this.getAllImageData();
            this._snackBar.open("Image Successfully Inserted", "Close");
          }
        },
        error: (error) => {
          console.log(error);
          this._snackBar.open("Image Not Uploaded", "Close");
        },
        complete() { },
      });
  }

}

