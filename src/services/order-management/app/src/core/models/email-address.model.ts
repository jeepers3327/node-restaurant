export class EmailAddress {
  emailAddress: string;
  domain: string;

  constructor(emailAddress: string) {
    if (emailAddress?.length === 0) {
      throw new Error("An email address must not be empty.");
    }

    if (!this.validateEmailFormat(emailAddress)) {
      throw new Error("A valid email address must be provided.");
    }

    this.emailAddress = emailAddress;
    this.domain = emailAddress.split('@')[1];
  }

  private validateEmailFormat(email): boolean {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
