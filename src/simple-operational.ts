import { SimpleFormEx } from './simple-ex';

export interface SimpleFormOperationalButton<R> {
  text: string;
  image?: string;
  operation: () => R;
}

export class SimpleFormOperational<R> {
  constructor(
    public title: string = '',
    public content: string = '',
    public buttons: SimpleFormOperationalButton<R>[] = []
  ) {}

  async sendAsync(player: Player): Promise<R | null> {
    const form = new SimpleFormEx(this.buttons);
    form.formatter = ({ text, image }) => [text, image];
    const res = await form.sendAsync(player);
    if (!res) return res;
    return res.operation();
  }
}
