export class Backup {
  public app:address = '';
  public messages:address = '';

  constructor(data?:Partial<Backup>) {
    Object.assign(this, data);
  }
}