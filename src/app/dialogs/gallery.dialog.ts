import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-gallery-dialog',
    templateUrl: 'gallery.dialog.html',
})
export class GalleryDialog {

    constructor(public dialogRef: MatDialogRef<GalleryDialog>) { }

    close(): void {
        this.dialogRef.close();
    }
}