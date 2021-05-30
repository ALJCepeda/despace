export class Message {
  public title:string = '';
  public body:string = '';

  constructor(data?:Partial<Message>) {
    Object.assign(this, data);
  }
}