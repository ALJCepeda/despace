import {Message} from "@/models/Message";

export class App {
  public name:string = '';
  public version:string = '';
  public messages:Message[] = [];

  constructor(data?:Partial<App>) {
    Object.assign(this, data);
  }
}