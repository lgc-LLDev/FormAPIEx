import { FormClose } from './const'
import { SimpleFormEx } from './simple-ex'

export interface SimpleFormOperationalButton<R> {
  text: string
  image?: string
  operation: () => R
}

export class SimpleFormOperational<R> {
  constructor(
    public title: string = '',
    public content: string = '',
    public buttons: SimpleFormOperationalButton<R>[] = [],
  ) {}

  async sendAsync(player: Player): Promise<R | FormClose> {
    const form = new SimpleFormEx(this.buttons)
    form.title = this.title
    form.content = this.content
    form.formatter = ({ text, image }) => [text, image]
    const res = await form.sendAsync(player)
    if (res === FormClose) return FormClose
    return res.operation()
  }
}
