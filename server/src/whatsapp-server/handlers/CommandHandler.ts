import MessageController from '../Controllers/MessageController';
import {
  capitalizeFirstLetter,
  getReadableRawOrder,
} from '../../utils/stringProcess';

class CommandHandler {
  messageController: MessageController;
  constructor(messageController: MessageController) {
    this.messageController = messageController;
  }

  async handle(message: string, isTemplate: boolean = false) {
    const lines = message.trim().split('\n');
    const [commandWithParam, ...args] = lines.map((line) =>
      capitalizeFirstLetter(line.trim()),
    );
    const [command, ...params] = commandWithParam.trim().split(' ');

    switch (command) {
      case '/send-order':
        this.handleSendOrder(args, isTemplate);
        break;
      case '/get-template':
        this.handleGetTemplate(params, isTemplate);
        break;
      case '/update-order':
        this.handleUpdateOrder(args, params, isTemplate);
        break;
      case '/get-order':
        this.handleGetOrder(params, isTemplate);
        break;
      case '/get-commands':
        this.handleGetCommands(isTemplate);
        break;
      case '/get-invoice':
        this.handleGetInvoice(params, isTemplate);
        break;
      default:
        this.messageController.handleUnknown(command);
        break;
    }
  }

  /**
   * Hanlders
   */
  private async handleSendOrder(args: string[], isTemplate: boolean) {
    if (!isTemplate) {
      this.messageController.handleSendOrder(args);
    } else {
      this.messageController.sendTemplate(
        await this.generateSendOrderTemplate(),
      );
    }
  }

  private async handleGetTemplate(params: string[], isTemplate: boolean) {
    if (!isTemplate) {
      this.messageController.handleGetTemplate(params);
    } else {
      this.messageController.sendTemplate(this.generateGetTemplate());
    }
  }

  private async handleUpdateOrder(
    args: string[],
    params: string[],
    isTemplate: boolean,
  ) {
    if (!isTemplate) {
      this.messageController.handleUpdate(args, params);
    } else {
      this.messageController.sendTemplate(
        await this.generateUpdateOrderTemplate(),
      );
    }
  }

  private async handleGetOrder(params: string[], isTemplate: boolean) {
    if (!isTemplate) {
      this.messageController.handleGetOrder(params);
    } else {
      this.messageController.sendTemplate(this.generateGetOrderTemplate());
    }
  }

  private async handleGetCommands(isTemplate: boolean) {
    if (!isTemplate) {
      this.messageController.handleGetCommands();
    } else {
      this.messageController.sendTemplate(this.generateGetCommandsTemplate());
    }
  }

  private async handleGetInvoice(params: string[], isTemplate: boolean) {
    if (!isTemplate) {
      this.messageController.handleGetInvoice(params);
    } else {
      this.messageController.sendTemplate(this.generateGetInvoiceTemplate());
    }
  }

  /**
   * Templates
   */

  private async generateSendOrderTemplate() {
    try {
      const readableData = await getReadableRawOrder();
      const template = `/send-order\n${readableData}`;
      return template;
    } catch (error: any) {
      return error.message;
    }
  }

  private async generateUpdateOrderTemplate() {
    try {
      const template = `/update-order <Invoice Number>\n<Key>:<Value>`;
      return template;
    } catch (error: any) {
      return error.message;
    }
  }

  private generateGetOrderTemplate(): string {
    return `/get-order <Invoice Number>`;
  }

  private generateGetTemplate(): string {
    return '/get-template /<Command>';
  }

  private generateGetCommandsTemplate(): string {
    return '/get-commands';
  }

  private generateGetInvoiceTemplate(): string {
    return '/get-invoice <Invoice Number>';
  }
}

export default CommandHandler;
