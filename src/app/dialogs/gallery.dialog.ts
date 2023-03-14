import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-gallery-dialog',
    templateUrl: 'gallery.dialog.html',
})
export class GalleryDialog {

    photoCollection: Array<object> = [
        {
            image: 'assets/photos/1.jpg',
            thumbImage: 'assets/photos/1.jpg'
        },
        {
            image: 'assets/photos/2.jpg',
            thumbImage: 'assets/photos/1.jpg'
        }, 
        {
            image: 'assets/photos/3.jpg',
            thumbImage: 'assets/photos/1.jpg'
        },
        {
            image: 'assets/photos/4.jpg',
            thumbImage: 'assets/photos/1.jpg'
        }, 
        {
            image: 'assets/photos/5.jpg',
            thumbImage: 'assets/photos/1.jpg'
        }, 
        {
            image: 'assets/photos/6.jpg',
            thumbImage: 'assets/photos/1.jpg'
        }, 
        {
            image: 'assets/photos/7.jpg',
            thumbImage: 'assets/photos/1.jpg'
        },
        {
            image: 'assets/photos/8.jpg',
            thumbImage: 'assets/photos/1.jpg'
        }
    ];

    constructor(public dialogRef: MatDialogRef<GalleryDialog>) { }

    close(): void {
        this.dialogRef.close();
    }
}