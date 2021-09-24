export class Address {
  private _addressLine1: string;
  private _addressLine2: string;
  private _addressLine3: string;
  private _addressLine4: string;
  private _addressLine5: string;
  private _postcode: string;

  constructor(
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    addressLine4: string,
    addressLine5: string,
    postcode: string
  ) {
    if (addressLine1?.length === 0 || postcode?.length === 0)
    {
        throw new Error('An address must have address line 1 and postcode');
    }
    
    this._addressLine1 = addressLine1;
    this._addressLine2 = addressLine2;
    this._addressLine3 = addressLine3;
    this._addressLine4 = addressLine4;
    this._addressLine5 = addressLine5;
    this._postcode = postcode;
  }

  get addressLine1(): string {
    return this._addressLine1;
  }

  get addressLine2(): string {
    return this._addressLine2;
  }

  get addressLine3(): string {
    return this._addressLine3;
  }

  get addressLine4(): string {
    return this._addressLine4;
  }

  get addressLine5(): string {
    return this._addressLine5;
  }

  get postcode(): string {
    return this._postcode;
  }
}
