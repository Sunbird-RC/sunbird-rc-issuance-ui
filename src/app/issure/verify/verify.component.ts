import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  itemData: any;
  constructor() {}
  ngOnInit(): void {
    this.itemData =
    {
      "scanner_type": "ZBAR_QRCODE",
      "scanNote": "To verify certificate, simply scan the QR code thats on the document.",
      "verify_another_Certificate": 'Verify another Certificate',
      "cetificate_not_valid": 'This Certificate is not valid',
      "scan_qrcode_again": "Please scan QR code again"
    }
  }

}
